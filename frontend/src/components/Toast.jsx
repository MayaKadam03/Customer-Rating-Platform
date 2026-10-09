import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 20px',
        borderRadius: '12px',
        background: isSuccess ? 'rgba(16, 185, 129, 0.95)' : 'rgba(244, 63, 94, 0.95)',
        color: '#ffffff',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(10px)',
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      {isSuccess ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
      <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{toast.message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: '#ffffff',
          cursor: 'pointer',
          padding: '2px',
          marginLeft: '8px'
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
