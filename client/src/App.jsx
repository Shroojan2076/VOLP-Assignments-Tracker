import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import AuthView from './components/AuthView';
import DashboardView from './components/DashboardView';

function MainLayout() {
  const { isAuthenticated } = useAuth();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1 }}>
        {isAuthenticated ? (
          <DashboardView />
        ) : (
          <AuthView />
        )}
      </main>

      <footer style={{
        padding: '1.5rem',
        borderTop: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--bg-canvas)',
        fontSize: '0.78rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            VOLP Desk • A calm companion for classroom.volp.in
          </div>
          <div style={{ display: 'flex', gap: '0.85rem', color: 'var(--text-dim)', fontSize: '0.74rem' }}>
            <span>PostgreSQL Database</span>
            <span>•</span>
            <span>Automated Daily Sync</span>
            <span>•</span>
            <span>Student Field Guide</span>
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
