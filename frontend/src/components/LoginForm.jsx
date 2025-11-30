import React, { useState } from 'react';
import { login, register } from '../services/api';

export default function LoginForm({ onLogin }) {
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('staff'); // Default role
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setName('');
    setRole('staff');
    setError('');
    setSuccess('');
    setConfirmPassword('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login(username, password);
      // Flatten the user object so it contains token, name, role, etc. at the top level
      // The backend returns: { success: true, data: { token: "...", user: { id: 1, name: "...", ... } } }
      const { token, user } = response.data;
      onLogin({ token, ...user });
      resetForm();
    } catch (error) {
      // api.js throws an Error object with the message
      setError(error.message || 'Login gagal');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Password tidak cocok');
      return;
    }

    try {
      const response = await register({ username, password, name, role });
      setSuccess(response.message || 'Registrasi berhasil');
      setTimeout(() => {
        setIsRegister(false);
        resetForm();
      }, 2000);
    } catch (error) {
      // api.js throws an Error object with the message
      setError(error.message || 'Registrasi gagal');
    }
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
          <h2>{isRegister ? 'Daftar Akun Baru' : 'Selamat Datang'}</h2>
          <p>{isRegister ? 'Pilih peran dan buat akun.' : 'Silakan masuk untuk melanjutkan'}</p>
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
            
            <div className="form-group">
              <label>Daftar Sebagai</label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="role" 
                    value="staff" 
                    checked={role === 'staff'} 
                    onChange={e => setRole(e.target.value)} 
                  />
                  <span>Staff (Langsung Aktif)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="role" 
                    value="admin" 
                    checked={role === 'admin'} 
                    onChange={e => setRole(e.target.value)} 
                  />
                  <span>Admin (Perlu Approval)</span>
                </label>
              </div>
            </div>

            <div className="form-group password-wrapper">
              <label>Password</label>
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required />
              <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>}
              </span>
            </div>
            <div className="form-group password-wrapper">
              <label>Konfirmasi Password</label>
              <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
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
            <p>Belum punya akun? <button onClick={toggleMode}>Daftar di sini</button></p>
          )}
        </div>
      </div>
    </div>
  );
}