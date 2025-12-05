import axios from 'axios';
import config from '../config/api';

console.log('[DEBUG] Config apiUrl:', config.apiUrl);
// TEMPORARY FIX: Hardcode URL to bypass config issue
const API_URL = 'https://tugasmetopeen-production.up.railway.app/api/price-list';
console.log('[DEBUG] PriceList API_URL:', API_URL);

const getPriceList = async (token) => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data; // Updated to handle { success, data } format
};

const updateItem = async (id, data, token) => {
  const response = await axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const saleItem = async (id, quantity, token) => {
  const response = await axios.post(`${API_URL}/${id}/sale`, { quantity }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const restockItem = async (id, quantity, token) => {
  const response = await axios.post(`${API_URL}/${id}/restock`, { quantity }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export default {
  getPriceList,
  updateItem,
  saleItem,
  restockItem,
};
