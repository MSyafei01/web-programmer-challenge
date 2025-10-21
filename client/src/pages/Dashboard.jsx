    import React, { useState, useEffect } from 'react';
    import { useAuth } from '../hooks/useAuth';
    import axios from 'axios';

    const Dashboard = () => {
    const { user, logout } = useAuth();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
        const response = await axios.get('/api/dashboard');
        setDashboardData(response.data.dashboardData);
        } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        } finally {
        setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
    };

    if (loading) {
        return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                Welcome back, {user?.username || user?.email}!
                </p>
            </div>
            <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
                Logout
            </button>
            </div>

            {/* Stats Grid */}
            {dashboardData && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Total Users
                </h3>
                <p className="text-3xl font-bold text-blue-600">
                    {dashboardData.stats.totalUsers}
                </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Active Sessions
                </h3>
                <p className="text-3xl font-bold text-green-600">
                    {dashboardData.stats.activeSessions}
                </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    System Uptime
                </h3>
                <p className="text-3xl font-bold text-purple-600">
                    {dashboardData.stats.uptime}
                </p>
                </div>
            </div>
            )}

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recent Activity
                </h2>
            </div>
            <div className="p-6">
                <ul className="space-y-3">
                {dashboardData?.recentActivity.map((activity, index) => (
                    <li key={index} className="flex items-center text-gray-700 dark:text-gray-300">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    {activity}
                    </li>
                ))}
                </ul>
            </div>
            </div>

