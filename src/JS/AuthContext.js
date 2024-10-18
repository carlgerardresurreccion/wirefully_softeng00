import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get('http://localhost:8000/verify-token', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setUser(response.data.user);
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error('Token validation failed or session expired:', error);
                    setIsAuthenticated(false);
                    localStorage.removeItem('token'); 
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (credentials) => {
        const response = await axios.post('https://wirefully-backend0.onrender.com/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            console.log("LOG IN: ", response.data.token);
            setUser(response.data.user);
            setIsAuthenticated(true);
        } else {
            throw new Error('Authentication failed: No token received');
        }
    };

    const logout = async () => {
        try {
            console.log("Token before logout:", localStorage.getItem('token'));
            await axios.post('https://wirefully-backend0.onrender.com/logout', null, {
                headers: {
                    'Authorization': localStorage.getItem('token'),
                },
            });
            localStorage.removeItem('token'); 
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('token');
            window.location.href = '/';
        } catch (error) {
            console.error("Logout error:", error.response ? error.response.data : error.message);
        }
    };
    
    const token = localStorage.getItem('token');

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated, token }}>
            {/*{children}*/}
            {loading ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
