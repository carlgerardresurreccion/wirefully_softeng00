import '../CSS/Dashboard.css';
import logo from '../CSS/1.png';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useHistory } from 'react-router-dom';
import { signOut } from 'firebase/auth'; 

function Dashboard() {
    const [inputValue, setInputValue] = useState('');
    const textareaRef = useRef(null);
    const { currentUser } = useAuth();
    const history = useHistory();

    useEffect(() => {
        if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [inputValue]);

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
            <h2>How can I help you today?</h2>
            <div className='query-input'>
                <textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder='Enter use case diagram scripts here...'
                />
                <button>Generate</button>
            </div>
        </div>
        </div>
    );
}

export default Dashboard;