import React, { useState, useRef } from 'react';
import logo from '../CSS/1.png';
import '../CSS/Dashboard.css';
import DiagramEditor from './DiagramEditor';
import parse from 'html-react-parser';
import html2canvas from 'html2canvas';  

function Dashboard() {
    const [errorMessage, setErrorMessage] = useState('');
    const [xmlResponse, setXmlResponse] = useState(null);
    const [htmlPreview, setHtmlPreview] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const htmlPreviewRef = useRef(null);

    const [showXML, setShowXML] = useState(false);

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
                setXmlResponse(jsonResponse.xmlContent);
                setHtmlPreview(jsonResponse.htmlContent);  
            } else {
                setErrorMessage(`Error: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            setErrorMessage(`Error during API request: ${error.message}`);
        }
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };


    const exportAsImage = async () => {
        if (htmlPreviewRef.current) {
            const canvas = await html2canvas(htmlPreviewRef.current);  
            const image = canvas.toDataURL('image/png');  
            
            // Create a temporary download link
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
                    <span className='App-name'>WireFully</span>
                </div>
            </div>
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



