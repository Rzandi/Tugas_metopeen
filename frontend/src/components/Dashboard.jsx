import React, { useEffect, useState } from 'react';
import { getTransactions, deleteTransaction } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

function formatIDR(n) {
  return n.toLocaleString('id-ID', { style:'currency', currency:'IDR', minimumFractionDigits: 0 });
}

export default function Dashboard({ user, token }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      const response = await getTransactions(token);
      setTransactions(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch transactions', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus transaksi ini?')) return;
    try {
      await deleteTransaction(id, token);
      fetchData(); // Refresh data
    } catch (error) {
      alert('Gagal menghapus transaksi: ' + error.message);
    }
  };

  const totals = transactions.reduce((acc, t) => {
    if (t.type === 'penjualan') acc.sales += Number(t.total);
    else acc.expense += Number(t.total);
    return acc;
  }, { sales:0, expense:0 });

  const getNetProfitClass = () => {
    const netProfit = totals.sales - totals.expense;
    if (netProfit > 0) return 'text-success';
    if (netProfit < 0) return 'text-danger';
    return '';
  };

  const chartData = [
    { name: 'Penjualan', amount: totals.sales, color: '#10b981' },
    { name: 'Pengeluaran', amount: totals.expense, color: '#ef4444' }
  ];

  if (loading) return <div className="p-4 text-center">Loading dashboard...</div>;

  return (
    <div className="dashboard">
      <div className="welcome-header mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Selamat datang, <span className="font-semibold text-primary">{user?.name}</span>. 
          Anda login sebagai <span className="badge badge-role">{user?.role}</span>.
        </p>
      </div>

      <div className="summary-grid">
        <div className="card summary-card">
          <div className="summary-icon icon-sales">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          </div>
          <div className="summary-info">
            <h4>Total Penjualan</h4>
            <p className="big">{formatIDR(totals.sales)}</p>
          </div>
        </div>
        <div className="card summary-card">
          <div className="summary-icon icon-expense">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
          </div>
          <div className="summary-info">
            <h4>Total Pengeluaran</h4>
            <p className="big">{formatIDR(totals.expense)}</p>
          </div>
        </div>
        <div className="card summary-card">
          <div className="summary-icon icon-profit">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <div className="summary-info">
            <h4>Laba Bersih</h4>
            <p className={`big ${getNetProfitClass()}`}>{formatIDR(totals.sales - totals.expense)}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <h3>Statistik Keuangan</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" tickFormatter={(value) => `Rp${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                  formatter={(value) => formatIDR(value)}
                />
                <Legend />
                <Bar dataKey="amount" name="Jumlah" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h3>Transaksi Terbaru</h3>
          {transactions.length === 0 && <p className="empty-state">Tidak ada transaksi untuk ditampilkan.</p>}
          {transactions.length > 0 && (
            <div className="table-container">
              <table className="table">
                <thead><tr>
                  <th>Tanggal</th><th>Jenis</th><th>Produk</th><th className="text-right">Total</th>
                  {user?.role === 'owner' && <th>Aksi</th>}
                </tr></thead>
                <tbody>
                  {transactions.slice(0,5).map(t => (
                    <tr key={t.id}>
                      <td>{new Date(t.date).toLocaleDateString('id-ID')}</td>
                      <td><span className={`badge badge-${t.type}`}>{t.type}</span></td>
                      <td>{t.product}</td>
                      <td className="text-right">{formatIDR(t.total)}</td>
                      {user?.role === 'owner' && (
                        <td className="text-center">
                          <button 
                            onClick={() => handleDelete(t.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Hapus Transaksi"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}