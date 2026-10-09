import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import UpdatePasswordModal from './components/UpdatePasswordModal';
import Toast from './components/Toast';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import UserStoresPage from './pages/UserStoresPage';
import OwnerDashboard from './pages/OwnerDashboard';

function MainApp() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState('login'); // 'login' or 'register'
  const [isUpdatePassOpen, setIsUpdatePassOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        Loading platform application...
      </div>
    );
  }

  // Not logged in -> Show Login or Register
  if (!user) {
    return (
      <>
        {page === 'login' ? (
          <LoginPage onNavigateRegister={() => setPage('register')} showToast={showToast} />
        ) : (
          <RegisterPage onNavigateLogin={() => setPage('login')} showToast={showToast} />
        )}
        <Toast toast={toast} onClose={() => setToast(null)} />
      </>
    );
  }

  // Logged in -> Render Navbar + Role-based Dashboard
  return (
    <div>
      <Navbar onOpenUpdatePassword={() => setIsUpdatePassOpen(true)} />

      <main>
        {user.role === 'SYSTEM_ADMIN' && <AdminDashboard showToast={showToast} />}
        {user.role === 'NORMAL_USER' && <UserStoresPage showToast={showToast} />}
        {user.role === 'STORE_OWNER' && <OwnerDashboard showToast={showToast} />}
      </main>

      <UpdatePasswordModal
        isOpen={isUpdatePassOpen}
        onClose={() => setIsUpdatePassOpen(false)}
        showToast={showToast}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
