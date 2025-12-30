<template>
	<view class="register-container">
		<view class="form-wrap">
			<view class="form-title">用户注册</view>
			
			<view class="input-group">
				<view class="input-item">
					<text class="label">用户名</text>
					<input 
						type="text" 
						v-model="form.username" 
						placeholder="请输入用户名（2-20个字符）"
						placeholder-class="placeholder"
						maxlength="20"
					/>
				</view>
				
				<view class="input-item">
					<text class="label">邮箱</text>
					<input 
						type="text" 
						v-model="form.email" 
						placeholder="请输入邮箱"
						placeholder-class="placeholder"
					/>
				</view>
				
				<view class="input-item">
					<text class="label">密码</text>
					<input 
						type="password" 
						v-model="form.password" 
						placeholder="请输入密码（至少6位）"
						placeholder-class="placeholder"
						:password="true"
					/>
				</view>
				
				<view class="input-item">
					<text class="label">确认密码</text>
					<input 
						type="password" 
						v-model="form.confirmPassword" 
						placeholder="请再次输入密码"
						placeholder-class="placeholder"
						:password="true"
					/>
				</view>
			</view>
			
			<!-- 用户协议 -->
			<view class="agreement">
				<checkbox-group @change="onAgreementChange">
					<label class="agreement-label">
						<checkbox :checked="agreed" color="#42b983" />
						<text>我已阅读并同意</text>
						<text class="link">《用户协议》</text>
						<text>和</text>
						<text class="link">《隐私政策》</text>
					</label>
				</checkbox-group>
			</view>
			
			<button 
				class="btn-register" 
				:loading="loading"
				:disabled="loading || !agreed"
				@tap="handleRegister"
			>
				注册
			</button>
			
			<view class="register-footer">
				<text class="link" @tap="goLogin">已有账号？立即登录</text>
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
				username: '',
				email: '',
				password: '',
				confirmPassword: ''
			},
			agreed: false,
			loading: false
		}
	},
	
	methods: {
		// 协议勾选
		onAgreementChange(e) {
			this.agreed = e.detail.value.length > 0
		},
		
		// 表单验证
		validateForm() {
			if (!this.form.username || this.form.username.length < 2) {
				uni.showToast({ title: '用户名至少2个字符', icon: 'none' })
				return false
			}
			
			if (!this.form.email) {
				uni.showToast({ title: '请输入邮箱', icon: 'none' })
				return false
			}
			
			const emailReg = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
			if (!emailReg.test(this.form.email)) {
				uni.showToast({ title: '请输入有效的邮箱', icon: 'none' })
				return false
			}
			
			if (!this.form.password || this.form.password.length < 6) {
				uni.showToast({ title: '密码至少6位', icon: 'none' })
				return false
			}
			
			if (this.form.password !== this.form.confirmPassword) {
				uni.showToast({ title: '两次密码不一致', icon: 'none' })
				return false
			}
			
			if (!this.agreed) {
				uni.showToast({ title: '请同意用户协议', icon: 'none' })
				return false
			}
			
			return true
		},
		
		// 注册
		async handleRegister() {
			if (!this.validateForm()) return
			
			this.loading = true
			try {
				const res = await authService.register({
					username: this.form.username,
					email: this.form.email,
					password: this.form.password
				})
				
				if (res.success) {
					// 保存登录信息
					authService.saveLoginInfo(res.token, res.user)
					
					uni.showToast({
						title: '注册成功',
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
				console.error('注册失败:', error)
			} finally {
				this.loading = false
			}
		},
		
		// 跳转登录
		goLogin() {
			uni.navigateBack()
		}
	}
}
</script>

<style lang="scss" scoped>
.register-container {
	min-height: 100vh;
	background: #f5f5f5;
	padding: 40rpx;
}

.form-wrap {
	padding: 50rpx 40rpx;
	background: #fff;
	border-radius: 20rpx;
	box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
	
	.form-title {
		font-size: 40rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 50rpx;
		text-align: center;
	}
}

.input-group {
	.input-item {
		margin-bottom: 30rpx;
		
		.label {
			display: block;
			font-size: 28rpx;
			color: #666;
			margin-bottom: 16rpx;
		}
		
		input {
			width: 100%;
			height: 88rpx;
			padding: 0 24rpx;
			background: #f8f8f8;
			border-radius: 12rpx;
			font-size: 28rpx;
			color: #333;
			box-sizing: border-box;
		}
	}
}

.placeholder {
	color: #bbb;
}

.agreement {
	margin: 40rpx 0;
	
	.agreement-label {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		font-size: 24rpx;
		color: #666;
		
		checkbox {
			transform: scale(0.8);
			margin-right: 8rpx;
		}
		
		.link {
			color: #42b983;
		}
	}
}

.btn-register {
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

.register-footer {
	margin-top: 40rpx;
	text-align: center;
	
	.link {
		color: #42b983;
		font-size: 26rpx;
	}
}
</style>
