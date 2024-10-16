import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { login } = useAuth();
    const [credentials, setCredentials] = useState({ email: '', password: '' });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Login attempt with:', credentials); // Debugging line
        try {
            await login(credentials);
            navigate('/home');
        } catch (error) {
            console.error('Login error:', error.response?.data || error.message); // Log the error response
        }
    };    

    return (
        <form onSubmit={handleSubmit}>
            <div className='input-group'>
                <label htmlFor="email">Email</label>
                <input 
                    type="email" 
                    name="email" 
                    value={credentials.email} 
                    onChange={handleChange} 
                    required 
                />
            </div>
            <div className='input-group'>
                <label htmlFor="password">Password</label>
                <input 
                    type="password" 
                    name="password" 
                    value={credentials.password} 
                    onChange={handleChange} 
                    required 
                />
            </div>
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
