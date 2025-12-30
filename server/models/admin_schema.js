const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * 管理员模型
 * 后台管理人员
 */
const adminSchema = new Schema(
    {
        // 用户名
        username: {
            type: String,
            required: [true, '用户名不能为空'],
            unique: true,
            trim: true,
            minlength: [3, '用户名至少3个字符'],
            maxlength: [20, '用户名最多20个字符'],
        },
        // 密码
        password: {
            type: String,
            required: [true, '密码不能为空'],
            minlength: [6, '密码至少6个字符'],
            select: false,
        },
        // 真实姓名
        realName: {
            type: String,
            trim: true,
        },
        // 邮箱
        email: {
            type: String,
            unique: true,
            sparse: true,
            lowercase: true,
            trim: true,
        },
        // 手机号
        phone: {
            type: String,
            trim: true,
        },
        // 头像
        avatar: {
            type: String,
            default: '',
        },
        // 角色权限
        role: {
            type: String,
            enum: {
                values: ['super_admin', 'admin', 'operator', 'auditor'],
                message: '无效的管理员角色',
            },
            default: 'operator',
        },
        // 权限列表（细粒度权限控制）
        permissions: {
            type: [String],
            enum: [
                'user:read',
                'user:write',
                'user:delete',
                'space:read',
                'space:write',
                'space:delete',
                'space:approve',
                'order:read',
                'order:write',
                'order:refund',
                'comment:read',
                'comment:delete',
                'admin:read',
                'admin:write',
                'admin:delete',
                'system:config',
                'stats:read',
            ],
            default: [],
        },
        // 账户状态
        status: {
            type: String,
            enum: ['active', 'frozen', 'deleted'],
            default: 'active',
        },
        // 最后登录时间
        lastLoginAt: Date,
        // 最后登录IP
        lastLoginIp: String,
        // 登录失败次数（用于防暴力破解）
        loginFailCount: {
            type: Number,
            default: 0,
        },
        // 账户锁定到期时间
        lockUntil: Date,
    },
    {
        timestamps: true,
    }
);

// 保存前加密密码
adminSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// 比较密码
adminSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// 检查是否被锁定
adminSchema.methods.isLocked = function () {
    return this.lockUntil && this.lockUntil > Date.now();
};

// 检查权限
adminSchema.methods.hasPermission = function (permission) {
    // 超级管理员拥有所有权限
    if (this.role === 'super_admin') return true;
    return this.permissions.includes(permission);
};

// 根据角色设置默认权限
adminSchema.pre('save', function () {
    if (this.isNew && this.permissions.length === 0) {
        switch (this.role) {
            case 'super_admin':
                // 超级管理员拥有所有权限，不需要列出
                break;
            case 'admin':
                this.permissions = [
                    'user:read',
                    'user:write',
                    'space:read',
                    'space:write',
                    'space:approve',
                    'order:read',
                    'order:write',
                    'order:refund',
                    'comment:read',
                    'comment:delete',
                    'stats:read',
                ];
                break;
            case 'auditor':
                this.permissions = [
                    'user:read',
                    'space:read',
                    'space:approve',
                    'comment:read',
                ];
                break;
            case 'operator':
            default:
                this.permissions = [
                    'user:read',
                    'space:read',
                    'order:read',
                    'comment:read',
                    'stats:read',
                ];
                break;
        }
    }
});

// 索引
adminSchema.index({ role: 1 });
adminSchema.index({ status: 1 });

module.exports = model('Admin', adminSchema);
