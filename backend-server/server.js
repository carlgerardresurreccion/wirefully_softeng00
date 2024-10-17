const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 8000;
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const API_KEY = "AIzaSyDgDzrlIwIILh6M-2_bl0HrxNGXeAdMoS8";
const SECRET_KEY = 'superSecretKey';
const MONGODB_URI = "mongodb+srv://carlgerardresuu:llrTldGAU3JSQm5y@cluster0.l28co.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

mongoose.connect(MONGODB_URI, {
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

const historySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  diagram: String,
  xml: String,
  html: String,
  timestamp: String, 
});

const History = mongoose.model('History', historySchema);

const auth = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
      const decoded = jwt.verify(token, SECRET_KEY);
      req.user = decoded.userId;  
      console.log(req.user);
      next();
  } catch (error) {
      res.status(401).json({ message: 'Token is not valid' });
  }
};

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(bodyParser.json());

app.post('/generate-content', async (req, res) => {
  try {
    const { diagram } = req.body;

    const generateXMLUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-001:generateContent?key=${API_KEY}`;
    const data = {
      contents: [
        {
          parts: [
            {
              text: 'Based on the following diagram:\n\n' + diagram + '\n\nGenerate XML codes/layout (for Android Studio) for each use case based on its relationship with actors (no further explanations, just the xml code). Make sure it looks a phone screen wireframe and add other components to make it look complete',
            }
          ]
        }
      ]
    };

    const headers = { 'Content-Type': 'application/json' };

    const xmlResponse = await axios.post(generateXMLUrl, data, { headers });
    const xmlContent = xmlResponse.data.candidates[0]?.content?.parts[0]?.text || '';

    const cleanedXml = xmlContent.replace(/```xml/g, '').replace(/```/g, '').trim();

    const convertToHtmlData = {
      contents: [
        {
          parts: [
            {
              text: 'Convert the following XML to HTML:\n\n' + cleanedXml + '\n\nNo explanation and notes, just the HTML code. Make sure it looks a phone screen wireframe and add other components to make it look complete',
            }
          ]
        }
      ]
    };

    const htmlResponse = await axios.post(generateXMLUrl, convertToHtmlData, { headers });
    const htmlContent = htmlResponse.data.candidates[0]?.content?.parts[0]?.text || '';

    res.json({
      xmlContent: cleanedXml,
      htmlContent: htmlContent.trim(),
    });

  } catch (error) {
    console.error('Error during API request:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/save-history', auth, async (req, res) => {
    try {
        const historyItem = new History({ ...req.body, userId: req.user }); 
        await historyItem.save();
        res.status(201).json({ message: 'History saved successfully' });
    } catch (error) {
        console.error('Error saving history:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/get-history', auth, async (req, res) => {
  try {
    const history = await History.find({ userId: req.user }); 
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history', error });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server is running at http://localhost:${PORT}`);
});

app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
      let user = await User.findOne({ email });
      if (user) {
          return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      user = new User({ email, password: hashedPassword });
      await user.save();

      res.status(201).json(console.log("User added!"));
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
      let user = await User.findOne({ email });
      if (!user) {
          return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });
      res.json({ token, message: 'Login successful' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
});

app.post('/logout', auth, (req, res) => {

  res.status(200).json({ message: 'Logged out successfully' });

});

app.get('/dashboard', auth, (req, res) => {
  res.json({ message: 'Welcome to the dashboard!', userId: req.user });
});