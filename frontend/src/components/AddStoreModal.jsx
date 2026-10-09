import React, { useState } from 'react';
import { apiFetch } from '../utils/api';
import { validateEmail, validateAddress } from '../utils/validators';
import { Store, X } from 'lucide-react';

export default function AddStoreModal({ isOpen, onClose, onSuccess, showToast, users = [] }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    ownerId: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const storeOwners = users.filter(u => u.role === 'STORE_OWNER');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      return setError('Store name is required.');
    }

    const emailErr = validateEmail(formData.email);
    if (emailErr) return setError(emailErr);

    const addrErr = validateAddress(formData.address);
    if (addrErr) return setError(addrErr);

    setSubmitting(true);
    try {
      await apiFetch('/admin/stores', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      showToast('Store created successfully!', 'success');
      setFormData({ name: '', email: '', address: '', ownerId: '' });
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
            <div style={{ background: 'rgba(6, 182, 212, 0.2)', padding: '8px', borderRadius: '8px' }}>
              <Store size={20} color="var(--accent-cyan)" />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Add New Store</h3>
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
            <label className="form-label">Store Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="e.g. Croma Electronics Store"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Store Contact Email</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="store@domain.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <span>Store Physical Address</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dark)' }}>{formData.address.length}/400</span>
            </label>
            <textarea
              name="address"
              className="form-textarea"
              rows="2"
              placeholder="Full street address, city, state, pincode"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Assign Store Owner (Optional)</label>
            <select name="ownerId" className="form-select" value={formData.ownerId} onChange={handleChange}>
              <option value="">-- Select Store Owner --</option>
              {storeOwners.map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Creating Store...' : 'Add Store'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
