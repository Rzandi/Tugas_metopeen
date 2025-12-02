import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createTransaction } from '../services/api';
import priceListService from '../services/priceListService';
import { 
  Save, Calendar, Package, DollarSign, FileText, 
  CheckCircle, AlertCircle, Search, X, ChevronDown, Plus, Minus
} from 'lucide-react';

function getNowDate() {
  const d = new Date();
  return d.toISOString().slice(0,10);
}

export default function TransactionForm({ token }) {
  const [type, setType] = useState('penjualan');
  const [date, setDate] = useState(getNowDate());
  const [product, setProduct] = useState('');
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState('');
  const [note, setNote] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
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
    setPrice(p.price);
    setShowSuggestions(false);
  };

  const save = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
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
      setMsg('Transaksi berhasil disimpan!');
      setProduct('');
      setQty(1);
      setPrice('');
      setNote('');
      setTimeout(() => setMsg(''), 3000);
    } catch (err) {
      setError(err.message || 'Gagal menyimpan transaksi');
    } finally {
      setLoading(false);
    }
  };

  const total = Number(qty) * Number(price);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card max-w-2xl mx-auto overflow-hidden"
    >
      <div className="bg-primary/5 p-6 border-b border-border">
        <h3 className="text-xl font-bold flex items-center gap-2 text-foreground">
          <div className="p-2 bg-primary rounded-lg text-primary-foreground">
            <Plus className="w-5 h-5" />
          </div>
          Input Transaksi Baru
        </h3>
      </div>

      <form onSubmit={save} className="p-6 space-y-6">
        {/* Transaction Type Toggle */}
        <div className="flex bg-muted p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setType('penjualan')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-md transition-all ${
              type === 'penjualan' 
                ? 'bg-white text-green-600 shadow-sm dark:bg-gray-800' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${type === 'penjualan' ? 'bg-green-500' : 'bg-transparent'}`} />
            Penjualan
          </button>
          <button
            type="button"
            onClick={() => setType('pengeluaran')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-md transition-all ${
              type === 'pengeluaran' 
                ? 'bg-white text-red-600 shadow-sm dark:bg-gray-800' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${type === 'pengeluaran' ? 'bg-red-500' : 'bg-transparent'}`} />
            Pengeluaran
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Tanggal
            </label>
            <input 
              type="date" 
              value={date} 
              onChange={e=>setDate(e.target.value)} 
              required 
              className="input w-full"
            />
          </div>

          {/* Product Autocomplete */}
          <div className="space-y-2 relative" ref={wrapperRef}>
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Package className="w-4 h-4" /> Produk / Keterangan
            </label>
            <div className="relative">
              <input 
                value={product} 
                onChange={handleProductChange} 
                required 
                placeholder="Cari produk..." 
                className="input w-full pl-10"
                autoComplete="off"
              />
              <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              {product && (
                <button 
                  type="button"
                  onClick={() => { setProduct(''); setShowSuggestions(false); }}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <AnimatePresence>
              {showSuggestions && filteredProducts.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg max-h-60 overflow-auto"
                >
                  {filteredProducts.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => selectProduct(p)}
                      className="w-full text-left px-4 py-3 hover:bg-muted transition-colors flex justify-between items-center border-b border-border last:border-0"
                    >
                      <div>
                        <div className="font-medium text-sm">{p.product_name}</div>
                        <div className="text-xs text-muted-foreground">{p.product_id} • Stok: {p.stock}</div>
                      </div>
                      <div className="text-sm font-semibold text-primary">
                        {Number(p.price).toLocaleString('id-ID')}
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Jumlah
            </label>
            <div className="flex items-center">
              <button 
                type="button"
                onClick={() => setQty(Math.max(1, Number(qty) - 1))}
                className="w-10 h-10 flex items-center justify-center border border-r-0 border-input rounded-l-lg hover:bg-muted"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input 
                type="number" 
                min="1" 
                value={qty} 
                onChange={e=>setQty(e.target.value)} 
                required 
                className="input w-full rounded-none text-center"
              />
              <button 
                type="button"
                onClick={() => setQty(Number(qty) + 1)}
                className="w-10 h-10 flex items-center justify-center border border-l-0 border-input rounded-r-lg hover:bg-muted"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> Harga Satuan
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-muted-foreground text-sm font-medium">Rp</span>
              <input 
                type="number" 
                min="0" 
                value={price} 
                onChange={e=>setPrice(e.target.value)} 
                required 
                placeholder="0" 
                className="input w-full pl-10"
              />
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <FileText className="w-4 h-4" /> Catatan (Opsional)
          </label>
          <input 
            value={note} 
            onChange={e=>setNote(e.target.value)} 
            placeholder="Tambahkan catatan..." 
            className="input w-full"
          />
        </div>

        {/* Total & Submit */}
        <div className="pt-4 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Transaksi</p>
            <p className="text-2xl font-bold text-primary">
              {(total).toLocaleString('id-ID', { style:'currency', currency:'IDR' })}
            </p>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary w-full md:w-auto px-8 py-6 text-base shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Menyimpan...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save className="w-5 h-5" />
                Simpan Transaksi
              </span>
            )}
          </button>
        </div>
        
        <AnimatePresence>
          {msg && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="p-4 bg-green-50 text-green-700 border border-green-200 rounded-lg flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              {msg}
            </motion.div>
          )}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-center gap-2"
            >
              <AlertCircle className="w-5 h-5" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </motion.div>
  );
}