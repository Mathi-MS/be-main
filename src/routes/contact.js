const express = require('express');
const { createContact, getContacts } = require('../controllers/contactController');

const router = express.Router();

router.post('/contact', createContact);
router.get('/contact', getContacts);

module.exports = router;