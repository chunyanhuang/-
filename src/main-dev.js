import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 导入字体图库
import './assets/fonts/iconfont.css'

// 导入全局样式表
import './assets/css/global.css'

// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// 导入axios发送请求
import axios from 'axios';

// 引入NProgress的js,css文件
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 导入折叠树
import TreeTable from 'vue-table-with-tree-grid'
// 全局注册
Vue.component('tree-table', TreeTable)

// 将富文本注册为全局可用
Vue.use(VueQuillEditor);

// 设置请求根路径
axios.defaults.baseURL = 'http://192.168.37.21:8888/api/private/v1/'
// 向服务器发送请求时，如果登录了，访问除login以外的页面都要携带token,以便正常访问
// 在请求拦截器中展示进度条，NPogress.start()
axios.interceptors.request.use(config => {
  // 为请求头对象添加Authorization字段
  // console.log(config)
  NProgress.start();
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
})
// 在响应拦截器中终止进度条，NPogress.done()
axios.interceptors.response.use(config => {
   NProgress.done();
   return config
})
// 挂载axios 在其原型对象上挂载了方法
Vue.prototype.$http = axios;


//格式化事件
Vue.filter('dateFormat',function(time){
    var dt = new Date(time);
    var y = dt.getFullYear();
    // 进行字符串补全， 不够的前面补0
    var M = (dt.getMonth()+1 + '').padStart(2,'0');
    var d = (dt.getDate() + '').padStart(2, '0');
    var h = (dt.getHours() + '').padStart(2, '0');
    var m = (dt.getMinutes() + '').padStart(2, '0');
    var s = (dt.getSeconds() + '').padStart(2, '0');
    return `${y}-${M}-${d} ${h}:${m}:${s}`
})


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
