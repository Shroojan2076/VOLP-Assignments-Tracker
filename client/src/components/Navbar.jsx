import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  RefreshCw, 
  Server, 
  LogOut, 
  User, 
  CheckCircle2, 
  AlertTriangle,
  Sparkles
} from 'lucide-react';

export default function Navbar() {
  const { user, isDemoMode, backendState, syncState, syncNow, logout } = useAuth();

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 40,
      backgroundColor: 'rgba(7, 9, 14, 0.8)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '0.85rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      flexWrap: 'wrap'
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          boxShadow: '0 0 16px rgba(99, 102, 241, 0.4)'
        }}>
          <GraduationCap size={22} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h1 style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff' }}>
              VOLP<span style={{ color: 'var(--accent-primary)' }}>Tracker</span>
            </h1>
            {isDemoMode && (
              <span className="badge badge-amber" style={{ fontSize: '0.68rem', padding: '0.1rem 0.45rem' }}>
                <Sparkles size={10} /> Demo Data
              </span>
            )}
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Automated Academic Sync Engine
          </p>
        </div>
      </div>

      
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Backend connectivity indicator */}
        <div 
          title={backendState.message}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            backgroundColor: backendState.connected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
            border: `1px solid ${backendState.connected ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.25)'}`,
            color: backendState.connected ? '#34d399' : '#fbbf24',
            cursor: 'default'
          }}
        >
          <Server size={13} />
          <span>{backendState.connected ? 'Backend Online (Port 3000)' : 'Backend Disconnected'}</span>
        </div>

        {/* Sync Now button */}
        {user && (
          <button
            onClick={syncNow}
            disabled={syncState.isSyncing}
            className="btn-primary"
            style={{
              padding: '0.45rem 0.9rem',
              fontSize: '0.8rem',
              borderRadius: 'var(--radius-full)'
            }}
            id="sync-now-button"
          >
            <RefreshCw size={13} className={syncState.isSyncing ? 'animate-spin' : ''} />
            <span>{syncState.isSyncing ? 'Syncing...' : 'Sync with VOLP'}</span>
          </button>
        )}
      </div>

      {/* User profile & Logout */}
      {user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.35rem 0.75rem',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '0.75rem',
              fontWeight: 700
            }}>
              {(user.firstName ? user.firstName[0] : user.email[0]).toUpperCase()}
            </div>
            <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                {user.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Student'}
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.email}
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="btn-secondary"
            style={{
              padding: '0.45rem 0.75rem',
              fontSize: '0.8rem',
              borderRadius: 'var(--radius-full)'
            }}
            title="Log out"
            id="logout-button"
          >
            <LogOut size={13} />
            <span style={{ display: 'none' }}>Logout</span>
          </button>
        </div>
      )}
    </header>
  );
}
