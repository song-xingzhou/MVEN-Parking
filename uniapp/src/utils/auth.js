/**
 * 认证服务
 * 处理登录、注册、用户信息等
 */
import { post, get } from './request.js'
import config from './config.js'

const authService = {
  /**
   * 用户注册
   */
  register(data) {
    return post('/auth/register', data)
  },
  
  /**
   * 用户登录（账号密码）
   */
  login(data) {
    return post('/auth/login', data)
  },
  
  /**
   * 获取当前用户信息
   */
  getMe() {
    return get('/auth/me')
  },
  
  /**
   * 更新密码
   */
  updatePassword(data) {
    return post('/auth/updatepassword', data)
  },
  
  /**
   * 保存登录信息到本地
   */
  saveLoginInfo(token, userInfo) {
    uni.setStorageSync(config.storageKeys.token, token)
    uni.setStorageSync(config.storageKeys.userInfo, userInfo)
  },
  
  /**
   * 获取本地存储的用户信息
   */
  getUserInfo() {
    return uni.getStorageSync(config.storageKeys.userInfo) || null
  },
  
  /**
   * 获取本地存储的token
   */
  getToken() {
    return uni.getStorageSync(config.storageKeys.token) || ''
  },
  
  /**
   * 检查是否已登录
   */
  isLoggedIn() {
    return !!this.getToken()
  },
  
  /**
   * 登出
   */
  logout() {
    uni.removeStorageSync(config.storageKeys.token)
    uni.removeStorageSync(config.storageKeys.userInfo)
  },
  
  /**
   * 微信小程序登录（获取code）
   */
  wxLogin() {
    return new Promise((resolve, reject) => {
      uni.login({
        provider: 'weixin',
        success: (res) => {
          if (res.code) {
            resolve(res.code)
          } else {
            reject(new Error('微信登录失败'))
          }
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  },
  
  /**
   * 获取微信用户信息
   */
  getWxUserProfile() {
    return new Promise((resolve, reject) => {
      uni.getUserProfile({
        desc: '用于完善用户资料',
        success: (res) => {
          resolve(res.userInfo)
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  }
}

export default authService
