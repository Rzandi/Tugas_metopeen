import React, { useState } from 'react';
import { saveUserToStorage } from '../utils/storage';

export default function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
      <div className="card login-card">
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
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />
          </div>
          {error && <div className="error">{error}</div>}
          <button className="btn btn-primary" type="submit">Login</button>
        </form>
        <p className="hint">Contoh: owner / owner123  —  staff / staff123</p>
      </div>
    </div>
  );
}