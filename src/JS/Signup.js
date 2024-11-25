import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = ({ toggleForm }) => {
    const [userDetails, setUserDetails] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserDetails({ ...userDetails, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(userDetails);
        try {
            await axios.post('https://wirefully-backend0.onrender.com/signup', userDetails);
            toggleForm();
        } catch (error) {
            setError(err.response?.data?.message || 'An error occurred. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <p style={{ color: 'red', fontSize: '12px', marginBottom: '10px' }}>{error}</p>}
            <div className='input-group'>
                <label htmlFor="email">Email</label>
                <input 
                    type="email" 
                    name="email" 
                    value={userDetails.email} 
                    onChange={handleChange} 
                    required 
                />
            </div>
            <div className='input-group'>
                <label htmlFor="password">Password</label>
                <input 
                    type="password" 
                    name="password" 
                    value={userDetails.password} 
                    onChange={handleChange} 
                    required 
                />
            </div>
            <button type="submit">Sign Up</button>
        </form>
    );
};

export default Signup;
