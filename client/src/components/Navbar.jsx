import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, 
  LogOut,
  SlidersHorizontal,
  X,
  Check
} from 'lucide-react';

export default function Navbar() {
  const { user, backendState, updateBackendUrl, customBackendUrl, logout } = useAuth();
  const [showConfig, setShowConfig] = useState(false);
  const [urlInput, setUrlInput] = useState(customBackendUrl || '');

  const hostDisplay = backendState.host || 'localhost:3000';

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    await updateBackendUrl(urlInput.trim());
    setShowConfig(false);
  };

  const handleResetConfig = async () => {
    setUrlInput('');
    await updateBackendUrl('');
    setShowConfig(false);
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 40,
      backgroundColor: 'rgba(15, 17, 21, 0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '0.75rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      flexWrap: 'wrap'
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: '34px',
          height: '34px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'rgba(229, 142, 57, 0.12)',
          border: '1px solid rgba(229, 142, 57, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-amber)'
        }}>
          <BookOpen size={17} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
            <span style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
              VOLP
            </span>
            <span className="font-serif" style={{ fontSize: '1.15rem', fontStyle: 'italic', color: 'var(--accent-amber)' }}>
              Desk
            </span>
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            Coursework & Deadline Companion
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Subtle, refined connection pill */}
        <button
          onClick={() => {
            setUrlInput(customBackendUrl || '');
            setShowConfig(!showConfig);
          }}
          title="Click to view or edit backend host"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.3rem 0.7rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.73rem',
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            color: varStatusColor(backendState.connected),
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'all 0.15s ease'
          }}
          id="backend-connection-pill"
        >
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: backendState.connected ? '#34a853' : '#ea4335',
            display: 'inline-block'
          }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
            {backendState.connected ? hostDisplay : 'Offline'}
          </span>
          <SlidersHorizontal size={11} style={{ opacity: 0.6, marginLeft: '0.15rem' }} />
        </button>

        {/* User profile & Logout */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              padding: '0.28rem 0.7rem',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: 'var(--radius-xs)',
                backgroundColor: 'rgba(229, 142, 57, 0.2)',
                color: 'var(--accent-amber)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.72rem',
                fontWeight: 700
              }}>
                {(user.firstName ? user.firstName[0] : (user.email ? user.email[0] : 'S')).toUpperCase()}
              </div>
              <div style={{ textAlign: 'left', lineHeight: 1.15 }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-main)', display: 'block' }}>
                  {user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Student'}
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              className="btn-secondary"
              style={{
                padding: '0.35rem 0.65rem',
                fontSize: '0.75rem',
                borderRadius: 'var(--radius-sm)'
              }}
              title="Sign out of VOLP Desk"
              id="logout-button"
            >
              <LogOut size={12} />
              <span>Sign out</span>
            </button>
          </div>
        )}
      </div>

      {/* Backend Settings Dialog */}
      {showConfig && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(5px)',
          zIndex: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div className="craft-card" style={{
            width: '100%',
            maxWidth: '440px',
            padding: '1.5rem',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowConfig(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>

            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              API Server Destination
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.1rem', lineHeight: 1.45 }}>
              Connect directly to your local Express server or a remote hosted instance (e.g. on Render or Railway).
            </p>

            <form onSubmit={handleSaveConfig}>
              <div className="form-group" style={{ marginBottom: '1rem' }}>
                <label className="form-label">Backend Host or Full URL</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="http://localhost:3000 or https://volp-api.onrender.com"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
                />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Currently active: <code style={{ color: 'var(--accent-amber)' }}>{hostDisplay}</code>
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1.25rem' }}>
                <button
                  type="button"
                  onClick={handleResetConfig}
                  className="btn-secondary"
                  style={{ fontSize: '0.78rem', padding: '0.45rem 0.85rem' }}
                >
                  Reset Default
                </button>
                <button
                  type="submit"
                  className="btn-amber"
                  style={{ fontSize: '0.78rem', padding: '0.45rem 1rem' }}
                >
                  <Check size={13} />
                  <span>Save Connection</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}

function varStatusColor(connected) {
  return connected ? 'var(--text-main)' : 'var(--text-muted)';
}
