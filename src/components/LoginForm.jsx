import React, { useState } from 'react';
import { saveUserToStorage } from '../utils/storage';

export default function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State baru
  const [error, setError] = useState('');

  // dummy cred: owner / owner123 ; staff / staff123
  const users = [
    { username: 'owner', name: 'Pemilik', role: 'owner', password: 'owner123' },
    { username: 'staff', name: 'Karyawan', role: 'staff', password: 'staff123' }
  ];

  const submit = (e) => {
    e.preventDefault();
    const found = users.find(u => u.username === username && u.password === password);
    if (!found) {
      setError('Username atau password salah');
      return;
    }
    saveUserToStorage(found);
    onLogin(found);
  };

  return (
    <div className="login-container">
      {/* Menambahkan class animasi 'fade-in-up' */}
      <div className="card login-card fade-in-up"> 
        <div className="login-header">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-log-in"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
          <h2>Selamat Datang</h2>
          <p>Silakan masuk untuk melanjutkan</p>
        </div>
        <form onSubmit={submit}>
          <div className="form-group">
            <label>Username</label>
            <input value={username} onChange={e => setUsername(e.target.value)} required autoComplete="username" />
          </div>
          {/* Wrapper baru untuk input password dan ikon */}
          <div className="form-group password-wrapper">
            <label>Password</label>
            <input 
              type={showPassword ? 'text' : 'password'} // Tipe input dinamis
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              autoComplete="current-password" 
            />
            {/* Ikon untuk toggle password */}
            <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
              )}
            </span>
          </div>
          {/* Pesan error dengan ikon */}
          {error && (
            <div className="error">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              {error}
            </div>
          )}
          <button className="btn btn-primary" type="submit">Login</button>
        </form>
        <p className="hint">Contoh: owner / owner123  —  staff / staff123</p>
      </div>
    </div>
  );
}
}