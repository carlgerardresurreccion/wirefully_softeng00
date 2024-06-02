import React from 'react';
import { useLocation } from 'react-router-dom';

const Display = () => {
  const location = useLocation();
  const { responseData } = location.state || { responseData: 'No data received' };

  return (
    <div>
      <h1>Processed Data</h1>
      <p>{responseData}</p>
    </div>
  );
};

export default Display;