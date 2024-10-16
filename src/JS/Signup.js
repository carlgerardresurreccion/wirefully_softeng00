import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = ({ toggleForm }) => {
    const [userDetails, setUserDetails] = useState({
        username: '',
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserDetails({ ...userDetails, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(userDetails);
        try {
            await axios.post('http://localhost:8000/signup', userDetails);
            toggleForm();
        } catch (error) {
            console.error(error.response.data);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className='input-group'>
            <label htmlFor="username">Username</label>
                <input 
                    type="text" 
                    name="username" 
                    value={userDetails.username} 
                    onChange={handleChange} 
                    required 
                />
            </div>
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
