// 开发中路由都是独立放在这里 全局的才放在main.js
import Vue from 'vue'

//导入路由 饿了么
import VueRouter from 'vue-router'
import ElementUI from 'element-ui';

// 注册路由 饿了么
Vue.use(VueRouter)
Vue.use(ElementUI);

//准备组件

//设置路由规则
const routes = []

//创建路由对象
const router =new VueRouter({
  routes
})

//暴露出去
export default router
