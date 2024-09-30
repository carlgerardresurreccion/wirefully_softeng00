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
