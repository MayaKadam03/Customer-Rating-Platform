import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { validateName, validateEmail, validatePassword, validateAddress } from '../utils/validators';
import { UserPlus, ArrowLeft, ShieldCheck, Store, User, CheckCircle2 } from 'lucide-react';

export default function RegisterPage({ onNavigateLogin, showToast }) {
  const { register } = useAuth();
  const [selectedRole, setSelectedRole] = useState('NORMAL_USER'); // 'NORMAL_USER', 'STORE_OWNER', 'SYSTEM_ADMIN'

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    storeName: '',
    storeAddress: '',
    storeEmail: ''
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const nameErr = validateName(formData.name);
    if (nameErr) return setError(nameErr);

    const emailErr = validateEmail(formData.email);
    if (emailErr) return setError(emailErr);

    const addrErr = validateAddress(formData.address);
    if (addrErr) return setError(addrErr);

    const passErr = validatePassword(formData.password);
    if (passErr) return setError(passErr);

    if (selectedRole === 'STORE_OWNER' && formData.storeName.trim() && formData.storeEmail.trim()) {
      const storeEmailErr = validateEmail(formData.storeEmail);
      if (storeEmailErr) return setError(`Store Email Error: ${storeEmailErr}`);
    }

    setSubmitting(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        address: formData.address,
        role: selectedRole,
        storeName: formData.storeName,
        storeAddress: formData.storeAddress || formData.address,
        storeEmail: formData.storeEmail || `store_${Date.now()}@domain.com`
      });
      showToast('Registration successful! Welcome to the platform.', 'success');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div className="glass-panel animate-fade-in" style={{ width: '100%', maxWidth: '640px', padding: '36px 32px' }}>
        
        <button
          onClick={onNavigateLogin}
          className="btn btn-secondary btn-sm"
          style={{ marginBottom: '20px' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Login</span>
        </button>

        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>Create New Account</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Select your account type below to get started
          </p>
        </div>

        {/* STEP 1: ROLE SELECTION CARDS */}
        <div style={{ marginBottom: '24px' }}>
          <label className="form-label" style={{ marginBottom: '10px' }}>Select Account Type</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px' }}>
            
            {/* Normal User Option */}
            <div
              onClick={() => setSelectedRole('NORMAL_USER')}
              style={{
                cursor: 'pointer',
                padding: '16px 14px',
                borderRadius: '12px',
                border: selectedRole === 'NORMAL_USER' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                background: selectedRole === 'NORMAL_USER' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              {selectedRole === 'NORMAL_USER' && (
                <CheckCircle2 size={16} color="var(--primary)" style={{ position: 'absolute', top: '10px', right: '10px' }} />
              )}
              <User size={22} color="var(--accent-emerald)" style={{ marginBottom: '8px' }} />
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff' }}>Normal User</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Rate & review stores</div>
            </div>

            {/* Store Owner Option */}
            <div
              onClick={() => setSelectedRole('STORE_OWNER')}
              style={{
                cursor: 'pointer',
                padding: '16px 14px',
                borderRadius: '12px',
                border: selectedRole === 'STORE_OWNER' ? '2px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                background: selectedRole === 'STORE_OWNER' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              {selectedRole === 'STORE_OWNER' && (
                <CheckCircle2 size={16} color="var(--accent-cyan)" style={{ position: 'absolute', top: '10px', right: '10px' }} />
              )}
              <Store size={22} color="var(--accent-cyan)" style={{ marginBottom: '8px' }} />
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff' }}>Store Owner</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Manage store & ratings</div>
            </div>

            {/* System Admin Option */}
            <div
              onClick={() => setSelectedRole('SYSTEM_ADMIN')}
              style={{
                cursor: 'pointer',
                padding: '16px 14px',
                borderRadius: '12px',
                border: selectedRole === 'SYSTEM_ADMIN' ? '2px solid var(--accent-amber)' : '1px solid var(--border-color)',
                background: selectedRole === 'SYSTEM_ADMIN' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              {selectedRole === 'SYSTEM_ADMIN' && (
                <CheckCircle2 size={16} color="var(--accent-amber)" style={{ position: 'absolute', top: '10px', right: '10px' }} />
              )}
              <ShieldCheck size={22} color="var(--accent-amber)" style={{ marginBottom: '8px' }} />
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff' }}>System Admin</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Full platform management</div>
            </div>

          </div>
        </div>

        {error && (
          <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#fda4af', padding: '12px 16px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        {/* STEP 2: REGISTRATION FORM */}
        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label className="form-label">
              <span>Full Name</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dark)' }}>{formData.name.length}/60 (min 20)</span>
            </label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="e.g. Vikramaditya Suresh Deshmukh"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <span className="form-hint">Must be 20 to 60 characters in length.</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Password</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dark)' }}>{formData.password.length}/16</span>
              </label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="8-16 chars, 1 upper, 1 special"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <span className="form-hint" style={{ marginBottom: '14px', display: 'block' }}>Password rule: 8-16 characters, 1+ uppercase letter, 1+ special character (e.g. Pass123!).</span>

          <div className="form-group">
            <label className="form-label">
              <span>Personal Address</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dark)' }}>{formData.address.length}/400</span>
            </label>
            <textarea
              name="address"
              className="form-textarea"
              rows="2"
              placeholder="Enter complete address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          {/* STORE OWNER SPECIFIC FIELDS */}
          {selectedRole === 'STORE_OWNER' && (
            <div style={{ background: 'rgba(6, 182, 212, 0.08)', padding: '18px', borderRadius: '12px', border: '1px solid rgba(6, 182, 212, 0.25)', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#67e8f9', fontWeight: 700 }}>
                <Store size={18} />
                <span>Store Information Setup</span>
              </div>

              <div className="form-group">
                <label className="form-label">Store Name</label>
                <input
                  type="text"
                  name="storeName"
                  className="form-input"
                  placeholder="e.g. Deshmukh Electronics & Gadgets Hub"
                  value={formData.storeName}
                  onChange={handleChange}
                  required={selectedRole === 'STORE_OWNER'}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Store Email</label>
                  <input
                    type="email"
                    name="storeEmail"
                    className="form-input"
                    placeholder="contact@store.com"
                    value={formData.storeEmail}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Store Address</label>
                  <input
                    type="text"
                    name="storeAddress"
                    className="form-input"
                    placeholder="Same as personal address if blank"
                    value={formData.storeAddress}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px', padding: '12px' }} disabled={submitting}>
            <UserPlus size={18} />
            <span>{submitting ? 'Creating Account...' : `Register as ${selectedRole === 'SYSTEM_ADMIN' ? 'System Admin' : selectedRole === 'STORE_OWNER' ? 'Store Owner' : 'Normal User'}`}</span>
          </button>

        </form>

      </div>
    </div>
  );
}
