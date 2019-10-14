<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <el-button type="primary" @click="showAddCateList">添加分类</el-button>
      <!-- 表单 -->
      <!-- selection-type是否为多选 ；expand-type是否为展开行；show-index是否显示索引，index-text索引名称；show-row-hover鼠标悬停时是否为高亮-->
      <tree-table :data="cateList" :columns="columns" show-index index-text="#" border :selection-type="false" :expand-type="false" :show-row-hover="false">
        <!-- 是否有效 -->
        <template slot="isOk" slot-scope="scope" >
             <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:lightgreen"></i>
             <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level==0">一级</el-tag>
          <el-tag size="mini" v-else-if="scope.row.cat_level==1" type="success">二级</el-tag>
          <el-tag size="mini" v-else type="warning">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt">
          <el-button size="mini" type="primary" icon="el-icon-edit" >编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" >删除</el-button>
      </template>
      </tree-table>

      <!-- 分页 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[2, 5, 10, 15]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      
      <!-- 添加分类弹出框 -->
      <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClosed">
        <!-- 表单 -->
        <el-form :model="addCateForm" :rules="addCateRules" ref="addCateRef" label-width="100px" >
            <el-form-item label="分类名称：" prop="cat_name">
              <el-input v-model="addCateForm.cat_name"></el-input>
            </el-form-item>
             <el-form-item label="父级分类:" >
               <!-- 级联选择框 -->
               <el-cascader  v-model="selectedKeys" :options="parentCateList" :props="cascaderProps" @change="parentCateChange"  ></el-cascader>
            </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate" >确 定</el-button>
        </span>
      </el-dialog> 

    </el-card>
  </div>
</template>

<script>
export default {

  data () {
    return {
      // 查询商品分类的参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 总商品数量
      total: 0,
      // 商品所有分类列表
      cateList: [],
      columns: [
        {label: '分类名称', prop: 'cat_name'},
        {label: '是否有效', prop: '', type:"template",template:'isOk'},
        {label: '排序', prop: '',type:"template",template:'order'},
        {label: '操作', prop: '',type:"template",template:'opt'},
      ],
      // 添加分类弹出框显示与否
      addCateDialogVisible: false,
      // 添加分类表单对象,数据请求时需要这些参数
      addCateForm: {
          cat_name:'',
          cat_pid: 0,
          cat_level:0
      },
      // 添加分类表单验证规则
      addCateRules: {
          cat_name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' },
          ]
      },
      // 选中的父级分类
      selectedKeys:[],
      // 1,2级分类列表
      parentCateList:[],
      // 配置数据的显示
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover' 
      }
    }
  },

  methods: {
    // 获取商品所有分类列表
    async getCateList(){

      // 获取商品分类
      const {data: res} = await this.$http.get('categories',{
        params: this.queryInfo
      });
      // console.log(res);
      
      // 商品分类获取失败
      if(res.meta.status != 200) return this.$message.error('商品分类列表获取失败')

      // 获取成功
      this.total = res.data.total;
      this.cateList = res.data.result;
      // console.log(this.cateList)
    },
    // 改变每页显示的数据条数
    handleSizeChange(val){
      // console.log(val)
      this.queryInfo.pagesize = val;
      this.getCateList()
    },
    // 改变当前页码
    handleCurrentChange(val){
      // console.log(val);
       this.queryInfo.pagenum = val;
      this.getCateList()
    },
    // 添加分类弹出框显示
    showAddCateList(){
      // 获取父级分类列表
      this.getParentCateList();
      // 显示弹出框
      this.addCateDialogVisible = true;
    },
    // 获取1,2父级分类列表
    async getParentCateList(){
       const {data: res} =  await this.$http.get('categories',{
          params: {type: 2}
        })
        // console.log(res)

        // 获取失败
        if(res.meta.status != 200) return this.$message.error('前2级权限获取失败')

        // 获取成功
        this.parentCateList = res.data
        console.log(this.parentCateList)

    },
    // 当选定了父级分类时触发
    parentCateChange(){
        console.log(this.selectedKeys)
        // 如果选定了父级分类，
        if(this.selectedKeys.length > 0) {
          // 将数组最后一项(二级分类)设置为父级分类
          this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1];
          // level也要变换
          this.addCateForm.cat_level = this.selectedKeys.length;
        }
    },
    // 提交添加分类信息是
    addCate(){
       console.log(this.addCateForm)
      // 预验证
      this.$refs.addCateRef.validate(async valid => {
          // 验证失败直接返回
          if(!valid) return 
          // 验证成功发送请求
          const {data: res} = await this.$http.post('categories',this.addCateForm);
          console.log(res)
          if(res.meta.status != 201) return this.$message.error('添加分类失败');

          // 添加分类成功
          this.$message.success('分类添加成功');
          this.getCateList();
          // 关闭对话框
          this.addCateDialogVisible = false;
      })

      
    },
    // 关闭添加分类弹出框时
    addCateDialogClosed(){
      // 重置表单
      this.$refs.addCateRef.resetFields();
      this.selectedKeys=[];
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
    }
  },

  created () {
    this.getCateList()
  }
}
</script>

<style lang='less' scoped>

  .zk-table  {
    margin: 10px 0;
  }

  .el-cascader {
  width: 100%;
  // height: 300px;
}

</style>
