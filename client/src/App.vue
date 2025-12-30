<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">首页</router-link> |
      <router-link to="/about">关于</router-link>
      <template v-if="isAuthenticated">
        | <router-link to="/profile">个人中心</router-link>
        | <a href="#" @click.prevent="handleLogout">退出</a>
      </template>
      <template v-else>
        | <router-link to="/login">登录</router-link>
        | <router-link to="/register">注册</router-link>
      </template>
    </div>
    <router-view />
  </div>
</template>

<script>
import AuthService from "@/services/auth";

export default {
  name: "App",
  data() {
    return {
      isAuthenticated: false,
    };
  },
  created() {
    this.checkAuth();
    // 监听路由变化更新认证状态
    this.$router.afterEach(() => {
      this.checkAuth();
    });
  },
  methods: {
    checkAuth() {
      this.isAuthenticated = AuthService.isAuthenticated();
    },
    handleLogout() {
      AuthService.logout();
      this.isAuthenticated = false;
      this.$router.push("/login");
    },
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  background: #f8f9fa;
  margin-bottom: 20px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

#nav a:hover {
  color: #42b983;
}
</style>
