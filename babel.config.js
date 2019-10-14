// 这是项目上线所用到的插件
const prodPlugins=[]
// 发布阶段就移除console,
if(process.env.NODE_ENV == 'production') {
  prodPlugins.push('transform-remove-console')
}
module.exports = {
  "presets": [
    "@vue/app"
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ],
    // 发布产品时的插件
    ...prodPlugins,
     //配置路由懒加载插件
     "@babel/plugin-syntax-dynamic-import"
  ]
}