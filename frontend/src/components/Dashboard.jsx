import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, CreditCard, 
  ArrowUpRight, ArrowDownRight, Package, Calendar, MoreHorizontal, Trash2, Plus, Minus
} from 'lucide-react';
import { getTransactions, deleteTransaction, updateTransaction } from '../services/api';

function formatIDR(n) {
  return n.toLocaleString('id-ID', { style:'currency', currency:'IDR' });
}

export default function Dashboard({ user, token }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recapType, setRecapType] = useState('harian'); // harian, bulanan, tahunan

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
      fetchData();
    } catch (error) {
      alert('Gagal menghapus transaksi: ' + error.message);
    }
  };

  const handleUpdateQuantity = async (id, currentQty, change) => {
    const newQty = currentQty + change;
    if (newQty < 1) return;

    try {
      await updateTransaction(id, { quantity: newQty }, token);
      fetchData();
    } catch (error) {
      alert('Gagal update quantity: ' + error.message);
    }
  };

  const getFilteredTransactions = () => {
    const now = new Date();
    return transactions.filter(t => {
      const tDate = new Date(t.date);
      if (recapType === 'harian') {
        return tDate.toDateString() === now.toDateString();
      } else if (recapType === 'bulanan') {
        return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
      } else if (recapType === 'tahunan') {
        return tDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  };

  const filteredTransactions = getFilteredTransactions();

  const totals = filteredTransactions.reduce((acc, t) => {
    if (t.type === 'penjualan') acc.sales += Number(t.total);
    else acc.expense += Number(t.total);
    return acc;
  }, { sales: 0, expense: 0 });

  const netProfit = totals.sales - totals.expense;
  const profitMargin = totals.sales > 0 ? ((netProfit / totals.sales) * 100).toFixed(1) : 0;

  const chartData = [
    { name: 'Penjualan', amount: totals.sales, color: '#6366f1' }, // Indigo 500
    { name: 'Pengeluaran', amount: totals.expense, color: '#ef4444' } // Red 500
  ];

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Selamat datang kembali, <span className="font-semibold text-primary">{user?.name}</span>
          </p>
        </div>
        <div className="flex items-center gap-1 bg-card p-1 rounded-lg border shadow-sm">
          {['harian', 'bulanan', 'tahunan'].map((type) => (
            <button
              key={type}
              onClick={() => setRecapType(type)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                recapType === type 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Penjualan</p>
              <h3 className="text-2xl font-bold mt-1">{formatIDR(totals.sales)}</h3>
            </div>
            <div className="p-3 bg-primary/10 rounded-full text-primary">
              <ShoppingCart className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-green-500 flex items-center font-medium">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              +12.5%
            </span>
            <span className="text-muted-foreground ml-2">vs bulan lalu</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-destructive"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Pengeluaran</p>
              <h3 className="text-2xl font-bold mt-1">{formatIDR(totals.expense)}</h3>
            </div>
            <div className="p-3 bg-destructive/10 rounded-full text-destructive">
              <CreditCard className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-red-500 flex items-center font-medium">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              +4.3%
            </span>
            <span className="text-muted-foreground ml-2">vs bulan lalu</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-500"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Laba Bersih</p>
              <h3 className={`text-2xl font-bold mt-1 ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatIDR(netProfit)}
              </h3>
            </div>
            <div className={`p-3 rounded-full ${netProfit >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className={`flex items-center font-medium ${netProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {netProfit >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              {profitMargin}%
            </span>
            <span className="text-muted-foreground ml-2">margin keuntungan</span>
          </div>
        </motion.div>
      </div>

      {/* Charts & Recent Transactions */}
      <div className="grid gap-6 md:grid-cols-7">
        {/* Chart Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="col-span-4 card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Statistik Keuangan</h3>
            <button className="text-sm text-primary hover:underline">Lihat Detail</button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `Rp${value/1000}k`} 
                />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    borderColor: 'hsl(var(--border))', 
                    borderRadius: 'var(--radius)',
                    boxShadow: 'var(--shadow-lg)'
                  }}
                  formatter={(value) => [formatIDR(value), 'Jumlah']}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]} barSize={50}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="col-span-3 card p-0 overflow-hidden flex flex-col"
        >
          <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
            <h3 className="text-lg font-semibold">Transaksi Terbaru</h3>
            <button className="p-2 hover:bg-muted rounded-full transition-colors">
              <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
          
          <div className="flex-1 overflow-auto p-0">
            {filteredTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                <Package className="w-12 h-12 mb-2 opacity-20" />
                <p>Belum ada transaksi</p>
              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground font-medium">
                  <tr>
                    <th className="px-4 py-3">Produk</th>
                    <th className="px-4 py-3 text-center">Qty</th>
                    <th className="px-4 py-3 text-right">Total</th>
                    {user?.role === 'owner' && <th className="px-4 py-3 w-[50px]"></th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredTransactions.slice(0, 5).map((t) => (
                    <tr key={t.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">{t.product}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(t.date).toLocaleDateString('id-ID')}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          {user?.role === 'owner' && (
                            <button 
                              onClick={() => handleUpdateQuantity(t.id, t.quantity, -1)}
                              className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                          )}
                          <span className="font-medium w-4 text-center">{t.quantity}</span>
                          {user?.role === 'owner' && (
                            <button 
                              onClick={() => handleUpdateQuantity(t.id, t.quantity, 1)}
                              className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        <span className={t.type === 'penjualan' ? 'text-green-600' : 'text-red-600'}>
                          {t.type === 'penjualan' ? '+' : '-'}{formatIDR(t.total)}
                        </span>
                      </td>
                      {user?.role === 'owner' && (
                        <td className="px-4 py-3 text-center">
                          <button 
                            onClick={() => handleDelete(t.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          
          <div className="p-4 border-t border-border bg-muted/30 text-center">
            <button className="text-sm font-medium text-primary hover:underline">
              Lihat Semua Transaksi
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}