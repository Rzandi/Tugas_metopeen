export function saveUserToStorage(user) {
  localStorage.setItem('activeUser', JSON.stringify(user));
}

export function loadUserFromStorage() {
  const userJson = localStorage.getItem('activeUser');
  return userJson ? JSON.parse(userJson) : null;
}

export function getUsers() {
  const usersJson = localStorage.getItem('users');
  if (!usersJson) {
    const defaultUsers = [
      { username: 'owner', name: 'Pemilik', role: 'owner', password: 'owner123' },
      { username: 'staff', name: 'Karyawan', role: 'staff', password: 'staff123' }
    ];
    localStorage.setItem('users', JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  return JSON.parse(usersJson);
}

export function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}