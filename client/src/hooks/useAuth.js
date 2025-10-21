    import React, { createContext, useContext, useState, useEffect } from 'react';
    import axios from 'axios';

    const AuthContext = createContext();

    export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
    };

    export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Configure axios to include credentials
    axios.defaults.withCredentials = true;

    useEffect(() => {
        verifyAuth();
    }, []);

    const verifyAuth = async () => {
        try {
        const response = await axios.get('/api/auth/verify');
        setIsAuthenticated(response.data.authenticated);
        setUser(response.data.user);
        } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
        } finally {
        setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
        const response = await axios.post('/api/auth/login', { email, password });
        setIsAuthenticated(true);
        setUser(response.data.user);
        return { success: true, data: response.data };
        } catch (error) {
        return { 
            success: false, 
            error: error.response?.data?.error || 'Login failed' 
        };
        }
    };

    const logout = async () => {
        try {
        await axios.post('/api/auth/logout');
        } catch (error) {
        console.error('Logout error:', error);
        } finally {
        setIsAuthenticated(false);
        setUser(null);
        }
    };

    const value = {
        isAuthenticated,
        user,
        loading,
        login,
        logout,
        verifyAuth
    };

    return (
        <AuthContext.Provider value={value}>
        {children}
        </AuthContext.Provider>
    );
    };