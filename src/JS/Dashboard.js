import React, { useState, useEffect, useRef } from 'react';
import logo from '../CSS/1.png';
import '../CSS/Dashboard.css';
import DiagramEditor from './DiagramEditor';

function Dashboard() {
    const [errorMessage, setErrorMessage] = useState('');
    const [responseData, setResponseData] = useState(null);

    const [actorImageSrcs, setActorImageSrcs] = useState({});
    const [errorLoading, setErrorLoading] = useState(false);

    const [imageUrl, setImageUrl] = useState(null);

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
                const blob = await response.blob();
    
                // Create an object URL for the blob (image)
                const imageUrl = URL.createObjectURL(blob);
                
                // Set the wireframe image URL for the UI display
                setImageUrl(imageUrl);
    
                // Log the image to the console as a Base64 data URL
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = function() {
                    const base64data = reader.result;
                    console.log("Base64 Image URL: ", base64data);
                };
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
                {imageUrl && (
                    <div>
                        <h3>Wireframe Output:</h3>
                        <img src={imageUrl} alt="Wireframe" />
                    </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
