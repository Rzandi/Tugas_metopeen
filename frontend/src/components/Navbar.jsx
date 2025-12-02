import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { getPendingApprovals } from '../services/api';

export default function Navbar({ user, route, onRouteChange, onLogout }) {
  const { theme, toggleTheme } = useTheme();
  const [pendingCount, setPendingCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (user && user.role === 'owner') {
      const fetchPending = async () => {
        try {
          const token = localStorage.getItem('token'); 
          if (token) {
            const response = await getPendingApprovals(token);
            // Ensure response is an array before checking length
            const data = Array.isArray(response) ? response : (response.data || []);
            setPendingCount(Array.isArray(data) ? data.length : 0);
          }
        } catch (error) {
          console.error("Failed to fetch pending approvals", error);
        }
      };
      fetchPending();
      const interval = setInterval(fetchPending, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const NavLink = ({ page, children, badge, mobile }) => (
    <button 
      className={`nav-link ${route === page ? 'active' : ''}`}
      onClick={() => {
        onRouteChange(page);
        if (mobile) setIsMenuOpen(false);
      }}
      style={{ position: 'relative', width: mobile ? '100%' : 'auto', textAlign: mobile ? 'left' : 'center' }}
    >
      {children}
      {badge > 0 && (
        <span style={{
          position: mobile ? 'relative' : 'absolute',
          top: mobile ? '0' : '-5px',
          right: mobile ? '0' : '-5px',
          marginLeft: mobile ? '8px' : '0',
          backgroundColor: '#ef4444',
          color: 'white',
          fontSize: '0.6rem',
          padding: '0.1rem 0.3rem',
          borderRadius: '999px',
          minWidth: '1rem',
          textAlign: 'center',
          display: 'inline-block'
        }}>
          {badge}
        </span>
      )}
    </button>
  );

  return (
    <header className="navbar" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontSize: '1.25rem' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'hsl(var(--primary))' }}><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          <span>Frozen Food Oppa</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex" style={{ gap: '0.5rem' }}>
          <NavLink page="dashboard">Dashboard</NavLink>
          <NavLink page="input">Input Transaksi</NavLink>
          <NavLink page="pricelist">Daftar Barang</NavLink>
          {user && user.role === 'owner' && (
            <>
              <NavLink page="report">Laporan</NavLink>
              <NavLink page="users">Anggota</NavLink>
              <NavLink page="approvals" badge={pendingCount}>Inbox</NavLink>
            </>
          )}
        </nav>

        {/* Desktop User Area */}
        <div className="hidden md:flex user-area">
          {user ? (
            <>
              <div className="user-info">
                <span className="user-name">{user.name}</span>
                <span className="user-role-label" style={{ fontSize: '0.7rem', color: 'hsl(var(--foreground) / 0.5)' }}>Login sebagai:</span>
                <span className="user-role" style={{ fontWeight: '600', color: 'hsl(var(--primary))' }}>{user.role}</span>
              </div>
              <button 
                className="nav-icon-btn" 
                onClick={toggleTheme} 
                title={theme === 'light' ? "Mode Gelap" : "Mode Terang"}
              >
                {theme === 'light' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                )}
              </button>
              <button className="nav-icon-btn" onClick={() => onRouteChange('settings')} title="Pengaturan">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              </button>
              <button className="btn btn-outline" style={{ width: 'auto' }} onClick={onLogout}>Logout</button>
            </>
          ) : (
            <button className="btn btn-primary" style={{ width: 'auto' }} onClick={() => onRouteChange('login')}>Login</button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden nav-icon-btn" onClick={toggleMenu}>
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          )
          }
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mobile-menu" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '0.5rem', 
          marginTop: '1rem', 
          paddingTop: '1rem', 
          borderTop: '1px solid hsl(var(--border))',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          {user && (
            <div className="user-info-mobile" style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: 'hsl(var(--input))', borderRadius: '0.5rem' }}>
              <div style={{ fontWeight: '600' }}>{user.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'hsl(var(--muted))' }}>{user.role}</div>
            </div>
          )}
          
          <NavLink page="dashboard" mobile>Dashboard</NavLink>
          <NavLink page="input" mobile>Input Transaksi</NavLink>
          <NavLink page="pricelist" mobile>Daftar Barang</NavLink>
          {user && user.role === 'owner' && (
            <>
              <NavLink page="report" mobile>Laporan</NavLink>
              <NavLink page="users" mobile>Anggota</NavLink>
              <NavLink page="approvals" badge={pendingCount} mobile>Inbox</NavLink>
            </>
          )}
          
          <div style={{ height: '1px', backgroundColor: 'hsl(var(--border))', margin: '0.5rem 0' }}></div>
          
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between' }}>
            <button 
              className="btn btn-outline" 
              onClick={toggleTheme} 
              style={{ flex: 1, justifyContent: 'center' }}
            >
              {theme === 'light' ? 'Mode Gelap' : 'Mode Terang'}
            </button>
            <button 
              className="btn btn-outline" 
              onClick={() => {
                onRouteChange('settings');
                setIsMenuOpen(false);
              }}
              style={{ flex: 1, justifyContent: 'center' }}
            >
              Pengaturan
            </button>
          </div>
          <button className="btn btn-primary" onClick={onLogout} style={{ marginTop: '0.5rem' }}>Logout</button>
        </div>
      )}
    </header>
  );
}