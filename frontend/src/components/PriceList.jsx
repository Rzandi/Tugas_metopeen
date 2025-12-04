import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import priceListService from '../services/priceListService';
import PriceListOverview from './PriceListOverview';

const PriceList = ({ token }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editStock, setEditStock] = useState(0);
  
  // New features state
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const data = await priceListService.getPriceList(token);
      setItems(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch price list');
      setLoading(false);
    }
  };

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

  // Filter Logic
  const filteredItems = items.filter(item => {
    const matchesSearch = item.product_name.toLowerCase().includes(search.toLowerCase()) || 
                          item.product_id.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...new Set(items.map(item => item.category))];
  const lowStockItems = items.filter(i => i.stock < 5).length;

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
  
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white tracking-tight">Daftar Barang</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Kelola inventaris dan harga barang</p>
        </div>
      </div>

      <PriceListOverview items={items} />

      {/* Stock Alert Banner */}
      {lowStockItems > 0 && (
        <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 rounded-r-lg flex items-center gap-3">
          <div className="p-2 bg-orange-100 dark:bg-orange-900/40 rounded-full text-orange-600 dark:text-orange-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          </div>
          <div>
            <h4 className="font-bold text-base text-orange-800 dark:text-orange-300">⚠️ Peringatan Stok Menipis!</h4>
            <p className="text-sm font-semibold text-orange-700 dark:text-orange-400">Ada {lowStockItems} item dengan stok di bawah 5 unit. Segera lakukan restock!</p>
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="relative w-full md:w-96">
          <svg className="absolute left-3 top-3 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input 
            placeholder="Cari nama atau kode barang..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <svg className="text-gray-400" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                categoryFilter === cat 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Kode Barang</th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Nama Barang</th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Brand</th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Stok Barang</th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Qty Penjualan</th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Qty Pembelian</th>
                <th className="py-4 px-6 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredItems.map((item, index) => (
                <motion.tr 
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors duration-200"
                >
                  <td className="py-4 px-6 text-sm font-medium text-gray-900 dark:text-gray-200 whitespace-nowrap">{item.product_id}</td>
                  <td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-300 font-medium">{item.product_name}</td>
                  <td className="py-4 px-6 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm whitespace-nowrap">
                    {editId === item.id ? (
                      <input
                        type="number"
                        value={editStock}
                        onChange={(e) => setEditStock(e.target.value)}
                        className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg px-3 py-1 w-24 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        autoFocus
                      />
                    ) : (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.stock < 5 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                          : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      }`}>
                        {item.stock} Unit
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap font-semibold">
                    {item.qty_sales || 0}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap font-semibold">
                    {item.qty_purchases || 0}
                  </td>
                  <td className="py-4 px-6 text-sm space-x-2 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {editId === item.id ? (
                        <button
                          onClick={() => saveEdit(item.id)}
                          className="bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition-colors text-xs font-medium shadow-sm"
                        >
                          Simpan
                        </button>
                      ) : (
                        <button
                          onClick={() => startEdit(item)}
                          className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors p-1"
                          title="Edit Stok"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                      )}
                      <button
                        onClick={() => handleSale(item.id)}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg transition-all text-xs font-medium shadow-sm hover:shadow-md flex items-center gap-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        Jual
                      </button>
                      <button
                        onClick={() => handleRestock(item.id)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg transition-all text-xs font-medium shadow-sm hover:shadow-md flex items-center gap-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        Restock
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PriceList;
