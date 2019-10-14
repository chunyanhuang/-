<template>
  <div>
     <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <!-- 警示框 -->
      <el-alert show-icon 
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning">
      </el-alert>
       <!-- 选择商品分类 -->
      <el-row clas="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 商品级联选择框 -->
          <el-cascader :options="cateList" v-model="selectedCateId" :props="goodsCateProps" @change="goodsCateChange" >
          </el-cascader>
        </el-col>
      </el-row>
      <!-- tab栏 -->
      <el-tabs  v-model="activeName"  @tab-click="tabChange" >

        <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="many">
            <el-button type="primary" size='mini' :disabled="isBtnDisabled" @click="addParamsBtn" >添加参数</el-button>
            <!-- 表格 -->
            <el-table :data="manyList" style="width: 100%" border stripe>
               <el-table-column type="expand">
                 <template slot-scope="scope">
                   <el-tag :key="i" v-for="(item, i) in scope.row.attr_vals" closable :disable-transitions="false" @close="parmasClose(i,scope.row)">  {{item}} </el-tag>
                 <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="paramsInputConfirm(scope.row)" @blur="paramsInputConfirm(scope.row)" > </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showParamsInput(scope.row)">+ New Tag</el-button>
                 </template>
              </el-table-column>
              <el-table-column type="index">
              </el-table-column>
              <el-table-column label="参数名称" prop="attr_name">
              </el-table-column>
               <el-table-column label="操作" >
                  <template slot-scope="scope">
                    <el-button size="mini" type="primary" icon="el-icon-edit" @click="editParams(scope.row.attr_id)">修改</el-button>
                  <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteParams(scope.row.attr_id)">删除</el-button>
                  </template>
              </el-table-column>
            </el-table>
        </el-tab-pane>

        <!-- 静态属性 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size='mini' :disabled="isBtnDisabled" @click="addParamsBtn" >添加属性</el-button>
           <!-- 表格 -->
            <el-table :data="onlyList" style="width: 100%" border stripe>
               <el-table-column type="expand">
                 <template slot-scope="scope">
                   <el-tag :key="i" v-for="(item, i) in scope.row.attr_vals" closable :disable-transitions="false" @close="parmasClose(i,scope.row)">  {{item}} </el-tag>
                 <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="paramsInputConfirm(scope.row)" @blur="paramsInputConfirm(scope.row)" > </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showParamsInput(scope.row)">+ New Tag</el-button>
                 </template>
              </el-table-column>
              <el-table-column type="index">
              </el-table-column>
              <el-table-column label="参数名称" prop="attr_name">
              </el-table-column>
               <el-table-column label="操作" >
                  <template slot-scope="scope">
                    <el-button size="mini" type="primary" icon="el-icon-edit" @click="editParams(scope.row.attr_id)">修改</el-button>
                  <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteParams(scope.row.attr_id)">删除</el-button>
                  </template>
              </el-table-column>
            </el-table>
        </el-tab-pane>
      </el-tabs>

    </el-card>

     <!-- 添加参数弹出框- -->
      <el-dialog
        :title="activeName == 'many'?'添加动态参数':'添加静态属性'"
        :visible.sync="addParamsdDialogVisible"
        width="50%" @close="addParamsClosed" >
        <el-form :model="addParamsForm" :rules="addParamsRules" ref="addParamsRef" label-width="100px" class="demo-ruleForm">
          <el-form-item :label="activeName == 'many'?'动态参数':'静态属性'" prop="attr_name" >
            <el-input v-model="addParamsForm.attr_name" ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addParamsdDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitAddParams">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改参数弹出框 -->
       <el-dialog
        :title="activeName == 'many'?'修改动态参数':'修改静态属性'"
        :visible.sync="editParamsdDialogVisible"
        width="50%" @close="editParamsClosed" >
        <el-form :model="editParamsForm" :rules="editParamsRules" ref="editParamsRef" label-width="100px" class="demo-ruleForm">
          <el-form-item :label="activeName == 'many'?'动态参数':'静态属性'" prop="attr_name" >
            <el-input v-model="editParamsForm.attr_name" ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editParamsdDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitEditParams">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
export default {

  data () {
    return {
      // 商品分类列表
      cateList:[],
      // 当前选中的分类的id数组
      selectedCateId:[],
      goodsCateProps: {
        value:'cat_id',
        label:'cat_name',
        childreb: 'children',
        expandTrigger: 'hover'
      },
      // 激活项
      activeName: 'many',
      // 动态参数： 
      manyList: [],
      // 静态参数数据
      onlyList:[],
      // 添加动态参数弹出框的显示与否
      addParamsdDialogVisible: false,
      // 添加动态参数表单对象
      addParamsForm: {
        attr_name: ''
      },
      // 添加参数表单的验证规则
      addParamsRules: {
        attr_name: [
          { required: true, message: '请输入动态参数', trigger: 'blur' },
        ]
      },
      // 修改动态参数弹出框
      editParamsdDialogVisible:false,
      // 修改参数的表单对象
      editParamsForm:{
        attr_name: ''
      },
      // 修改参数的表单验证规则
      editParamsRules:{
        attr_name: [
          { required: true, message: '请输入动态参数', trigger: 'blur' },
        ]
      },
      
      
    }
  },

  methods: {
    // 获取商品分类列表
    async getCateList(){
        const {data: res} = await this.$http.get('categories');
        // console.log(res)

        if(res.meta.status != 200) return this.$message.error('商品分类数据获取失败')

        this.cateList = res.data;
    },
    // 当分类选择级联框发生变化时触发
    goodsCateChange(){
        this.getParamsData()
      },
    // 获取参数
    async getParamsData(){
        // console.log(this.selectedCateId)
        // 判断所选分类是否是3级
        if(this.selectedCateId.length !== 3) {
            this.selectedCateId=[];
            // 还要清空查找出来的only/many得数组
            this.manyList=[];
            this.onlyList=[];
            return;
        }
        // 发送请求获取参数
        const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`,{params: {sel: this.activeName }});
        // console.log(res)

        if(res.meta.status != 200) return this.$message.error('动态参数获取失败');
        // 将字符串变成数组, 如果是空字符串要返回空数组
        res.data.forEach(item=>{
          item.attr_vals = item.attr_vals.length==0?[]: item.attr_vals.split(' ');
          // 控制输入框的显示与隐藏
          item.inputVisible = false;
          // 输入框内容
          item.inputValue = ''
        })
        console.log(res)
        if(this.activeName == 'many'){
          this.manyList = res.data;
        }else {
           this.onlyList = res.data;
        }
        
    },
    // 切换tab栏
    tabChange(){
      this.getParamsData()
    },
    //----------------添加参数--------  
    // 点击添加参数
    addParamsBtn(){

      this.addParamsdDialogVisible = true;
    },
    // 提交添加的参数
     submitAddParams(){
      this.$refs.addParamsRef.validate(async valid=>{
          if(valid) {
            const {data: res} = await this.$http.post(`categories/${this.cateId}/attributes`,{
              attr_name: this.addParamsForm.attr_name,
              attr_sel: this.activeName
            });
            console.log(res)

            if(res.meta.status != 201) return this.$message.error('动态参数添加失败')

            // c参数添加成功
            this.$message.success('动态参数添加成功')
            this.addParamsdDialogVisible = false;
            this.getParamsData();
          }
      })
       
    },
    // 添加参数对话框关闭事件
    addParamsClosed(){
      this.$refs.addParamsRef.resetFields()
    },
    //-----------------修改参数-----------
     // 点击修改参数按钮
    async editParams(attr_id){
      // 根据id查询参数再渲染到表单, 没有直接将当前行数据渲染到表单，而是根据Id再次查询再渲染，因为可能有多人再操作这个数据库， 所以这样乙方出错
      // console.log(this.cateId)
      const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,{
          attr_sel:this.activeName
      })
      console.log(res)
      if(res.meta.status != 200) return this.$message.error('参数获取失败')

      // 参数获取成功  
      this.editParamsForm.attr_name = res.data.attr_name;
      this.editParamsForm.attr_id = res.data.attr_id;
      // this.editParamsForm = res.data;
      this.editParamsdDialogVisible = true;
        
    },
    // 关闭修改参数的弹出框
    editParamsClosed(){},
    // 提交修改的动态参数
    submitEditParams(){
        // 预验证
        this.$refs.editParamsRef.validate(async valid=>{
          // console.log(valid)
          if(valid) {
              // 发送请求
              const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editParamsForm.attr_id}`, {
                attr_name: this.editParamsForm.attr_name,
                attr_sel: this.activeName
              });
              console.log(res)
              this.getParamsData();
              this.editParamsdDialogVisible = false;
          }
        })
    },
    //---------------删除---------------
    async deleteParams(attr_id){
        const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        console.log(confirmResult)
        if(confirmResult != 'confirm') return this.$message.info('取消删除属性')
        
        // 否则确认了删除
         const {data: res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`);
         console.log(res)
         if(res.meta.status != 200) return this.$message.error('属性删除失败')
         // 删除成功
         this.$message.success('删除参数成功')
         this.getParamsData()
    },
    // ------------------分类参数----------
    // 输入框失去焦点时
    async paramsInputConfirm(row){
        console.log(row)
        console.log(row.inputValue)
        // 关闭输入框
        row.inputVisible = false;
        // 判断输入内容，内容不合法就重置
        if(row.inputValue.trim().length == 0) {
          row.inputValue='';
          return;
        }

        // 不为空，将输入的内容push到参数数组
        row.attr_vals.push(row.inputValue)
        // 清空输入框
         row.inputValue='';
        // 发送请求添加参数
        this.setAttribute(row)    
    },
    // 发送请求添加参数
    async setAttribute(row){
        const {data: res} = await this.$http.put(`categories/${row.cat_id}/attributes/${row.attr_id}`,{
          attr_name: row.attr_name,
          attr_sel: this.activeName,
          attr_vals: row.attr_vals.join(' ')
        });
        console.log(res)
    },
   
    // 点击newTag时显示输入框
    showParamsInput(row){
      console.log(1)
      row.inputVisible = true;
      // 文本框自动获取焦点
      this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
    },
    // 关闭参数时，i是index
    parmasClose(i,row){
      // console.log(item)
      row.attr_vals.splice(i,1);
      this.setAttribute(row)
    }
  },

  created () {
    this.getCateList();
  },
  computed:{
    isBtnDisabled(){
      return this.selectedCateId.length != 3
    },
    // 选择分类后，获取分类Id， 多个地方要用到，所以单独提取出来
    cateId(){
       if(this.selectedCateId.length ==3){
         return this.selectedCateId[2];
        //  console.log(this.cateId)
       }
       return null;
    },

  }
}
</script>

<style lang='less' scoped>
.el-row {
  margin: 20px 0;
  font-size: 18px;
}
.el-cascader {
  margin-left: 10px;
}
.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: middle;
  }
  .el-tag + .el-tag {
    margin: 10px ;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
</style>
