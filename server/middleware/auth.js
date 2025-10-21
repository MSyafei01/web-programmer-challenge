    import jwt from 'jsonwebtoken';

    export const authenticateToken = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token.' });
    }
    };

    export const rateLimit = (windowMs = 15 * 60 * 1000, max = 5) => {
    const attempts = new Map();
    
    return (req, res, next) => {
        const ip = req.ip;
        const now = Date.now();
        const windowStart = now - windowMs;
        
        if (!attempts.has(ip)) {
        attempts.set(ip, []);
        }
        
        const ipAttempts = attempts.get(ip).filter(time => time > windowStart);
        attempts.set(ip, ipAttempts);
        
        if (ipAttempts.length >= max) {
        return res.status(429).json({ 
            error: 'Too many login attempts. Please try again later.' 
        });
        }
        
        ipAttempts.push(now);
        next();
    };
    };