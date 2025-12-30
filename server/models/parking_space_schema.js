const { Schema, model } = require('mongoose');

/**
 * 车位模型
 * 存储车位信息，包含地理位置（GeoJSON格式）支持附近搜索
 */
const parkingSpaceSchema = new Schema(
    {
        // 所属用户（车位发布者）
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, '车位必须关联用户'],
            index: true,
        },
        // 车位标题
        title: {
            type: String,
            required: [true, '请输入车位标题'],
            trim: true,
            maxlength: [50, '标题最多50个字符'],
        },
        // 车位描述
        description: {
            type: String,
            trim: true,
            maxlength: [500, '描述最多500个字符'],
        },
        // 地理位置 (GeoJSON格式，支持MongoDB地理空间查询)
        location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point',
            },
            coordinates: {
                type: [Number], // [经度, 纬度]
                required: [true, '请提供车位坐标'],
                index: '2dsphere',
            },
        },
        // 详细地址
        address: {
            province: { type: String, trim: true },
            city: { type: String, trim: true },
            district: { type: String, trim: true },
            street: { type: String, trim: true },
            detail: {
                type: String,
                required: [true, '请输入详细地址'],
                trim: true,
            },
        },
        // 车位图片列表
        images: {
            type: [String],
            validate: {
                validator: function (v) {
                    return v.length <= 9;
                },
                message: '最多上传9张图片',
            },
        },
        // 价格设置
        pricePerHour: {
            type: Number,
            required: [true, '请设置每小时价格'],
            min: [0, '价格不能为负数'],
        },
        pricePerDay: {
            type: Number,
            min: [0, '价格不能为负数'],
        },
        pricePerMonth: {
            type: Number,
            min: [0, '价格不能为负数'],
        },
        // 可用时间段
        availableTimeSlots: [
            {
                dayOfWeek: {
                    type: Number, // 0-6 代表周日到周六
                    min: 0,
                    max: 6,
                },
                startTime: String, // "08:00"
                endTime: String, // "18:00"
            },
        ],
        // 车位状态
        status: {
            type: String,
            enum: {
                values: ['available', 'occupied', 'offline', 'pending'],
                message: '无效的车位状态',
            },
            default: 'pending', // 默认待审核
            index: true,
        },
        // 车位类型
        spaceType: {
            type: String,
            enum: ['indoor', 'outdoor', 'underground', 'rooftop'],
            default: 'outdoor',
        },
        // 车位尺寸（适合车型）
        sizeType: {
            type: String,
            enum: ['small', 'medium', 'large', 'xlarge'],
            default: 'medium',
        },
        // 配套设施
        facilities: {
            hasCharger: { type: Boolean, default: false }, // 有充电桩
            hasSurveillance: { type: Boolean, default: false }, // 有监控
            hasLighting: { type: Boolean, default: false }, // 有照明
            hasRoof: { type: Boolean, default: false }, // 有顶棚
        },
        // 统计数据
        stats: {
            viewCount: { type: Number, default: 0 },
            orderCount: { type: Number, default: 0 },
            totalRevenue: { type: Number, default: 0 },
            avgRating: { type: Number, default: 0, min: 0, max: 5 },
            reviewCount: { type: Number, default: 0 },
        },
        // 是否被管理员审核通过
        isApproved: {
            type: Boolean,
            default: false,
        },
        approvedAt: Date,
        approvedBy: {
            type: Schema.Types.ObjectId,
            ref: 'Admin',
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// 虚拟字段：车位的订单
parkingSpaceSchema.virtual('orders', {
    ref: 'Order',
    localField: '_id',
    foreignField: 'parkingSpace',
    justOne: false,
});

// 虚拟字段：车位的评价
parkingSpaceSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'parkingSpace',
    justOne: false,
});

// 2dsphere索引用于地理位置查询
parkingSpaceSchema.index({ location: '2dsphere' });
parkingSpaceSchema.index({ status: 1, isApproved: 1 });
parkingSpaceSchema.index({ pricePerHour: 1 });
parkingSpaceSchema.index({ 'stats.avgRating': -1 });

// 静态方法：查找附近的车位
parkingSpaceSchema.statics.findNearby = function (
    longitude,
    latitude,
    maxDistance = 5000 // 默认5公里
) {
    return this.find({
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [longitude, latitude],
                },
                $maxDistance: maxDistance,
            },
        },
        status: 'available',
        isApproved: true,
    });
};

module.exports = model('ParkingSpace', parkingSpaceSchema);
