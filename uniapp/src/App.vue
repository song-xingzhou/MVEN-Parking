<script>
import authService from '@/utils/auth.js'

export default {
	onLaunch: function() {
		console.log('App Launch')
		
		// 检查登录状态
		this.checkLoginStatus()
	},
	
	onShow: function() {
		console.log('App Show')
	},
	
	onHide: function() {
		console.log('App Hide')
	},
	
	methods: {
		// 检查登录状态
		checkLoginStatus() {
			const token = authService.getToken()
			if (token) {
				// 有token，验证token是否有效
				authService.getMe().then(res => {
					console.log('用户已登录:', res.user)
					// 更新本地用户信息
					authService.saveLoginInfo(token, res.user)
				}).catch(err => {
					console.log('Token无效，需要重新登录')
					authService.logout()
				})
			}
		}
	}
}
</script>

<style lang="scss">
/* 全局样式 */
page {
	background-color: #f5f5f5;
	font-size: 28rpx;
	color: #333;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* 清除默认样式 */
view, text, input, button, image {
	box-sizing: border-box;
}

button::after {
	border: none;
}

/* 通用类 */
.flex {
	display: flex;
}

.flex-1 {
	flex: 1;
}

.flex-center {
	display: flex;
	align-items: center;
	justify-content: center;
}

.flex-between {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.text-center {
	text-align: center;
}

.text-ellipsis {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

/* 安全区域 */
.safe-area-bottom {
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);
}
</style>
