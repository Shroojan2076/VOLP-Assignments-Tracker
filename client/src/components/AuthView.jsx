import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  GraduationCap, 
  ShieldCheck, 
  KeyRound, 
  Mail, 
  User, 
  ArrowRight, 
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Lock,
  Layers,
  Clock
} from 'lucide-react';

export default function AuthView() {
  const { login, register, loginDemo, backendState } = useAuth();
  const [tab, setTab] = useState('register'); // Default to register as emphasized by user

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [loading, setLoading] = useState(false);
  const [statusStep, setStatusStep] = useState('');
  const [error, setError] = useState('');
  const [endpointMissingNotice, setEndpointMissingNotice] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEndpointMissingNotice(false);
    setLoading(true);

    if (tab === 'register') {
      setStatusStep('Verifying credentials against official VOLP servers...');
      const res = await register({ email, password, firstName, lastName });
      
      if (!res.success) {
        setLoading(false);
        setStatusStep('');
        if (res.isEndpointMissing) {
          setEndpointMissingNotice(true);
        } else {
          setError(res.message);
        }
      }
    } else {
      setStatusStep('Authenticating session...');
      const res = await login(email, password);

      if (!res.success) {
        setLoading(false);
        setStatusStep('');
        if (res.isEndpointMissing) {
          setEndpointMissingNotice(true);
        } else {
          setError(res.message);
        }
      }
    }
  };

  const handleQuickDemo = (role = 'VIT Student') => {
    loginDemo({
      id: 1,
      email: email || 'shroojan.1251090062@vit.edu',
      firstName: firstName || 'Shroojan',
      lastName: lastName || 'Gaikwad',
      isActive: true,
      createdAt: new Date().toISOString()
    });
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 75px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem'
    }}>
      <div style={{
        maxWidth: '960px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
        alignItems: 'center'
      }}>
        {/* Left Column: Platform info & VOLP Verification badge */}
        <div>
          <div className="badge badge-indigo" style={{ marginBottom: '1rem', padding: '0.35rem 0.75rem' }}>
            <ShieldCheck size={14} /> Official VOLP Credential Gateway
          </div>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, #ffffff 30%, #94a3b8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Unified Academic Sync for VOLP Classrooms
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            Connect your college credentials to automate assignment tracking, grade evaluation monitoring, and course deadlines in one clean dashboard.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.85rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'rgba(99, 102, 241, 0.15)',
                color: 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Lock size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>Active Credential Verification</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Registration queries the live VOLP server. Only credentials that yield a valid session token (<code style={{ color: '#a5b4fc' }}>token, uid, ut</code>) are enrolled into the database.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.85rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'rgba(6, 182, 212, 0.15)',
                color: 'var(--accent-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Layers size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>Automated Course & Assignment Sync</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Subjective assignments, grace periods, submission statuses, and professor remarks are mapped directly into your PostgreSQL portfolio.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.85rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: 'var(--accent-emerald)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Clock size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>24-Hour Deadline Tracking</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Intelligent deadline awareness tailored for VOLP's timestamp formats with grace period countdowns.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Auth Card */}
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
          {/* Tabs */}
          <div style={{
            display: 'flex',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            borderRadius: 'var(--radius-md)',
            padding: '0.25rem',
            marginBottom: '1.5rem',
            border: '1px solid var(--border-subtle)'
          }}>
            <button
              onClick={() => { setTab('register'); setError(''); setEndpointMissingNotice(false); }}
              style={{
                flex: 1,
                padding: '0.6rem 0',
                borderRadius: 'calc(var(--radius-md) - 2px)',
                background: tab === 'register' ? 'var(--accent-primary)' : 'transparent',
                color: tab === 'register' ? '#fff' : 'var(--text-secondary)',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'inherit'
              }}
              id="tab-register"
            >
              Register & Verify
            </button>
            <button
              onClick={() => { setTab('login'); setError(''); setEndpointMissingNotice(false); }}
              style={{
                flex: 1,
                padding: '0.6rem 0',
                borderRadius: 'calc(var(--radius-md) - 2px)',
                background: tab === 'login' ? 'var(--accent-primary)' : 'transparent',
                color: tab === 'login' ? '#fff' : 'var(--text-secondary)',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'inherit'
              }}
              id="tab-login"
            >
              Sign In
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {tab === 'register' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Shroojan"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    id="input-first-name"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Student"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    id="input-last-name"
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">College Email (VOLP)</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  className="form-input"
                  placeholder="student.id@vit.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  id="input-email"
                />
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Your institutional login for classroom.volp.in
              </span>
            </div>

            <div className="form-group">
              <label className="form-label">VOLP Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                id="input-password"
              />
            </div>

            {error && (
              <div style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(244, 63, 94, 0.15)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: '#fb7185',
                fontSize: '0.8rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <AlertCircle size={15} />
                <span>{error}</span>
              </div>
            )}

            {/* Notice if backend auth route is pending */}
            {endpointMissingNotice && (
              <div style={{
                padding: '0.85rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                color: '#fbbf24',
                fontSize: '0.8rem',
                marginBottom: '1rem',
                lineHeight: 1.5
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  <AlertCircle size={15} /> Backend Route Pending
                </div>
                The backend route <code>POST /api/auth/{tab}</code> is not yet mounted on the Express server.
                <div style={{ marginTop: '0.6rem' }}>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo()}
                    className="btn-primary"
                    style={{ width: '100%', fontSize: '0.8rem', padding: '0.5rem' }}
                    id="btn-preview-demo"
                  >
                    <Sparkles size={14} /> Preview Dashboard with Demo Data Now
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem', marginTop: '0.5rem' }}
              id="submit-auth-button"
            >
              {loading ? (
                <span>{statusStep || 'Processing...'}</span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {tab === 'register' ? 'Verify with VOLP & Register' : 'Sign In to Tracker'}
                  <ArrowRight size={16} />
                </span>
              )}
            </button>
          </form>

          {/* Quick Demo Option */}
          <div style={{
            marginTop: '1.5rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--border-subtle)',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
              Testing the prototype frontend?
            </p>
            <button
              type="button"
              onClick={() => handleQuickDemo()}
              className="btn-secondary"
              style={{
                width: '100%',
                fontSize: '0.82rem',
                padding: '0.5rem'
              }}
              id="quick-demo-button"
            >
              <Sparkles size={14} style={{ color: 'var(--accent-amber)' }} />
              <span>Launch Demo Dashboard Preview</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
