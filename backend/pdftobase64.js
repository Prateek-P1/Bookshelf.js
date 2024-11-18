const fs = require('fs');

// Convert PDF to Base64
const filePath = 'book1.pdf';
const pdfBase64 = fs.readFileSync(filePath, { encoding: 'base64' });

// Example document
const pdfDocument = {
  name: 'Golden Bug PDF',
  content: pdfBase64,
};

// Prepare an array for MongoDB Compass import
const jsonData = [pdfDocument];

// Write JSON data to a file
const jsonFilePath = 'book1.json';
fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2)); // Pretty-print JSON

console.log(`JSON data written to ${jsonFilePath}`);
