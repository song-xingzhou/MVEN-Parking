const { Schema, model } = require('mongoose');

/**
 * 评价模型
 * 交易完成后的用户反馈
 */
const commentSchema = new Schema(
    {
        // 关联订单（一对一）
        order: {
            type: Schema.Types.ObjectId,
            ref: 'Order',
            required: [true, '评价必须关联订单'],
            unique: true, // 一个订单只能有一条评价
            index: true,
        },
        // 评论者（租户）
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, '评价必须关联用户'],
            index: true,
        },
        // 被评车位
        parkingSpace: {
            type: Schema.Types.ObjectId,
            ref: 'ParkingSpace',
            required: [true, '评价必须关联车位'],
            index: true,
        },
        // 车位所有者（便于查询收到的评价）
        spaceOwner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        // 综合评分 (1-5星)
        rating: {
            type: Number,
            required: [true, '请选择评分'],
            min: [1, '评分最低1星'],
            max: [5, '评分最高5星'],
        },
        // 细分评分
        detailedRatings: {
            location: { type: Number, min: 1, max: 5 }, // 位置便利性
            accuracy: { type: Number, min: 1, max: 5 }, // 描述准确性
            safety: { type: Number, min: 1, max: 5 }, // 安全性
            value: { type: Number, min: 1, max: 5 }, // 性价比
        },
        // 评论内容
        content: {
            type: String,
            trim: true,
            maxlength: [500, '评论内容最多500字符'],
        },
        // 评论图片
        images: {
            type: [String],
            validate: {
                validator: function (v) {
                    return v.length <= 6;
                },
                message: '最多上传6张图片',
            },
        },
        // 标签
        tags: {
            type: [String],
            enum: [
                '位置便利',
                '停车方便',
                '环境整洁',
                '安全可靠',
                '价格实惠',
                '沟通顺畅',
                '设施完善',
                '推荐',
            ],
        },
        // 是否匿名
        isAnonymous: {
            type: Boolean,
            default: false,
        },
        // 车位主回复
        reply: {
            content: String,
            repliedAt: Date,
        },
        // 状态
        status: {
            type: String,
            enum: ['visible', 'hidden', 'deleted'],
            default: 'visible',
        },
        // 是否置顶（管理员操作）
        isPinned: {
            type: Boolean,
            default: false,
        },
        // 点赞数
        likeCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// 索引
commentSchema.index({ parkingSpace: 1, createdAt: -1 });
commentSchema.index({ user: 1, createdAt: -1 });
commentSchema.index({ rating: 1 });

// 保存后更新车位的平均评分
commentSchema.post('save', async function () {
    const ParkingSpace = require('./parking_space_schema');

    const stats = await this.model('Comment').aggregate([
        { $match: { parkingSpace: this.parkingSpace, status: 'visible' } },
        {
            $group: {
                _id: '$parkingSpace',
                avgRating: { $avg: '$rating' },
                reviewCount: { $sum: 1 },
            },
        },
    ]);

    if (stats.length > 0) {
        await ParkingSpace.findByIdAndUpdate(this.parkingSpace, {
            'stats.avgRating': Math.round(stats[0].avgRating * 10) / 10,
            'stats.reviewCount': stats[0].reviewCount,
        });
    }
});

module.exports = model('Comment', commentSchema);
