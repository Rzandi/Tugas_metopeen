import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PriceListOverview = ({ items }) => {
  // Calculate stock distribution by category
  const data = items.reduce((acc, item) => {
    const existing = acc.find(x => x.name === item.category);
    if (existing) {
      existing.value += item.stock;
    } else {
      acc.push({ name: item.category, value: item.stock });
    }
    return acc;
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  const lowStockCount = items.filter(item => item.stock < 5).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Distribusi Stok per Kategori</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                itemStyle={{ color: '#374151' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-center items-center text-center transition-colors duration-300">
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Peringatan Stok Menipis</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Barang dengan stok kurang dari 5</p>
        <span className="text-4xl font-bold text-red-500 mt-4">{lowStockCount}</span>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Item perlu restock segera</p>
      </div>
    </div>
  );
};

export default PriceListOverview;
