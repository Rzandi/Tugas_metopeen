import React, { useState, useEffect, useRef } from 'react';
import { updateUser, deleteUser, getUsers } from '../services/api';
import { animate } from 'animejs';

export default function Settings({ user, onUserUpdate }) {
  const [name, setName] = useState(user.name);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user.profile_picture || null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [staffList, setStaffList] = useState([]);
  
  const settingsRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (settingsRef.current) {
      animate(settingsRef.current, {
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 600,
        easing: 'easeOutQuad'
      });
    }
  }, []);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Ukuran foto maksimal 2MB' });
        return;
      }
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    if (password && password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Password dan konfirmasi password tidak cocok!' });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      if (password) {
        formData.append('password', password);
      }
      if (profilePicture) {
        formData.append('profile_picture', profilePicture);
      }

      const response = await updateUser(user.id, formData, user.token);
      
      // Update local user state with new data including profile picture URL
      onUserUpdate({ ...user, ...response.data });
      
      setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' });
      setPassword('');
      setConfirmPassword('');
      setProfilePicture(null);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
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

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="settings-view container mx-auto p-4 max-w-4xl" ref={settingsRef} style={{ opacity: 0 }}>
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
           {message.type === 'success' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
          )}
          {message.text}
        </div>
      )}

      {/* Hero Card for Profile Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8 border border-gray-100 dark:border-gray-700">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-gray-200 flex items-center justify-center shadow-lg">
                {previewUrl ? (
                  <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-gray-500">{getInitials(user.name)}</span>
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-0 right-0 p-1.5 bg-white dark:bg-gray-700 rounded-full shadow-md border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                title="Ubah Foto Profil"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
            </div>
            <div className="mb-1">
               <span className={`px-3 py-1 rounded-full text-sm font-medium ${user.role === 'owner' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                {user.role === 'owner' ? 'Owner' : 'Staff'}
              </span>
            </div>
          </div>

          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                <input 
                  value={user.username} 
                  disabled 
                  className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-500 cursor-not-allowed"
                />
                <p className="text-xs text-gray-400 mt-1">Username tidak dapat diubah.</p>
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Lengkap</label>
                <input 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required 
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password Baru</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="Kosongkan jika tidak ingin mengubah"
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Konfirmasi Password</label>
                <input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)} 
                  placeholder="Ulangi password baru"
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
              <button 
                type="submit" 
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      </div>

      {user.role === 'owner' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">Manajemen Pengguna</h3>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
              {staffList.filter(u => u.role === 'staff').length} Staff
            </span>
          </div>
          
          <div className="p-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <svg className="animate-spin h-8 w-8 mb-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p>Memuat data pengguna...</p>
              </div>
            ) : staffList.filter(u => u.role === 'staff').length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                </div>
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Belum Ada Staff</h4>
                <p>Staff yang terdaftar akan muncul di sini.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 uppercase tracking-wider font-medium">
                    <tr>
                      <th className="px-6 py-4 rounded-tl-lg">Nama</th>
                      <th className="px-6 py-4">Username</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4 rounded-tr-lg text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {staffList.filter(u => u.role === 'staff').map(staff => (
                      <tr key={staff.username} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                            {staff.profile_picture ? (
                              <img src={staff.profile_picture} alt={staff.name} className="w-full h-full rounded-full object-cover" />
                            ) : (
                              getInitials(staff.name)
                            )}
                          </div>
                          {staff.name}
                        </td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{staff.username}</td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                            {staff.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            className="text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-lg transition-colors text-xs font-medium inline-flex items-center gap-1"
                            onClick={() => handleDeleteUser(staff.id, staff.name)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
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
        </div>
      )}
    </div>
  );
}
