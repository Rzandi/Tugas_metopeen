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
          <div className="not-auth">
            <h4>Akses Ditolak</h4>
            <p>Anda tidak memiliki izin untuk mengakses halaman ini.</p>
          </div>
        )}
        {!user && route !== 'login' && (
          <div className="not-auth">Silakan login terlebih dahulu.</div>
        )}
      </main>
    </div>
  );
}
