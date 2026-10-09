import React from 'react';
import StarRating from './StarRating';
import { User, Mail, MapPin, Shield, Store, X, Star } from 'lucide-react';

export default function UserDetailsModal({ userDetails, onClose }) {
  if (!userDetails) return null;

  const { name, email, address, role, createdAt, storeRatingInfo } = userDetails;

  const getRoleBadge = (r) => {
    switch (r) {
      case 'SYSTEM_ADMIN':
        return <span className="badge badge-admin">System Admin</span>;
      case 'STORE_OWNER':
        return <span className="badge badge-owner">Store Owner</span>;
      default:
        return <span className="badge badge-user">Normal User</span>;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ padding: '24px', maxWidth: '560px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '8px', borderRadius: '8px' }}>
              <User size={22} color="var(--primary)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>User Profile Details</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Detailed system inspection</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>{name}</h4>
                <div style={{ marginTop: '4px' }}>{getRoleBadge(role)}</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px', fontSize: '0.875rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                <Mail size={16} color="var(--accent-cyan)" />
                <span>{email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: 'var(--text-muted)' }}>
                <MapPin size={16} color="var(--accent-amber)" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>{address}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                <Shield size={16} color="var(--primary)" />
                <span>Account Created: {new Date(createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* If the user is a Store Owner, display Store Details & Rating as per spec */}
          {role === 'STORE_OWNER' && (
            <div style={{ background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(99, 102, 241, 0.1) 100%)', padding: '18px', borderRadius: '12px', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <Store size={20} color="var(--accent-cyan)" />
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#67e8f9' }}>Store Owner Performance Details</h4>
              </div>

              {storeRatingInfo ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
                  <div><strong>Store Name:</strong> {storeRatingInfo.storeName}</div>
                  <div><strong>Store Email:</strong> {storeRatingInfo.storeEmail || 'N/A'}</div>
                  <div><strong>Store Address:</strong> {storeRatingInfo.storeAddress || 'N/A'}</div>
                  
                  <div style={{ marginTop: '8px', padding: '12px', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Star size={18} color="var(--accent-amber)" fill="var(--accent-amber)" />
                      <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{storeRatingInfo.averageRating} / 5.0</span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Based on {storeRatingInfo.totalRatingsCount} submitted ratings</span>
                  </div>
                </div>
              ) : (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No store currently assigned to this Store Owner account.</p>
              )}
            </div>
          )}

        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
          <button className="btn btn-secondary" onClick={onClose}>Close Details</button>
        </div>
      </div>
    </div>
  );
}
