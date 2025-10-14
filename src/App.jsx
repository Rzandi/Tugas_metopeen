import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import ReportView from './components/ReportView';
import { loadUserFromStorage } from './utils/storage';
import './App.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [route, setRoute] = useState('dashboard'); // 'dashboard' | 'input' | 'report' | 'login'
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const saved = loadUserFromStorage();
    if (saved) {
      setUser(saved);
    } else {
      setRoute('login');
    }
  }, []);

  const handleRouteChange = (newRoute) => {
    setRoute(newRoute);
    setRefreshKey(prev => prev + 1);
  };

  const handleLogin = (userObj) => {
    setUser(userObj);
    setRoute('dashboard');
    setRefreshKey(prev => prev + 1);
  };

  const handleLogout = () => {
    setUser(null);
    setRoute('login');
    localStorage.removeItem('activeUser'); // simple logout
  };

  return (
    <div className="app">
      <Navbar user={user} route={route} onRouteChange={handleRouteChange} onLogout={handleLogout} />
      <main className="main">
        {!user && route === 'login' && <LoginForm onLogin={handleLogin} />}
        {user && route === 'dashboard' && <Dashboard key={`dashboard-${refreshKey}`} />}
        {user && route === 'input' && <TransactionForm />}
        {user && user.role === 'owner' && route === 'report' && <ReportView key={`report-${refreshKey}`} />}
        {user && user.role !== 'owner' && route === 'report' && (
          <div className="not-auth card">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>
            <h4>Akses Ditolak</h4>
            <p>Halaman ini hanya dapat diakses oleh Owner.</p>
          </div>
        )}
        {!user && route !== 'login' && (
          <div className="not-auth card">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 21h7a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v5"></path><line x1="7" y1="16" x2="21" y2="16"></line><line x1="16" y1="11" x2="16" y2="21"></line></svg>
            <h4>Anda Belum Login</h4>
            <p>Silakan login terlebih dahulu untuk mengakses sistem.</p>
          </div>
        )}
      </main>
    </div>
  );
}


