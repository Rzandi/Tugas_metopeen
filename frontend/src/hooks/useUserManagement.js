import { useState, useEffect } from 'react';
import { getUsers, saveUsers } from '../utils/storage';

export function useUserManagement(userRole) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userRole === 'owner') {
      setUsers(getUsers());
    }
    setIsLoading(false);
  }, [userRole]);

  const deleteUser = async (username) => {
    const allUsers = getUsers();
    const filteredUsers = allUsers.filter(u => u.username !== username);
    await saveUsers(filteredUsers);
    setUsers(filteredUsers);
    return true;
  };

  const updateUser = async (username, updates) => {
    const allUsers = getUsers();
    const userIndex = allUsers.findIndex(u => u.username === username);
    if (userIndex === -1) return false;

    allUsers[userIndex] = { ...allUsers[userIndex], ...updates };
    await saveUsers(allUsers);
    setUsers(allUsers);
    return true;
  };

  return {
    users,
    isLoading,
    deleteUser,
    updateUser
  };
}