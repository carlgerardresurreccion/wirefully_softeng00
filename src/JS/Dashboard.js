import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useHistory } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import Display from './Display';
import logo from '../CSS/1.png';
import '../CSS/Dashboard.css';

function Dashboard() {
    const [inputValue, setInputValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const textareaRef = useRef(null);
    const { currentUser } = useAuth();
    const history = useHistory();
    const [currentView, setCurrentView] = useState('Dashboard');
    const [responseData, setResponseData] = useState(null);

    const handleViewChange = (view) => {
        setCurrentView(view);
    };

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [inputValue]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        try {
            const response = await axios.post('http://localhost:3001/process-data', {
                inputData: inputValue,
            });
            if (response.data.error) {
                setErrorMessage(response.data.error); // Set error message received from backend
                handleViewChange('Dashboard');
            } else {
                setResponseData(response.data.parsed_text);
                handleViewChange('Display');
            }
            console.log(response.data);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setErrorMessage(error.response.data.error); // Set error message from backend
            } else {
                setErrorMessage('An error occurred. Please try again.');
            }
            handleViewChange('Dashboard');
            console.error('Error sending data to server:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(currentUser.auth);
            history.push('/');
        } catch (error) {
            console.error('Error signing out:', error.message);
        }
    };

    const handleBackButtonClick = () => {
        setCurrentView('Dashboard');
    };

    return (
        <div>
            <div className="User-NavBar">
                <div className="NavBar-left">
                    <img src={logo} className="App-logo" alt="logo" />
                </div>
                <div className='NavBar-middle'>
                    <span>WireFully</span>
                </div>
                <div className="NavBar-right">
                    {currentUser && <button className='userName'>{currentUser.email}</button>}
                    <button className='userName' onClick={handleLogout}>Log Out</button>
                </div>
            </div>
            <div>
                {currentView === 'Display' ? (
                    <Display responseData={responseData} onBackButtonClick={handleBackButtonClick} onSignUpClick={() => handleViewChange('Display')} />
                ) : (
                    <div className='Main'>
                        <h2>How can I help you today?</h2>
                        <div className='query-input'>
                            <textarea
                                ref={textareaRef}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder='Enter use case diagram scripts here...'
                            />
                            <button onClick={handleSubmit}>Generate</button>
                            {errorMessage && <p className='error-message'>{errorMessage}</p>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;



