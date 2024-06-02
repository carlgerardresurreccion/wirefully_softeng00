import '../CSS/Dashboard.css';
import logo from '../CSS/1.png';
import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useHistory } from 'react-router-dom';
import { signOut } from 'firebase/auth'; 
import Display from './Display';

function Dashboard() {
    const [inputValue, setInputValue] = useState('');
    const textareaRef = useRef(null);
    const { currentUser } = useAuth();
    const history = useHistory();
    const [currentView, setCurrentView] = React.useState('Dashboard');

    const handleViewChange = (view) => {
        setCurrentView(view);
      }

    useEffect(() => {
        if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [inputValue]);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          const response = await axios.post('http://localhost:3001/process-data', {
            inputData: inputValue,
          });
          handleViewChange('Display');
        } catch (error) {
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
            <div className='Main'>
                {currentView === 'Display' ? (
                    <Display onSignUpClick={() => handleViewChange('Display')} />
                ) : (
                    <div>
                        <h2>How can I help you today?</h2>
                        <div className='query-input'>
                            <textarea
                                ref={textareaRef}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder='Enter use case diagram scripts here...'
                            />
                            <button onClick={handleSubmit}>Generate</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;