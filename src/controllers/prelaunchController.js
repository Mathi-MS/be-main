const Prelaunch = require('../models/prelaunch');

const createWish = async (req, res) => {
  try {
    const { fullname, email, wishes, suggestion } = req.body;
    
    if (!fullname || !email || !wishes) {
      return res.status(400).json({ error: 'fullname, email, and wishes are required' });
    }

    const entry = new Prelaunch({ fullname, email, wishes, suggestion });
    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getWishes = async (req, res) => {
  try {
    const wishes = await Prelaunch.find();
    res.json(wishes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createWish, getWishes };