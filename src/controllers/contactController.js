const Contact = require('../models/contact');

const createContact = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, message, preferWhatsApp } = req.body;
    
    if (!fullName || !email || !phoneNumber || !message) {
      return res.status(400).json({ error: 'All fields except preferWhatsApp are required' });
    }

    const contact = new Contact({ fullName, email, phoneNumber, message, preferWhatsApp });
    await contact.save();
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createContact, getContacts };