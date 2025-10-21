    import request from 'supertest';
    import express from 'express';
    import authRoutes from '../routes/auth.js';

    const app = express();
    app.use(express.json());
    app.use('/api/auth', authRoutes);

    describe('Auth API Tests', () => {
    it('should validate required fields', async () => {
        const response = await request(app)
        .post('/api/auth/login')
        .send({});
        
        expect(response.status).toBe(400);
        expect(response.body.error).toContain('required');
    });

    it('should validate email format', async () => {
        const response = await request(app)
        .post('/api/auth/login')
        .send({
            email: 'invalid-email',
            password: 'password123'
        });
        
        expect(response.status).toBe(400);
        expect(response.body.error).toContain('Invalid email format');
    });
    });