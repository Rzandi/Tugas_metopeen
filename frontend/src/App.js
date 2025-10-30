import React, { useEffect, useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, XCircle, Server, Database } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState(null);
  const [statusChecks, setStatusChecks] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const { toast } = useToast();

  const checkApiHealth = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/`);
      setApiStatus({
        status: 'success',
        message: response.data.message
      });
      toast({
        title: "✅ API Connected",
        description: "Backend is running smoothly",
      });
    } catch (e) {
      console.error(e, `errored out requesting / api`);
      setApiStatus({
        status: 'error',
        message: e.message
      });
      toast({
        title: "❌ API Error",
        description: "Failed to connect to backend",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStatusChecks = async () => {
    try {
      setLoadingStatus(true);
      const response = await axios.get(`${API}/status`);
      setStatusChecks(response.data);
    } catch (e) {
      console.error("Error fetching status checks:", e);
      toast({
        title: "Error",
        description: "Failed to fetch status checks",
        variant: "destructive"
      });
    } finally {
      setLoadingStatus(false);
    }
  };

  const createStatusCheck = async () => {
    try {
      const response = await axios.post(`${API}/status`, {
        client_name: `User_${Math.floor(Math.random() * 1000)}`
      });
      toast({
        title: "✅ Status Created",
        description: `Created check for ${response.data.client_name}`,
      });
      // Refresh the list
      fetchStatusChecks();
    } catch (e) {
      console.error("Error creating status check:", e);
      toast({
        title: "❌ Error",
        description: "Failed to create status check",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    checkApiHealth();
    fetchStatusChecks();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Toaster />
      
      {/* Header - Mobile Responsive */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-3xl"></div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="flex flex-col items-center justify-center space-y-6 sm:space-y-8">
            <a
              href="https://emergent.sh"
              target="_blank"
              rel="noopener noreferrer"
              className="transform hover:scale-105 transition-transform duration-300"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-50"></div>
                <img 
                  src="https://avatars.githubusercontent.com/in/1201222?s=120&u=2686cf91179bbafbc7a71bfbc43004cf9ae1acea&v=4" 
                  alt="Emergent Logo"
                  className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-2xl shadow-2xl"
                />
              </div>
            </a>
            
            <div className="text-center space-y-3 sm:space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white">
                Building something{" "}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  incredible
                </span>{" "}
                ~!
              </h1>
              <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-4">
                Full-stack application with FastAPI, React, and MongoDB
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Mobile Responsive */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
          
          {/* API Status Card */}
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-slate-700/50 shadow-xl">
            <div className="flex items-center justify-between mb-4 sm:mb-6 flex-wrap gap-3">
              <div className="flex items-center space-x-3">
                <Server className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">API Status</h2>
              </div>
              
              {loading ? (
                <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 animate-spin" />
              ) : apiStatus?.status === 'success' ? (
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
              ) : (
                <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
              )}
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-6 sm:py-8">
                <div className="text-center space-y-3">
                  <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-purple-400 animate-spin mx-auto" />
                  <p className="text-slate-400 text-sm sm:text-base">Checking API health...</p>
                </div>
              </div>
            ) : (
              <div className={`p-3 sm:p-4 rounded-lg ${
                apiStatus?.status === 'success' 
                  ? 'bg-green-500/10 border border-green-500/20' 
                  : 'bg-red-500/10 border border-red-500/20'
              }`}>
                <p className={`font-medium text-sm sm:text-base ${
                  apiStatus?.status === 'success' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {apiStatus?.message || 'Unknown status'}
                </p>
              </div>
            )}
          </div>

          {/* Status Checks Management */}
          <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-slate-700/50 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
              <div className="flex items-center space-x-3">
                <Database className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Status Checks</h2>
              </div>
              
              <button
                onClick={createStatusCheck}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
              >
                + Create Check
              </button>
            </div>
            
            {loadingStatus ? (
              <div className="flex items-center justify-center py-8 sm:py-12">
                <div className="text-center space-y-3">
                  <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-purple-400 animate-spin mx-auto" />
                  <p className="text-slate-400 text-sm sm:text-base">Loading status checks...</p>
                </div>
              </div>
            ) : statusChecks.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <p className="text-slate-400 text-sm sm:text-base">No status checks yet. Create one to get started!</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4 max-h-96 overflow-y-auto">
                {statusChecks.map((check) => (
                  <div
                    key={check.id}
                    className="bg-slate-700/30 rounded-lg p-3 sm:p-4 border border-slate-600/50 hover:border-purple-500/50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
                        <span className="text-white font-medium text-sm sm:text-base break-all">
                          {check.client_name}
                        </span>
                      </div>
                      <span className="text-slate-400 text-xs sm:text-sm">
                        {new Date(check.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Footer - Mobile Responsive */}
      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 text-center">
        <p className="text-slate-400 text-xs sm:text-sm">
          Made with ❤️ using FastAPI, React, and MongoDB
        </p>
      </footer>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
