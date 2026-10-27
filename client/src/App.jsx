import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import BackendBanner from './components/BackendBanner';
import AuthView from './components/AuthView';
import DashboardView from './components/DashboardView';

function MainLayout() {
  const { isAuthenticated } = useAuth();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <BackendBanner />

      <main style={{ flex: 1 }}>
        {isAuthenticated ? (
          <DashboardView />
        ) : (
          <AuthView />
        )}
      </main>

      <footer style={{
        padding: '1.5rem',
        textAlign: 'center',
        borderTop: '1px solid var(--border-subtle)',
        backgroundColor: 'rgba(7, 9, 14, 0.95)',
        fontSize: '0.78rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            VOLP Tracker • Reverse-Engineered Academic Sync Prototype
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span>PostgreSQL: Neon Cloud DB</span>
            <span>•</span>
            <span>API: Node.js & Express</span>
            <span>•</span>
            <span>Frontend: React + Vite</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
