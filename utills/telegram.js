// utils/telegram.js
const axios = require('axios');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const BOT_USERNAME = process.env.TELEGRAM_BOT_USERNAME || '@Vlmail_verification_bot';

/**
 * Send OTP via Telegram bot
 * @param {string} telegramUsername - User's Telegram username (with or without @)
 * @param {string} otp - 6-digit OTP
 * @returns {Promise} - API response
 */
async function sendOTP(telegramUsername, otp) {
    try {
        // Remove @ if present
        const cleanUsername = telegramUsername.replace('@', '');

        const message = `
🔐 **VL Mail Verification Code**

Your 6-digit verification code is:

**${otp}**

This code expires in **5 minutes**.

For your security, do not share this code with anyone.

If you didn't request this, ignore this message.
        `;

        const response = await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            chat_id: `@${cleanUsername}`,
            text: message,
            parse_mode: 'Markdown'
        });

        return response.data;
    } catch (error) {
        console.error('❌ Telegram OTP error:', error.response?.data || error.message);
        throw new Error('Failed to send verification code via Telegram');
    }
}

/**
 * Generate a random 6-digit OTP
 */
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

module.exports = { sendOTP, generateOTP };