const { Schema, model } = require('mongoose');

/**
 * 订单状态常量
 */
const ORDER_STATUS = {
    PENDING: 0, // 待支付
    PAID: 1, // 已支付
    IN_PROGRESS: 2, // 进行中（使用中）
    COMPLETED: 3, // 已完成
    CANCELLED: -1, // 已取消
    REFUNDED: -2, // 已退款
};

/**
 * 订单模型
 * 连接用户与车位的交易记录
 */
const orderSchema = new Schema(
    {
        // 订单编号（用于展示）
        orderNo: {
            type: String,
            unique: true,
        },
        // 租户（下单用户）
        renter: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, '订单必须关联租户'],
            index: true,
        },
        // 车位
        parkingSpace: {
            type: Schema.Types.ObjectId,
            ref: 'ParkingSpace',
            required: [true, '订单必须关联车位'],
            index: true,
        },
        // 车位所有者（冗余存储，便于查询）
        spaceOwner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        // 预约开始时间
        startTime: {
            type: Date,
            required: [true, '请选择开始时间'],
        },
        // 预约结束时间
        endTime: {
            type: Date,
            required: [true, '请选择结束时间'],
        },
        // 实际使用时间
        actualStartTime: Date,
        actualEndTime: Date,
        // 计费类型
        billingType: {
            type: String,
            enum: ['hourly', 'daily', 'monthly'],
            default: 'hourly',
        },
        // 单价（下单时的价格快照）
        unitPrice: {
            type: Number,
            required: true,
            min: 0,
        },
        // 计费数量（小时数/天数/月数）
        quantity: {
            type: Number,
            required: true,
            min: 0,
        },
        // 原始金额
        originalPrice: {
            type: Number,
            required: true,
            min: 0,
        },
        // 折扣金额
        discountAmount: {
            type: Number,
            default: 0,
            min: 0,
        },
        // 实际支付金额
        totalPrice: {
            type: Number,
            required: [true, '订单金额不能为空'],
            min: 0,
        },
        // 订单状态
        status: {
            type: Number,
            enum: Object.values(ORDER_STATUS),
            default: ORDER_STATUS.PENDING,
            index: true,
        },
        // 支付信息
        payment: {
            method: {
                type: String,
                enum: ['wechat', 'alipay', 'balance', 'none'],
            },
            transactionId: String, // 第三方交易号
            paidAt: Date,
        },
        // 车辆信息
        vehicleInfo: {
            plateNumber: String, // 车牌号
            vehicleType: String, // 车型
        },
        // 取消信息
        cancellation: {
            reason: String,
            cancelledBy: {
                type: String,
                enum: ['renter', 'owner', 'system', 'admin'],
            },
            cancelledAt: Date,
            refundAmount: Number,
        },
        // 备注
        renterRemark: String, // 租户备注
        ownerRemark: String, // 车位主备注
        // 是否已评价
        isReviewed: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// 虚拟字段：订单评价
orderSchema.virtual('comment', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'order',
    justOne: true,
});

// 生成订单编号
orderSchema.pre('save', async function () {
    if (!this.orderNo) {
        const timestamp = Date.now().toString();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        this.orderNo = `PK${timestamp}${random}`;
    }
});

// 索引
orderSchema.index({ orderNo: 1 });
orderSchema.index({ renter: 1, status: 1 });
orderSchema.index({ spaceOwner: 1, status: 1 });
orderSchema.index({ parkingSpace: 1, startTime: 1, endTime: 1 });
orderSchema.index({ createdAt: -1 });

// 静态方法：检查时间段是否冲突
orderSchema.statics.checkTimeConflict = async function (
    parkingSpaceId,
    startTime,
    endTime,
    excludeOrderId = null
) {
    const query = {
        parkingSpace: parkingSpaceId,
        status: { $in: [ORDER_STATUS.PAID, ORDER_STATUS.IN_PROGRESS] },
        $or: [
            { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
        ],
    };

    if (excludeOrderId) {
        query._id = { $ne: excludeOrderId };
    }

    const conflictOrder = await this.findOne(query);
    return !!conflictOrder;
};

// 导出状态常量
module.exports = model('Order', orderSchema);
module.exports.ORDER_STATUS = ORDER_STATUS;
