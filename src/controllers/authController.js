const AccessCode = require('../models/accessCode');
const GameUser = require('../models/gameUser');

const gameLogin = async (req, res) => {
  try {
    const { name, accessCode } = req.body;
    
    if (!name || !accessCode) {
      return res.status(400).json({ error: 'Name and access code are required' });
    }

    // Check if access code exists and is active
    const validCode = await AccessCode.findOne({ code: accessCode, isActive: true });
    if (!validCode) {
      return res.status(401).json({ error: 'Invalid access code' });
    }

    // Check if access code is already used by someone else
    const existingUser = await GameUser.findOne({ accessCode, isActive: true });
    if (existingUser && existingUser.name !== name) {
      return res.status(400).json({ error: 'Access code already used by another user' });
    }

    // Check if user already has an active session with this access code (relogin)
    let gameUser = await GameUser.findOne({ name, accessCode, isActive: true });
    
    if (gameUser) {
      // Relogin - return existing session
      return res.status(200).json({ 
        message: 'Game relogin successful',
        sessionId: gameUser._id,
        name: gameUser.name,
        personalityGame: gameUser.personalityGame,
        groupGame: gameUser.groupGame,
        loginTime: gameUser.createdAt
      });
    }

    // Create new game user session
    gameUser = new GameUser({ name, accessCode });
    await gameUser.save();

    res.status(200).json({ 
      message: 'Game login successful',
      sessionId: gameUser._id,
      name: gameUser.name,
      personalityGame: false,
      groupGame: false,
      loginTime: gameUser.createdAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateQuizResult = async (req, res) => {
  try {
    const { sessionId, score, time, personalityFruit } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    const gameUser = await GameUser.findById(sessionId);
    if (!gameUser) {
      return res.status(404).json({ error: 'Game user not found' });
    }

    // Personality game validation - only allow once
    if (personalityFruit) {
      if (gameUser.personalityFruit) {
        return res.status(400).json({ error: 'Personality game already completed' });
      }
      gameUser.personalityFruit = personalityFruit;
      gameUser.personalityGame = true;
    }

    // Group game validation - only allow once
    if (score !== undefined && time !== undefined) {
      if (gameUser.score !== null && gameUser.time !== null) {
        return res.status(400).json({ error: 'Group game already completed' });
      }
      gameUser.score = parseInt(score);
      gameUser.time = parseInt(time);
      gameUser.groupGame = true;
    }
    
    await gameUser.save();

    res.status(200).json({ 
      message: 'Quiz result updated successfully',
      data: {
        name: gameUser.name,
        score: gameUser.score,
        time: gameUser.time,
        personalityFruit: gameUser.personalityFruit,
        personalityGame: gameUser.personalityGame,
        groupGame: gameUser.groupGame
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const gameUsers = await GameUser.find({
      personalityGame: true,
      groupGame: true
    }).select('name score time');

    // Sort by score (descending) first, then by time (ascending)
    const sortedUsers = gameUsers.sort((a, b) => {
      if (a.score !== b.score) {
        return b.score - a.score; // Higher score is better
      }
      return a.time - b.time; // Lower time is better
    });

    const leaderboard = sortedUsers.map((user, index) => ({
      placement: index + 1,
      name: user.name,
      time: user.time,
      score: user.score
    }));

    res.status(200).json({
      message: 'Leaderboard retrieved successfully',
      data: leaderboard
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { gameLogin, updateQuizResult, getLeaderboard };