const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
    origin: "http://localhost:3000",
    methods: ["POST", "GET", "PUT"],
    credentials: true,
}));

// Serve static files
const generatedImagesPath = path.join(__dirname, 'generated_images');
app.use('/generated_images', express.static(generatedImagesPath));

app.post('/process-data', (req, res) => {
    const inputData = req.body.inputData;

    const pythonProcess = spawn('python', ['C:/wirefully_softeng/backend/myenv/main.py', inputData]);

    let stdoutData = '';
    let stderrData = '';

    pythonProcess.stdout.on('data', (data) => {
        stdoutData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        stderrData += data.toString();
    });

    pythonProcess.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        if (code !== 0) {
            console.error(`stderr: ${stderrData}`);
            res.status(500).json({ error: stderrData });
        } else {
            try {
                const outputLines = stdoutData.trim().split('\n');
                let imagePaths = [];
                let relativeImagePaths = [];

                outputLines.forEach(line => {
                    if (line.startsWith('Image saved at: ')) {
                        const imagePath = line.replace('Image saved at: ', '').trim();
                        imagePaths.push(imagePath);

                        const relativePath = path.relative(generatedImagesPath, imagePath).replace(/\\/g, '/');
                        relativeImagePaths.push(`generated_images/${relativePath}`);
                    }
                });

                console.log('Image Paths:', imagePaths);
                console.log('Relative Image Paths:', relativeImagePaths);
                res.json({ success: true, imagePaths: relativeImagePaths });
            } catch (error) {
                console.error('Error parsing Python output:', error);
                res.status(500).json({ error: 'Error parsing Python output' });
            }
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});





