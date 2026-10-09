import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import StarRating from '../components/StarRating';
import { Store, Search, MapPin, Star, ArrowUpDown, Edit3, CheckCircle2 } from 'lucide-react';

export default function UserStoresPage({ showToast }) {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [submittingRatingStoreId, setSubmittingRatingStoreId] = useState(null);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        search,
        sortBy,
        sortOrder
      });
      const data = await apiFetch(`/stores?${query.toString()}`);
      setStores(data.stores || []);
    } catch (err) {
      showToast('Failed to fetch store listings.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [search, sortBy, sortOrder]);

  const handleRatingSubmit = async (storeId, newRatingValue) => {
    setSubmittingRatingStoreId(storeId);
    try {
      const response = await apiFetch(`/stores/${storeId}/rating`, {
        method: 'POST',
        body: JSON.stringify({ rating: newRatingValue })
      });

      showToast(`Rating of ${newRatingValue} ★ submitted successfully!`, 'success');

      // Update local state smoothly
      setStores(prev => prev.map(s => {
        if (s.id === storeId) {
          return {
            ...s,
            userSubmittedRating: response.rating,
            overallRating: response.overallRating,
            totalRatingsCount: response.totalRatingsCount
          };
        }
        return s;
      }));
    } catch (err) {
      showToast(err.message || 'Failed to submit rating.', 'error');
    } finally {
      setSubmittingRatingStoreId(null);
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 48px 24px' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Registered Stores Directory</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Explore registered stores, view overall ratings, and submit or modify your ratings</p>
        </div>
      </div>

      {/* Controls Bar: Search & Sort */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '28px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Search Input */}
        <div style={{ flex: '1', minWidth: '280px', position: 'relative' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '42px' }}
            placeholder="Search stores by Name or Address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Sort Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Sort By:</span>
          <select
            className="form-select"
            style={{ width: 'auto' }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Store Name</option>
            <option value="overallRating">Overall Rating</option>
            <option value="address">Address</option>
          </select>

          <button
            className="btn btn-secondary"
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            title="Toggle sort direction"
          >
            <ArrowUpDown size={16} />
            <span>{sortOrder.toUpperCase()}</span>
          </button>
        </div>

      </div>

      {/* Store Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          Loading stores catalog...
        </div>
      ) : stores.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px' }}>
          <Store size={48} color="var(--text-dark)" style={{ marginBottom: '12px' }} />
          <h3 style={{ fontSize: '1.1rem', color: '#ffffff' }}>No Stores Found</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Try adjusting your search criteria</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
          {stores.map((store) => {
            const hasRated = store.userSubmittedRating !== null;

            return (
              <div key={store.id} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'transform 0.2s ease', position: 'relative' }}>
                
                <div>
                  {/* Store Name & Overall Rating Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.3 }}>
                      {store.name}
                    </h3>
                    <div style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '4px 10px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                      <Star size={14} color="var(--accent-amber)" fill="var(--accent-amber)" />
                      <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--accent-amber)' }}>{store.overallRating}</span>
                    </div>
                  </div>

                  {/* Address */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '18px' }}>
                    <MapPin size={16} color="var(--accent-cyan)" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span>{store.address}</span>
                  </div>

                  {/* Rating Counts info */}
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-dark)', marginBottom: '16px' }}>
                    Overall Average Rating based on {store.totalRatingsCount} {store.totalRatingsCount === 1 ? 'review' : 'reviews'}.
                  </div>
                </div>

                {/* Rating Interactive Section */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: hasRated ? 'var(--accent-emerald)' : 'var(--text-muted)' }}>
                      {hasRated ? 'Your Submitted Rating:' : 'Rate this Store:'}
                    </span>
                    {hasRated && (
                      <span className="badge" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                        <CheckCircle2 size={12} /> {store.userSubmittedRating} / 5 Stars
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0, 0, 0, 0.25)', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <StarRating
                      rating={store.userSubmittedRating || 0}
                      onRate={(newVal) => handleRatingSubmit(store.id, newVal)}
                      size={24}
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dark)' }}>
                      {submittingRatingStoreId === store.id ? 'Submitting...' : hasRated ? 'Click star to modify' : 'Click to rate'}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
