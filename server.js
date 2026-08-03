// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); // ← Make sure this line is added

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (frontend folder) ← ADD THIS
app.use(express.static(path.join(__dirname, 'frontend')));

// Import Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Home Route - serves index.html from frontend folder ← ADD THIS
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ VL Mail is running on http://localhost:${PORT}`);
});