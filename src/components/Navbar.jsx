import React from 'react';

export default function Navbar({ user, route, onRouteChange, onLogout }) {
  const NavLink = ({ page, children }) => (
    <button 
      className={`nav-link ${route === page ? 'active' : ''}`}
      onClick={() => onRouteChange(page)}
    >
      {children}
    </button>
  );

  return (
    <header className="nav">
      <div className="brand">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-dollar-sign"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
        <span>Frozen Food Oppa</span>
      </div>
      <nav>
        <NavLink page="dashboard">Dashboard</NavLink>
        <NavLink page="input">Input Transaksi</NavLink>
        {user && user.role === 'owner' && <NavLink page="report">Laporan</NavLink>}
      </nav>
      <div className="user-area">
        {user ? (
          <>
            <div className="user-info">
              <span className="user-name">{user.name}</span>
              <span className="user-role">{user.role}</span>
            </div>
            <button className="btn btn-outline" onClick={onLogout}>Logout</button>
          </>
        ) : (
          <button className="btn" onClick={() => onRouteChange('login')}>Login</button>
        )}
      </div>
    </header>
  );
}