/**
 * 数据库初始化脚本
 * 运行方式: node helpers/db/init_db.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { Admin } = require('../../models');

const initDatabase = async () => {
    try {
        // 连接数据库
        await mongoose.connect(process.env.DB_URL);
        console.log('✅ 数据库连接成功');

        // 检查是否已存在超级管理员
        const existingAdmin = await Admin.findOne({ role: 'super_admin' });

        if (!existingAdmin) {
            // 创建默认超级管理员
            const superAdmin = await Admin.create({
                username: 'superadmin',
                password: 'admin123456', // 请在生产环境修改
                realName: '超级管理员',
                email: 'admin@parking.com',
                role: 'super_admin',
                status: 'active',
            });
            console.log('✅ 创建超级管理员成功:', superAdmin.username);
            console.log('   默认密码: admin123456 (请及时修改)');
        } else {
            console.log('ℹ️  超级管理员已存在:', existingAdmin.username);
        }

        // 确保创建地理空间索引
        const ParkingSpace = require('../../models/parking_space_schema');
        await ParkingSpace.collection.createIndex({ location: '2dsphere' });
        console.log('✅ 地理空间索引创建成功');

        console.log('\n🎉 数据库初始化完成！');
        console.log('\n📊 数据库集合:');
        const collections = await mongoose.connection.db.listCollections().toArray();
        collections.forEach((col) => console.log(`   - ${col.name}`));

        process.exit(0);
    } catch (error) {
        console.error('❌ 数据库初始化失败:', error.message);
        process.exit(1);
    }
};

initDatabase();
