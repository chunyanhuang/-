import Vue from 'vue'
import Router from 'vue-router'
// import Login from './components/Login.vue'
// import Home from './components/Home.vue'
// import Welcome from './components/Welcome.vue'
// import Users from './components/user/Users.vue'
// import Rights from './components/power/Rights.vue'
// import Roles from './components/power/Roles.vue'
// import Cate from  './components/goods/cate.vue'
// import Params from './components/goods/Params.vue'
// import Goods from './components/goods/goods.vue'
// import AddGoods from './components/goods/Add.vue'
// import Order from './components/order/Order.vue'
// import Report from './components/report/Report.vue'

const Login = () => import(/* webpackChunkName:"login_home_welcome" */ './components/Login.vue')
const Home = () => import(/* webpackChunkName:"login_home_welcome" */ './components/Home.vue')
const Welcome = () => import(/* webpackChunkName:"login_home_welcome" */ './components/Welcome.vue')
const Users = () => import(/* webpackChunkName:"user" */ './components/user/Users.vue')
const Rights = () => import(/* webpackChunkName:"power" */ './components/power/Rights.vue')
const Roles = () => import(/* webpackChunkName:"power" */ './components/power/Roles.vue')
const Cate = () => import(/* webpackChunkName:"goods" */ './components/goods/cate.vue')
const Params = () => import(/* webpackChunkName:"goods" */ './components/goods/Params.vue')
const Goods = () => import(/* webpackChunkName:"goods" */ './components/goods/goods.vue')
const AddGoods = () => import(/* webpackChunkName:"goods" */ './components/goods/Add.vue')
const Order = () => import(/* webpackChunkName:"order" */ './components/order/Order.vue')
const Report = () => import(/* webpackChunkName:"report" */ './components/report/Report.vue')

Vue.use(Router) 

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/home', component: Home, redirect: '/welcome', children: [
      { path: '/welcome', component: Welcome},
      { path: '/users', component: Users},
      { path: '/rights', component: Rights},
      { path: '/roles', component: Roles},
      { path: '/categories', component: Cate},
      { path: '/params', component: Params},
      { path: '/goods', component: Goods},
      { path: '/goods/add', component: AddGoods},
      { path: '/orders', component: Order},
      { path: '/reports', component: Report},
    ] },

  ]
})

// 路由守卫： 若未登录就直接跳转回登录页面，
//  不调用 next(),  就会停在当前状态
router.beforeEach((to, from, next) => {
    //  to 要访问的路径
    //  from  从哪里跳转来的
    // next()  next('/login')强制跳转
    // 访问登录页面。直接放行
    if(to.path === '/login'){
      return next();  // return 则不再执行之后的内容
    }

    // 获取网站中存储的token
    const token = window.sessionStorage.getItem('token');
    // 若不存在token， 即表示未登录
    if(!token) {
      // console.log(this)
      this.$router.push('/login')  
    }
    // 若已登录，直接放行
    next();
})

export default router;