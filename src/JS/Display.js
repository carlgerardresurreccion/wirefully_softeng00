import '../CSS/Dashboard.css';
import React, { useEffect, useState } from 'react';

const Display = ({ responseData, onBackButtonClick }) => {
    const [imageSrcs, setImageSrcs] = useState([]);
    const [errorLoading, setErrorLoading] = useState(false);

    useEffect(() => {
        if (responseData && responseData.success && responseData.imagePaths.length > 0) {
            const imageUrls = responseData.imagePaths.map(path => `http://localhost:3001/${path}`);
            setImageSrcs(imageUrls);
            console.log("Image URLs:", imageUrls); // Log image URLs for debugging
        } else {
            setErrorLoading(true); // Handle error cases if needed
        }
    }, [responseData]);

    console.log('Received responseData:', responseData); // Log responseData for debugging

    const handleBackButtonClick = () => {
        onBackButtonClick();
    };

    const handleExportButtonClick = () => {
        // Handle export logic
    };

    const handleImageError = () => {
        setErrorLoading(true);
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
                        {imageSrcs.map((src, index) => (
                            <div key={index} className="image-wrapper">
                                <img src={src} alt={`Generated Wireframe ${index + 1}`} className="image-style" onError={handleImageError} />
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

export default Display;












