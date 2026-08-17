// routes/authRoutes.js
console.log('🔐 Loading auth routes...');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendOTP, generateOTP } = require('../utils/telegram');


router.post('/register', async (req, res) => {
    console.log('📝 Registration request received:', req.body.email);
    
    try {
        const { full_name, email, password } = req.body;
        
        // Log received data (excluding password)
        console.log('  Full Name:', full_name);
        console.log('  Email:', email);
        
        // ... rest of your registration code
    } catch (error) {
        console.error('❌ Registration error:', error.message);
        console.error('Stack:', error.stack);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error during registration'
        });
    }
});

router.post('/send-telegram-otp', async (req, res) => {
    try {
        const { email, telegram_username } = req.body;

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found. Please register first.'
            });
        }

        if (user.is_phone_verified) {
            return res.status(400).json({
                success: false,
                message: 'Account already verified.'
            });
        }

        
        const otp = generateOTP();
        const otp_expiry = new Date(Date.now() + 5 * 60000);

        
        await prisma.user.update({
            where: { id: user.id },
            data: {
                telegram_username: telegram_username.replace('@', ''),
                otp_code: otp,
                otp_expiry: otp_expiry
            }
        });

        
        await sendOTP(telegram_username, otp);

        res.status(200).json({
            success: true,
            message: 'Verification code sent to your Telegram!'
        });

    } catch (error) {
        console.error('Send Telegram OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send verification code. Make sure your Telegram username is correct.'
        });
    }
});


router.post('/verify-telegram-otp', async (req, res) => {
    try {
        const { email, otp_code } = req.body;

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }

        if (user.is_phone_verified) {
            return res.status(400).json({
                success: false,
                message: 'Account already verified.'
            });
        }

        if (user.otp_code !== otp_code) {
            return res.status(400).json({
                success: false,
                message: 'Invalid verification code.'
            });
        }

        if (new Date() > new Date(user.otp_expiry)) {
            return res.status(400).json({
                success: false,
                message: 'Verification code expired. Please request a new one.'
            });
        }

        // Mark as verified
        await prisma.user.update({
            where: { id: user.id },
            data: {
                is_phone_verified: true,
                is_verified: true,
                otp_code: null,
                otp_expiry: null
            }
        });

        res.status(200).json({
            success: true,
            message: 'Account verified successfully! Welcome to VL Mail.'
        });

    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to verify account.'
        });
    }
});

module.exports = router;