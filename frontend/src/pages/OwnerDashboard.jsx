import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import StarRating from '../components/StarRating';
import { Store, Star, Users, MapPin, Mail, ArrowUpDown, Calendar, AlertTriangle } from 'lucide-react';

export default function OwnerDashboard({ showToast }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('submittedAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const fetchOwnerDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const query = new URLSearchParams({
        sortBy,
        sortOrder
      });
      const data = await apiFetch(`/owner/dashboard?${query.toString()}`);
      setDashboardData(data);
    } catch (err) {
      setError(err.message || 'Failed to load Store Owner Dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerDashboard();
  }, [sortBy, sortOrder]);

  const handleSort = (field) => {
    const isSameField = sortBy === field;
    const newOrder = isSameField && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(field);
    setSortOrder(newOrder);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-muted)' }}>
        Loading your Store Owner Dashboard...
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 24px' }}>
        <div className="glass-panel" style={{ padding: '32px', textAlign: 'center' }}>
          <AlertTriangle size={48} color="var(--accent-rose)" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>Store Owner Access Notice</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '24px' }}>{error}</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dark)' }}>Please request System Administrator to assign your user account to a Store.</p>
        </div>
      </div>
    );
  }

  const { store, userRatings } = dashboardData;

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 48px 24px' }}>
      
      {/* Store Header Banner */}
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '32px', background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.9) 0%, rgba(6, 182, 212, 0.1) 100%)', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{ background: 'rgba(6, 182, 212, 0.2)', padding: '10px', borderRadius: '12px' }}>
                <Store size={24} color="var(--accent-cyan)" />
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>{store.name}</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9rem', color: 'var(--text-muted)', marginLeft: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} color="var(--accent-cyan)" />
                <span>{store.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={16} color="var(--accent-amber)" />
                <span>{store.address}</span>
              </div>
            </div>
          </div>

          {/* Average Rating Large KPI Box */}
          <div style={{ background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '20px 28px', borderRadius: '16px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.5px' }}>STORE AVERAGE RATING</span>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', margin: '6px 0' }}>
              <Star size={28} color="var(--accent-amber)" fill="var(--accent-amber)" />
              <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffffff' }}>{store.averageRating}</span>
              <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>/ 5</span>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dark)' }}>{store.totalRatingsCount} User {store.totalRatingsCount === 1 ? 'Rating' : 'Ratings'} Submitted</span>
          </div>

        </div>
      </div>

      {/* Customer Ratings Section */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Users Who Submitted Ratings</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>List of registered customers and their individual store feedback</p>
          </div>
        </div>

        {/* User Ratings Table */}
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th className="sortable" onClick={() => handleSort('userName')}>
                  User Name {sortBy === 'userName' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="sortable" onClick={() => handleSort('userEmail')}>
                  User Email {sortBy === 'userEmail' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="sortable" onClick={() => handleSort('userAddress')}>
                  User Address
                </th>
                <th className="sortable" onClick={() => handleSort('ratingValue')}>
                  Submitted Rating {sortBy === 'ratingValue' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="sortable" onClick={() => handleSort('submittedAt')}>
                  Submission Date {sortBy === 'submittedAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody>
              {userRatings.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                    No users have submitted ratings for your store yet.
                  </td>
                </tr>
              ) : (
                userRatings.map((r) => (
                  <tr key={r.ratingId}>
                    <td style={{ fontWeight: 600 }}>{r.userName}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{r.userEmail}</td>
                    <td style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {r.userAddress}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <StarRating rating={r.ratingValue} readonly size={16} />
                        <span style={{ fontWeight: 700, color: 'var(--accent-amber)' }}>{r.ratingValue} ★</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {new Date(r.submittedAt).toLocaleDateString()} {new Date(r.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
