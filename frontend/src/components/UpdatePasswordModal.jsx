import React, { useState } from 'react';
import { apiFetch } from '../utils/api';
import { validatePassword } from '../utils/validators';
import { KeyRound, X, Lock } from 'lucide-react';

export default function UpdatePasswordModal({ isOpen, onClose, showToast }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!currentPassword) {
      setError('Please enter your current password.');
      return;
    }

    const passErr = validatePassword(newPassword);
    if (passErr) {
      setError(passErr);
      return;
    }

    setSubmitting(true);
    try {
      await apiFetch('/auth/update-password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword })
      });
      showToast('Password updated successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '8px', borderRadius: '8px' }}>
              <KeyRound size={20} color="var(--primary)" />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Update Password</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#fda4af', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                className="form-input"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>New Password</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dark)' }}>{newPassword.length}/16</span>
            </label>
            <input
              type="password"
              className="form-input"
              placeholder="8-16 chars, 1 uppercase, 1 special char"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <span className="form-hint">Must be 8-16 characters long, contain at least 1 uppercase letter and 1 special character.</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Updating...' : 'Save New Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
