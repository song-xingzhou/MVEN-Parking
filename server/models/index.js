/**
 * 数据库模型统一导出
 * 个人停车位共享服务平台
 */

const User = require('./user_schema');
const ParkingSpace = require('./parking_space_schema');
const Order = require('./order_schema');
const Comment = require('./comment_schema');
const Admin = require('./admin_schema');

// 订单状态常量
const { ORDER_STATUS } = require('./order_schema');

module.exports = {
    User,
    ParkingSpace,
    Order,
    Comment,
    Admin,
    ORDER_STATUS,
};
