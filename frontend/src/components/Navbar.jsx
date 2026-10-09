import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Store, LogOut, KeyRound, User } from 'lucide-react';

export default function Navbar({ onOpenUpdatePassword }) {
  const { user, logout } = useAuth();

  if (!user) return null;

  const getRoleBadge = (role) => {
    switch (role) {
      case 'SYSTEM_ADMIN':
        return <span className="badge badge-admin">System Admin</span>;
      case 'STORE_OWNER':
        return <span className="badge badge-owner">Store Owner</span>;
      default:
        return <span className="badge badge-user">Normal User</span>;
    }
  };

  return (
    <header className="glass-panel" style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', marginBottom: '24px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-cyan) 100%)', padding: '10px', borderRadius: '12px', display: 'flex' }}>
            <Store size={22} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
              Store Rating Application
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Roxiler Systems Challenge Solution</p>
          </div>
        </div>

        {/* User Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255, 255, 255, 0.04)', padding: '6px 14px', borderRadius: '30px', border: '1px solid var(--border-color)' }}>
            <User size={16} color="var(--primary)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.name}</span>
            {getRoleBadge(user.role)}
          </div>

          <button className="btn btn-secondary btn-sm" onClick={onOpenUpdatePassword} title="Update Password">
            <KeyRound size={16} />
            <span>Update Password</span>
          </button>

          <button className="btn btn-danger btn-sm" onClick={logout} title="Log Out">
            <LogOut size={16} />
            <span>Log Out</span>
          </button>
        </div>

      </div>
    </header>
  );
}
