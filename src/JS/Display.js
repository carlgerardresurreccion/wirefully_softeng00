import '../CSS/Dashboard.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Display = ({ responseData, onBackButtonClick }) => {
    const [actorImageSrcs, setActorImageSrcs] = useState({});
    const [errorLoading, setErrorLoading] = useState(false);

    useEffect(() => {
        if (responseData && responseData.success && responseData.actorData) {
            const actorImageUrls = {};
            for (const actor in responseData.actorData) {
                actorImageUrls[actor] = responseData.actorData[actor].map(imagePath => {
                    console.log(`http://localhost:3001/${imagePath}`);
                    return `http://localhost:3001/${imagePath}`;
                });
            }
            setActorImageSrcs(actorImageUrls);
        } else {
            setErrorLoading(true);
        }
    }, [responseData]);

    const handleBackButtonClick = () => {
        onBackButtonClick();
    };

    const handleExportButtonClick = async () => {
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
    };

    return (
        <div className='Display-Main'>
            <div className="Below-NavBar">
                <button className="backButton" onClick={handleBackButtonClick}>Back</button>
                <button className="exportButton" onClick={handleExportButtonClick}>Export</button>
            </div>
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
            </div>
        </div>
    );
};

export default Display;

















