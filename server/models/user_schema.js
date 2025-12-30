const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new Schema(
  {
    // 微信相关字段（小程序登录用）
    openid: {
      type: String,
      unique: true,
      sparse: true, // 允许多个null值
      index: true,
    },
    // 基本信息
    username: {
      type: String,
      required: [true, '用户名不能为空'],
      unique: true,
      trim: true,
      minlength: [2, '用户名至少2个字符'],
      maxlength: [20, '用户名最多20个字符'],
    },
    nickname: {
      type: String,
      trim: true,
      maxlength: [30, '昵称最多30个字符'],
    },
    avatar: {
      type: String,
      default: '', // 头像URL
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, '请提供有效的邮箱地址'],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^1[3-9]\d{9}$/, '请提供有效的手机号'],
    },
    password: {
      type: String,
      minlength: [6, '密码至少6个字符'],
      select: false, // 默认查询不返回密码
    },
    // 实名认证
    isVerified: {
      type: Boolean,
      default: false,
    },
    realName: {
      type: String,
      trim: true,
    },
    idCard: {
      type: String,
      select: false, // 敏感信息默认不返回
    },
    // 钱包余额
    balance: {
      type: Number,
      default: 0,
      min: [0, '余额不能为负数'],
    },
    // 角色
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    // 账户状态
    status: {
      type: String,
      enum: ['active', 'frozen', 'banned'],
      default: 'active',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 虚拟字段：用户发布的车位
userSchema.virtual('parkingSpaces', {
  ref: 'ParkingSpace',
  localField: '_id',
  foreignField: 'owner',
  justOne: false,
});

// 虚拟字段：用户的订单
userSchema.virtual('orders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'renter',
  justOne: false,
});

// 保存前加密密码
userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// 比较密码方法
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// 索引
userSchema.index({ phone: 1 });
userSchema.index({ status: 1 });

module.exports = model('User', userSchema);
