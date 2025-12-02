import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getUsers, deleteUser } from '../services/api';

export default function UserManagement({ token }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    try {
      const response = await getUsers(token);
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Yakin ingin menghapus akun ${name}? Tindakan ini tidak dapat dibatalkan.`)) return;

    try {
      await deleteUser(id, token);
      setMessage({ type: 'success', text: 'Pengguna berhasil dihapus' });
      fetchUsers();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Gagal menghapus pengguna' });
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

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-7xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white tracking-tight">Manajemen Anggota</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Kelola akun staff dan admin</p>
          </div>
          <div className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-4 py-2 rounded-lg font-medium border border-blue-100 dark:border-blue-800">
            Total: {users.length} Anggota
          </div>
        </div>
        
        <AnimatePresence>
          {message.text && (
            <motion.div 
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className={`p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}
            >
              {message.type === 'success' ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
              )}
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>
  
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {users.length === 0 ? (
            <div className="col-span-full bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center border border-gray-100 dark:border-gray-700">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Belum ada anggota</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Daftar anggota akan muncul di sini.</p>
            </div>
          ) : (
            <AnimatePresence>
              {users.map((user, index) => (
                <motion.div 
                  key={user.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700 overflow-hidden group flex flex-col"
                >
                  <div className="p-6 flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md overflow-hidden">
                        {user.profile_picture_url ? (
                          <img src={user.profile_picture_url} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          getInitials(user.name)
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        user.role === 'admin' 
                          ? 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800' 
                          : 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 truncate" title={user.name}>{user.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                      @{user.username}
                    </p>
  
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <span className="text-gray-500 dark:text-gray-400">Status</span>
                        {(() => {
                          const lastLogin = user.last_login_at ? new Date(user.last_login_at) : null;
                          const isOnline = lastLogin && lastLogin > new Date(Date.now() - 5 * 60 * 1000);
                          const isToday = lastLogin && lastLogin.toDateString() === new Date().toDateString();
                          
                          let statusText = 'Offline';
                          let statusClass = 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300';
                          
                          if (isOnline) {
                            statusText = 'Online';
                            statusClass = 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
                          } else if (isToday) {
                            statusText = 'Hadir';
                            statusClass = 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
                          }
  
                          return (
                            <span className={`px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1.5 ${statusClass}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500' : isToday ? 'bg-blue-500' : 'bg-gray-400'}`}></span>
                              {statusText}
                            </span>
                          );
                        })()}
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <span className="text-gray-500 dark:text-gray-400">Terakhir Login</span>
                        <span className="text-gray-700 dark:text-gray-200 font-medium text-xs">
                          {user.last_login_at 
                            ? new Date(user.last_login_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
                            : '-'}
                        </span>
                      </div>
                    </div>
                  </div>
  
                  <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleDelete(user.id, user.name)}
                      className="w-full bg-white dark:bg-gray-700 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border border-gray-200 dark:border-gray-600 hover:border-red-200 dark:hover:border-red-800 text-sm font-medium flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                      Hapus Akun
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </div>
  );
}
