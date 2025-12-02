import React, { useEffect, useState, useRef } from 'react';
import { getTransactions } from '../services/api';
import { animate } from 'animejs';

function formatIDR(n) {
  return n.toLocaleString('id-ID', { style:'currency', currency:'IDR' });
}

export default function ReportView({ token }) {
  const [transactions, setTransactions] = useState([]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const reportRef = useRef(null);

  useEffect(() => {
    if (reportRef.current) {
      animate(reportRef.current, {
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 600,
        easing: 'easeOutQuad'
      });
    }
  }, []);

  useEffect(()=> {
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
    fetchData();
  }, [token]);

  const setDatePreset = (days) => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    setFrom(start.toISOString().slice(0,10));
    setTo(end.toISOString().slice(0,10));
  };

  const generate = () => {
    const f = from || '1970-01-01';
    const t = to || '9999-12-31';
    const filtered = transactions.filter(trx => trx.date >= f && trx.date <= t);
    const totals = filtered.reduce((acc, t) => {
      if (t.type === 'penjualan') acc.sales += Number(t.total); 
      else acc.expense += Number(t.total);
      return acc;
    }, { sales:0, expense:0 });
    setReport({ filtered, totals });
  };

  const exportCSV = () => {
    if (!report) return;
    const rows = [['ID','Tanggal','Jenis','Produk','Qty','Harga','Total','Note']];
    report.filtered.forEach(r => rows.push([r.id, r.date, r.type, r.product, r.quantity, r.price, r.total, r.note]));
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report_${from || 'all'}_${to||'all'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getNetProfitClass = () => {
    if (!report) return '';
    const netProfit = report.totals.sales - report.totals.expense;
    if (netProfit > 0) return 'text-success';
    if (netProfit < 0) return 'text-danger';
    return '';
  };

  if (loading) return <div className="p-4 text-center">Loading report data...</div>;

  return (
    <div className="report-view" ref={reportRef} style={{ opacity: 0 }}>
      <div className="card">
        <h3 className="card-header">Generate Laporan</h3>
        <div className="form-inline report-filters">
          <div className="form-group">
            <label>Dari Tanggal</label>
            <input type="date" value={from} onChange={e=>setFrom(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Sampai Tanggal</label>
            <input type="date" value={to} onChange={e=>setTo(e.target.value)} />
          </div>
          <div className="presets flex gap-2 items-end pb-1">
            <button className="btn btn-sm btn-ghost" onClick={() => setDatePreset(7)}>7 Hari</button>
            <button className="btn btn-sm btn-ghost" onClick={() => setDatePreset(30)}>30 Hari</button>
            <button className="btn btn-sm btn-ghost" onClick={() => setDatePreset(90)}>3 Bulan</button>
          </div>
          <div className="filter-actions">
            <button className="btn" onClick={generate}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
              Generate
            </button>
            <button className="btn btn-outline" onClick={exportCSV} disabled={!report}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {report && (
        <div className="card">
          <div className="report-summary">
            <h4>Laporan Periode {from || 'Awal'} s/d {to || 'Akhir'}</h4>
            <p>({report.filtered.length} transaksi ditemukan)</p>
          </div>
          <div className="summary-grid">
            <div className="card summary-card">
              <div className="summary-icon icon-sales">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
              </div>
              <div className="summary-info">
                <h4>Total Penjualan</h4>
                <p className="big">{formatIDR(report.totals.sales)}</p>
              </div>
            </div>
            <div className="card summary-card">
              <div className="summary-icon icon-expense">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
              </div>
              <div className="summary-info">
                <h4>Total Pengeluaran</h4>
                <p className="big">{formatIDR(report.totals.expense)}</p>
              </div>
            </div>
            <div className="card summary-card">
              <div className="summary-icon icon-profit">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              </div>
              <div className="summary-info">
                <h4>Laba Bersih</h4>
                <p className={`big ${getNetProfitClass()}`}>{formatIDR(report.totals.sales - report.totals.expense)}</p>
              </div>
            </div>
          </div>

          <div className="table-container">
            <table className="table">
              <thead><tr><th>Tanggal</th><th>Jenis</th><th>Produk</th><th>Jumlah</th><th>Total</th></tr></thead>
              <tbody>
                {report.filtered.map(r => (
                  <tr key={r.id}>
                    <td>{new Date(r.date).toLocaleDateString('id-ID')}</td>
                    <td><span className={`badge badge-${r.type}`}>{r.type}</span></td>
                    <td>{r.product}</td>
                    <td>{r.quantity}</td>
                    <td className="text-right">{formatIDR(r.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {!report && (
        <div className="card empty-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          <h4>Belum Ada Laporan</h4>
          <p>Silakan pilih rentang tanggal dan klik "Generate" untuk melihat laporan.</p>
        </div>
      )}
    </div>
  );
}