import React, { useState, useEffect } from 'react';
import { updateUser, deleteUser, getUsers } from '../services/api';

export default function Settings({ user, onUserUpdate }) {
  const [name, setName] = useState(user.name);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [staffList, setStaffList] = useState([]);

  // Auto-dismiss messages after 3 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message.text]);

  useEffect(() => {
    const loadStaffList = async () => {
      if (user.role === 'owner') {
        try {
          setIsLoading(true);
          const response = await getUsers(user.token);
          setStaffList(response.data);
        } catch (error) {
          setMessage({ type: 'error', text: error.message });
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadStaffList();
  }, [user.role, user.token]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    if (password && password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Password dan konfirmasi password tidak cocok!' });
      return;
    }

    try {
      const updates = { name };
      if (password) {
        updates.password = password;
      }

      const response = await updateUser(user.id, updates, user.token);
      onUserUpdate({ ...user, name: response.data.name });
      setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' });
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }

    setMessage({ type: 'success', text: 'Profil berhasil diperbarui.' });
    setPassword('');
    setConfirmPassword('');
  };

  const handleDeleteUser = async (userId, staffName) => {
    if (!window.confirm(`Yakin ingin menghapus staff ${staffName}?`)) {
      return;
    }

    try {
      await deleteUser(userId, user.token);
      setStaffList(staffList.filter(staff => staff.id !== userId));
      setMessage({ type: 'success', text: 'Staff berhasil dihapus!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  return (
    <div className="settings-view">
      {message.text && <div className={`message ${message.type}`}>{message.text}</div>}

      <div className="card">
        <h3 className="card-header">Pengaturan Profil</h3>
        <form onSubmit={handleProfileUpdate} className="form-grid">
          <div className="form-group">
            <label>Username (tidak dapat diubah)</label>
            <input value={user.username} disabled />
          </div>
          <div className="form-group">
            <label>Nama</label>
            <input value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password Baru (kosongkan jika tidak ingin mengubah)</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Konfirmasi Password Baru</label>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
          </div>
          <div className="actions span-2">
            <button type="submit" className="btn">Simpan Perubahan</button>
          </div>
        </form>
      </div>

      {user.role === 'owner' && (
        <div className="card">
          <h3 className="card-header">Manajemen Pengguna</h3>
          {isLoading ? (
            <div className="loading-state">
              <svg className="spinner" viewBox="0 0 50 50">
                <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
              </svg>
              <p>Memuat data pengguna...</p>
            </div>
          ) : users.filter(u => u.role === 'staff').length === 0 ? (
            <div className="empty-state">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <h4>Belum Ada Staff</h4>
              <p>Staff yang terdaftar akan muncul di sini.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nama</th>
                    <th>Username</th>
                    <th>Role</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {users.filter(u => u.role === 'staff').map(staff => (
                    <tr key={staff.username}>
                      <td>{staff.name}</td>
                      <td>{staff.username}</td>
                      <td><span className="badge badge-staff">{staff.role}</span></td>
                      <td>
                        <button 
                          className="btn btn-danger small"
                          onClick={() => handleDeleteUser(staff.username, staff.name)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          </svg>
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
