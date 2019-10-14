<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
          <!-- 顶部 -->
         <el-button type="primary" @click="addRolesVisible=true">添加角色</el-button>
          <!-- 表格 -->
          <el-table  border stripe :data="roleList" >
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <el-row :class="['bdbottom', i1==0?'bdTop':'' ]" :key="item1.id" v-for="(item1, i1) in scope.row.children" >
                      <!-- 一级权限 -->
                      <el-col :span="5">
                        <el-tag  closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                        <i class="el-icon-caret-right"></i>
                      </el-col>
                      <!-- 二三级权限 -->
                      <el-col :span="19">
                          <el-row :class="[ i2==0?'':'bdTop']" :key="item2.id" v-for="(item2, i2) in item1.children"  >
                            <!-- 二级权限 -->
                            <el-col :span="6">
                                 <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{item2.authName}}</el-tag>
                                  <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 三级权限 -->
                            <el-col :span="18">
                                <el-tag type="warning" closable @close="removeRightById(scope.row, item3.id)"  :key="item3.id" v-for="(item3) in item2.children">{{item3.authName}}</el-tag>
                            </el-col>
                          </el-row>
                      </el-col>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column type="index" ></el-table-column>
            <el-table-column label="角色名称" prop="roleName" ></el-table-column>
            <el-table-column label="角色描述" prop="roleDesc"  ></el-table-column>
            <!-- 操作 -->
            <el-table-column label="操作" width="320px">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
                <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
              </template>
            </el-table-column>
        </el-table>
    </el-card>

    <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogColse">
      <!-- node-key每个节点的唯一标识 -->
      <el-tree :data="rightsList" show-checkbox default-expand-all node-key="id" ref="treeRef" :default-checked-keys="defKeys" highlight-current :props="defaultProps" ></el-tree>

      <div slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible=false" >取 消</el-button>
        <el-button type="primary"  @click="allotRights" >确 定</el-button>
      </div>
      
    </el-dialog>

  </div>
</template>

<script>
export default {

  data () {
    return {
      // 是否显示添加角色弹框
      addRolesVisible: false,
      // 角色数据列表
      roleList: [],
      // 是否显示分配权限弹出框
      setRightDialogVisible: false,
      // 权限列表
      rightsList: [],
      // 数据绑定的字段
      defaultProps: {
          children: 'children',
          label: 'authName'
        },
      // 属性控件中默认选中的内容
      defKeys: [],
      // 保存正在操作的角色id
      roleId: '',
    }
  },

  methods: {
    // 获取权限列表
    async getRolesList(){
      const {data: res} = await this.$http.get('roles')
      // console.log(res)

      // 权限获取失败
      if(res.meta.status != 200) return this.$message.error('权限信息获取失败')
      
      // 获取成功
      this.roleList = res.data
      
    },
    // 移除权限
    async removeRightById(role, rightId){
      // console.log(role)
      // return;
      // console.log(roleId)
      // console.log(rightId)
      const rights = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err);
        //  rights 返回值为 confirm 和 cancle
      console.log(rights)

      // 取消删除
      if(rights == 'cancel') {
        // console.log(1)
        return this.$message.info('取消权限删除')
      }

      // 确定删除
      const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
      console.log(res)
      this.$message.success('权限删除成功');
      // 无需更新所有权限， 只更新更改用的权限
      role.children = res.data;

    },
    // 分配权限
    async showSetRightDialog(item){
      // console.log(item)

      // return;
      // item  是当前行的id
      this.roleId = item.id
      // 显示权限弹出框
      this.setRightDialogVisible = true;

      const {data: res} = await this.$http.get('rights/tree')
      // console.log(res)

      // 权限获取成功
      if(res.meta.status != 200) return this.$message.error('获取权限失败')

      // 获取权限成功
      this.rightsList = res.data;
      // 用户的3级权限id存储在defKeys中
      this.getLeafKeys(item, this.defKeys)
      // console.log(this.defKeys)
      
    },
    // 获取所有的三级权限id，存放到数组中
    getLeafKeys(item, arr){
      // 如果当前节点不包含children属性，则表示item为三级权限，将选中的三级权限存储在arr数组中
      if(!item.children) {
        return arr.push(item.id)
      }
      // 递归
      item.children.forEach(item=> this.getLeafKeys(item, arr))
    },
    // 关闭权限设置框
    setRightDialogColse(){
      this.defKeys = [];
    },
    // 点击确定时，将更新的权限同步到数据库
    async allotRights(){
      // 获取所有选中和半选中的内容
      // console.log(this.$refs)
      // return;
      // treeRef 是tree的引用
      // getCheckedKeys()所有选中节点的id数组
      // getHalfCheckedKeys()所有半选中节点的数组
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
         ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      // console.log(keys)
      // 将数组转换成以, 拼接的字符串
      const idStr = keys.join(',');
      // console.log(this.roleId)
      const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`, {rids: idStr});
      console.log(res)

      // 更新失败
      if(res.meta.status != 200) return this.$message.error('权限分配失败')
      
      // 更新成功
      this.$message.success('权限更新成功');
      this.getRolesList();
      this.setRightDialogVisible=false
    }

  },

  created () {
    this.getRolesList();
  }
}
</script>

<style lang='less' scoped>

  .bdbottom {
    border-bottom: 1px solid #eee;
  }
  .bdTop {
    border-top: 1px solid #eee;
  }

  .el-row {
    display: flex;
    align-items: center;

  } 
  .el-tag {
    margin:  10px;
    

  }

</style>
