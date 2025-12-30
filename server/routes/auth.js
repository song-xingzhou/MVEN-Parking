const express = require('express');
const {
    register,
    login,
    getMe,
    logout,
    updatePassword,
} = require('../controllers/auth_controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

// 公开路由
router.post('/register', register);
router.post('/login', login);

// 需要认证的路由
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.put('/updatepassword', protect, updatePassword);

module.exports = router;
