import '../CSS/Dashboard.css';
import React from 'react';
import { useLocation } from 'react-router-dom';

const Display = () => {
  const location = useLocation();
  const { responseData } = location.state || { responseData: 'No data received' };

  return (
    <div className='Main'>
        <h1>Processed Data</h1>
    </div>
  );
};

export default Display;