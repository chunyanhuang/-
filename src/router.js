import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/home', component: Home },

  ]
})

// 路由守卫： 若未登录就直接跳转回登录页面，
router.beforeEach((to, from, next) => {
    // 访问登录页面。直接放行
    if(to.path === '/login'){
      return next();  // return 则不再执行之后的内容
    }

  // 获取网站中存储的token
  const token = window.sessionStorage.getItem('token');
  // 若不存在token， 即表示未登录
  if(!token) {
    this.$router.push('/login')
  }
  next();
})

export default router;