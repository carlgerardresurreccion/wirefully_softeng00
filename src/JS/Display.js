import '../CSS/Dashboard.css';
import React from 'react';

const Display = ({ responseData }) => {
    return (
        <div className='Main'>
            <h1>Processed Data</h1>
            <p>{responseData || 'No data received'}</p>
        </div>
    );
};

export default Display;