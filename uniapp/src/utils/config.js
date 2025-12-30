/**
 * 全局配置
 */
const config = {
  // API基础地址 - 开发环境
  baseUrl: 'http://localhost:9000/api',
  
  // API基础地址 - 生产环境（部署后修改）
  // baseUrl: 'https://your-domain.com/api',
  
  // 请求超时时间
  timeout: 10000,
  
  // 存储键名
  storageKeys: {
    token: 'parking_token',
    userInfo: 'parking_user_info',
  },
}

export default config
