const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const PORT = process.env.PORT || 5000;
const axios = require('axios');
require('dotenv').config();

const serviceAccount = require('./wirefully-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
const port = 8000;

app.use(express.json());

app.post('/convert-to-wireframe', async (req, res) => {
  const { diagram } = req.body;
  const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyDgDzrlIwIILh6M-2_bl0HrxNGXeAdMoS8";
  const apiKey = "AIzaSyDgDzrlIwIILh6M-2_bl0HrxNGXeAdMoS8";

  try {
    // Make the request to the Gemini API
    const response = await axios.post(apiUrl, {
      contents: [
        {
          parts: [
            {
              text: 'Based on the following diagram:\n\n' + diagram + '\n\nGenerate wireframe images for each use cases based on its relationship with actors'
            }
          ]
        }
      ]
    }, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      }
    });

    // Process and send the response back to the frontend
    // Assuming the response contains wireframe data
    res.setHeader('Content-Type', 'application/json');
    res.send(response.data);
  } catch (error) {
    console.error("Error during Gemini API request:", error);
    res.status(500).send("Error converting diagram to wireframe.");
  }
});

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

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
  console.log(`Backend server is running at http://localhost:${port}`);
});
