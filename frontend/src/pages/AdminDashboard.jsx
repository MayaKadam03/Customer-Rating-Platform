import React, { useState, useEffect } from 'react';
import { apiFetch } from '../utils/api';
import AddUserModal from '../components/AddUserModal';
import AddStoreModal from '../components/AddStoreModal';
import UserDetailsModal from '../components/UserDetailsModal';
import StarRating from '../components/StarRating';
import { Users, Store, Star, UserPlus, PlusCircle, Search, ArrowUpDown, Filter, Eye } from 'lucide-react';

export default function AdminDashboard({ showToast }) {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'stores'

  // User Filter & Sorting States
  const [userFilters, setUserFilters] = useState({ name: '', email: '', address: '', role: 'ALL' });
  const [userSort, setUserSort] = useState({ sortBy: 'name', sortOrder: 'asc' });

  // Store Filter & Sorting States
  const [storeFilters, setStoreFilters] = useState({ search: '' });
  const [storeSort, setStoreSort] = useState({ sortBy: 'name', sortOrder: 'asc' });

  // Modal States
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isAddStoreOpen, setIsAddStoreOpen] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);

  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const data = await apiFetch('/admin/dashboard-stats');
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const query = new URLSearchParams({
        name: userFilters.name,
        email: userFilters.email,
        address: userFilters.address,
        role: userFilters.role,
        sortBy: userSort.sortBy,
        sortOrder: userSort.sortOrder
      });
      const data = await apiFetch(`/admin/users?${query.toString()}`);
      setUsers(data.users || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const fetchStores = async () => {
    try {
      const query = new URLSearchParams({
        search: storeFilters.search,
        sortBy: storeSort.sortBy,
        sortOrder: storeSort.sortOrder
      });
      const data = await apiFetch(`/admin/stores?${query.toString()}`);
      setStores(data.stores || []);
    } catch (err) {
      console.error('Failed to fetch stores:', err);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchUsers(), fetchStores()]);
      setLoading(false);
    };
    loadAll();
  }, [userFilters, userSort, storeFilters, storeSort]);

  const handleUserSort = (field) => {
    const isSameField = userSort.sortBy === field;
    const newOrder = isSameField && userSort.sortOrder === 'asc' ? 'desc' : 'asc';
    setUserSort({ sortBy: field, sortOrder: newOrder });
  };

  const handleStoreSort = (field) => {
    const isSameField = storeSort.sortBy === field;
    const newOrder = isSameField && storeSort.sortOrder === 'asc' ? 'desc' : 'asc';
    setStoreSort({ sortBy: field, sortOrder: newOrder });
  };

  const openUserDetails = async (userId) => {
    try {
      const data = await apiFetch(`/admin/users/${userId}`);
      setSelectedUserDetails(data.user);
    } catch (err) {
      showToast('Failed to load user details.', 'error');
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'SYSTEM_ADMIN':
        return <span className="badge badge-admin">Admin</span>;
      case 'STORE_OWNER':
        return <span className="badge badge-owner">Store Owner</span>;
      default:
        return <span className="badge badge-user">Normal User</span>;
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 48px 24px' }}>
      
      {/* Page Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>System Administrator Dashboard</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Manage platform stores, users, ratings and system metrics</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={() => setIsAddStoreOpen(true)}>
            <PlusCircle size={18} />
            <span>Add New Store</span>
          </button>
          <button className="btn btn-primary" onClick={() => setIsAddUserOpen(true)}>
            <UserPlus size={18} />
            <span>Add New User</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(99, 102, 241, 0.4)' }}>
            <Users size={32} color="var(--primary)" />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL USERS</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>{stats.totalUsers}</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: 'rgba(6, 182, 212, 0.2)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(6, 182, 212, 0.4)' }}>
            <Store size={32} color="var(--accent-cyan)" />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL STORES</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>{stats.totalStores}</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
            <Star size={32} color="var(--accent-amber)" />
          </div>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>SUBMITTED RATINGS</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>{stats.totalRatings}</div>
          </div>
        </div>

      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        <button
          className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('users')}
        >
          <Users size={18} />
          <span>User Listings ({users.length})</span>
        </button>
        <button
          className={`btn ${activeTab === 'stores' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('stores')}
        >
          <Store size={18} />
          <span>Store Listings ({stores.length})</span>
        </button>
      </div>

      {/* Users Tab Content */}
      {activeTab === 'users' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          
          {/* User Filters Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '20px' }}>
            <div>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Filter by Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Search name..."
                value={userFilters.name}
                onChange={(e) => setUserFilters({ ...userFilters, name: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Filter by Email</label>
              <input
                type="text"
                className="form-input"
                placeholder="Search email..."
                value={userFilters.email}
                onChange={(e) => setUserFilters({ ...userFilters, email: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Filter by Address</label>
              <input
                type="text"
                className="form-input"
                placeholder="Search address..."
                value={userFilters.address}
                onChange={(e) => setUserFilters({ ...userFilters, address: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Filter by Role</label>
              <select
                className="form-select"
                value={userFilters.role}
                onChange={(e) => setUserFilters({ ...userFilters, role: e.target.value })}
              >
                <option value="ALL">All Roles</option>
                <option value="NORMAL_USER">Normal User</option>
                <option value="STORE_OWNER">Store Owner</option>
                <option value="SYSTEM_ADMIN">System Admin</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th className="sortable" onClick={() => handleUserSort('name')}>
                    Name {userSort.sortBy === 'name' && (userSort.sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="sortable" onClick={() => handleUserSort('email')}>
                    Email {userSort.sortBy === 'email' && (userSort.sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="sortable" onClick={() => handleUserSort('address')}>
                    Address {userSort.sortBy === 'address' && (userSort.sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="sortable" onClick={() => handleUserSort('role')}>
                    Role {userSort.sortBy === 'role' && (userSort.sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Store Rating (If Store Owner)</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                      No users match the selected filters.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id}>
                      <td style={{ fontWeight: 600 }}>{u.name}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                      <td style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {u.address}
                      </td>
                      <td>{getRoleBadge(u.role)}</td>
                      <td>
                        {u.role === 'STORE_OWNER' && u.storeRatingInfo ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Star size={14} color="var(--accent-amber)" fill="var(--accent-amber)" />
                            <span style={{ fontWeight: 700 }}>{u.storeRatingInfo.averageRating} ★</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-dark)' }}>({u.storeRatingInfo.storeName})</span>
                          </div>
                        ) : u.role === 'STORE_OWNER' ? (
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-dark)' }}>No store assigned</span>
                        ) : (
                          <span style={{ color: 'var(--text-dark)' }}>—</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => openUserDetails(u.id)}>
                          <Eye size={14} />
                          <span>View Details</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* Stores Tab Content */}
      {activeTab === 'stores' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          
          {/* Store Filter Bar */}
          <div style={{ marginBottom: '20px', maxWidth: '400px' }}>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Search Stores by Name or Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search store name or address..."
                value={storeFilters.search}
                onChange={(e) => setStoreFilters({ ...storeFilters, search: e.target.value })}
              />
            </div>
          </div>

          {/* Stores Table */}
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th className="sortable" onClick={() => handleStoreSort('name')}>
                    Store Name {storeSort.sortBy === 'name' && (storeSort.sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="sortable" onClick={() => handleStoreSort('email')}>
                    Email {storeSort.sortBy === 'email' && (storeSort.sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="sortable" onClick={() => handleStoreSort('address')}>
                    Address {storeSort.sortBy === 'address' && (storeSort.sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="sortable" onClick={() => handleStoreSort('rating')}>
                    Overall Rating {storeSort.sortBy === 'rating' && (storeSort.sortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th>Store Owner</th>
                </tr>
              </thead>
              <tbody>
                {stores.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                      No stores found.
                    </td>
                  </tr>
                ) : (
                  stores.map((s) => (
                    <tr key={s.id}>
                      <td style={{ fontWeight: 600 }}>{s.name}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{s.email}</td>
                      <td>{s.address}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <StarRating rating={Math.round(s.overallRating)} readonly size={16} />
                          <span style={{ fontWeight: 700 }}>{s.overallRating}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-dark)' }}>({s.totalRatingsCount} ratings)</span>
                        </div>
                      </td>
                      <td>
                        {s.owner ? (
                          <span style={{ fontWeight: 500, color: '#67e8f9' }}>{s.owner.name}</span>
                        ) : (
                          <span style={{ color: 'var(--text-dark)', italic: true }}>Unassigned</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* Modals */}
      <AddUserModal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onSuccess={() => { fetchUsers(); fetchStats(); }}
        showToast={showToast}
        stores={stores}
      />

      <AddStoreModal
        isOpen={isAddStoreOpen}
        onClose={() => setIsAddStoreOpen(false)}
        onSuccess={() => { fetchStores(); fetchStats(); }}
        showToast={showToast}
        users={users}
      />

      <UserDetailsModal
        userDetails={selectedUserDetails}
        onClose={() => setSelectedUserDetails(null)}
      />

    </div>
  );
}
