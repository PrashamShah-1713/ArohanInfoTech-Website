const express = require('express');
const router = express.Router();
const authMiddleware = require('../Middlewares/middleware');
const { createUser, login, getCurrentUser, updateCurrentUser, logout, sendOtp, verifyOtp, forgotPassword } = require('../controllers/authcontroller');

router.post('/', createUser);
router.post('/login', login);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/forgot-password', forgotPassword);
router.get('/me', authMiddleware, getCurrentUser);
router.patch('/profile', authMiddleware, updateCurrentUser);
router.post('/logout', authMiddleware, logout);

module.exports = router;