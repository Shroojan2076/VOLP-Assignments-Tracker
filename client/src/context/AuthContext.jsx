import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  checkBackendConnection, 
  loginUser, 
  registerUser, 
  triggerResync,
  mockCourses,
  mockAssignments 
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
    message: 'Checking backend status...'
  });

  const [syncState, setSyncState] = useState({
    isSyncing: false,
    lastSynced: localStorage.getItem('volp_last_synced') || null,
    status: 'idle',
    message: ''
  });

  const [isDemoMode, setIsDemoMode] = useState(false);

  // Check backend connectivity on mount
  useEffect(() => {
    async function checkHealth() {
      const res = await checkBackendConnection();
      setBackendState({
        checked: true,
        connected: res.connected,
        status: res.status,
        message: res.message
      });
    }
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const login = async (email, password) => {
    // Attempt real backend call
    const result = await loginUser(email, password);

    const activeUser = result.user || result.data?.user;
    if (result.success && activeUser) {
      setUser(activeUser);
      localStorage.setItem('volp_user', JSON.stringify(activeUser));
      setIsDemoMode(false);
      return { success: true };
    }

    // If backend route POST /api/auth/login is truly missing
    if (result.isEndpointMissing) {
      return {
        success: false,
        isEndpointMissing: true,
        message: result.message || 'Backend auth endpoint is not mounted yet.'
      };
    }

    return {
      success: false,
      message: result.message || 'Login failed: check your VOLP email and password.'
    };
  };

  const register = async (userData, maybePassword) => {
    // Attempt real backend call
    const result = await registerUser(userData, maybePassword);

    const activeUser = result.user || result.data?.user;
    if (result.success && activeUser) {
      setUser(activeUser);
      localStorage.setItem('volp_user', JSON.stringify(activeUser));
      setIsDemoMode(false);
      return { success: true };
    }

    // If backend route POST /api/auth/register is truly missing
    if (result.isEndpointMissing) {
      return {
        success: false,
        isEndpointMissing: true,
        message: result.message || 'Backend register endpoint is not mounted yet.'
      };
    }

    return {
      success: false,
      message: result.message || 'VOLP credential verification failed.'
    };
  };

  const loginDemo = (customUser) => {
    const demoUser = customUser || {
      id: 1,
      email: 'shroojan.1251090062@vit.edu',
      firstName: 'Shroojan',
      lastName: 'Student',
      isActive: true,
      createdAt: new Date().toISOString()
    };
    setUser(demoUser);
    setIsDemoMode(true);
    localStorage.setItem('volp_user', JSON.stringify(demoUser));
  };

  const logout = () => {
    setUser(null);
    setIsDemoMode(false);
    localStorage.removeItem('volp_user');
  };

  const syncNow = async () => {
    setSyncState(prev => ({ ...prev, isSyncing: true, status: 'syncing', message: 'Triggering VOLP sync...' }));
    
    try {
      const res = await triggerResync();
      const timestamp = new Date().toLocaleTimeString();
      localStorage.setItem('volp_last_synced', timestamp);

      if (res.success) {
        setSyncState({
          isSyncing: false,
          lastSynced: timestamp,
          status: 'success',
          message: 'Synchronization completed successfully!'
        });
      } else {
        setSyncState({
          isSyncing: false,
          lastSynced: timestamp,
          status: 'warning',
          message: res.message || 'Sync triggered (processed in background).'
        });
      }
    } catch (err) {
      setSyncState(prev => ({
        ...prev,
        isSyncing: false,
        status: 'error',
        message: 'Sync request error'
      }));
    }

    setTimeout(() => {
      setSyncState(prev => ({ ...prev, status: 'idle', message: '' }));
    }, 4000);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isDemoMode,
      backendState,
      syncState,
      login,
      register,
      loginDemo,
      logout,
      syncNow
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
