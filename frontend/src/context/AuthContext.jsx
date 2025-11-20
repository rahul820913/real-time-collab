// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // normal import, works with latest jwt-decode
import { fetchUserProfile, updateUserProfile } from "../API/userApi";

// Create context
const AuthContext = createContext();

// Custom hook for easy access
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);       // Stores logged-in user
  const [token, setToken] = useState(null);     // JWT or auth token
  const [loading, setLoading] = useState(true); // Loading state while fetching user

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem('profile');
      
      if (!storedUser) {
        setLoading(false);
        return;
      }

      try {
        const parsedUser = JSON.parse(storedUser);
        const userToken = parsedUser?.token;

        if (userToken) {
          const decoded = jwtDecode(userToken); // decode token
          const currentTime = Date.now() / 1000; // current time in seconds
          if (decoded.exp && decoded.exp < currentTime) {
            console.warn('Token expired. Logging out...');
            logout();
            navigate('/', { replace: true });
            return;
          }
        }

        setUser(parsedUser);
        setToken(userToken || null);
      } catch (err) {
        console.error('Failed to parse user from localStorage:', err);
        localStorage.removeItem('profile');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Login function: saves to state + localStorage
  const login = (userData) => {
    if (!userData || !userData.token) {
      console.error('Invalid user data for login:', userData);
      return;
    }
    setUser(userData);
    setToken(userData.token);
    localStorage.setItem('profile', JSON.stringify(userData));
  };

  const refreshUser = async () => {
    try {
      const data = await fetchUserProfile();
      console.log('Refreshed user:', data);
      setUser(data);
      localStorage.setItem('profile', JSON.stringify({data , token : token}));
    } catch (err) {
      console.error("Failed to refresh user:", err);
    }
  };
  
  const updateProfile = async (profileData) => {
    try {
      const data = await updateUserProfile(profileData);
      return data;
    } catch (err) {
      console.error("Error updating profile:", err);
      throw err;
    }
  };
  

  // Logout function: clears state + localStorage
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('profile');
    navigate('/', { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout , refreshUser, updateProfile}}>
      {children}
    </AuthContext.Provider>
  );
};
