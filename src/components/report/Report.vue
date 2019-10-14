<template>
  <div>
     <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
       <!-- 2. 为ECharts准备一个具备大小（宽高）的Dom -->
        <div id="main" style="width: 750px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
// 1.导入echart
import echarts from 'echarts'
import _ from 'lodash'
export default {

  data () {
    return {
      // 要合并额数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  // 数据和方法以及页面Dom都渲染完毕
  async mounted(){
     // 3. 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));
    // 获取图表数据
    const {data: res} = await this.$http.get('reports/type/1');
    console.log(res);

    // 获取失败
    if(res.meta.status != 200) return this.$message.error('数据获取失败')

    // 获取成功
     // 4. 准备数据和配置项  合并数据
    const result = _.merge(res.data, this.options)

    // 5. 展示数据
    myChart.setOption(result)
    
  },
  methods: {},
  // created是只渲染了数据和方法，还没渲染页面
  created () {
  }
}
</script>

<style lang='less' scoped>

</style>
