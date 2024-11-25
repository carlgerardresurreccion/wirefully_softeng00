const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 8000;
const axios = require('axios');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const API_KEY = "AIzaSyBvYkhHmx91JcEb7z5adavz_7bH5FHiuos";
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
      const decoded = jwt.verify(token.split(' ')[1], SECRET_KEY);  // Extract the token part
      req.user = decoded.userId;  // Extract user ID from token payload
      next();
  } catch (error) {
      res.status(401).json({ message: 'Token is not valid' });
  }
};

// app.use(cors({ origin: 'http://localhost:3000' }));
app.use(cors({ origin: 'https://wirefullysofteng-0.onrender.com' }));
app.use(express.json());
app.use(bodyParser.json());

app.post('/generate-content', async (req, res) => {
  try {
    const { diagram } = req.body;

    const templatePath = path.join(__dirname, '..', 'src', 'JS', 'temp.html');

    // Log the resolved path to check if it’s correct
    console.log('Resolved template path:', templatePath);
    
    if (!fs.existsSync(templatePath)) {
      return res.status(500).json({ error: 'Template file not found at the specified path.' });
    }

    if (fs.existsSync(templatePath)) {
      return res.status(500).json({ error: 'There is but not followed' });
    }
    
    const templateContent = fs.readFileSync(templatePath, 'utf-8');

    console.log(templateContent);

    const generateXMLUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-001:generateContent?key=${API_KEY}`;
    const data = {
      contents: [
        {
          parts: [
            {
              text: 'Based on the following use case diagram data which also contains the system name:\n\n' + diagram + '\n\nGenerate XML codes/layout (for Android Studio) for each use case based on its relationship with actors (no further explanations, just the xml code). Make sure it looks a phone screen wireframe and add other components to make it look complete. Please be consistent and accurate about this query.',
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
              text: 'Convert the following XML to HTML wireframes. Use the structure provided in the HTML template below ' +
                    'to ensure consistency in styling and layout. Generate only the HTML code.\n\nXML:\n' +
                    cleanedXml + "Use the following template to be the base/container of the wireframe" +
                    '\n\nTemplate:\n\n' +
                    templateContent +
                    '\n\nEnsure the output resembles a mobile phone wireframe, including headers, navigation bars, buttons, and content areas. ' +
                    'Use unique CSS classes to avoid conflicts and ensure all components are sized and spaced appropriately for mobile screens.',
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

app.get('/', (req, res) => {
  res.send('Backend is running successfully!');
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
          return res.status(400).json({ message: 'Invalid email or password. Please try again.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).json({ message: 'Invalid email or password. Please try again.' });
      }

      const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });
      res.json({ token, message: 'Login successful' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
});

app.get('/verify-token', auth, async (req, res) => {
  try {
      const user = await User.findById(req.user);  // req.user contains the userId from the token
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.json({ user: { id: user._id, email: user.email } });  // Return user data
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