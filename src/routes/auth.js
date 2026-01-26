const express = require('express');
const { gameLogin, updateQuizResult, getLeaderboard } = require('../controllers/authController');

const router = express.Router();

router.post('/game/login', gameLogin);
router.post('/game/quiz-result', updateQuizResult);
router.get('/game/leaderboard', getLeaderboard);

module.exports = router;