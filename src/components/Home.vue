<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div>
        <!-- logo -->
        <img src="../assets/heima.png" alt>
        <!-- 顶部标题 -->
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse?'64px':'200px'">
        <!-- unique-opened 每次只开启一个子菜单； collapse-transition 关掉折叠动画 router 开启以index作为hash跳转  default-active：当前激活菜单的 index-->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF"  unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath" >

          <!-- 伸缩侧边栏按钮 -->
          <div class="toggle-button" @click="toggleCollapse" >|||</div>

          <!-- 一级菜单 -->
          <!-- Index是唯一标识符 -->
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单模板 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+item1.path" v-for="item1 in item.children" :key="item1.id" @click="saveNavState('/'+item1.path)">
              <!-- 二级菜单模板 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{item1.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体 -->
      <el-main>
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menuList: [],
      // 菜单项图标
      iconsObj: {
        "125": 'iconfont icon-user',
        "103": 'iconfont icon-tijikongjian',
        "101": 'iconfont icon-shangpin',
        "102": 'iconfont icon-danju',
        "145": 'iconfont icon-baobiao',
      },
      // 是否折叠
      isCollapse: false,
      // 当前点击链接的路由地址
      activePath:''
    }
  },
   created() {
     // 在创建阶段请求左侧菜单数据
     this.getMenuList();
     this.activePath = window.sessionStorage.getItem('activePath')
   },
  methods: {
    // 退出登录
    logout() {
      // 点击退出时，清除token值
      window.sessionStorage.removeItem('token')
      // console.log(this)
      // 跳转回登录页面
      this.$router.push('/login') // 
    },
    // 请求左侧菜单数据
    async getMenuList(){
        // 请求数据
        const {data: res} = await this.$http.get('menus');
        // console.log(res)
        
        // 请求数据失败
        if(res.meta.status !== 200) return this.$message.error(res.meta.msg);

        // 数据请求成功
        this.menuList = res.data;
        // console.log(this.menuList)
    },
    // 点击伸缩按钮时
    toggleCollapse(){
        // 将折叠属性取反
        this.isCollapse = !this.isCollapse;
    },
    // 保存当前点击的链接的路由地址
    saveNavState(path){
      console.log(path)
      window.sessionStorage.setItem('activePath', path);
      this.activePath = path;
    }

  },

 
}
</script>

<style lang='less' scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  div {
    display: flex;
    align-items: center;
    span {
      color: #fff;
      font-size: 20px;
      margin-left: 10px;
    }
  }
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
.el-menu {
  border-right: none;
}
.iconfont {
  margin-right: 10px;
}

.toggle-button {
  color: #fff; 
  letter-spacing: 0.2em;
  font-size: 10px;
  text-align: center;
  background-color: #4a5064;
  cursor: pointer;
  line-height: 25px;
  user-select: none
}
</style>
