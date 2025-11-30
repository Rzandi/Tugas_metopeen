import React, { useEffect, useState } from 'react';

function formatIDR(n) {
  return n.toLocaleString('id-ID', { style:'currency', currency:'IDR', minimumFractionDigits: 0 });
}

function DataViz({ sales, expense }) {
  const total = sales + expense;
  if (total === 0) return null;

  const salesWidth = (sales / total) * 100;
  const expenseWidth = (expense / total) * 100;

  return (
    <div className="data-viz">
      <div className="bar sales" style={{ width: `${salesWidth}%` }} title={`Penjualan: ${formatIDR(sales)}`}></div>
      <div className="bar expense" style={{ width: `${expenseWidth}%` }} title={`Pengeluaran: ${formatIDR(expense)}`}></div>
    </div>
  );
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const arr = JSON.parse(localStorage.getItem('transactions') || '[]');
    setTransactions(arr.reverse());
  }, []);

  const totals = transactions.reduce((acc, t) => {
    if (t.type === 'penjualan') acc.sales += t.total;
    else acc.expense += t.total;
    return acc;
  }, { sales:0, expense:0 });

  const getNetProfitClass = () => {
    const netProfit = totals.sales - totals.expense;
    if (netProfit > 0) return 'text-success';
    if (netProfit < 0) return 'text-danger';
    return '';
  };

  return (
    <div className="dashboard">
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

      <div className="card">
        <h3>Transaksi Terbaru</h3>
        {transactions.length === 0 && <p className="empty-state">Tidak ada transaksi untuk ditampilkan.</p>}
        {transactions.length > 0 && (
          <div className="table-container">
            <table className="table">
              <thead><tr>
                <th>Tanggal</th><th>Jenis</th><th>Produk</th><th>Jumlah</th><th>Total</th>
              </tr></thead>
              <tbody>
                {transactions.slice(0,10).map(t => (
                  <tr key={t.id}>
                    <td>{new Date(t.date).toLocaleDateString('id-ID')}</td>
                    <td><span className={`badge badge-${t.type}`}>{t.type}</span></td>
                    <td>{t.product}</td>
                    <td>{t.qty}</td>
                    <td className="text-right">{formatIDR(t.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card">
        <h3>Visualisasi Data</h3>
        <DataViz sales={totals.sales} expense={totals.expense} />
      </div>
    </div>
  );
}