<template>
	<view class="index-container">
		<!-- 搜索栏 -->
		<view class="search-bar">
			<view class="search-input" @tap="goSearch">
				<text class="icon">🔍</text>
				<text class="placeholder">搜索附近停车位</text>
			</view>
			<view class="location" @tap="chooseLocation">
				<text class="icon">📍</text>
				<text class="text">{{ locationName }}</text>
			</view>
		</view>
		
		<!-- 轮播图 -->
		<view class="banner-section">
			<swiper 
				class="banner-swiper"
				indicator-dots
				autoplay
				circular
				interval="4000"
			>
				<swiper-item v-for="(item, index) in banners" :key="index">
					<view class="banner-item" :style="{ background: item.color }">
						<text class="banner-text">{{ item.title }}</text>
					</view>
				</swiper-item>
			</swiper>
		</view>
		
		<!-- 功能入口 -->
		<view class="function-section">
			<view class="function-grid">
				<view class="function-item" @tap="goNearby">
					<view class="icon-wrap" style="background: #42b983;">
						<text class="icon">🅿️</text>
					</view>
					<text class="text">附近车位</text>
				</view>
				<view class="function-item" @tap="goPublish">
					<view class="icon-wrap" style="background: #3498db;">
						<text class="icon">➕</text>
					</view>
					<text class="text">发布车位</text>
				</view>
				<view class="function-item" @tap="goOrder">
					<view class="icon-wrap" style="background: #e67e22;">
						<text class="icon">📋</text>
					</view>
					<text class="text">我的订单</text>
				</view>
				<view class="function-item" @tap="goWallet">
					<view class="icon-wrap" style="background: #9b59b6;">
						<text class="icon">💰</text>
					</view>
					<text class="text">我的钱包</text>
				</view>
			</view>
		</view>
		
		<!-- 推荐车位 -->
		<view class="recommend-section">
			<view class="section-header">
				<text class="title">推荐车位</text>
				<text class="more" @tap="goNearby">查看更多 ›</text>
			</view>
			
			<view class="parking-list">
				<view 
					class="parking-item" 
					v-for="(item, index) in parkingList" 
					:key="index"
					@tap="goDetail(item)"
				>
					<view class="parking-image">
						<text class="placeholder-icon">🅿️</text>
					</view>
					<view class="parking-info">
						<text class="title">{{ item.title }}</text>
						<text class="address">{{ item.address }}</text>
						<view class="price-row">
							<text class="price">¥{{ item.price }}</text>
							<text class="unit">/小时</text>
							<text class="distance">{{ item.distance }}</text>
						</view>
					</view>
				</view>
			</view>
			
			<!-- 空状态 -->
			<view class="empty-state" v-if="parkingList.length === 0">
				<text class="icon">🅿️</text>
				<text class="text">暂无推荐车位</text>
				<text class="desc">附近还没有共享车位，快来发布吧</text>
			</view>
		</view>
	</view>
</template>

<script>
import authService from '@/utils/auth.js'

export default {
	data() {
		return {
			locationName: '定位中...',
			banners: [
				{ title: '共享车位 · 便捷出行', color: 'linear-gradient(135deg, #42b983 0%, #35495e 100%)' },
				{ title: '闲置车位 · 轻松赚钱', color: 'linear-gradient(135deg, #3498db 0%, #2c3e50 100%)' },
				{ title: '新用户注册 · 享首单优惠', color: 'linear-gradient(135deg, #e67e22 0%, #c0392b 100%)' }
			],
			parkingList: [
				{ id: 1, title: '万达广场地下停车场A区', address: '朝阳区建国路93号', price: 8, distance: '500m' },
				{ id: 2, title: '阳光100小区东门', address: '朝阳区阳光100小区东门', price: 5, distance: '800m' },
				{ id: 3, title: '国贸大厦B座地下二层', address: '朝阳区国贸大厦B座', price: 12, distance: '1.2km' }
			]
		}
	},
	
	onLoad() {
		this.getLocation()
	},
	
	onPullDownRefresh() {
		// 下拉刷新
		setTimeout(() => {
			uni.stopPullDownRefresh()
			uni.showToast({
				title: '刷新成功',
				icon: 'success'
			})
		}, 1000)
	},
	
	methods: {
		// 获取位置
		getLocation() {
			uni.getLocation({
				type: 'gcj02',
				success: (res) => {
					console.log('位置:', res)
					this.locationName = '当前位置'
					// TODO: 根据经纬度获取地址名称
				},
				fail: (err) => {
					console.error('获取位置失败:', err)
					this.locationName = '定位失败'
				}
			})
		},
		
		// 选择位置
		chooseLocation() {
			uni.chooseLocation({
				success: (res) => {
					console.log('选择位置:', res)
					this.locationName = res.name || res.address
				}
			})
		},
		
		// 检查登录状态
		checkLogin() {
			if (!authService.isLoggedIn()) {
				uni.showToast({
					title: '请先登录',
					icon: 'none'
				})
				setTimeout(() => {
					uni.navigateTo({
						url: '/pages/login/login'
					})
				}, 1500)
				return false
			}
			return true
		},
		
		// 跳转搜索
		goSearch() {
			uni.showToast({ title: '搜索功能开发中', icon: 'none' })
		},
		
		// 跳转附近
		goNearby() {
			uni.showToast({ title: '附近车位功能开发中', icon: 'none' })
		},
		
		// 跳转发布
		goPublish() {
			if (!this.checkLogin()) return
			uni.showToast({ title: '发布车位功能开发中', icon: 'none' })
		},
		
		// 跳转订单
		goOrder() {
			if (!this.checkLogin()) return
			uni.showToast({ title: '订单功能开发中', icon: 'none' })
		},
		
		// 跳转钱包
		goWallet() {
			if (!this.checkLogin()) return
			uni.showToast({ title: '钱包功能开发中', icon: 'none' })
		},
		
		// 跳转详情
		goDetail(item) {
			uni.showToast({ title: '车位详情功能开发中', icon: 'none' })
		}
	}
}
</script>

<style lang="scss" scoped>
.index-container {
	min-height: 100vh;
	background: #f5f5f5;
	padding-bottom: 120rpx;
}

.search-bar {
	display: flex;
	align-items: center;
	padding: 20rpx 30rpx;
	background: #42b983;
	
	.search-input {
		flex: 1;
		display: flex;
		align-items: center;
		height: 72rpx;
		background: #fff;
		border-radius: 36rpx;
		padding: 0 30rpx;
		
		.icon {
			font-size: 32rpx;
			margin-right: 16rpx;
		}
		
		.placeholder {
			font-size: 28rpx;
			color: #999;
		}
	}
	
	.location {
		display: flex;
		align-items: center;
		margin-left: 20rpx;
		
		.icon {
			font-size: 32rpx;
		}
		
		.text {
			font-size: 24rpx;
			color: #fff;
			max-width: 120rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}
}

.banner-section {
	padding: 20rpx 30rpx;
	
	.banner-swiper {
		height: 280rpx;
		border-radius: 16rpx;
		overflow: hidden;
	}
	
	.banner-item {
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		
		.banner-text {
			font-size: 40rpx;
			color: #fff;
			font-weight: bold;
		}
	}
}

.function-section {
	padding: 0 30rpx;
	
	.function-grid {
		display: flex;
		justify-content: space-between;
		background: #fff;
		border-radius: 16rpx;
		padding: 30rpx 20rpx;
	}
	
	.function-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		
		.icon-wrap {
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			margin-bottom: 16rpx;
			
			.icon {
				font-size: 44rpx;
			}
		}
		
		.text {
			font-size: 26rpx;
			color: #333;
		}
	}
}

.recommend-section {
	margin-top: 20rpx;
	padding: 0 30rpx;
	
	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
		
		.title {
			font-size: 32rpx;
			font-weight: bold;
			color: #333;
		}
		
		.more {
			font-size: 26rpx;
			color: #999;
		}
	}
	
	.parking-list {
		.parking-item {
			display: flex;
			background: #fff;
			border-radius: 16rpx;
			padding: 24rpx;
			margin-bottom: 20rpx;
			
			.parking-image {
				width: 160rpx;
				height: 120rpx;
				background: #f0f0f0;
				border-radius: 12rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-right: 24rpx;
				
				.placeholder-icon {
					font-size: 60rpx;
				}
			}
			
			.parking-info {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				
				.title {
					font-size: 30rpx;
					color: #333;
					font-weight: 500;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				
				.address {
					font-size: 24rpx;
					color: #999;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				
				.price-row {
					display: flex;
					align-items: baseline;
					
					.price {
						font-size: 36rpx;
						color: #e74c3c;
						font-weight: bold;
					}
					
					.unit {
						font-size: 22rpx;
						color: #999;
						margin-right: 20rpx;
					}
					
					.distance {
						font-size: 22rpx;
						color: #42b983;
					}
				}
			}
		}
	}
	
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 80rpx 0;
		
		.icon {
			font-size: 100rpx;
			margin-bottom: 20rpx;
		}
		
		.text {
			font-size: 32rpx;
			color: #666;
			margin-bottom: 10rpx;
		}
		
		.desc {
			font-size: 26rpx;
			color: #999;
		}
	}
}
</style>
