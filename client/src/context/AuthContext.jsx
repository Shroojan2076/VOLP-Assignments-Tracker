import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  checkBackendConnection, 
  loginUser, 
  registerUser,
  setCustomBackendUrl,
  getCustomBackendUrl,
  getApiBase
} from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('volp_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [backendState, setBackendState] = useState({
    checked: false,
    connected: false,
    status: 0,
    host: '',
    apiBase: getApiBase(),
    message: 'Checking backend status...'
  });

  const checkHealth = useCallback(async () => {
    const res = await checkBackendConnection();
    setBackendState({
      checked: true,
      connected: res.connected,
      status: res.status,
      host: res.host || '',
      apiBase: getApiBase(),
      message: res.message
    });
  }, []);

  useEffect(() => {
    let active = true;
    checkBackendConnection().then((res) => {
      if (!active) return;
      setBackendState({
        checked: true,
        connected: res.connected,
        status: res.status,
        host: res.host || '',
        apiBase: getApiBase(),
        message: res.message
      });
    });

    const interval = setInterval(() => {
      checkBackendConnection().then((res) => {
        if (!active) return;
        setBackendState({
          checked: true,
          connected: res.connected,
          status: res.status,
          host: res.host || '',
          apiBase: getApiBase(),
          message: res.message
        });
      });
    }, 15000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const updateBackendUrl = async (newUrl) => {
    setCustomBackendUrl(newUrl);
    await checkHealth();
  };

  const login = async (email, password) => {
    const result = await loginUser(email, password);
    const activeUser = result.user || result.data?.user;
    if (result.success && activeUser) {
      setUser(activeUser);
      localStorage.setItem('volp_user', JSON.stringify(activeUser));
      return { success: true };
    }

    return {
      success: false,
      message: result.message || 'Login failed. Please check your credentials.'
    };
  };

  const register = async (userData, maybePassword) => {
    const result = await registerUser(userData, maybePassword);
    const activeUser = result.user || result.data?.user;
    if (result.success && activeUser) {
      setUser(activeUser);
      localStorage.setItem('volp_user', JSON.stringify(activeUser));
      return { success: true };
    }

    return {
      success: false,
      message: result.message || 'Registration failed. Please check your credentials.'
    };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('volp_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      backendState,
      checkHealth,
      updateBackendUrl,
      customBackendUrl: getCustomBackendUrl(),
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
