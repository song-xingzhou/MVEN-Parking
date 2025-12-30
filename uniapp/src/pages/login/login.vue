<template>
	<view class="login-container">
		<!-- 顶部装饰 -->
		<view class="header">
			<view class="header-bg"></view>
			<view class="logo-wrap">
				<image class="logo" src="/static/logo.png" mode="aspectFit"></image>
				<text class="app-name">停车位共享平台</text>
			</view>
		</view>
		
		<!-- 登录表单 -->
		<view class="form-wrap">
			<view class="form-title">账号登录</view>
			
			<view class="input-group">
				<view class="input-item">
					<text class="iconfont icon-email">📧</text>
					<input 
						type="text" 
						v-model="form.email" 
						placeholder="请输入邮箱"
						placeholder-class="placeholder"
					/>
				</view>
				
				<view class="input-item">
					<text class="iconfont icon-password">🔒</text>
					<input 
						type="password" 
						v-model="form.password" 
						placeholder="请输入密码"
						placeholder-class="placeholder"
						:password="!showPassword"
					/>
					<text class="toggle-pwd" @tap="showPassword = !showPassword">
						{{ showPassword ? '🙈' : '👁️' }}
					</text>
				</view>
			</view>
			
			<button 
				class="btn-login" 
				:loading="loading"
				:disabled="loading"
				@tap="handleLogin"
			>
				登录
			</button>
			
			<view class="login-footer">
				<text class="link" @tap="goRegister">还没有账号？立即注册</text>
			</view>
		</view>
		
		<!-- 其他登录方式 -->
		<view class="other-login">
			<view class="divider">
				<view class="line"></view>
				<text class="text">其他登录方式</text>
				<view class="line"></view>
			</view>
			
			<view class="login-icons">
				<view class="icon-item" @tap="handleWxLogin">
					<text class="icon-wx">微信</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import authService from '@/utils/auth.js'

export default {
	data() {
		return {
			form: {
				email: '',
				password: ''
			},
			showPassword: false,
			loading: false
		}
	},
	
	methods: {
		// 表单验证
		validateForm() {
			if (!this.form.email) {
				uni.showToast({ title: '请输入邮箱', icon: 'none' })
				return false
			}
			
			const emailReg = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
			if (!emailReg.test(this.form.email)) {
				uni.showToast({ title: '请输入有效的邮箱', icon: 'none' })
				return false
			}
			
			if (!this.form.password) {
				uni.showToast({ title: '请输入密码', icon: 'none' })
				return false
			}
			
			if (this.form.password.length < 6) {
				uni.showToast({ title: '密码至少6位', icon: 'none' })
				return false
			}
			
			return true
		},
		
		// 登录
		async handleLogin() {
			if (!this.validateForm()) return
			
			this.loading = true
			try {
				const res = await authService.login(this.form)
				
				if (res.success) {
					// 保存登录信息
					authService.saveLoginInfo(res.token, res.user)
					
					uni.showToast({
						title: '登录成功',
						icon: 'success'
					})
					
					// 跳转首页
					setTimeout(() => {
						uni.switchTab({
							url: '/pages/index/index'
						})
					}, 1500)
				}
			} catch (error) {
				console.error('登录失败:', error)
			} finally {
				this.loading = false
			}
		},
		
		// 微信登录
		async handleWxLogin() {
			try {
				uni.showLoading({ title: '登录中...' })
				
				// 获取微信code
				const code = await authService.wxLogin()
				console.log('微信登录code:', code)
				
				// TODO: 发送code到后端换取用户信息
				// const res = await authService.wxLoginByCode(code)
				
				uni.hideLoading()
				uni.showToast({
					title: '微信登录功能开发中',
					icon: 'none'
				})
			} catch (error) {
				uni.hideLoading()
				console.error('微信登录失败:', error)
				uni.showToast({
					title: '微信登录失败',
					icon: 'none'
				})
			}
		},
		
		// 跳转注册
		goRegister() {
			uni.navigateTo({
				url: '/pages/register/register'
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.login-container {
	min-height: 100vh;
	background: #f5f5f5;
}

.header {
	position: relative;
	height: 400rpx;
	
	.header-bg {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 350rpx;
		background: linear-gradient(135deg, #42b983 0%, #35495e 100%);
		border-radius: 0 0 50% 50%;
	}
	
	.logo-wrap {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 120rpx;
		
		.logo {
			width: 140rpx;
			height: 140rpx;
			border-radius: 50%;
			background: #fff;
		}
		
		.app-name {
			margin-top: 20rpx;
			font-size: 36rpx;
			color: #fff;
			font-weight: bold;
		}
	}
}

.form-wrap {
	margin: -60rpx 40rpx 0;
	padding: 50rpx 40rpx;
	background: #fff;
	border-radius: 20rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
	
	.form-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 40rpx;
		text-align: center;
	}
}

.input-group {
	.input-item {
		display: flex;
		align-items: center;
		padding: 24rpx 20rpx;
		border-bottom: 1rpx solid #eee;
		margin-bottom: 20rpx;
		
		.iconfont {
			font-size: 36rpx;
			margin-right: 20rpx;
		}
		
		input {
			flex: 1;
			font-size: 28rpx;
			color: #333;
		}
		
		.toggle-pwd {
			font-size: 36rpx;
			padding: 0 10rpx;
		}
	}
}

.placeholder {
	color: #999;
}

.btn-login {
	margin-top: 60rpx;
	height: 88rpx;
	line-height: 88rpx;
	background: linear-gradient(135deg, #42b983 0%, #35495e 100%);
	color: #fff;
	font-size: 32rpx;
	border-radius: 44rpx;
	border: none;
	
	&::after {
		border: none;
	}
	
	&[disabled] {
		background: #ccc;
		color: #fff;
	}
}

.login-footer {
	margin-top: 30rpx;
	text-align: center;
	
	.link {
		color: #42b983;
		font-size: 26rpx;
	}
}

.other-login {
	margin-top: 80rpx;
	padding: 0 40rpx;
	
	.divider {
		display: flex;
		align-items: center;
		justify-content: center;
		
		.line {
			flex: 1;
			height: 1rpx;
			background: #ddd;
		}
		
		.text {
			padding: 0 20rpx;
			font-size: 24rpx;
			color: #999;
		}
	}
	
	.login-icons {
		display: flex;
		justify-content: center;
		margin-top: 40rpx;
		
		.icon-item {
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
			background: #07c160;
			display: flex;
			align-items: center;
			justify-content: center;
			
			.icon-wx {
				color: #fff;
				font-size: 28rpx;
			}
		}
	}
}
</style>
