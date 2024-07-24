import '../CSS/Dashboard.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Display = ({ responseData, onBackButtonClick }) => {
    const [imageSrcs, setImageSrcs] = useState([]);
    const [errorLoading, setErrorLoading] = useState(false);

    useEffect(() => {
        if (responseData && responseData.success && responseData.imagePaths.length > 0) {
            const imageUrls = responseData.imagePaths.map(path => `http://localhost:3001/${path}`);
            setImageSrcs(imageUrls);
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
                        {imageSrcs.map((src, index) => (
                            <div key={index} className="image-wrapper">
                                <img src={src} alt={`Generated Wireframe ${index + 1}`} className="image-style" />
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

export default Display;














