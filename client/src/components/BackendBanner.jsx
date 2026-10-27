import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  CheckCircle2, 
  AlertCircle, 
  Code, 
  ChevronDown, 
  ChevronUp, 
  Info,
  Sparkles
} from 'lucide-react';

export default function BackendBanner() {
  const { backendState, syncState, isDemoMode } = useAuth();
  const [showSpecs, setShowSpecs] = useState(false);

  return (
    <div style={{ maxWidth: '1200px', margin: '1rem auto 0 auto', padding: '0 1.5rem' }}>
      {/* Sync Notification Toast */}
      {syncState.message && (
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          fontSize: '0.85rem',
          backgroundColor: syncState.status === 'success' 
            ? 'rgba(16, 185, 129, 0.15)' 
            : syncState.status === 'warning' 
              ? 'rgba(245, 158, 11, 0.15)' 
              : 'rgba(99, 102, 241, 0.15)',
          border: `1px solid ${
            syncState.status === 'success' 
              ? 'rgba(16, 185, 129, 0.3)' 
              : syncState.status === 'warning' 
                ? 'rgba(245, 158, 11, 0.3)' 
                : 'rgba(99, 102, 241, 0.3)'
          }`,
          color: syncState.status === 'success' 
            ? '#34d399' 
            : syncState.status === 'warning' 
              ? '#fbbf24' 
              : '#a5b4fc',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
        }}>
          {syncState.status === 'success' ? (
            <CheckCircle2 size={16} />
          ) : (
            <Info size={16} />
          )}
          <span style={{ fontWeight: 500 }}>{syncState.message}</span>
        </div>
      )}

      {/* Integration Status Bar */}
      <div className="glass-panel" style={{
        padding: '0.65rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        fontSize: '0.8rem',
        borderRadius: 'var(--radius-md)',
        borderLeft: '4px solid var(--accent-primary)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Code size={15} style={{ color: 'var(--accent-primary)' }} />
          <span style={{ color: 'var(--text-secondary)' }}>Backend Blueprint:</span>
          <span style={{ 
            color: backendState.connected ? '#34d399' : '#fbbf24', 
            fontWeight: 600 
          }}>
            {backendState.connected ? 'Server Detected at localhost:3000' : 'Server Offline'}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>•</span>
          <span style={{ color: 'var(--text-muted)' }}>
            Route <code style={{ color: '#67e8f9', background: 'rgba(6, 182, 212, 0.1)', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>GET /api/resync</code> is active
          </span>
        </div>

        <button
          onClick={() => setShowSpecs(!showSpecs)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--accent-primary)',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontFamily: 'inherit'
          }}
          id="toggle-backend-specs-button"
        >
          <span>{showSpecs ? 'Hide Backend Integration Notes' : 'View Recommended Backend Endpoints'}</span>
          {showSpecs ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Collapsible Backend Notes */}
      {showSpecs && (
        <div className="glass-panel" style={{
          marginTop: '0.5rem',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'rgba(11, 16, 27, 0.95)',
          fontSize: '0.8rem',
          lineHeight: 1.6
        }}>
          <h4 style={{ color: '#fff', fontSize: '0.85rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={14} style={{ color: 'var(--accent-primary)' }} />
            Suggested Backend Endpoints to Complete Full Integration:
          </h4>
          <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <li>
              <code style={{ color: '#a5b4fc', fontWeight: 600 }}>POST /api/auth/register</code>:
              Accepts <code>email, password, firstName, lastName</code> &rarr; calls <code>login(email, password)</code> in <code>api/api.js</code> to verify session token &rarr; if valid, inserts into <code>users</code> table and returns <code>{'{ user }'}</code>.
            </li>
            <li>
              <code style={{ color: '#a5b4fc', fontWeight: 600 }}>POST /api/auth/login</code>:
              Validates email and password, or checks local <code>users</code> record and returns <code>{'{ user }'}</code>.
            </li>
            <li>
              <code style={{ color: '#a5b4fc', fontWeight: 600 }}>GET /api/courses?userId=X</code>:
              Queries <code>courses</code> table for the given <code>user_id</code>.
            </li>
            <li>
              <code style={{ color: '#a5b4fc', fontWeight: 600 }}>GET /api/assignments?userId=X</code>:
              Queries <code>assignments</code> table for the given <code>user_id</code>.
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
