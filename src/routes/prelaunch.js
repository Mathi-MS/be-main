const express = require('express');
const { createWish, getWishes } = require('../controllers/prelaunchController');

const router = express.Router();

router.post('/wishes', createWish);
router.get('/wishes', getWishes);

module.exports = router;