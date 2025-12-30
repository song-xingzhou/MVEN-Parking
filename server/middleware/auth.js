'use strict';

const jwt = require('jsonwebtoken');
const User = require('../models/user_schema');

// 保护路由中间件
const protect = async (req, res, next) => {
    let token;

    // 从请求头获取token
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    // 检查token是否存在
    if (!token) {
        return res.status(401).json({
            success: false,
            message: '未授权访问，请先登录',
        });
    }

    try {
        // 验证token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 查找用户
        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: '用户不存在',
            });
        }

        next();
    } catch (err) {
        console.error('Auth middleware error:', err);
        return res.status(401).json({
            success: false,
            message: 'Token无效或已过期',
        });
    }
};

// 角色授权中间件
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `角色 ${req.user.role} 无权访问此资源`,
            });
        }
        next();
    };
};

module.exports = { protect, authorize };
