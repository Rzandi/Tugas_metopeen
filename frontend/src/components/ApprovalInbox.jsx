import React, { useState, useEffect, useRef } from 'react';
import { getPendingApprovals, approveUser, rejectUser } from '../services/api';
import { animate } from 'animejs';

export default function ApprovalInbox({ token }) {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const inboxRef = useRef(null);

  useEffect(() => {
    if (inboxRef.current) {
      animate(inboxRef.current, {
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 600,
        easing: 'easeOutQuad'
      });
    }
  }, []);

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
    } catch (error) {
      setMessage({ type: 'error', text: 'Gagal menolak user' });
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Memuat inbox...</div>;

  return (
    <div className="approval-inbox container mx-auto p-4 max-w-4xl fade-in-up" ref={inboxRef} style={{ opacity: 0 }}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Inbox Persetujuan</h2>
          <p className="text-muted-foreground mt-1">Permintaan pendaftaran akun admin baru</p>
        </div>
        {pendingUsers.length > 0 && (
          <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg font-medium border border-yellow-200">
            {pendingUsers.length} Menunggu
          </span>
        )}
      </div>
      
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

      {pendingUsers.length === 0 ? (
        <div className="bg-card text-card-foreground rounded-xl shadow-sm p-12 text-center border border-border">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          </div>
          <h3 className="text-lg font-medium">Inbox Kosong</h3>
          <p className="text-muted-foreground mt-1">Tidak ada permintaan pendaftaran baru saat ini.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingUsers.map(user => (
            <div key={user.id} className="bg-card text-card-foreground rounded-xl shadow-sm p-6 border border-border flex flex-col sm:flex-row justify-between items-center gap-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-5 w-full sm:w-auto">
                <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 flex items-center justify-center shrink-0 overflow-hidden">
                  {user.profile_picture ? (
                    <img src={user.profile_picture} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg font-bold">{user.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold">{user.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>@{user.username}</span>
                    <span>•</span>
                    <span className="text-yellow-600 dark:text-yellow-400 font-medium">Menunggu Persetujuan Admin</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 w-full sm:w-auto">
                <button 
                  onClick={() => handleApprove(user.id)}
                  className="flex-1 sm:flex-none px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  Setujui
                </button>
                <button 
                  onClick={() => handleReject(user.id)}
                  className="flex-1 sm:flex-none px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  Tolak
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
