const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 8000;
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const API_KEY = "AIzaSyDgDzrlIwIILh6M-2_bl0HrxNGXeAdMoS8";

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(bodyParser.json());

// Endpoint to generate XML and convert it to HTML using the same API
app.post('/generate-content', async (req, res) => {
  try {
    const { diagram } = req.body;

    // Step 1: Generate XML from diagram
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

    // Generate XML from diagram data
    const xmlResponse = await axios.post(generateXMLUrl, data, { headers });
    const xmlContent = xmlResponse.data.candidates[0]?.content?.parts[0]?.text || '';

    // Clean the XML content
    const cleanedXml = xmlContent.replace(/```xml/g, '').replace(/```/g, '').trim();
    console.log(cleanedXml);

    // Step 2: Convert the cleaned XML to HTML
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

    // Convert XML to HTML using the same API
    const htmlResponse = await axios.post(generateXMLUrl, convertToHtmlData, { headers });
    const htmlContent = htmlResponse.data.candidates[0]?.content?.parts[0]?.text || '';

    // Send back both XML and HTML to frontend
    res.json({
      xmlContent: cleanedXml,
      htmlContent: htmlContent.trim(),
    });

  } catch (error) {
    console.error('Error during API request:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend server is running at http://localhost:${PORT}`);
});

