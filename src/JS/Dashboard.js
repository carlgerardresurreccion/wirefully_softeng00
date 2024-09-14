import React, { useState, useEffect, useRef } from 'react';
import logo from '../CSS/1.png';
import '../CSS/Dashboard.css';
import DiagramEditor from './DiagramEditor';

function Dashboard() {
    const [errorMessage, setErrorMessage] = useState('');
    const [responseData, setResponseData] = useState(null);

    const [actorImageSrcs, setActorImageSrcs] = useState({});
    const [errorLoading, setErrorLoading] = useState(false);

    /*const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        try {
            const response = await axios.post('http://localhost:3001/process-data', {

            });
            if (response.data.error) {
                setErrorMessage(response.data.error);
            } else {

            }
            console.log(response.data);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setErrorMessage(error.response.data.error);
            } else {
                setErrorMessage('An error occurred. Please try again.');
            }
            console.error('Error sending data to server:', error);
        }
    };*/

    /*useEffect(() => {
        if (responseData && responseData.success && responseData.actorData) {
            const actorImageUrls = {};
            for (const actor in responseData.actorData) {
                actorImageUrls[actor] = responseData.actorData[actor].map(imagePath => {
                    console.log(`http://localhost:3001/${imagePath}`);
                    return `http://localhost:3001/${imagePath}`;
                });
            }
            setActorImageSrcs(actorImageUrls);
            setErrorLoading(false);
        } else {
            setErrorLoading(true);
        }
    }, [responseData]);*/

    /*const handleExportButtonClick = async () => {
        if (responseData && responseData.imagePaths) {
            try {
                const response = await axios.get('http://localhost:3001/export-images', {
                    params: { images: responseData.imagePaths },
                    responseType: 'blob', // Important
                });

                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'generated_images.zip');
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
            } catch (error) {
                console.error('Error exporting images:', error);
            }
        }
    };*/

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
                        <DiagramEditor/>
                        <button className='generateButton'>Generate</button>
                        {errorMessage && <p className='error-message'>{errorMessage}</p>}
                    </div>
                </div>
                <div className='column2'>
                    {/*{responseData && (
                        <div className='Image-Container'>
                            {errorLoading ? (
                                <p>Error loading images.</p>
                            ) : (
                                <>
                                    {Object.keys(actorImageSrcs).map((actor, index) => (
                                        <div key={index} className="actor-section">
                                            <h3 className='actor'>Actor: {actor}</h3>
                                            {actorImageSrcs[actor].map((src, imgIndex) => (
                                                <div key={imgIndex} className="image-wrapper">
                                                    <img src={src} alt={`Generated Wireframe ${actor} ${imgIndex + 1}`} className="image-style" />
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </>
                            )}
                            <button className='exportButton'>Export</button>
                        </div>
                    )}*/}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
