    import express from 'express';
    import { authenticateToken } from '../middleware/auth.js';

    const router = express.Router();

    router.get('/', authenticateToken, (req, res) => {
    res.json({
        message: 'Welcome to Dashboard!',
        user: req.user,
        dashboardData: {
        stats: {
            totalUsers: 150,
            activeSessions: 45,
            uptime: '99.9%'
        },
        recentActivity: [
            'User login at 10:30 AM',
            'Profile updated at 11:15 AM',
            'New feature deployed at 2:00 PM'
        ]
        }
    });
    });

    export default router;