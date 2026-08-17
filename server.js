// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// ===== ENVIRONMENT CHECK =====
console.log('🚀 VL Mail Server Starting...');
console.log('🔍 Environment check:');
console.log('  PORT:', process.env.PORT || '5000');
console.log('  DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ MISSING');
console.log('  TELEGRAM_BOT_TOKEN:', process.env.TELEGRAM_BOT_TOKEN ? '✅ Set' : '❌ MISSING');
console.log('  NODE_ENV:', process.env.NODE_ENV || 'development');

const app = express();

// ===== MIDDLEWARE =====
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===== REQUEST LOGGER =====
app.use((req, res, next) => {
    console.log(`📝 ${req.method} ${req.path}`);
    next();
});

// ===== STATIC FILES =====
app.use(express.static(path.join(__dirname, 'frontend')));

// ===== HEALTH CHECK =====
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        env: {
            database: !!process.env.DATABASE_URL,
            telegram: !!process.env.TELEGRAM_BOT_TOKEN
        }
    });
});

// ===== ROUTES =====
try {
    const authRoutes = require('./routes/authRoutes');
    app.use('/api/auth', authRoutes);
    console.log('✅ Auth routes loaded');
} catch (err) {
    console.error('❌ Failed to load auth routes:', err.message);
}

// ===== FRONTEND ROUTES =====
app.get('/', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
    } catch (err) {
        console.error('❌ Error serving index.html:', err.message);
        res.status(500).send('Error loading page');
    }
});

app.get('*', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
    } catch (err) {
        console.error('❌ Error serving fallback:', err.message);
        res.status(404).send('Page not found');
    }
});

// ===== ERROR HANDLING =====
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });
    
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log('='.repeat(50));
    console.log(`✅ VL Mail running on http://localhost:${PORT}`);
    console.log('='.repeat(50));
});

// ===== UNHANDLED REJECTIONS =====
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err.message);
    console.error('Stack:', err.stack);
});

module.exports = app;