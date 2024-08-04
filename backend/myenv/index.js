const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const cors = require('cors');
const zip = require('express-zip');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
    origin: "http://localhost:3000",
    methods: ["POST", "GET", "PUT"],
    credentials: true,
}));

const generatedImagesPath = path.join(__dirname, 'generated_images');
app.use('/generated_images', express.static(generatedImagesPath));

app.post('/process-data', (req, res) => {
    const inputData = req.body.inputData;
    const pythonScriptPath = path.join(__dirname, 'main.py');
    const pythonProcess = spawn('python', [pythonScriptPath, inputData]);

    let stdoutData = '';
    let stderrData = '';

    pythonProcess.stdout.on('data', (data) => {
        stdoutData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        stderrData = data.toString();
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0) {
            res.status(500).json({ error: stderrData });
        } else {
            try {
                const outputLines = stdoutData.trim().split('\n');
                let imagePaths = [];
                let relativeImagePaths = [];
                let actorData = {};

                outputLines.forEach(line => {
                    if (line.startsWith('Image saved at: ')) {
                        const imagePath = line.replace('Image saved at: ', '').trim();
                        imagePaths.push(imagePath);

                        const relativePath = path.relative(__dirname, imagePath).replace(/\\/g, '/');
                        relativeImagePaths.push(`generated_images/${path.basename(relativePath)}`);
                    } else if (line.startsWith('Actor:')) {
                        const [actor, imagePath] = line.replace('Actor:', '').trim().split(',');
                        if (!actorData[actor]) {
                            actorData[actor] = [];
                        }
                        const relativePath = path.relative(__dirname, imagePath).replace(/\\/g, '/');
                        actorData[actor].push(`generated_images/${path.basename(relativePath)}`);
                    }
                });

                res.json({ success: true, actorData, imagePaths: relativeImagePaths });
            } catch (error) {
                res.status(500).json({ error: 'Error parsing Python output' });
            }
        }
    });
});

app.get('/export-images', (req, res) => {
    const images = req.query.images;
    if (!images) {
        return res.status(400).json({ error: 'No images provided' });
    }

    console.log('Images to export:', images); // Debug log

    const imagePaths = images.map(img => ({
        path: path.join(generatedImagesPath, path.basename(img)),
        name: path.basename(img),
    }));

    res.zip(imagePaths, 'generated_images.zip', (err) => {
        if (err) {
            console.error('Error creating zip:', err);
            res.status(500).json({ error: 'Error creating zip' });
        } else {
            console.log('Zip file created and sent');
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});










