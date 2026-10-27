import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Wifi, 
  WifiOff 
} from 'lucide-react';

export default function BackendBanner() {
  const { backendState } = useAuth();

  const hostDisplay = backendState.host || 'unknown';

  return (
    <div style={{ maxWidth: '1200px', margin: '1rem auto 0 auto', padding: '0 1.5rem' }}>
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
        borderLeft: `4px solid ${backendState.connected ? 'var(--accent-emerald)' : 'var(--accent-rose)'}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {backendState.connected ? (
            <Wifi size={15} style={{ color: 'var(--accent-emerald)' }} />
          ) : (
            <WifiOff size={15} style={{ color: 'var(--accent-rose)' }} />
          )}
          <span style={{ color: 'var(--text-secondary)' }}>Backend Target:</span>
          <span style={{ 
            color: backendState.connected ? '#34d399' : '#fb7185', 
            fontWeight: 600,
            fontFamily: 'var(--font-mono)'
          }}>
            {backendState.connected ? `Connected (${hostDisplay})` : `Offline (${hostDisplay})`}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>•</span>
          <span style={{ color: 'var(--text-muted)' }}>
            Endpoints dynamically routed via Express API
          </span>
        </div>
      </div>
    </div>
  );
}
