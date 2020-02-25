// 导入Vue
import Vue from 'vue'

//导入NProgress包
import NProgress from 'nprogress'
import  'nprogress/nprogress.css'

// 导入路由
import VueRouter from 'vue-router'

// 注册路由
Vue.use(VueRouter)

// 准备组件
import login from "../views/login/index.vue"
import index from "../views/index/index.vue" 

import user from "../views/index/user/user.vue"
import chart from "../views/index/chart/chart.vue"
import business from "../views/index/business/business.vue"
import question from "../views/index/question/question.vue"
import subject from "../views/index/subject/subject.vue"



// 设置路由规则
const routes = [
  { path:"/login",component:login },
  { path:"/index",component:index,children:[
    {path:"user",component:user},{path:"chart",component:chart},{path:"business",component:business},
    {path:"question",component:question},{path:"subject",component:subject},
    ]},

  // 设置子路由的方法 子路由出口放在哪里,就在那加一个children属性 再加路由路径 子路由的路径写法稍微有不同 不用加/
  
]

// 创建路由对象
const router = new VueRouter({
  routes
})

//把导航守卫写在 创建路由对象 的后面
// 这个回调函数 在即将跳转路由之前调用  to:到哪去  from:从哪来  next:是一个函数 调用了才能跳转

// 作用:在即将要跳转的时候 可以放进度条 (npm i --save nprogress) 页面跳转的时候 上面有一根进度线
  // 在beforeeach开始进度条  在aftereach结束进度条


router.beforeEach((to, from, next) => {
  // to and from are both route objects. must call `next`.

  //开始进度条
  NProgress.start();

  next()

})

//  跳转之后
router.afterEach(() => {

  // 结束进度条
  NProgress.done();

})

// 暴露出去
export default router