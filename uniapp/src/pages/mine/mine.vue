<template>
	<view class="mine-container">
		<!-- 用户信息卡片 -->
		<view class="user-card">
			<view class="user-info" v-if="isLoggedIn">
				<view class="avatar">
					<text class="avatar-text">{{ avatarText }}</text>
				</view>
				<view class="info">
					<text class="username">{{ userInfo.username }}</text>
					<text class="email">{{ userInfo.email }}</text>
				</view>
			</view>
			
			<view class="login-tip" v-else @tap="goLogin">
				<view class="avatar avatar-default">
					<text class="avatar-text">?</text>
				</view>
				<view class="info">
					<text class="login-text">点击登录</text>
					<text class="login-desc">登录后享受更多服务</text>
				</view>
			</view>
		</view>
		
		<!-- 功能菜单 -->
		<view class="menu-section">
			<view class="section-title">我的服务</view>
			<view class="menu-list">
				<view class="menu-item" @tap="goPage('/pages/order/order')">
					<text class="icon">📋</text>
					<text class="text">我的订单</text>
					<text class="arrow">›</text>
				</view>
				<view class="menu-item" @tap="goPage('/pages/space/myspace')">
					<text class="icon">🅿️</text>
					<text class="text">我的车位</text>
					<text class="arrow">›</text>
				</view>
				<view class="menu-item" @tap="goPage('/pages/wallet/wallet')">
					<text class="icon">💰</text>
					<text class="text">我的钱包</text>
					<text class="arrow">›</text>
				</view>
				<view class="menu-item" @tap="goPage('/pages/favorite/favorite')">
					<text class="icon">❤️</text>
					<text class="text">我的收藏</text>
					<text class="arrow">›</text>
				</view>
			</view>
		</view>
		
		<view class="menu-section">
			<view class="section-title">其他</view>
			<view class="menu-list">
				<view class="menu-item" @tap="goPage('/pages/setting/setting')">
					<text class="icon">⚙️</text>
					<text class="text">设置</text>
					<text class="arrow">›</text>
				</view>
				<view class="menu-item" @tap="goPage('/pages/help/help')">
					<text class="icon">❓</text>
					<text class="text">帮助中心</text>
					<text class="arrow">›</text>
				</view>
				<view class="menu-item" @tap="goPage('/pages/about/about')">
					<text class="icon">ℹ️</text>
					<text class="text">关于我们</text>
					<text class="arrow">›</text>
				</view>
			</view>
		</view>
		
		<!-- 退出登录按钮 -->
		<view class="logout-section" v-if="isLoggedIn">
			<button class="btn-logout" @tap="handleLogout">退出登录</button>
		</view>
	</view>
</template>

<script>
import authService from '@/utils/auth.js'

export default {
	data() {
		return {
			isLoggedIn: false,
			userInfo: null
		}
	},
	
	computed: {
		avatarText() {
			if (this.userInfo && this.userInfo.username) {
				return this.userInfo.username.charAt(0).toUpperCase()
			}
			return '?'
		}
	},
	
	onShow() {
		// 每次显示页面时检查登录状态
		this.checkLoginStatus()
	},
	
	methods: {
		// 检查登录状态
		checkLoginStatus() {
			this.isLoggedIn = authService.isLoggedIn()
			if (this.isLoggedIn) {
				this.userInfo = authService.getUserInfo()
			} else {
				this.userInfo = null
			}
		},
		
		// 跳转登录
		goLogin() {
			uni.navigateTo({
				url: '/pages/login/login'
			})
		},
		
		// 跳转页面
		goPage(url) {
			if (!this.isLoggedIn) {
				uni.showToast({
					title: '请先登录',
					icon: 'none'
				})
				setTimeout(() => {
					this.goLogin()
				}, 1500)
				return
			}
			
			// TODO: 这些页面需要后续创建
			uni.showToast({
				title: '功能开发中',
				icon: 'none'
			})
		},
		
		// 退出登录
		handleLogout() {
			uni.showModal({
				title: '提示',
				content: '确定要退出登录吗？',
				success: (res) => {
					if (res.confirm) {
						authService.logout()
						this.isLoggedIn = false
						this.userInfo = null
						
						uni.showToast({
							title: '已退出登录',
							icon: 'success'
						})
					}
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.mine-container {
	min-height: 100vh;
	background: #f5f5f5;
}

.user-card {
	background: linear-gradient(135deg, #42b983 0%, #35495e 100%);
	padding: 60rpx 40rpx;
	
	.user-info,
	.login-tip {
		display: flex;
		align-items: center;
	}
	
	.avatar {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.3);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 30rpx;
		
		.avatar-text {
			font-size: 48rpx;
			color: #fff;
			font-weight: bold;
		}
	}
	
	.avatar-default {
		background: rgba(255, 255, 255, 0.2);
	}
	
	.info {
		flex: 1;
		
		.username {
			display: block;
			font-size: 36rpx;
			color: #fff;
			font-weight: bold;
			margin-bottom: 10rpx;
		}
		
		.email {
			display: block;
			font-size: 26rpx;
			color: rgba(255, 255, 255, 0.8);
		}
		
		.login-text {
			display: block;
			font-size: 36rpx;
			color: #fff;
			font-weight: bold;
			margin-bottom: 10rpx;
		}
		
		.login-desc {
			display: block;
			font-size: 26rpx;
			color: rgba(255, 255, 255, 0.8);
		}
	}
}

.menu-section {
	margin: 20rpx;
	background: #fff;
	border-radius: 16rpx;
	overflow: hidden;
	
	.section-title {
		padding: 24rpx 30rpx;
		font-size: 26rpx;
		color: #999;
		background: #fafafa;
	}
	
	.menu-list {
		.menu-item {
			display: flex;
			align-items: center;
			padding: 30rpx;
			border-bottom: 1rpx solid #f0f0f0;
			
			&:last-child {
				border-bottom: none;
			}
			
			.icon {
				font-size: 40rpx;
				margin-right: 24rpx;
			}
			
			.text {
				flex: 1;
				font-size: 30rpx;
				color: #333;
			}
			
			.arrow {
				font-size: 36rpx;
				color: #ccc;
			}
		}
	}
}

.logout-section {
	padding: 40rpx;
	
	.btn-logout {
		height: 88rpx;
		line-height: 88rpx;
		background: #fff;
		color: #e74c3c;
		font-size: 32rpx;
		border-radius: 44rpx;
		border: 2rpx solid #e74c3c;
		
		&::after {
			border: none;
		}
	}
}
</style>
