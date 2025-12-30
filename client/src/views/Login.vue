<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>用户登录</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">邮箱</label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            placeholder="请输入邮箱"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">密码</label>
          <input
            type="password"
            id="password"
            v-model="form.password"
            placeholder="请输入密码"
            required
          />
        </div>
        <div v-if="error" class="error-message">{{ error }}</div>
        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>
      <p class="auth-link">
        还没有账号？ <router-link to="/register">立即注册</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import AuthService from '@/services/auth';

export default {
  name: 'Login',
  data() {
    return {
      form: {
        email: '',
        password: '',
      },
      loading: false,
      error: '',
    };
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      this.error = '';
      try {
        await AuthService.login(this.form);
        this.$router.push('/');
      } catch (err) {
        this.error = err.message || '登录失败，请检查邮箱和密码';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;
}

.auth-card {
  background: #fff;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.auth-card h2 {
  margin-bottom: 30px;
  color: #2c3e50;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #42b983;
}

.btn-primary {
  width: 100%;
  padding: 12px;
  background: #42b983;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-primary:hover:not(:disabled) {
  background: #3aa876;
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.error-message {
  color: #e74c3c;
  margin-bottom: 15px;
  padding: 10px;
  background: #fdf2f2;
  border-radius: 4px;
  font-size: 14px;
}

.auth-link {
  margin-top: 20px;
  text-align: center;
  color: #666;
}

.auth-link a {
  color: #42b983;
  text-decoration: none;
}

.auth-link a:hover {
  text-decoration: underline;
}
</style>
