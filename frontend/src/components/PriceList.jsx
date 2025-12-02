import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import priceListService from '../services/priceListService';
import { 
  Search, Filter, AlertTriangle, ChevronLeft, ChevronRight, 
  Edit2, Trash2, ShoppingCart, Plus, ArrowUpDown, Package, RefreshCw
} from 'lucide-react';

export default function PriceList({ token }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const [editId, setEditId] = useState(null);
  const [editStock, setEditStock] = useState(0);

  useEffect(() => {
    fetchItems();
  }, [token]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await priceListService.getPriceList(token);
      setItems(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch price list');
      setLoading(false);
    }
  };

  // Filter Logic
  const filteredItems = items.filter(item => {
    const matchesSearch = item.product_name.toLowerCase().includes(search.toLowerCase()) || 
                          item.product_id.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const categories = ['All', ...new Set(items.map(item => item.category))];

  // Actions
  const handleSale = async (id) => {
    try {
      await priceListService.saleItem(id, 1, token);
      fetchItems();
    } catch (err) {
      alert('Sale failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleRestock = async (id) => {
    try {
      await priceListService.restockItem(id, 1, token);
      fetchItems();
    } catch (err) {
      alert('Restock failed');
    }
  };

  const startEdit = (item) => {
    setEditId(item.id);
    setEditStock(item.stock);
  };

  const saveEdit = async (id) => {
    try {
      await priceListService.updateItem(id, { stock: editStock }, token);
      setEditId(null);
      fetchItems();
    } catch (err) {
      alert('Update failed');
    }
  };

  const lowStockItems = items.filter(i => i.stock < 5).length;

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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Daftar Barang</h1>
          <p className="text-muted-foreground mt-1">Kelola inventaris dan harga barang</p>
        </div>
        <button className="btn btn-primary shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Barang
        </button>
      </div>

      {/* Stats & Alerts */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card p-6 flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-full text-primary">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Barang</p>
            <h3 className="text-2xl font-bold">{items.length}</h3>
          </div>
        </div>
        
        {lowStockItems > 0 && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card p-6 flex items-center gap-4 border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-950/20"
          >
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-full text-orange-600 dark:text-orange-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-orange-800 dark:text-orange-300">Peringatan Stok Menipis</p>
              <h3 className="text-2xl font-bold text-orange-700 dark:text-orange-400">{lowStockItems} Item</h3>
              <p className="text-xs text-orange-600 dark:text-orange-500">Perlu restock segera</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <input 
            placeholder="Cari nama atau kode barang..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                categoryFilter === cat 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Kode Barang</th>
                <th className="px-6 py-4">Nama Barang</th>
                <th className="px-6 py-4">Brand</th>
                <th className="px-6 py-4">Stok</th>
                <th className="px-6 py-4 text-center">Penjualan</th>
                <th className="px-6 py-4 text-center">Pembelian</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <AnimatePresence>
                {paginatedItems.map((item, index) => (
                  <motion.tr 
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    <td className="px-6 py-4 font-medium">{item.product_id}</td>
                    <td className="px-6 py-4 font-medium text-foreground">{item.product_name}</td>
                    <td className="px-6 py-4">
                      <span className="badge bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {editId === item.id ? (
                        <input
                          type="number"
                          value={editStock}
                          onChange={(e) => setEditStock(e.target.value)}
                          className="input w-20 h-8"
                          autoFocus
                        />
                      ) : (
                        <span className={`badge ${
                          item.stock < 5 
                            ? 'bg-red-50 text-red-700 border-red-200' 
                            : 'bg-green-50 text-green-700 border-green-200'
                        }`}>
                          {item.stock} Unit
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center text-muted-foreground">{item.qty_sales || 0}</td>
                    <td className="px-6 py-4 text-center text-muted-foreground">{item.qty_purchases || 0}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {editId === item.id ? (
                          <button
                            onClick={() => saveEdit(item.id)}
                            className="btn btn-primary h-8 px-3 text-xs"
                          >
                            Simpan
                          </button>
                        ) : (
                          <button
                            onClick={() => startEdit(item)}
                            className="p-2 hover:bg-muted rounded-md text-muted-foreground hover:text-primary transition-colors"
                            title="Edit Stok"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleSale(item.id)}
                          className="p-2 hover:bg-orange-50 rounded-md text-muted-foreground hover:text-orange-600 transition-colors"
                          title="Jual"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRestock(item.id)}
                          className="p-2 hover:bg-green-50 rounded-md text-muted-foreground hover:text-green-600 transition-colors"
                          title="Restock"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-border flex items-center justify-between bg-muted/10">
          <p className="text-sm text-muted-foreground">
            Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredItems.length)} dari {filteredItems.length} item
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium">
              Halaman {currentPage} dari {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
