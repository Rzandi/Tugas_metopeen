import React, { useState, useEffect, useRef } from 'react';
import { createTransaction } from '../services/api';
import priceListService from '../services/priceListService';
import { animate } from 'animejs';

function getNowDate() {
  const d = new Date();
  return d.toISOString().slice(0,10);
}

export default function TransactionForm({ token }) {
  const [type, setType] = useState('penjualan');
  const [date, setDate] = useState(getNowDate());
  const [product, setProduct] = useState('');
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(0);
  const [note, setNote] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  
  // Autocomplete state
  const [products, setProducts] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  const formRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (formRef.current) {
      animate(formRef.current, {
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 600,
        easing: 'easeOutQuad'
      });
    }
    // Fetch products for autocomplete
    const fetchProducts = async () => {
      try {
        const data = await priceListService.getPriceList(token);
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    };
    fetchProducts();
  }, [token]);

  // Handle click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleProductChange = (e) => {
    const value = e.target.value;
    setProduct(value);
    
    if (value.length > 0) {
      const filtered = products.filter(p => 
        p.product_name.toLowerCase().includes(value.toLowerCase()) ||
        p.product_id.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProducts(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectProduct = (p) => {
    setProduct(p.product_name);
    setPrice(p.price); // Smart default: auto-fill price
    setShowSuggestions(false);
  };

  const save = async (e) => {
    e.preventDefault();
    setError('');
    
    const trx = {
      date,
      type,
      product,
      quantity: Number(qty),
      price: Number(price),
      note
    };

    try {
      await createTransaction(trx, token);
      setMsg('Transaksi disimpan');
      setProduct('');
      setQty(1);
      setPrice(0);
      setNote('');
      setTimeout(() => setMsg(''), 2000);
    } catch (err) {
      setError(err.message || 'Gagal menyimpan transaksi');
    }
  };

  const total = Number(qty) * Number(price);

  return (
    <div className="card" ref={formRef} style={{ opacity: 0 }}>
      <h3 className="card-header">Input Transaksi Baru</h3>
      <form onSubmit={save} className="form-grid">
        <div className="form-group span-2">
          <label>Jenis Transaksi</label>
          <div className="type-selector">
            <button type="button" className={`type-btn ${type === 'penjualan' ? 'active' : ''}`} onClick={() => setType('penjualan')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              Penjualan
            </button>
            <button type="button" className={`type-btn ${type === 'pengeluaran' ? 'active' : ''}`} onClick={() => setType('pengeluaran')}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Pengeluaran
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Tanggal</label>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} required />
        </div>

        <div className="form-group relative" ref={wrapperRef}>
          <label>Produk / Keterangan</label>
          <input 
            value={product} 
            onChange={handleProductChange} 
            required 
            placeholder="Cari produk..." 
            autoComplete="off"
          />
          {showSuggestions && filteredProducts.length > 0 && (
            <div className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg mt-1 max-h-60 overflow-auto">
              {filteredProducts.map(p => (
                <div
                  key={p.id}
                  onClick={() => selectProduct(p)}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-0"
                >
                  <div className="font-medium text-sm">{p.product_name}</div>
                  <div className="text-xs text-gray-500 flex justify-between">
                    <span>Stok: {p.stock}</span>
                    <span>Rp {p.price.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Jumlah</label>
          <input type="number" min="1" value={qty} onChange={e=>setQty(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Harga Satuan (Rp)</label>
          <input type="number" min="0" value={price} onChange={e=>setPrice(e.target.value)} required placeholder="e.g. 25000" />
        </div>

        <div className="form-group span-2">
          <label>Catatan (Opsional)</label>
          <input value={note} onChange={e=>setNote(e.target.value)} placeholder="e.g. Untuk stok bulanan" />
        </div>

        <div className="form-group span-2 total-display">
          <h4>Total:</h4>
          <p>{(total).toLocaleString('id-ID', { style:'currency', currency:'IDR' })}</p>
        </div>

        <div className="actions span-2">
          <button className="btn" type="submit">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2 2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
            Simpan Transaksi
          </button>
        </div>
        
        {msg && <div className="success-toast">{msg}</div>}
        {error && <div className="error-toast text-red-500 mt-2">{error}</div>}
      </form>
    </div>
  );
}