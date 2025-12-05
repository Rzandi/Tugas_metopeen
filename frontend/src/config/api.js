const config = {
    // Development
    devApiUrl: 'http://localhost:8000/api',
    
    // Production - Railway URL
    prodApiUrl: 'https://tugasmetopeen-production.up.railway.app/api',
    
    // Pilih URL berdasarkan environment
    // Use import.meta.env for Vite, not process.env
    apiUrl: import.meta.env.VITE_BACKEND_URL || 
        (import.meta.env.PROD 
            ? 'https://tugasmetopeen-production.up.railway.app/api'
            : 'http://localhost:8000/api')
};

export default config;