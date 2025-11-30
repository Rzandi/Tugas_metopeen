const API_URL = 'http://localhost:5000/api';

export const login = async (username, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Error saat login');
  }
  return data;
};

export const register = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Error saat registrasi');
  }
  return data;
};

export const getUsers = async (token) => {
  const response = await fetch(`${API_URL}/users`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Error mengambil data pengguna');
  }
  return data;
};

export const createTransaction = async (transactionData, token) => {
  const response = await fetch(`${API_URL}/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(transactionData),
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Error membuat transaksi');
  }
  return data;
};

export const getTransactions = async (token) => {
  const response = await fetch(`${API_URL}/transactions`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Error mengambil data transaksi');
  }
  return data;
};

export const updateUser = async (userId, userData, token) => {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Error memperbarui pengguna');
  }
  return data;
};

export const deleteUser = async (userId, token) => {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Error menghapus pengguna');
  }
  return data;
};