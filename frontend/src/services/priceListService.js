import axios from 'axios';
import config from '../config/api';

const API_URL = `${config.apiUrl}/price-list`;

const getPriceList = async (token) => {
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
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
