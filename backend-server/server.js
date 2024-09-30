const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const PORT = process.env.PORT || 8000;
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();

const serviceAccount = require('./wirefully-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
const API_KEY = "AIzaSyDgDzrlIwIILh6M-2_bl0HrxNGXeAdMoS8";

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(bodyParser.json());


app.post('/generate-content', async (req, res) => {
  try {
      // Validate request body
      const { diagram } = req.body;

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-001:generateContent?key=${API_KEY}`;
      const data = {
          contents: [
              {
                  parts: [
                      {
                          text: 'Based on the following diagram:\n\n' + diagram + '\n\nGenerate wireframe html codes for each use cases based on its relationship with actors'
                      }
                  ]
              }
          ]
      };

      const headers = {
          'Content-Type': 'application/json',
      };

      // Make POST request to Google AI API
      const response = await axios.post(url, data, { headers });

      // Return the response data from Google AI API
      res.json(response.data);
  } catch (error) {
      console.error('Error calling Google AI API:', error.response ? error.response.data : error.message);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});




// app.post('/signup', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const userRecord = await admin.auth().createUser({
//       email,
//       password,
//     });
//     res.status(201).json({ user: userRecord });
//   } catch (error) {
//     console.error('Error creating user:', error);
//     res.status(500).json({ error: 'Failed to create user' });
//   }
// });

app.listen(PORT, () => {
  console.log(`Backend server is running at http://localhost:${PORT}`);
});
