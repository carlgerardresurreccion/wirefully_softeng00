const express = require('express');
const admin = require('firebase-admin');

const serviceAccount = require('./wirefully-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
const port = 8000;

app.use(express.json());

app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });
    res.status(201).json({ user: userRecord });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.listen(port, () => {
  console.log(`Backend server is running at http://localhost:${port}`);
});
