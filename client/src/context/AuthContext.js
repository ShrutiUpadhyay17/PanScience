import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        
        try {
            if (token) {
                const decodedToken = jwtDecode(token);
              
                if (decodedToken.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    setUser({ id: decodedToken.id, role: decodedToken.role });
                    localStorage.setItem('token', token);
                }
            } else {
                localStorage.removeItem('token');
                setUser(null);
            }
        } catch (error) {
             logout();
        }
    }, [token]);

    const login = (newToken) => {
        setToken(newToken);
    };

    const logout = () => {
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};