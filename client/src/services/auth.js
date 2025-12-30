import apiClient from './api';

const AuthService = {
    // 用户注册
    async register(userData) {
        try {
            const response = await apiClient.post('/auth/register', userData);
            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    },

    // 用户登录
    async login(credentials) {
        try {
            const response = await apiClient.post('/auth/login', credentials);
            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    },

    // 用户登出
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // 获取当前用户信息
    async getMe() {
        try {
            const response = await apiClient.get('/auth/me');
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    },

    // 更新密码
    async updatePassword(passwords) {
        try {
            const response = await apiClient.put('/auth/updatepassword', passwords);
            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
            }
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    },

    // 检查是否已登录
    isAuthenticated() {
        return !!localStorage.getItem('token');
    },

    // 获取当前用户
    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // 获取token
    getToken() {
        return localStorage.getItem('token');
    },
};

export default AuthService;
