<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>用户注册</h2>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="username">用户名</label>
          <input
            type="text"
            id="username"
            v-model="form.username"
            placeholder="请输入用户名（至少3个字符）"
            required
            minlength="3"
          />
        </div>
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
            placeholder="请输入密码（至少6个字符）"
            required
            minlength="6"
          />
        </div>
        <div class="form-group">
          <label for="confirmPassword">确认密码</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="form.confirmPassword"
            placeholder="请再次输入密码"
            required
          />
        </div>
        <div v-if="error" class="error-message">{{ error }}</div>
        <button type="submit" class="btn-primary" :disabled="loading">
          {{ loading ? '注册中...' : '注册' }}
        </button>
      </form>
      <p class="auth-link">
        已有账号？ <router-link to="/login">立即登录</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import AuthService from '@/services/auth';

export default {
  name: 'Register',
  data() {
    return {
      form: {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      },
      loading: false,
      error: '',
    };
  },
  methods: {
    async handleRegister() {
      // 验证密码匹配
      if (this.form.password !== this.form.confirmPassword) {
        this.error = '两次输入的密码不一致';
        return;
      }

      this.loading = true;
      this.error = '';

      try {
        await AuthService.register({
          username: this.form.username,
          email: this.form.email,
          password: this.form.password,
        });
        this.$router.push('/');
      } catch (err) {
        this.error = err.message || '注册失败，请稍后重试';
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
