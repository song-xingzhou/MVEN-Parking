import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Profile from "./views/Profile.vue";
import Login from "./views/Login.vue";
import Register from "./views/Register.vue";
import AuthService from "./services/auth";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/about",
      name: "about",
      component: () => import("./views/About.vue"),
    },
    {
      path: "/profile",
      name: "profile",
      component: Profile,
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "login",
      component: Login,
      meta: { guest: true },
    },
    {
      path: "/register",
      name: "register",
      component: Register,
      meta: { guest: true },
    },
  ],
});

// 导航守卫
router.beforeEach((to, from, next) => {
  const isAuthenticated = AuthService.isAuthenticated();

  // 需要登录的页面
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({
        path: "/login",
        query: { redirect: to.fullPath },
      });
    } else {
      next();
    }
  }
  // 游客页面（已登录用户不能访问）
  else if (to.matched.some((record) => record.meta.guest)) {
    if (isAuthenticated) {
      next({ path: "/" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
