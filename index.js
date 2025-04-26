const serviceAccount = require('./service-account-file.json');
var admin = require("firebase-admin");
const express = require('express'); // Add this line
const app = express(); // Initialize the app

app.use(express.json()); // Middleware to parse JSON requests

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

console.log(serviceAccount); // Log the service account details for debugging

const db = admin.firestore(); // Initialize Firestore

// Endpoint to create a financial asset record
app.post('/api/assets', async (req, res) => {
  try {
    const { owner, account, type, amount, unit } = req.body;

    // Validate input
    if (!owner || !account || !type || !amount || !unit) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Create a new record in Firestore
    const newRecord = {
      owner,
      account,
      type,
      amount,
      unit,
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection('financedata').add(newRecord);

    res.status(201).json({ id: docRef.id, message: 'Record created successfully.' });
  } catch (error) {
    console.error('Error creating record:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});