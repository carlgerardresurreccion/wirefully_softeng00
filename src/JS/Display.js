import '../CSS/Dashboard.css';
import React from 'react';

const Display = ({ responseData, onBackButtonClick }) => {

    const handleBackButtonClick = () => {

    };

    const handleExportButtonClick = () => {

    };

    return (
        <div className='Display-Main'>
            <div className="Below-NavBar">
                <button className="backButton" onClick={onBackButtonClick}>Back</button>
                <button className="exportButton" onClick={handleExportButtonClick}>Export</button>
            </div>
            <h1>Processed Data</h1>
            <p>{responseData || 'No data received'}</p>
        </div>
    );
};

export default Display;