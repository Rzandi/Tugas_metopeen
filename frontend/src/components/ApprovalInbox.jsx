import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPendingApprovals, approveUser, rejectUser } from '../services/api';

export default function ApprovalInbox({ token }) {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchPendingUsers();
  }, [token]);

  const fetchPendingUsers = async () => {
    try {
      const response = await getPendingApprovals(token);
      setPendingUsers(Array.isArray(response) ? response : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching approvals:', error);
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveUser(id, token);
      setMessage({ type: 'success', text: 'User berhasil disetujui' });
      fetchPendingUsers();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Gagal menyetujui user' });
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Yakin ingin menolak dan menghapus user ini?')) return;
    
    try {
      await rejectUser(id, token);
      setMessage({ type: 'success', text: 'User berhasil ditolak' });
      fetchPendingUsers();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Gagal menolak user' });
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white tracking-tight">Inbox Persetujuan</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Permintaan pendaftaran akun admin baru</p>
          </div>
          {pendingUsers.length > 0 && (
            <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 px-4 py-2 rounded-lg font-medium border border-yellow-200 dark:border-yellow-800">
              {pendingUsers.length} Menunggu
            </span>
          )}
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
  
        {pendingUsers.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center border border-gray-100 dark:border-gray-700">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Inbox Kosong</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Tidak ada permintaan pendaftaran baru saat ini.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {pendingUsers.map((user, index) => (
                <motion.div 
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-5 w-full sm:w-auto">
                    <div className="w-14 h-14 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 flex items-center justify-center shrink-0 overflow-hidden border-2 border-white dark:border-gray-700 shadow-sm">
                      {user.profile_picture ? (
                        <img src={user.profile_picture} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl font-bold">{user.name.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{user.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        <span>@{user.username}</span>
                        <span>•</span>
                        <span className="text-yellow-600 dark:text-yellow-400 font-medium bg-yellow-50 dark:bg-yellow-900/20 px-2 py-0.5 rounded text-xs">Menunggu Persetujuan</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 w-full sm:w-auto">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleApprove(user.id)}
                      className="flex-1 sm:flex-none px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-sm shadow-green-200 dark:shadow-none"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                      Setujui
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleReject(user.id)}
                      className="flex-1 sm:flex-none px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      Tolak
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
}
