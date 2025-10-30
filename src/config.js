const config = {
    apiUrl: window.location.hostname === 'localhost' 
        ? 'http://localhost:3000/api'
        : 'https://your-production-api.com/api' // Update ini dengan URL API production Anda
};

export default config;