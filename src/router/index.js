// 导入Vue
import Vue from 'vue'

// 导入路由
import VueRouter from 'vue-router'

// 注册路由
Vue.use(VueRouter)

// 准备组件
import login from "../views/login/index.vue"
import index from "../views/index/index.vue" 
import user from "../views/index/user/index.vue"

// 设置路由规则
const routes = [
  { path:"/login",component:login },
  { path:"/index",component:index,children:[
    {path:"user",component:user}
    ]},

  // 设置子路由的方法 子路由出口放在哪里,就在那加一个children属性 再加路由路径 子路由的路径写法稍微有不同 不用加/
  
]

// 创建路由对象
const router = new VueRouter({
  routes
})

// 暴露出去
export default router