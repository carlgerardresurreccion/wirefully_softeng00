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
        localStorage.setItem('token', response.data.token);
        setIsAuthenticated(true);
        return response;
    };

    const logout = async () => {
        try {
            console.log("Token before logout:", localStorage.getItem('token'));
            await axios.post('http://localhost:8000/logout', null, {
                headers: {
                    'Authorization': localStorage.getItem('token'),
                },
            });
            setUser(null);
            localStorage.removeItem('token'); 
            window.location.href = '/';
        } catch (error) {
            console.error("Logout error:", error.response ? error.response.data : error.message);
        }
    };    

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
