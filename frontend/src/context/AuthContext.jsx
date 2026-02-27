import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            checkAuth();
        } else {
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
            setLoading(false);
        }
    }, [token]);

    // Use environment variable if set, otherwise default to localhost
    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

    const checkAuth = async () => { // Renamed from fetchUser to checkAuth
        try {
            // Create axios instance with base URL for local auth
            const res = await axios.get(`${API_URL}/api/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(res.data);
        } catch (err) {
            console.error('Failed to fetch user', err);
            // setToken(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const res = await axios.post(`${API_URL}/api/login`, { email, password });
        setToken(res.data.access_token);
        localStorage.setItem('token', res.data.access_token); // Added this line
    };

    const requestOtp = async (email) => {
        await axios.post(`${API_URL}/api/request-otp`, { email });
    };

    const verifyOtp = async (email, otp_code) => {
        const res = await axios.post(`${API_URL}/api/verify-otp`, { email, otp_code });
        setToken(res.data.access_token);
        localStorage.setItem('token', res.data.access_token);
    };

    const register = async (name, email, password) => {
        await axios.post(`${API_URL}/api/register`, { name, email, password });
    };

    const logout = () => {
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, requestOtp, verifyOtp }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
