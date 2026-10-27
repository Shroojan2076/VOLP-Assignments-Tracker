import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Clock, 
  CheckCircle2, 
  BookMarked,
  ArrowRight, 
  AlertCircle
} from 'lucide-react';

export default function AuthView() {
  const { login, register } = useAuth();
  const [tab, setTab] = useState('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [loading, setLoading] = useState(false);
  const [statusStep, setStatusStep] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (tab === 'register') {
      setStatusStep('Checking credentials with college portal...');
      const res = await register({ email, password, firstName, lastName });
      
      if (!res.success) {
        setLoading(false);
        setStatusStep('');
        setError(res.message || 'We couldn’t verify these credentials on the college portal. Please check your email and password.');
      }
    } else {
      setStatusStep('Signing you in...');
      const res = await login(email, password);

      if (!res.success) {
        setLoading(false);
        setStatusStep('');
        setError(res.message || 'Incorrect college email or password.');
      }
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 120px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2.5rem 1rem'
    }}>
      <div style={{
        maxWidth: '920px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '3rem',
        alignItems: 'center'
      }}>
        <div>
          <span className="stamp stamp-amber" style={{ marginBottom: '1.25rem' }}>
            Academic Field Guide
          </span>
          
          <h1 className="font-serif" style={{
            fontSize: '2.75rem',
            lineHeight: 1.15,
            fontWeight: 400,
            letterSpacing: '-0.02em',
            color: 'var(--text-main)',
            marginBottom: '1rem'
          }}>
            Your coursework, <br />
            <span style={{ fontStyle: 'italic', color: 'var(--accent-amber)' }}>organized with clarity.</span>
          </h1>

          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '0.95rem',
            lineHeight: 1.6,
            marginBottom: '2.25rem',
            maxWidth: '440px'
          }}>
            VOLP Desk bridges directly with your college classroom portal. Check due dates, submission statuses, and professor evaluation remarks in a calm, distraction-free environment.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(229, 142, 57, 0.1)',
                color: 'var(--accent-amber)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Clock size={16} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: 600 }}>
                  Intelligent Deadline Awareness
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.45, marginTop: '0.2rem' }}>
                  Clear countdowns for official due dates and faculty grace periods, so you know exactly how much time remains.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(52, 168, 83, 0.1)',
                color: '#34a853',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <CheckCircle2 size={16} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: 600 }}>
                  Grades & Instructor Remarks
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.45, marginTop: '0.2rem' }}>
                  Instant visibility into evaluated scores, submission files, and feedback without navigating through nested portal menus.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(56, 189, 248, 0.1)',
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <BookMarked size={16} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.88rem', color: 'var(--text-main)', fontWeight: 600 }}>
                  Course Binder
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.45, marginTop: '0.2rem' }}>
                  A neat overview of your enrolled modules, instructors, and subjective coursework all in one desk view.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="craft-card" style={{ padding: '2rem' }}>
          <div style={{
            display: 'flex',
            backgroundColor: 'var(--bg-inset)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.25rem',
            marginBottom: '1.75rem',
            border: '1px solid var(--border-subtle)'
          }}>
            <button
              onClick={() => { setTab('login'); setError(''); }}
              style={{
                flex: 1,
                padding: '0.55rem 0',
                borderRadius: 'calc(var(--radius-sm) - 1px)',
                background: tab === 'login' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                color: tab === 'login' ? 'var(--text-main)' : 'var(--text-muted)',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                fontFamily: 'inherit'
              }}
              id="tab-login"
            >
              Sign In
            </button>
            <button
              onClick={() => { setTab('register'); setError(''); }}
              style={{
                flex: 1,
                padding: '0.55rem 0',
                borderRadius: 'calc(var(--radius-sm) - 1px)',
                background: tab === 'register' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                color: tab === 'register' ? 'var(--text-main)' : 'var(--text-muted)',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                fontFamily: 'inherit'
              }}
              id="tab-register"
            >
              New Student Setup
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {tab === 'register' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Shroojan"
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
                    placeholder="e.g. Gaikwad"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    id="input-last-name"
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">College Email</label>
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

            <div className="form-group">
              <label className="form-label">College Portal Password</label>
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
                padding: '0.75rem 0.9rem',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'rgba(234, 67, 53, 0.12)',
                border: '1px solid rgba(234, 67, 53, 0.3)',
                color: '#fca5a5',
                fontSize: '0.8rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.55rem',
                lineHeight: 1.4
              }}>
                <AlertCircle size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-amber"
              style={{
                width: '100%',
                padding: '0.7rem',
                fontSize: '0.88rem',
                marginTop: '0.5rem'
              }}
              id="submit-auth-button"
            >
              {loading ? (
                <span>{statusStep || 'Connecting...'}</span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem' }}>
                  {tab === 'register' ? 'Connect My Account' : 'Open My Desk'}
                  <ArrowRight size={15} />
                </span>
              )}
            </button>
          </form>

          <p style={{
            fontSize: '0.72rem',
            color: 'var(--text-dim)',
            textAlign: 'center',
            marginTop: '1.25rem',
            lineHeight: 1.4
          }}>
            Credentials are authenticated directly against classroom.volp.in to fetch your assigned coursework.
          </p>
        </div>
      </div>
    </div>
  );
}
