import React, { useState, useEffect } from 'react';
import { getUsers, saveUsers, saveUserToStorage } from '../utils/storage';

export default function Settings({ user, onUserUpdate }) {
  const [name, setName] = useState(user.name);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (user.role === 'owner') {
      setUsers(getUsers());
    }
  }, [user.role]);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Password konfirmasi tidak cocok.' });
      return;
    }

    const allUsers = getUsers();
    const userIndex = allUsers.findIndex(u => u.username === user.username);

    if (userIndex === -1) {
      setMessage({ type: 'error', text: 'Pengguna tidak ditemukan.' });
      return;
    }

    const updatedUser = { ...allUsers[userIndex], name };
    if (password) {
      updatedUser.password = password;
    }

    allUsers[userIndex] = updatedUser;
    saveUsers(allUsers);
    saveUserToStorage(updatedUser); // Update active user session
    onUserUpdate(updatedUser); // Update app state

    setMessage({ type: 'success', text: 'Profil berhasil diperbarui.' });
    setPassword('');
    setConfirmPassword('');
  };

  const handleDeleteUser = (usernameToDelete) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus pengguna ${usernameToDelete}?`)) {
      let allUsers = getUsers();
      allUsers = allUsers.filter(u => u.username !== usernameToDelete);
      saveUsers(allUsers);
      setUsers(allUsers); // Update local state
      setMessage({ type: 'success', text: `Pengguna ${usernameToDelete} berhasil dihapus.` });
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
                    <td><span className="badge badge-pengeluaran">{staff.role}</span></td>
                    <td>
                      <button className="btn btn-danger small" onClick={() => handleDeleteUser(staff.username)}>
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
