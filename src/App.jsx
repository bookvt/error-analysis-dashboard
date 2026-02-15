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
    // We will hash the input password and compare it with the STORED HASH from env.
    // This means VITE_APP_PASSWORD in GitHub Secrets must be the SHA-256 hash of the password.
    
    // For the username, we can keep it plain text or hash it too. Let's keep username plain for simplicity
    // but hash the password to prevent F12 snooping.
    
    if (username === validUser) {
        // Hash the input password
        const inputHash = await hashString(password);
        
        // Compare with the stored hash
        if (inputHash === validPass) {
          localStorage.setItem('dashboard_session', 'active');
          setIsLoggedIn(true);
          return true;
        }
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
