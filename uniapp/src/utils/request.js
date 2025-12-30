/**
 * HTTP请求封装
 * 支持自动携带token、统一错误处理
 */
import config from './config.js'

// 请求拦截
const requestInterceptor = (options) => {
  // 获取token
  const token = uni.getStorageSync(config.storageKeys.token)
  
  // 设置请求头
  options.header = options.header || {}
  options.header['Content-Type'] = 'application/json'
  
  if (token) {
    options.header['Authorization'] = `Bearer ${token}`
  }
  
  return options
}

// 响应拦截
const responseInterceptor = (response) => {
  const { statusCode, data } = response
  
  // 请求成功
  if (statusCode >= 200 && statusCode < 300) {
    return data
  }
  
  // 未授权，跳转登录
  if (statusCode === 401) {
    uni.removeStorageSync(config.storageKeys.token)
    uni.removeStorageSync(config.storageKeys.userInfo)
    
    uni.showToast({
      title: '请先登录',
      icon: 'none',
      duration: 2000
    })
    
    setTimeout(() => {
      uni.reLaunch({
        url: '/pages/login/login'
      })
    }, 1500)
    
    return Promise.reject({ message: '未授权，请登录' })
  }
  
  // 其他错误
  const errorMsg = data?.message || '请求失败'
  uni.showToast({
    title: errorMsg,
    icon: 'none',
    duration: 2000
  })
  
  return Promise.reject(data)
}

/**
 * 封装请求方法
 */
const request = (options) => {
  return new Promise((resolve, reject) => {
    // 请求拦截
    options = requestInterceptor(options)
    
    // 完整URL
    const url = options.url.startsWith('http') 
      ? options.url 
      : config.baseUrl + options.url
    
    uni.request({
      url,
      method: options.method || 'GET',
      data: options.data,
      header: options.header,
      timeout: options.timeout || config.timeout,
      success: (res) => {
        try {
          const result = responseInterceptor(res)
          if (result instanceof Promise) {
            result.then(resolve).catch(reject)
          } else {
            resolve(result)
          }
        } catch (error) {
          reject(error)
        }
      },
      fail: (error) => {
        uni.showToast({
          title: '网络请求失败',
          icon: 'none'
        })
        reject(error)
      }
    })
  })
}

// 快捷方法
export const get = (url, data, options = {}) => {
  return request({ url, method: 'GET', data, ...options })
}

export const post = (url, data, options = {}) => {
  return request({ url, method: 'POST', data, ...options })
}

export const put = (url, data, options = {}) => {
  return request({ url, method: 'PUT', data, ...options })
}

export const del = (url, data, options = {}) => {
  return request({ url, method: 'DELETE', data, ...options })
}

export default request
