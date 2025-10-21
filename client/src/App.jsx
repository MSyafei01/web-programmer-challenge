    import React from 'react';
    import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
    import { AuthProvider, useAuth } from './hooks/useAuth';
    import Login from './pages/Login';
    import Dashboard from './pages/Dashboard';
    import Layout from './components/Layout';

    const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) {
        return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        );
    }
    
    return isAuthenticated ? children : <Navigate to="/login" />;
    };

    function App() {
    return (
        <AuthProvider>
        <Router>
            <Layout>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route 
                path="/dashboard" 
                element={
                    <ProtectedRoute>
                    <Dashboard />
                    </ProtectedRoute>
                } 
                />
                <Route path="/" element={<Navigate to="/dashboard" />} />
            </Routes>
            </Layout>
        </Router>
        </AuthProvider>
    );
    }

    export default App;