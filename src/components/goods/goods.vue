<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- K卡片 -->
    <el-card>
      <!-- 搜索框 -->
      <el-row>
        <el-col :span="10">
            <el-input placeholder="请输入内容" clearable class="input-with-select" v-model="queryInfo.query" @clear="clearInput">
              <el-button slot="append" icon="el-icon-search" @click="searchGoods"></el-button>
            </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" class="addBtn" @click="addGoods" >添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="goodsList" style="width: 100%" border stripe>
          <el-table-column type="index" ></el-table-column>
          <el-table-column prop="goods_name" label="商品名称" ></el-table-column>
          <el-table-column prop="goods_price" label="商品价格(元)" width="110px"></el-table-column>
          <el-table-column prop="goods_weight" label="商品重量" width="90px"></el-table-column>
          <el-table-column prop="add_time" label="创建时间" width="160px">
            <template slot-scope="scope">
                {{scope.row.add_time | dateFormat(scope.row.add_time)}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px" >
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteGoods(scope.row)"></el-button>
            </template>
          </el-table-column>
      </el-table>

      <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[10, 15, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>

    

  </div>
</template>

<script>
export default {

  data () {
    return {
      // 商品查询参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 商品数据
      goodsList: [],
      // 总数据条数
      total:0,
      // // 查询参数：
      // inputValue:''
    }
  },

  methods: {
    // 获取商品
    async getGoodsData(){
        const {data: res} = await this.$http.get('goods',{params: this.queryInfo});
        console.log(res)
        // 获取失败
        if(res.meta.status != 200) return this.$message.error('商品数据获取失败');

        // 获取成功
        this.goodsList = res.data.goods;
        this.total = res.data.total;
    },
    handleSizeChange(val){
      this.queryInfo.pagesize = val;
      this.getGoodsData();
    },
    handleCurrentChange(val){
      this.queryInfo.pagenum = val;
      this.getGoodsData();
    },
    // 搜索商品
    async searchGoods(){
      // 或者通过双向数据绑定，将queryInfo.query绑定到input上
      // this.queryInfo.query = this.inputValue;
      this.getGoodsData();
    },
    // 删除商品
    async deleteGoods(row){
       const result = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=> err);
        console.log(result)
        if(result == 'cancel'){
          return this.$message.info('取消删除商品')
        }
        // 确定删除
       const {data: res} = await this.$http.delete(`goods/${row.goods_id}`);
       console.log(res);
       if(res.meta.status != 200) return this.$message.error('删除失败')
       this.$message.success('商品删除成功');
       this.getGoodsData();
    },
    // 添加商品
    addGoods(){
      this.$router.push('/goods/add')
    },
    // 清空输入框时重新获取数据
    clearInput(){
      this.queryInfo.query='';
      this.getGoodsData();
    }
  },

  created () {
    // 获取商品
    this.getGoodsData()
  }
}
</script>

<style lang='less' scoped>
  .addBtn {
    margin-left: 15px;
  }
  
</style>

