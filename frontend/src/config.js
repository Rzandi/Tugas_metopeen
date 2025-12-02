const config = {
    apiUrl: window.location.hostname === 'localhost' 
        ? 'http://localhost:8000/api'
        : 'https://tugasmetopeen-production.up.railway.app/api' // Update ini dengan URL API production Anda
};

export default config;