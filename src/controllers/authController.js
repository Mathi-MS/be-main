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

    // Check if user already has an active session with this access code (relogin)
    let gameUser = await GameUser.findOne({ name, accessCode, isActive: true });
    
    if (gameUser) {
      // Relogin - return existing session
      return res.status(200).json({ 
        message: 'Game relogin successful',
        sessionId: gameUser._id,
        name: gameUser.name,
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
      loginTime: gameUser.createdAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateQuizResult = async (req, res) => {
  try {
    const { sessionId, score, time, personalityFruit } = req.body;
    
    if (!sessionId || !score || !time || !personalityFruit) {
      return res.status(400).json({ error: 'All quiz result fields are required' });
    }

    const gameUser = await GameUser.findById(sessionId);
    if (!gameUser) {
      return res.status(404).json({ error: 'Game user not found' });
    }

    // Check if quiz result already exists
    if (gameUser.score || gameUser.time || gameUser.personalityFruit) {
      return res.status(400).json({ error: 'Quiz result already submitted for this user' });
    }

    gameUser.score = score;
    gameUser.time = time;
    gameUser.personalityFruit = personalityFruit;
    await gameUser.save();

    res.status(200).json({ 
      message: 'Quiz result updated successfully',
      data: {
        name: gameUser.name,
        score: gameUser.score,
        time: gameUser.time,
        personalityFruit: gameUser.personalityFruit
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const gameUsers = await GameUser.find({
      score: { $ne: null },
      time: { $ne: null }
    }).select('name score time');

    // Sort by time (ascending) first, then by score (descending)
    const sortedUsers = gameUsers.sort((a, b) => {
      const [minA, secA] = a.time.split(':').map(Number);
      const [minB, secB] = b.time.split(':').map(Number);
      const totalSecondsA = minA * 60 + secA;
      const totalSecondsB = minB * 60 + secB;
      
      if (totalSecondsA !== totalSecondsB) {
        return totalSecondsA - totalSecondsB; // Lower time is better
      }
      
      const scoreA = parseInt(a.score.split('/')[0]);
      const scoreB = parseInt(b.score.split('/')[0]);
      return scoreB - scoreA; // Higher score is better
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