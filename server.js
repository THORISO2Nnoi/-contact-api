require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1); // Exit if DB connection fails
});

// Contact schema and model
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true, trim: true },
}, { timestamps: true });

const Contact = mongoose.model('Contact', contactSchema);

// Routes
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    console.error('GET /api/contacts error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/api/contacts', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    const savedContact = await contact.save();
    res.status(201).json(savedContact);
  } catch (error) {
    console.error('POST /api/contacts error:', error);
    // Handle validation errors separately
    if (error.name === 'ValidationError') {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
});

app.put('/api/contacts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedContact = await Contact.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json(updatedContact);
  } catch (error) {
    console.error(`PUT /api/contacts/${id} error:`, error);
    if (error.name === 'ValidationError') {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
});

app.delete('/api/contacts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Contact.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json({ message: 'Deleted' });
  } catch (error) {
    console.error(`DELETE /api/contacts/${id} error:`, error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
