import React, { useState } from 'react';
import { apiFetch } from '../utils/api';
import { validateName, validateEmail, validatePassword, validateAddress } from '../utils/validators';
import { UserPlus, X } from 'lucide-react';

export default function AddUserModal({ isOpen, onClose, onSuccess, showToast, stores = [] }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'NORMAL_USER',
    storeId: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

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

    const passErr = validatePassword(formData.password);
    if (passErr) return setError(passErr);

    const addrErr = validateAddress(formData.address);
    if (addrErr) return setError(addrErr);

    setSubmitting(true);
    try {
      await apiFetch('/admin/users', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      showToast('User created successfully!', 'success');
      setFormData({
        name: '',
        email: '',
        password: '',
        address: '',
        role: 'NORMAL_USER',
        storeId: ''
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ padding: '24px', maxWidth: '580px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '8px', borderRadius: '8px' }}>
              <UserPlus size={20} color="var(--primary)" />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Add New User</h3>
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
            <label className="form-label">
              <span>Full Name</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dark)' }}>{formData.name.length}/60 (min 20)</span>
            </label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="e.g. System Administrator Mayank Sharma"
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
                placeholder="user@domain.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">User Role</label>
              <select name="role" className="form-select" value={formData.role} onChange={handleChange}>
                <option value="NORMAL_USER">Normal User</option>
                <option value="STORE_OWNER">Store Owner</option>
                <option value="SYSTEM_ADMIN">System Administrator</option>
              </select>
            </div>
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
              placeholder="8-16 chars, 1 uppercase, 1 special char"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span className="form-hint">8-16 characters, 1+ uppercase, 1+ special character (e.g. Pass123!).</span>
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>Address</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dark)' }}>{formData.address.length}/400</span>
            </label>
            <textarea
              name="address"
              className="form-textarea"
              rows="2"
              placeholder="Enter complete physical address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          {formData.role === 'STORE_OWNER' && (
            <div className="form-group">
              <label className="form-label">Assign Store (Optional)</label>
              <select name="storeId" className="form-select" value={formData.storeId} onChange={handleChange}>
                <option value="">-- Select Store --</option>
                {stores.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.address})</option>
                ))}
              </select>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Creating User...' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
