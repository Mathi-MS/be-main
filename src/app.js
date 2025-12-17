const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('../config/database');
const prelaunchRoutes = require('./routes/prelaunch');
const contactRoutes = require('./routes/contact');

connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: ['https://frootfast.vercel.app/', 'http://localhost:3000']
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

app.use('/api', prelaunchRoutes);
app.use('/api', contactRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;