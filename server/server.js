    import express from 'express';
    import cors from 'cors';
    import cookieParser from 'cookie-parser';
    import authRoutes from './routes/auth.js';
    import dashboardRoutes from './routes/dashboard.js';
    import { connectDB } from './config/database.js';

    const app = express();

    // Middleware
    app.use(express.json());
    app.use(cookieParser());
    app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
    }));

    // Database Connection
    connectDB();

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/dashboard', dashboardRoutes);

    // Health check
    app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    });