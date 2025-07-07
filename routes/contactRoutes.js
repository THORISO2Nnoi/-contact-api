const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// Add Contact
router.post('/', async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const contact = new Contact({ name, email, phone });
    const savedContact = await contact.save();
    res.status(201).json(savedContact);
  } catch (error) {
    console.error('POST /contacts error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get Contacts
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    console.error('GET /contacts error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete Contact
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json({ message: 'Deleted' });
  } catch (error) {
    console.error('DELETE /contacts/:id error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
