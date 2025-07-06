const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// Add Contact
router.post('/', async (req, res) => {
  const { name, email, phone } = req.body;
  const contact = new Contact({ name, email, phone });
  await contact.save();
  res.json(contact);
});

// Get Contacts
router.get('/', async (req, res) => {
  const contacts = await Contact.find();
  res.json(contacts);
});

// Delete Contact
router.delete('/:id', async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
