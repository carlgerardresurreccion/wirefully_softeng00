const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 8000;
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const API_KEY = "AIzaSyDgDzrlIwIILh6M-2_bl0HrxNGXeAdMoS8";
const MONGODB_URI = "mongodb+srv://carlgerardresuu:llrTldGAU3JSQm5y@cluster0.l28co.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGODB_URI, {
});

const historySchema = new mongoose.Schema({
    diagram: String,
    xml: String,
    html: String,
    timestamp: String,
});

const History = mongoose.model('History', historySchema);

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

app.post('/save-history', async (req, res) => {
  try {
    const historyItem = new History(req.body);
    await historyItem.save();
    res.status(201).json({ message: 'History saved successfully' });
  } catch (error) {
    console.error('Error saving history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/get-history', async (req, res) => {
  try {
      const history = await History.find();
      res.json(history);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching history', error });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server is running at http://localhost:${PORT}`);
});

