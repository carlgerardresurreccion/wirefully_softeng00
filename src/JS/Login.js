import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { login } = useAuth();
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Login attempt with:', credentials);
        try {
            await login(credentials);
            navigate('/home');
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred. Please try again.');
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
