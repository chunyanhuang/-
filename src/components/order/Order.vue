<template>
  <div>
     <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
        <el-input placeholder="请输入内容" v-model="iptValue" class="input-with-select" style="width: 40%;">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <!-- table -->
        <el-table :data="orderList" style="width: 100%" border  stripe>
          <el-table-column type="index"> </el-table-column>
          <el-table-column prop="order_number" label="订单编号" > </el-table-column>
          <el-table-column prop="order_price" label="订单价格" width="80"> </el-table-column>
          <el-table-column prop="pay_status" label="是否付款" width="80"> 
              <template slot-scope="scope">
                <el-tag type="danger" v-if="scope.row.pay_status==='0'">未付款</el-tag>
              <el-tag type="success" v-else>已付款</el-tag>
              </template>
          </el-table-column>
          <el-table-column prop="is_send" label="是否发货" width="80"> </el-table-column>
           <el-table-column prop="create_time" label="下单时间" width="160">
             <template slot-scope="scope">
                {{scope.row.create_time | dateFormat(scope.row.create_time)}}  
             </template>  
           </el-table-column>
           <el-table-column  label="操作" width="130">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="editAddress" ></el-button>
                <el-button  size="mini" type="success" icon="el-icon-location" @click="progressDialog(scope.row)" ></el-button>
              </template>
           </el-table-column>
        </el-table>
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
    </el-card>

    <!-- 订单修改弹出框 -->
    <el-dialog
      title="修改地址" @close="editAddressClosed"
      :visible.sync="editAddDialogVisible"
      width="50%">
        <!-- 表单 -->
        <el-form :model="editAddForm" :rules="editAddRules" ref="editAddRef" label-width="100px" class="demo-ruleForm">
          <el-form-item label="省市区/县" prop="address1">
            <el-cascader v-model="editAddForm.address1" :options="cityData" @change="handleChange" style="width:100%"></el-cascader>
          </el-form-item>
           <el-form-item label="详细地址" prop="address2">
            <el-input v-model="editAddForm.address2" ></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAddDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAddDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 物流进度弹出框 -->
    <el-dialog title="查看物流进度"  :visible.sync="progressDialogVisible" width="50%"  >
        <el-steps direction="vertical" :active="1">
          <el-step :title="item.time" v-for="(item,i) in progressData" :key="i" :description="item.context"></el-step>
         
        </el-steps>
    </el-dialog>

  </div>
</template>

<script>
  // 导入省市区数据
  import cityData from './citydata.js'

export default {

  data () {
    return {
      // 搜索输入框的内容
      iptValue:'',
      // 订单列表查询参数
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize: 10,
      },
      // 订单列表
      orderList:[],
      // 总数据条数
      total:0,
      // 编辑订单的弹出框显示与否
      editAddDialogVisible: false,
      // 修改地址的表单对象
      editAddForm:{
        address1:[],
        address2:''
      },
      // 修改地址的 表单验证对象
      editAddRules:{
        address1:[
           { required: true, message: '请输入省市区/县', trigger: 'blur' },
        ],
        address2:[
           { required: true, message: '请输入详细地址', trigger: 'blur' },
        ],
      },
      // 省市区数据
      cityData: cityData,
      // 物流进度弹出框的显示与否
      progressDialogVisible: false,
      // 物流进度
      progressData: []
    }
  },

  methods: {
    // 获取订单列表
    async getOrderList(){
     const {data: res} =  await this.$http.get('orders',{params: this.queryInfo});
     console.log(res)

     // 获取失败
      if(res.meta.status != 200) return this.$message.error('订单列表获取失败')

      // 获取成功
      this.orderList = res.data.goods;
      this.total = res.data.total;
    },
    // 每页的数据条数变化时
    handleSizeChange(page){
      this.queryInfo.pagesize = page;
      this.getOrderList();
    },
    // 分页的当前页码变化时
    handleCurrentChange(page){
      this.queryInfo.pagenum = page;
      this.getOrderList();
    },
    // 修改地址
    editAddress(){
      this.editAddDialogVisible = true;
    },
    // 添加省市区地址时触发
    handleChange(){
      console.log(this.editAddForm.address1)
    },
    // 关闭修改地址弹出框
    editAddressClosed(){
      // 重置表单
      this.$refs.editAddRef.resetFields()
    },
    // 显示物流进度弹出框
    async progressDialog(row){
      console.log(row)
      console.log(row.order_id)
      // 获取物流信息
      const {data: res} = await this.$http.get('/kuaidi/804909574412544580');
      console.log(res)

      // 获取信息失败
      if(res.meta.status != 200) return this.$message.error('物流获取失败')

      // 获取成功
      this.progressData = res.data;
      this.progressDialogVisible = true;
    }
  },

  created () {
    this.getOrderList()
  }
}
</script>

<style lang='less' scoped>

</style>
