'use strict';

const jwt = require('jsonwebtoken');
const User = require('../models/user_schema');

// 生成JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// 发送Token响应
const sendTokenResponse = (user, statusCode, res) => {
    const token = generateToken(user._id);

    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        },
    });
};

// @desc    注册用户
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 检查用户是否已存在
        const existingUser = await User.findOne({
            $or: [{ email }, { username }],
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: existingUser.email === email ? '邮箱已被注册' : '用户名已存在',
            });
        }

        // 创建用户
        const user = await User.create({
            username,
            email,
            password,
        });

        sendTokenResponse(user, 201, res);
    } catch (err) {
        console.error('Register error:', err);
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map((e) => e.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', '),
            });
        }
        res.status(500).json({
            success: false,
            message: '服务器错误',
        });
    }
};

// @desc    用户登录
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 验证邮箱和密码
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: '请提供邮箱和密码',
            });
        }

        // 查找用户并包含密码字段
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: '邮箱或密码错误',
            });
        }

        // 检查密码
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: '邮箱或密码错误',
            });
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({
            success: false,
            message: '服务器错误',
        });
    }
};

// @desc    获取当前登录用户
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
            },
        });
    } catch (err) {
        console.error('GetMe error:', err);
        res.status(500).json({
            success: false,
            message: '服务器错误',
        });
    }
};

// @desc    登出用户
// @route   POST /api/auth/logout
// @access  Private
const logout = (req, res) => {
    res.status(200).json({
        success: true,
        message: '登出成功',
    });
};

// @desc    更新密码
// @route   PUT /api/auth/updatepassword
// @access  Private
const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id).select('+password');

        // 检查当前密码
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: '当前密码错误',
            });
        }

        user.password = newPassword;
        await user.save();

        sendTokenResponse(user, 200, res);
    } catch (err) {
        console.error('UpdatePassword error:', err);
        res.status(500).json({
            success: false,
            message: '服务器错误',
        });
    }
};

module.exports = {
    register,
    login,
    getMe,
    logout,
    updatePassword,
};
