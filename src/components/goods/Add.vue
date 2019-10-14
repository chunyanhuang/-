<template>
  <div>
     <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
        <el-alert title="添加商品信息" :closable="false" center type="info" show-icon> </el-alert> 
        <!-- 步骤条 -->
        <el-steps  :active="activeIndex - 0" finish-status="success" align-center>
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
          <el-step title="完成"></el-step>
        </el-steps> 
        <!-- tabs栏 -->
        <el-form :model="addGoodsForm" :rules="addGoodsRules" ref="addGoodsRef" label-width="100px" label-position="top" class="demo-ruleForm">
          <el-tabs v-model="activeIndex" :tab-position="tabPosition"  @tab-click="tabsClick" :before-leave="beforeTabLeave" >
          <el-tab-pane label="基本信息">
             <el-form-item label="商品名称" prop="goods_name" >
                <el-input v-model="addGoodsForm.goods_name" ></el-input>
             </el-form-item>
             <el-form-item label="商品价格" prop="goods_price" >
                <el-input type="number"  v-model="addGoodsForm.goods_price" ></el-input>
             </el-form-item>
             <el-form-item label="商品重量" prop="goods_weight" >
                <el-input type="number" v-model="addGoodsForm.goods_weight" ></el-input>
             </el-form-item> 
             <el-form-item label="商品数量" prop="goods_number" >
                <el-input type="number"  v-model="addGoodsForm.goods_number" ></el-input>
             </el-form-item>
             <el-form-item label="商品分类" prop="goods_cat" >
                <el-cascader
                  v-model="addGoodsForm.goods_cat"
                  :options="cateList"
                  @change="handleChange" :props="goodsCateProps"></el-cascader>
             </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数">
             <el-form-item :label="item.attr_name" :key="i" v-for="(item,i) in manyDataList"  >
                <!-- 复选框 -->
                <el-checkbox-group v-model="item.attr_vals">
                     <el-checkbox :label="par" v-for="(par, i) in item.attr_vals" :key="i" border></el-checkbox>
                </el-checkbox-group>
             </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性">
              <el-form-item :label="item.attr_name" v-for="(item,i) in onlyDataList" :key="i">
                <el-input v-model="item.attr_vals"  ></el-input>
             </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片">
            <!-- list-type当前文件的呈现方式 -->
              <el-upload
                :action="uploadUrl"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                list-type="picture" :on-success="handleSuccess"
                :headers="headerObj">
                <el-button size="small" type="primary" >点击上传</el-button>
              </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容">
             <quill-editor v-model="addGoodsForm.goods_introduce"></quill-editor>
             <el-button type="primary" class="addGoods" @click="addGoodsBtn" >添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
         
        </el-form>  
         
    </el-card>

    <!-- 预览弹框 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewVisible"
      width="50%">
      <div>
        <img :src="previewPath" alt="" style="width:100%">
      </div>
      
    </el-dialog>

  </div>
</template>

<script>
  // 导入深度克隆函数
  import _ from 'lodash'

export default {

  data () {
    return {
      // 步骤条的激活索引
      activeIndex:0,
      // tabs的展示位置
      tabPosition: 'left',
      // 添加商品表单对象
      addGoodsForm:{
        goods_name:'',
        goods_price:1,
        goods_number:1,
        goods_weight:1,
        // 商品id
        goods_cat:[1,3,6],
        // 图片临时路径的数组
        pics:[],
        // 介绍
        goods_introduce:'',
        // 商品参数，包含静态参数和动态参数
        attrs:[]
      },
      // 添加商品表单的验证规则
      addGoodsRules:{
        goods_name:[
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price:[
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight:[
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number:[
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat:[
          { required: true, message: '请输入商品分类', trigger: 'blur' }
        ],
        
      },
      // 商品分类列表
      cateList:[],
      goodsCateProps:{
        value:'cat_id',
        label:'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 动态参数
      manyDataList:[],
      // 静态参数
      onlyDataList:[],
      // 上传后图片的存储地址
      uploadUrl: 'http://192.168.37.212:8888/api/private/v1/upload',
      // 设置请求头携带Token信息
      headerObj: {
        Authorization:window.sessionStorage.getItem('token')
      },
      // 预览的地址
      previewPath: '',
      // 预览弹出框的显示与否
      previewVisible: false
    
    }
  },

  methods: {
    // tabs切换时
    async tabsClick(){
      if(this.activeIndex == 1){
        // 动态参数
        console.log(this.cateId)
        const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'many'}});
        console.log(res);
        if(res.meta.status != 200) return this.$message.error('动态参数获取失败');
        // 获取成功
        res.data.forEach(item=>{
          item.attr_vals = item.attr_vals.length==0?[]:item.attr_vals.split(' ')
        })
          
        this.manyDataList = res.data;
        console.log(this.manyDataList)
      }else if(this.activeIndex == 2) {
        // 静态参数
        const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:'only'}});
        console.log(res);
        if(res.meta.status != 200) return this.$message.error('静态参数获取失败');
        // 获取成功
        this.onlyDataList = res.data
      }
      
    },
    // 获取商品分类
    async goodsCateList(){
        const {data: res} = await this.$http.get('categories');
        console.log(res)
        if(res.meta.status != 200) return this.$message.error('商品分类数据获取失败')
        this.cateList = res.data;
    },
    // 选中商品分类后触发
    handleChange(){
      console.log(this.addGoodsForm.goods_cat)
      if(this.addGoodsForm.goods_cat.length != 3) {
        return this.addGoodsForm.goods_cat = [];
      }
    },
    // 切换商品之前的钩子
    beforeTabLeave(activeName, oldActiveName){
      console.log(activeName)
      console.log(oldActiveName)
      if(oldActiveName=='0' && this.addGoodsForm.goods_cat.length != 3){
         this.$message.error('请选择商品分类');
         // 切换标签之前的钩子，若返回 false 或者返回 Promise 且被 reject，则阻止切换。
         return false; // 一定要return false，否则程序会向下

      }
    },
    // 点击图片预览时
    handlePreview(file){
      console.log(file)
      this.previewPath = `http://192.168.37.21:8888/${file.response.data.tmp_path}`;  //?
      console.log(this.previewPath)
      this.previewVisible=true;
    },
    // 上传成功时触发
    handleSuccess(response){
      console.log(response)
      if(response.meta.status != 200) {
        return this.$message.error('图片上传失败')
      };
      // 上传成功
      // tmp_path 图片上传后的临时路径，添加到表单中随表单一起提交给后端
      const picInfo = {pic: response.data.tmp_path};
      this.addGoodsForm.pics.push(picInfo)
      console.log(this.addGoodsForm)
    },
    // 图片移除时，移除表单对象中存储的图片地址
    handleRemove(file){
      console.log(file)
      // 获取要删除图片的临时路径
      const filePath = file.response.data.tmp_path;
      // 删除表单中pics中存储的图片地址
      const i = this.addGoodsForm.pics.findIndex(x => x.pic === filePath);
      this.addGoodsForm.pics.splice(i,1);
    },
    // 点击添加商品按钮
     addGoodsBtn(){
        // 预验证
        this.$refs.addGoodsRef.validate( async valid=>{
          // console.log(valid)
          if(!valid) return this.$message.error('请将内容填写完整')
        
        console.log(this.addGoodsForm);
        console.log(this.manyDataList);
        console.log(this.onlyDataList)
        // return;
        // 深拷贝当前的表单， 
        const form = _.cloneDeep(this.addGoodsForm);
        console.log(form)
        // 要求 goods_cat 以','分割的分类列表
        // 级联选择器希望goods_cat是数组，直接修改addGoodsForm会把其变成字符串，双向数据绑定就会报错
        // 这样也没关系是因为级联选择器的v-model绑定值不限制为一定是数组
        // this.addGoodsForm.goods_cat = this.addGoodsForm.goods_cat.join(',');
        // console.log(this.addGoodsForm)
        // return;
        form.goods_cat = form.goods_cat.join(',');
        
        // 处理动态参数列表
        this.manyDataList.forEach(item=>{
          const newInfo = {
            attr_id: item.attr_id,
            attr_value:item.attr_vals.join(' ')
          }
          this.addGoodsForm.attrs.push(newInfo);
        })

        // 处理静态参数
        this.onlyDataList.forEach(item=>{
          const newInfo = {
            attr_id: item.attr_id,
            attr_value:item.attr_vals
          }
          this.addGoodsForm.attrs.push(newInfo);
        })
        form.attrs = this.addGoodsForm.attrs
        console.log(form)

        // 发起请求添加商品
       const {data: res} = await this.$http.post('goods',form);
       console.log(res)
       if(res.meta.status != 201) return this.$message.error('商品创建失败')

       // 创建成功
       this.$message.success('商品创建成功');
       this.$router.push('/goods')
       })
    }

  },
  computed:{
    // 获取选中分类的id
    cateId(){
      if(this.addGoodsForm.goods_cat.length == 3) {
        return this.addGoodsForm.goods_cat[2]
      }
      return null;
    },

  },
  created () {
    this.goodsCateList()
  }
}
</script>

<style lang='less' scoped>
  .el-steps {
    margin: 15px 80px;
    
  }
  .el-tabs {
    margin-bottom: 20px;
  }
  .quill-editor {
    height: 400px;
  }
  .addGoods {
    margin-top: 80px;
  }
</style>
