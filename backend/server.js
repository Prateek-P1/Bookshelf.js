const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/inreactv2', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Could not connect to MongoDB:', err));

// Define a schema for the PDF collection
const pdfSchema = new mongoose.Schema({
  name: String,
  content: String, // Base64 string of the PDF
});

const Pdf = mongoose.model('Pdf', pdfSchema);

// Route to fetch all PDFs
app.get('/api/pdfs', async (req, res) => {
  try {
    const pdfs = await Pdf.find();
    res.json(pdfs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch PDFs' });
  }
});

// Route to fetch a single PDF by ID
app.get('/api/pdfs/:id', async (req, res) => {
  try {
    const pdf = await Pdf.findById(req.params.id);
    if (!pdf) return res.status(404).send('PDF not found');
    res.json(pdf);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch the PDF' });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
