const express = require('express');
const router = express.Router();
const authMiddleware = require('../Middlewares/middleware');
const { authLimiter, otpLimiter } = require('../Middlewares/security');
const { createUser, login, getCurrentUser, updateCurrentUser, logout, sendOtp, verifyOtp, forgotPassword, verifyEmail } = require('../controllers/authcontroller');

router.post('/', authLimiter, createUser);
router.post('/login', authLimiter, login);
router.post('/send-otp', otpLimiter, sendOtp);
router.post('/verify-otp', otpLimiter, verifyOtp);
router.post('/forgot-password', authLimiter, forgotPassword);
router.get('/verify-email', verifyEmail);
router.get('/me', authMiddleware, getCurrentUser);
router.patch('/profile', authMiddleware, updateCurrentUser);
router.post('/logout', authMiddleware, logout);

module.exports = router;