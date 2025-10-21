    import express from 'express';
    import bcrypt from 'bcryptjs';
    import jwt from 'jsonwebtoken';
    import validator from 'validator';
    import { getDB } from '../config/database.js';
    import { rateLimit } from '../middleware/auth.js';

    const router = express.Router();

    // Rate limiting for login attempts
    router.post('/login', rateLimit(), async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
        }

        if (!validator.isEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
        }

        const db = await getDB();
        
        // Check if user exists
        const [users] = await db.execute(
        'SELECT * FROM users WHERE email = ? OR username = ?',
        [email, email]
        );

        if (users.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = users[0];

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
        { userId: user.id, email: user.email, username: user.username },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '24h' }
        );

        // Set HttpOnly cookie
        res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        res.json({
        message: 'Login successful',
        user: {
            id: user.id,
            email: user.email,
            username: user.username
        }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
    });

    router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logout successful' });
    });

    router.get('/verify', async (req, res) => {
    try {
        const token = req.cookies.token;
        
        if (!token) {
        return res.status(401).json({ authenticated: false });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        res.json({ authenticated: true, user: decoded });
    } catch (error) {
        res.clearCookie('token');
        res.status(401).json({ authenticated: false });
    }
    });

    export default router;