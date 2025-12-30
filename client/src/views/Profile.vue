<template>
  <div class="profile-container">
    <div class="profile-card">
      <h2>个人资料</h2>
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="user" class="profile-info">
        <div class="avatar">
          {{ user.username ? user.username.charAt(0).toUpperCase() : 'U' }}
        </div>
        <div class="info-item">
          <label>用户名</label>
          <span>{{ user.username }}</span>
        </div>
        <div class="info-item">
          <label>邮箱</label>
          <span>{{ user.email }}</span>
        </div>
        <div class="info-item">
          <label>角色</label>
          <span>{{ user.role === 'admin' ? '管理员' : '普通用户' }}</span>
        </div>
        <div class="info-item">
          <label>注册时间</label>
          <span>{{ formatDate(user.createdAt) }}</span>
        </div>
        <button class="btn-logout" @click="handleLogout">退出登录</button>
      </div>
      <div v-else class="error">无法加载用户信息</div>
    </div>
  </div>
</template>

<script>
import AuthService from '@/services/auth';

export default {
  name: 'Profile',
  data() {
    return {
      user: null,
      loading: true,
    };
  },
  async mounted() {
    try {
      const response = await AuthService.getMe();
      this.user = response.user;
    } catch (err) {
      console.error('Failed to load user:', err);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    formatDate(dateStr) {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    },
    handleLogout() {
      AuthService.logout();
      this.$router.push('/login');
    },
  },
};
</script>

<style scoped>
.profile-container {
  display: flex;
  justify-content: center;
  padding: 40px 20px;
}

.profile-card {
  background: #fff;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
}

.profile-card h2 {
  margin-bottom: 30px;
  color: #2c3e50;
  text-align: center;
}

.avatar {
  width: 80px;
  height: 80px;
  background: #42b983;
  color: #fff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 36px;
  font-weight: bold;
  margin: 0 auto 30px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.info-item:last-of-type {
  border-bottom: none;
  margin-bottom: 20px;
}

.info-item label {
  color: #888;
  font-weight: 500;
}

.info-item span {
  color: #2c3e50;
}

.btn-logout {
  width: 100%;
  padding: 12px;
  background: #e74c3c;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 20px;
}

.btn-logout:hover {
  background: #c0392b;
}

.loading,
.error {
  text-align: center;
  padding: 20px;
  color: #888;
}

.error {
  color: #e74c3c;
}
</style>
