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

    // CORS untuk production
    app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://your-netlify-app.netlify.app', // Ganti nanti dengan URL Netlify
        process.env.CLIENT_URL
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    }));

    // Handle preflight
    app.options('*', cors());

    // Database Connection
    connectDB();

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/dashboard', dashboardRoutes);

    // Health check endpoint (PENTING untuk Railway)
    app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
    });

    // Root endpoint
    app.get('/', (req, res) => {
    res.json({ 
        message: 'Auth Server API',
        version: '1.0.0',
        status: 'running'
    });
    });

    // Gunakan PORT dari environment variable (WAJIB untuk Railway)
    const PORT = process.env.PORT || 5000;

    // Dengarkan di 0.0.0.0 (WAJIB untuk Railway)
    app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    });