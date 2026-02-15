import React, { useState, useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import ErrorDashboard from './components/ErrorDashboard';
import Login from './components/Login';

// Simple hashing function for ensuring basic security
const hashString = async (str) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check for existing session
  useEffect(() => {
    const session = localStorage.getItem('dashboard_session');
    if (session === 'active') {
      setIsLoggedIn(true);
    }
    setIsCheckingAuth(false);
  }, []);

  const handleLogin = async (username, password) => {
    // Get secrets from environment variables
    const validUser = import.meta.env.VITE_APP_USERNAME;
    const validPass = import.meta.env.VITE_APP_PASSWORD;

    // If secrets aren't set (e.g. initial dev), allow a default for testing IF NEEDED
    // BUT for security, we should enforce them.
    if (!validUser || !validPass) {
      console.warn('Login credentials not set in environment variables.');
      return false;
    }

    // In a real app, you'd hash the input and compare with a stored hash.
    // For this simple static deployment, we'll assume the env vars store the PLAIN credentials
    // effectively acting as the "stored secret" that shouldn't be revealed.
    // However, to prevent timing attacks slightly and follow best practice, 
    // we'll still compare them carefully, or even better, hash both to compare.
    
    // Let's rely on direct comparison for simplicity in this specific "no-backend" scope,
    // as the env vars are injected at build time.
    if (username === validUser && password === validPass) {
      localStorage.setItem('dashboard_session', 'active');
      setIsLoggedIn(true);
      return true;
    }

    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem('dashboard_session');
    setIsLoggedIn(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {isCheckingAuth ? (
        <div style={{ minHeight: '100vh', background: '#0f172a' }} />
      ) : !isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <ErrorDashboard onLogout={handleLogout} />
      )}
    </ThemeProvider>
  );
}

export default App;
