    import mysql from 'mysql2/promise';
    import bcrypt from 'bcryptjs';

    const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'auth_app'
    };

    export const connectDB = async () => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('MySQL Connected...');
        
        // Create users table if not exists
        await connection.execute(`
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            username VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        `);
        
        // Create default admin user
        const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', ['admin@javisteknologi.com']);
        if (rows.length === 0) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await connection.execute(
            'INSERT INTO users (email, username, password) VALUES (?, ?, ?)',
            ['admin@javisteknologi.com', 'admin', hashedPassword]
        );
        console.log('Default admin user created');
        }
        
        return connection;
    } catch (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    }
    };

    export const getDB = () => mysql.createPool(dbConfig);