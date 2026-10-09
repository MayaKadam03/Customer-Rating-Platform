import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Store, LogIn, Sparkles, UserCheck } from 'lucide-react';

export default function LoginPage({ onNavigateRegister, showToast }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      showToast('Login successful!', 'success');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoCredentials = async (demoEmail) => {
    setEmail(demoEmail);
    setPassword('AdminPass123!');
    setError('');
    try {
      setSubmitting(true);
      await login(demoEmail, 'AdminPass123!');
      showToast('Logged in successfully!', 'success');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '460px', padding: '36px 32px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'inline-flex', background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-cyan) 100%)', padding: '14px', borderRadius: '16px', marginBottom: '14px' }}>
            <Store size={32} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>
            Store Rating Portal
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Sign in to access your role dashboard
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#fda4af', padding: '12px 16px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px', padding: '12px' }} disabled={submitting}>
            <LogIn size={18} />
            <span>{submitting ? 'Signing in...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Demo Logins */}
        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-amber)', marginBottom: '12px' }}>
            <UserCheck size={16} />
            <span>Quick Test Accounts (1-Click Login):</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'space-between', width: '100%', textTransform: 'none' }}
              onClick={() => fillDemoCredentials('admin@roxiler.com')}
            >
              <span>System Admin (Mayank Sharma)</span>
              <span className="badge badge-admin">Admin</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'space-between', width: '100%', textTransform: 'none' }}
              onClick={() => fillDemoCredentials('rajesh.verma@store.com')}
            >
              <span>Store Owner (Rajesh Verma)</span>
              <span className="badge badge-owner">Owner</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ justifyContent: 'space-between', width: '100%', textTransform: 'none' }}
              onClick={() => fillDemoCredentials('aarav.singhania@gmail.com')}
            >
              <span>Normal User (Aarav Singhania)</span>
              <span className="badge badge-user">User</span>
            </button>
          </div>
        </div>

        {/* Register navigation */}
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          New user?{' '}
          <button
            onClick={onNavigateRegister}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
          >
            Create an account
          </button>
        </div>

      </div>
    </div>
  );
}
