import React, { useState, useEffect, Suspense } from 'react';
import { logout } from './services/api';

// AnimateJS is optional - lazy load it
let animate = () => {}; // fallback no-op
try {
  // Try to import dynamically to avoid breaking if unavailable
  import('animejs').then(module => {
    animate = module.animate;
  }).catch(() => {
    console.warn('AnimateJS not available, animations disabled');
  });
} catch (e) {
  console.warn('AnimateJS import failed:', e.message);
}
import LoginForm from './components/LoginForm';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import { loadUserFromStorage, saveUserToStorage } from './utils/storage';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

// Lazy load heavy components for better performance
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const TransactionForm = React.lazy(() => import('./components/TransactionForm'));
const PriceList = React.lazy(() => import('./components/PriceList'));
const ApprovalInbox = React.lazy(() => import('./components/ApprovalInbox'));
const Settings = React.lazy(() => import('./components/Settings'));
const ReportView = React.lazy(() => import('./components/ReportView'));
const UserManagement = React.lazy(() => import('./components/UserManagement'));

export default function App() {
  const [user, setUser] = useState(null);
  const [route, setRoute] = useState('dashboard'); // 'dashboard' | 'input' | 'report' | 'login' | 'settings' | 'users'
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const saved = loadUserFromStorage();
    if (saved) {
      setUser(saved);
    } else {
      setRoute('login');
    }
  }, []);

  useEffect(() => {
    // Animate not-auth cards when they appear
    if (document.querySelector('.not-auth')) {
      animate('.not-auth', {
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 600,
        easing: 'easeOutQuad'
      });
    }
  }, [route, user]);

  const handleRouteChange = (newRoute) => {
    setRoute(newRoute);
    setRefreshKey(prev => prev + 1);
  };

  const handleLogin = (userObj) => {
    setUser(userObj);
    saveUserToStorage(userObj);
    setRoute('dashboard');
    setRefreshKey(prev => prev + 1);
  };

  const handleLogout = async () => {
    if (user && user.token) {
      try {
        await logout(user.token);
      } catch (error) {
        console.error('Logout failed on server', error);
      }
    }
    setUser(null);
    setRoute('login');
    localStorage.removeItem('activeUser');
  };

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
    saveUserToStorage(updatedUser);
  };

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <div className="app">
          <Navbar user={user} route={route} onRouteChange={handleRouteChange} onLogout={handleLogout} />
          <main className="main">
            {!user && route === 'login' && <LoginForm onLogin={handleLogin} />}
            
            <Suspense fallback={<LoadingSpinner message="Loading dashboard..." />}>
              {user && route === 'dashboard' && <Dashboard user={user} token={user.token} key={`dashboard-${refreshKey}`} />}
            </Suspense>

            <Suspense fallback={<LoadingSpinner message="Loading transaction form..." />}>
              {user && route === 'input' && <TransactionForm token={user.token} />}
            </Suspense>

            <Suspense fallback={<LoadingSpinner message="Loading settings..." />}>
              {user && route === 'settings' && <Settings user={user} onUserUpdate={handleUserUpdate} />}
            </Suspense>

            <Suspense fallback={<LoadingSpinner message="Loading price list..." />}>
              {user && route === 'pricelist' && <PriceList token={user.token} />}
            </Suspense>
            
            <Suspense fallback={<LoadingSpinner message="Loading reports..." />}>
              {user && user.role === 'owner' && route === 'report' && <ReportView token={user.token} key={`report-${refreshKey}`} />}
            </Suspense>

            <Suspense fallback={<LoadingSpinner message="Loading approvals..." />}>
              {user && user.role === 'owner' && route === 'approvals' && <ApprovalInbox token={user.token} />}
            </Suspense>

            <Suspense fallback={<LoadingSpinner message="Loading user management..." />}>
              {user && user.role === 'owner' && route === 'users' && <UserManagement token={user.token} />}
            </Suspense>
            
            {user && user.role !== 'owner' && (route === 'report' || route === 'approvals' || route === 'users') && (
              <div className="not-auth card" style={{ opacity: 0 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                <h4>Akses Ditolak</h4>
                <p>Halaman ini hanya dapat diakses oleh Owner.</p>
              </div>
            )}
            
            {!user && route !== 'login' && (
              <div className="not-auth card" style={{ opacity: 0 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 21h7a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v5"></path><line x1="7" y1="16" x2="21" y2="16"></line><line x1="16" y1="11" x2="16" y2="21"></line></svg>
                <h4>Anda Belum Login</h4>
                <p>Silakan login terlebih dahulu untuk mengakses sistem.</p>
              </div>
            )}
          </main>
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
