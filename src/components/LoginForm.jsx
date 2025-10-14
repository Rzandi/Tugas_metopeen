import React, { useState } from 'react';
import { saveUserToStorage } from '../utils/storage';

export default function LoginForm({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const getUsers = () => JSON.parse(localStorage.getItem('users') || '[]');
  const saveUsers = (users) => localStorage.setItem('users', JSON.stringify(users));

  // Initialize default users if not present
  useState(() => {
    const users = getUsers();
    if (users.length === 0) {
      saveUsers([
        { username: 'owner', name: 'Pemilik', role: 'owner', password: 'owner123' },
        { username: 'staff', name: 'Karyawan', role: 'staff', password: 'staff123' }
      ]);
    }
  });

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setName('');
    setError('');
    setSuccess('');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const users = getUsers();
    const found = users.find(u => u.username === username && u.password === password);
    if (!found) {
      setError('Username atau password salah');
      return;
    }
    saveUserToStorage(found);
    onLogin(found);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const users = getUsers();
    if (users.find(u => u.username === username)) {
      setError('Username sudah digunakan');
      return;
    }
    const newUser = { username, password, name, role: 'staff' };
    users.push(newUser);
    saveUsers(users);
    setError('');
    setSuccess('Pendaftaran berhasil! Silakan login.');
    setIsRegister(false); // Back to login form
    resetForm();
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    resetForm();
  };

  return (
    <div className="login-container">
      <div className="card login-card fade-in-up">
        <div className="login-header">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-log-in"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
          <h2>{isRegister ? 'Daftar Akun Karyawan' : 'Selamat Datang'}</h2>
          <p>{isRegister ? 'Buat akun baru untuk mengakses sistem.' : 'Silakan masuk untuk melanjutkan'}</p>
        </div>

        {isRegister ? (
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label>Nama Lengkap</label>
              <input value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Username</label>
              <input value={username} onChange={e => setUsername(e.target.value)} required />
            </div>
            <div className="form-group password-wrapper">
              <label>Password</label>
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required />
              <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>}
              </span>
            </div>
            {error && <div className="error">{error}</div>}
            <button className="btn btn-primary" type="submit">Daftar</button>
          </form>
        ) : (
          <form onSubmit={handleLogin}>
            {success && <div className="success">{success}</div>}
            <div className="form-group">
              <label>Username</label>
              <input value={username} onChange={e => setUsername(e.target.value)} required autoComplete="username" />
            </div>
            <div className="form-group password-wrapper">
              <label>Password</label>
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />
              <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>}
              </span>
            </div>
            {error && <div className="error">{error}</div>}
            <button className="btn btn-primary" type="submit">Login</button>
          </form>
        )}

        <div className="toggle-form">
          {isRegister ? (
            <p>Sudah punya akun? <button onClick={toggleMode}>Login di sini</button></p>
          ) : (
            <p>Karyawan baru? <button onClick={toggleMode}>Daftar di sini</button></p>
          )}
        </div>
      </div>
    </div>
  );
}