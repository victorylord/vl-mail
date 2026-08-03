
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


router.post('/register', async (req, res) => {
    try {
        const { full_name, email, phone_number, password } = req.body;

        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { phone_number: phone_number }
                ]
            }
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email or phone already exists'
            });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Create the user
        const newUser = await prisma.user.create({
            data: {
                full_name,
                email,
                phone_number,
                password_hash,
                is_phone_verified: false // Will verify later via OTP
            }
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully! Please verify your phone.',
            user: {
                id: newUser.id,
                full_name: newUser.full_name,
                email: newUser.email,
                phone_number: newUser.phone_number
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
});

module.exports = router;