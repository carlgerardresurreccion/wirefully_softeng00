import '../CSS/Dashboard.css';
import React from 'react';

const Display = ({ responseData }) => {

    const handleBackButtonClick = () => {
        // Implement your logic to go back, e.g., using history.goBack()
    };

    const handleExportButtonClick = () => {
        // Implement your logic for export
    };

    return (
        <div className='Main'>
            <div className="Below-NavBar">
                <button className="backButton" onClick={handleBackButtonClick}>Back</button>
                <button className="exportButton" onClick={handleExportButtonClick}>Export</button>
            </div>
            <h1>Processed Data</h1>
            <p>{responseData || 'No data received'}</p>
        </div>
    );
};

export default Display;