import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPendingApprovals, approveUser, rejectUser } from '../services/api';
import { 
  Check, X, Clock, User, Shield, AlertCircle, Inbox, Mail 
} from 'lucide-react';

export default function ApprovalInbox({ token }) {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApprovals();
  }, [token]);

  const fetchApprovals = async () => {
    try {
      const response = await getPendingApprovals(token);
      // Handle new standardized response format
      const data = response.data || response;
      setApprovals(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch approvals', error);
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveUser(id, token);
      fetchApprovals();
    } catch (error) {
      alert('Failed to approve user');
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Reject this user?')) return;
    try {
      await rejectUser(id, token);
      fetchApprovals();
    } catch (error) {
      alert('Failed to reject user');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Inbox Persetujuan</h1>
        <p className="text-muted-foreground mt-1">Kelola permintaan pendaftaran pengguna baru</p>
      </div>

      {/* Content */}
      {approvals.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-12 flex flex-col items-center justify-center text-center min-h-[400px]"
        >
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
            <Inbox className="w-12 h-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Tidak Ada Permintaan Pending</h3>
          <p className="text-muted-foreground max-w-md">
            Semua permintaan pendaftaran telah diproses. Anda akan menerima notifikasi jika ada pengguna baru yang mendaftar.
          </p>
        </motion.div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {approvals.map((approval, index) => (
              <motion.div
                key={approval.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
                className="card p-6 border-l-4 border-l-yellow-500"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center font-bold">
                      {approval.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold">{approval.name}</h4>
                      <p className="text-xs text-muted-foreground">Requesting Access</p>
                    </div>
                  </div>
                  <span className="badge bg-yellow-100 text-yellow-700 text-xs">
                    Pending
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="w-4 h-4 mr-2" />
                    {approval.email}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="w-4 h-4 mr-2" />
                    @{approval.username}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-2" />
                    {new Date(approval.created_at).toLocaleString()}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => handleReject(approval.id)}
                    className="btn btn-outline border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Tolak
                  </button>
                  <button 
                    onClick={() => handleApprove(approval.id)}
                    className="btn btn-primary bg-green-600 hover:bg-green-700 border-none"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Setujui
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
