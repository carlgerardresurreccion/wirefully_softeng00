import React, { useState, useRef } from 'react';
import logo from '../CSS/1.png';
import '../CSS/Dashboard.css';
import DiagramEditor from './DiagramEditor';
import parse from 'html-react-parser';
import html2canvas from 'html2canvas';
import HistoryScreen from './HistoryScreen';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const [errorMessage, setErrorMessage] = useState('');
    const [xmlResponse, setXmlResponse] = useState(null);
    const [htmlPreview, setHtmlPreview] = useState(null);
    const [isHistoryVisible, setIsHistoryVisible] = useState(false);
    const [history, setHistory] = useState([]);
    const htmlPreviewRef = useRef(null);

    const [showXML, setShowXML] = useState(false);
    const { token, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const handleGenerate = async (diagramData) => {
        try {
            const response = await fetch("http://localhost:10000/generate-content", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ diagram: diagramData }),
            });
    
            if (response.ok) {
                const jsonResponse = await response.json();

                const diagramElement = document.getElementById('maonajudniboss'); 
                const diagramCanvas = diagramElement ? await html2canvas(diagramElement) : null;
                const diagramImage = diagramCanvas ? diagramCanvas.toDataURL('image/png') : null;

                const newHistoryItem = {
                    diagram: diagramImage,
                    xml: jsonResponse.xmlContent,
                    html: jsonResponse.htmlContent,
                    timestamp: new Date().toLocaleString(),  
                };
    
                await fetch("http://localhost:10000/save-history", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,  
                    },
                    body: JSON.stringify(newHistoryItem),
                });
    
                setXmlResponse(jsonResponse.xmlContent);
                setHtmlPreview(jsonResponse.htmlContent);  
            } else {
                setErrorMessage(`Error: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            setErrorMessage(`Error during API request: ${error.message}`);
        }
    };
    
    const fetchHistory = async () => {
        try {
            const response = await fetch("http://localhost:10000/get-history", {
                headers: {
                    "Authorization": `Bearer ${token}`,  
                },
            });
            if (response.ok) {
                const historyData = await response.json();
                console.log('Fetched History Data:', historyData); 
                setHistory(historyData);
            } else {
                setErrorMessage(`Error fetching history: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            setErrorMessage(`Error during API request: ${error.message}`);
        }
    };

    const toggleHistory = () => {
        setIsHistoryVisible(!isHistoryVisible);  
        if (!isHistoryVisible) {
            fetchHistory(); 
        }
    };

    const exportAsImage = async () => {
        const htmlPreviewCanvas = htmlPreviewRef.current 
            ? await html2canvas(htmlPreviewRef.current) 
            : null;
    
        const diagramElement = document.getElementById('maonajudniboss'); 
        const diagramCanvas = diagramElement 
            ? await html2canvas(diagramElement) 
            : null;
    
        if (htmlPreviewCanvas && diagramCanvas) {
            
            const maxHeight = Math.max(htmlPreviewCanvas.height, diagramCanvas.height);
            const combinedWidth = htmlPreviewCanvas.width + diagramCanvas.width + 20; // Add padding between the images
    
            
            const canvasSize = Math.max(maxHeight, combinedWidth); // Make it a big square
            const combinedCanvas = document.createElement('canvas');
            const context = combinedCanvas.getContext('2d');
    
            // Set the canvas size to the square size
            combinedCanvas.width = canvasSize;
            combinedCanvas.height = canvasSize;
    
            // Fill the background with a white color (optional)
            context.fillStyle = "#ffffff"; // White background
            context.fillRect(0, 0, combinedCanvas.width, combinedCanvas.height);
    
            // Draw the HTML preview (wireframe) on the left side
            const wireframeX = (canvasSize - combinedWidth) / 2; // Center horizontally
            const wireframeY = (canvasSize - htmlPreviewCanvas.height) / 2; // Center vertically
            context.drawImage(htmlPreviewCanvas, wireframeX, wireframeY, htmlPreviewCanvas.width, htmlPreviewCanvas.height);
    
            // Draw the diagram on the right side, with padding in between
            const diagramX = wireframeX + htmlPreviewCanvas.width + 50; // Add 20px padding between the images
            const diagramY = (canvasSize - diagramCanvas.height) / 2; // Center vertically
            context.drawImage(diagramCanvas, diagramX, diagramY, diagramCanvas.width, diagramCanvas.height);
    
            const combinedImage = combinedCanvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = combinedImage;
            link.download = 'UCDiagram&Wireframe.png';
            link.click();
        } else {
            console.error('Error capturing one or both images');
        }
    };

    const toggleView = () => {
        setShowXML(!showXML);
    };

    return (
        <div className='Whole-Page'>
            <div className="NavBar">
                <div className="NavBar-left">
                    <img src={logo} className="App-logo" alt="logo" />
                    <span className='Navbar-textt'>WireFully</span>
                </div>
                <div className='Navbar-middle'>
                    <span className='Navbar-textt'>Hi, welcome back!</span>
                </div>
                <div className='Navbar-right'>
                    <span onClick={toggleHistory} className='Navbar-text'>
                        {isHistoryVisible ? 'Back' : 'History'}
                    </span>
                    <span onClick={handleLogout} className='Navbar-text'>Log Out</span>
                </div>
            </div>
            {isHistoryVisible ? (
                <HistoryScreen history={history} /> 
            ) : (
            <div className='Display-Main'>
                <div className='column1'>
                    <div className='query-input'>
                        <DiagramEditor onGenerate={handleGenerate} />
                        {errorMessage && <p className='error-message'>{errorMessage}</p>}
                    </div>
                </div>
                <div className='column2'>
                    <div className='inside-column2'>
                        <h3>Output: </h3>
                        <div className="output-box">
                            {showXML ? (
                                <pre className="xml-content" >{xmlResponse ? xmlResponse : 'No XML generated yet.'}</pre>
                            ) : (
                                <div className="html-preview-content" ref={htmlPreviewRef}>
                                    {htmlPreview ? parse(htmlPreview) : 'Create your own use case diagram'}
                                </div>
                            )}
                        </div>

                        <div className='buttons'>
                            <button onClick={toggleView} className="xml-button">
                                {showXML ? 'Wireframe' : 'XML'}
                            </button>

                            <button onClick={exportAsImage} className="export-button">
                                Export
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
        </div>
    );
}

export default Dashboard;



