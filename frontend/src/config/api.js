const config = {
    // Development
    devApiUrl: 'http://localhost:8000/api',
    
    // Production - Railway URL
    prodApiUrl: 'https://tugasmetopeen-production.up.railway.app/api',
    
    // Pilih URL berdasarkan environment
    apiUrl: process.env.NODE_ENV === 'production' 
        ? 'https://tugasmetopeen-production.up.railway.app/api'
        : 'http://localhost:8000/api'
};

export default config;