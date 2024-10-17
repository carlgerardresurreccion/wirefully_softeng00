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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHistoryVisible, setIsHistoryVisible] = useState(false);
    const [history, setHistory] = useState([]);
    const htmlPreviewRef = useRef(null);

    const [showXML, setShowXML] = useState(false);
    const { token, logout } = useAuth(); // Access the logout function from context
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout(); // Call the logout function
        navigate('/'); // Redirect to the home page after logging out
    };

    const handleGenerate = async (diagramData) => {
        try {
            const response = await fetch("http://localhost:8000/generate-content", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ diagram: diagramData }),
            });
    
            if (response.ok) {
                const jsonResponse = await response.json();
                const newHistoryItem = {
                    diagram: diagramData,
                    xml: jsonResponse.xmlContent,
                    html: jsonResponse.htmlContent,
                    timestamp: new Date().toLocaleString(),  
                };
    
                await fetch("http://localhost:8000/save-history", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token,  
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
            const response = await fetch("http://localhost:8000/get-history", {
                headers: {
                    "Authorization": token,  
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
    
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const toggleHistory = () => {
        setIsHistoryVisible(!isHistoryVisible);  
        if (!isHistoryVisible) {
            fetchHistory(); 
        }
    };


    const exportAsImage = async () => {
        if (htmlPreviewRef.current) {
            const canvas = await html2canvas(htmlPreviewRef.current);  
            const image = canvas.toDataURL('image/png');  
            const link = document.createElement('a');
            link.href = image;
            link.download = 'wireframe.png';  
            link.click();  
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
                    <span className='Navbar-text'>WireFully</span>
                </div>
                <div className='Navbar-middle'>
                    <span className='Navbar-text'>Hi, welcome back!</span>
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
                {/*<div className='column2'>
                    <div>
                        <h3>Generated XML Output:</h3>
                        <div className="xml-output-box">
                            <pre>{xmlResponse ? xmlResponse : 'No XML generated yet.'}</pre>
                        </div>

                        <h2>HTML Preview:</h2>
                        <button onClick={toggleModal} className="preview-button">
                            {htmlPreview ? 'Show HTML Preview' : 'No HTML Preview Available'}
                        </button>
                    </div>
                </div>*/}
                <div className='column2'>
                    <div className='inside-column2'>
                        <h3>Output: </h3>
                        <div className="output-box">
                            {showXML ? (
                                <pre>{xmlResponse ? xmlResponse : 'No XML generated yet.'}</pre>
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

            {/*isModalOpen && htmlPreview && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button onClick={toggleModal} className="close-button">Close Preview</button>
                        <div className="html-preview-content" ref={htmlPreviewRef}>
                            {parse(htmlPreview)}
                        </div>
                        <button onClick={exportAsImage} className="export-button">
                            Export as Image
                        </button>
                    </div>
                </div>
            )*/}
        </div>
    );
}

export default Dashboard;



