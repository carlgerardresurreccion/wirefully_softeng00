// src/AuthContext.js

import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = async (credentials) => {
        console.log(credentials);
        const response = await axios.post('http://localhost:8000/login', credentials);
        setUser(response.data.user);
        localStorage.setItem('token', response.data.token); // Store the token
        setIsAuthenticated(true); // Update the authentication state
        return response; // Ensure you return the response
    };

    const logout = async () => {
        await axios.post('http://localhost:8000/logout');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
