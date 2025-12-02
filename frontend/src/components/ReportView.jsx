import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getTransactions } from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { 
  Calendar, Download, FileText, TrendingUp, TrendingDown, DollarSign, Printer
} from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function formatIDR(n) {
  return n.toLocaleString('id-ID', { style:'currency', currency:'IDR' });
}

export default function ReportView({ token }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [chartType, setChartType] = useState('bar'); // bar or area

  useEffect(() => {
    fetchData();
    // Set default to this month
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    setStartDate(firstDay.toISOString().slice(0,10));
    setEndDate(lastDay.toISOString().slice(0,10));
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

  const setDatePreset = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    setStartDate(start.toISOString().slice(0,10));
    setEndDate(end.toISOString().slice(0,10));
  };

  const filteredTransactions = transactions.filter(t => {
    if (!startDate || !endDate) return true;
    const d = new Date(t.date);
    return d >= new Date(startDate) && d <= new Date(endDate);
  });

  // Aggregate data for chart
  const chartData = filteredTransactions.reduce((acc, t) => {
    const date = new Date(t.date).toLocaleDateString('id-ID');
    const existing = acc.find(item => item.date === date);
    if (existing) {
      if (t.type === 'penjualan') existing.sales += Number(t.total);
      else existing.expense += Number(t.total);
    } else {
      acc.push({
        date,
        sales: t.type === 'penjualan' ? Number(t.total) : 0,
        expense: t.type === 'pengeluaran' ? Number(t.total) : 0,
      });
    }
    return acc;
  }, []).sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date? Needs better parsing for sort, but string sort might work for simple cases or use original date obj

  const totals = filteredTransactions.reduce((acc, t) => {
    if (t.type === 'penjualan') acc.sales += Number(t.total);
    else acc.expense += Number(t.total);
    return acc;
  }, { sales: 0, expense: 0 });

  const netProfit = totals.sales - totals.expense;

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredTransactions.map(t => ({
      Tanggal: new Date(t.date).toLocaleDateString('id-ID'),
      Tipe: t.type,
      Produk: t.product,
      Qty: t.quantity,
      Harga: t.price,
      Total: t.total,
      Catatan: t.note
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan");
    XLSX.writeFile(wb, "Laporan_Keuangan.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Laporan Keuangan", 14, 15);
    doc.text(`Periode: ${startDate} s/d ${endDate}`, 14, 25);
    
    doc.autoTable({
      startY: 30,
      head: [['Tanggal', 'Tipe', 'Produk', 'Qty', 'Total']],
      body: filteredTransactions.map(t => [
        new Date(t.date).toLocaleDateString('id-ID'),
        t.type,
        t.product,
        t.quantity,
        formatIDR(t.total)
      ]),
    });
    doc.save("Laporan_Keuangan.pdf");
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Laporan Keuangan</h1>
          <p className="text-muted-foreground mt-1">Analisis pendapatan dan pengeluaran</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportExcel} className="btn btn-outline gap-2">
            <FileText className="w-4 h-4" /> Excel
          </button>
          <button onClick={exportPDF} className="btn btn-primary gap-2 shadow-lg shadow-primary/20">
            <Download className="w-4 h-4" /> PDF
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <input 
            type="date" 
            value={startDate} 
            onChange={e=>setStartDate(e.target.value)} 
            className="input w-auto"
          />
          <span className="text-muted-foreground">-</span>
          <input 
            type="date" 
            value={endDate} 
            onChange={e=>setEndDate(e.target.value)} 
            className="input w-auto"
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
          <button onClick={() => setDatePreset(7)} className="btn btn-ghost text-xs whitespace-nowrap">7 Hari Terakhir</button>
          <button onClick={() => setDatePreset(30)} className="btn btn-ghost text-xs whitespace-nowrap">30 Hari Terakhir</button>
          <button onClick={() => setDatePreset(90)} className="btn btn-ghost text-xs whitespace-nowrap">3 Bulan Terakhir</button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 border-l-4 border-l-primary"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Pemasukan</p>
              <h3 className="text-2xl font-bold mt-1">{formatIDR(totals.sales)}</h3>
            </div>
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6 border-l-4 border-l-destructive"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Pengeluaran</p>
              <h3 className="text-2xl font-bold mt-1">{formatIDR(totals.expense)}</h3>
            </div>
            <div className="p-2 bg-destructive/10 rounded-lg text-destructive">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6 border-l-4 border-l-green-500"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Laba Bersih</p>
              <h3 className={`text-2xl font-bold mt-1 ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatIDR(netProfit)}
              </h3>
            </div>
            <div className={`p-2 rounded-lg ${netProfit >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Grafik Keuangan</h3>
          <div className="flex gap-2">
            <button 
              onClick={() => setChartType('bar')}
              className={`p-2 rounded ${chartType === 'bar' ? 'bg-muted' : 'hover:bg-muted'}`}
            >
              Bar
            </button>
            <button 
              onClick={() => setChartType('area')}
              className={`p-2 rounded ${chartType === 'area' ? 'bg-muted' : 'hover:bg-muted'}`}
            >
              Area
            </button>
          </div>
        </div>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `Rp${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: 'var(--radius)' }}
                  formatter={(value) => formatIDR(value)}
                />
                <Legend />
                <Bar dataKey="sales" name="Pemasukan" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Pengeluaran" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `Rp${value/1000}k`} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: 'var(--radius)' }}
                  formatter={(value) => formatIDR(value)}
                />
                <Area type="monotone" dataKey="sales" name="Pemasukan" stroke="#6366f1" fillOpacity={1} fill="url(#colorSales)" />
                <Area type="monotone" dataKey="expense" name="Pengeluaran" stroke="#ef4444" fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Detailed Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card overflow-hidden"
      >
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-semibold">Rincian Transaksi</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Tipe</th>
                <th className="px-6 py-4">Produk</th>
                <th className="px-6 py-4 text-center">Qty</th>
                <th className="px-6 py-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">{new Date(t.date).toLocaleDateString('id-ID')}</td>
                  <td className="px-6 py-4">
                    <span className={`badge ${
                      t.type === 'penjualan' 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {t.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">{t.product}</td>
                  <td className="px-6 py-4 text-center">{t.quantity}</td>
                  <td className="px-6 py-4 text-right font-medium">{formatIDR(t.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}