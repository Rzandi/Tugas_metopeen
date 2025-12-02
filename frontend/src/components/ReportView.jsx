import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getTransactions } from '../services/api';

function formatIDR(n) {
  return n.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
}

export default function ReportView({ token }) {
  const [transactions, setTransactions] = useState([]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTransactions(token);
        setTransactions(response.data);
      } catch (error) {
        console.error('Failed to fetch transactions', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const generate = () => {
    const f = from || '1970-01-01';
    const t = to || '9999-12-31';
    const filtered = transactions.filter(trx => trx.date >= f && trx.date <= t);
    const totals = filtered.reduce((acc, t) => {
      if (t.type === 'penjualan') acc.sales += Number(t.total);
      else acc.expense += Number(t.total);
      return acc;
    }, { sales: 0, expense: 0 });
    setReport({ filtered, totals });
  };

  const exportCSV = () => {
    if (!report) return;
    const rows = [['ID', 'Tanggal', 'Jenis', 'Produk', 'Qty', 'Harga', 'Total', 'Note']];
    report.filtered.forEach(r => rows.push([r.id, r.date, r.type, r.product, r.quantity, r.price, r.total, r.note]));
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report_${from || 'all'}_${to || 'all'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white tracking-tight">Laporan Keuangan</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Analisis pendapatan dan pengeluaran</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Dari Tanggal</label>
              <input 
                type="date" 
                value={from} 
                onChange={e => setFrom(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sampai Tanggal</label>
              <input 
                type="date" 
                value={to} 
                onChange={e => setTo(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button 
                onClick={generate}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                Generate
              </button>
              <button 
                onClick={exportCSV} 
                disabled={!report}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 border ${!report ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {report ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                </div>
                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">Total Penjualan</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{formatIDR(report.totals.sales)}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                </div>
                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">Total Pengeluaran</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{formatIDR(report.totals.expense)}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                </div>
                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">Laba Bersih</h3>
                <p className={`text-2xl font-bold mt-2 ${report.totals.sales - report.totals.expense >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {formatIDR(report.totals.sales - report.totals.expense)}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <h3 className="font-semibold text-gray-800 dark:text-white">Rincian Transaksi</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">{report.filtered.length} transaksi</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700/50">
                      <th className="py-3 px-6 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tanggal</th>
                      <th className="py-3 px-6 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Jenis</th>
                      <th className="py-3 px-6 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Produk</th>
                      <th className="py-3 px-6 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Qty</th>
                      <th className="py-3 px-6 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {report.filtered.map((r, index) => (
                      <motion.tr 
                        key={r.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                      >
                        <td className="py-3 px-6 text-sm text-gray-700 dark:text-gray-300">{new Date(r.date).toLocaleDateString('id-ID')}</td>
                        <td className="py-3 px-6 text-sm">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            r.type === 'penjualan' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          }`}>
                            {r.type}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-sm text-gray-700 dark:text-gray-300">{r.product}</td>
                        <td className="py-3 px-6 text-sm text-gray-700 dark:text-gray-300">{r.quantity}</td>
                        <td className="py-3 px-6 text-sm text-gray-700 dark:text-gray-300 text-right font-medium">{formatIDR(r.total)}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Belum Ada Laporan</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">Silakan pilih rentang tanggal dan klik "Generate" untuk melihat analisis keuangan Anda.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}