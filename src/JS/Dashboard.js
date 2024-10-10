import React, { useState, useEffect, useRef } from 'react';
import logo from '../CSS/1.png';
import '../CSS/Dashboard.css';
import DiagramEditor from './DiagramEditor';
import parse from 'html-react-parser';

function Dashboard() {
    const [errorMessage, setErrorMessage] = useState('');
    const [responseData, setResponseData] = useState(null);

    const [actorImageSrcs, setActorImageSrcs] = useState({});
    const [errorLoading, setErrorLoading] = useState(false);

    const [imageUrl, setImageUrl] = useState(null);
    const [xmlResponse, setXmlResponse] = useState(null);

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

            // Clean up the XML text: remove unnecessary characters
            const xmlContent = jsonResponse.candidates[0]?.content?.parts[0]?.text || '';
                
                // Clean up the XML text: remove any markdown or unnecessary characters
                const cleanedXml = xmlContent
                    .replace(/```xml/g, '') 
                    .replace(/```/g, '')    
                    .trim();                

                // Set the cleaned XML text in state
                setXmlResponse(cleanedXml);
                console.log("Received XML: ", cleanedXml);
            } else {
                setErrorMessage(`Error: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            setErrorMessage(`Error during API request: ${error.message}`);
        }
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
                        <DiagramEditor onGenerate={handleGenerate}/>
                        {errorMessage && <p className='error-message'>{errorMessage}</p>}
                    </div>
                </div>
                <div className='column2'>
                <div>
                        <h3>Generated XML Output:</h3>
                        <div className="xml-output-box">
                            <pre>{xmlResponse ? xmlResponse : 'No XML generated yet.'}</pre> 
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
