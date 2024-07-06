const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(bodyParser.json());

app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["POST, GET", "PUT"],
    credentials: true,
}));

app.post('/process-data', (req, res) => {
    const inputData = req.body.inputData;

    const pythonProcess = spawn('python', ['C:/wirefully_softeng/backend/myenv/nlp_processing.py', inputData]);

    let errorMessage = ''; // Separate variable for error message

    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        errorMessage = data.toString().trim(); // Store error message separately
    });

    pythonProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        if (code !== 0) {
            // If there's an error, send the errorMessage
            res.status(500).json({ error: errorMessage });
        } else {
            // Otherwise, send a success response
            res.json({ success: true });
        }
    });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
