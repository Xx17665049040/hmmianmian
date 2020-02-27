// 导入Vue
import Vue from 'vue'

//导入NProgress包
import NProgress from 'nprogress'
import  'nprogress/nprogress.css'

import { info} from "@/api/index.js";
import { removeToken} from "@/utilis/token.js";

import { Message } from "element-ui";



// 导入路由
import VueRouter from 'vue-router'

//导入store
import store from '@/store/index'


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
  //路由重定向,什么都不输就自己跳到login
  { path:"/",component:login,meta:{title:"登录"}},

  { path:"/login",component:login,meta:{title:"登录"}},
  
  { path:"/index",component:index,meta:{title:"首页"},children:[
    {path:"user",component:user,meta:{title:"用户列表"}},{path:"chart",component:chart,meta:{title:"数据概览"}},{path:"business",component:business,meta:{title:"企业列表"}},
    {path:"question",component:question,meta:{title:"题库列表"}},{path:"subject",component:subject,meta:{title:"学科列表"}}   ]},       
     
        //meta 路由元信息 标签上可以写任何想记录的东西 常用来设置 标题 获取:在相对应的路由上(this.$route.meta.名字)   
          //设置好了  meta:{title:"首页"} 后 还要在 进入页面后 取出标题 也就是导航守卫里面的afterEach   to参数进入                                                                                  

  // 设置子路由的方法 子路由出口放在哪里,就在那加一个children属性 再加路由路径 子路由的路径写法稍微有不同 不用加/
  
]

// 创建路由对象
const router = new VueRouter({
  routes
})

// 白名单:  现实中有很多页面都不需要登录判断 直接放行 比如注册,广告,新闻,产品展示....因此就有路由白名单,里面存放着一些不需要做验证的路径,遇到这些白名单里的路径就直接放行

let whiteUrl =['/login','/register']



//把导航守卫写在 创建路由对象 的后面
// 这个回调函数 在即将跳转路由之前调用  to:到哪去  from:从哪来  next:是一个函数 调用了才能跳转

// 作用1.:进度条   在即将要跳转的时候 可以放进度条 (npm i --save nprogress) 页面跳转的时候 上面有一根进度线
  // 在beforeeach开始进度条  在aftereach结束进度条

//作用2.token判断前置  发送请求才能判断token是否有效,而axios请求又是异步的,(也是要等界面加载完毕才会发请求,所以这时候可能别人已经看到主页,又因为token不对,重新回去)
//                  所以要把token的判断 放到页面跳转前(路由的跳转之前) 也就是导航守卫beforeeach


router.beforeEach((to, from, next) => {
  //在导航守卫里    
  //1.开始进度条
  NProgress.start();

  //2.判断token真假
    //如果是登录页面不需要判断 直接放行next()   
   if(whiteUrl.includes(to.path)){   //includes   数组.includs() 能判断数组包不包含某个元素     to.path 要去到的页面
     next()
   }else{
     //info()个人信息的axios请求
     info().then(res => {
      //  如果是200 即token没问题,直接放行
        if(res.data.code == 200){
          console.log(res);

          //把服务器返回的用户名取出来存到vuex
          store.commit('changeUserName',res.data.data.username);
          store.commit('changeAvatar',process.env.VUE_APP_URL+'/'+res.data.data.avatar);
          
          next()
        }else{
          //否则1.提示登录异常 2.移除tiken 3.回去登录页 4.可以手动终结进度条

          Message.error('登录状态异常,请重新登录');
        
          removeToken();
         
          NProgress.done()
         
          next('/login')
        }
     })
   }

 

})

//  跳转之后
// 有两个参数选择 1.to 到哪去 2.from从哪来
router.afterEach((to) => {
  // 结束进度条
  NProgress.done();

  //设置标题第二步
  //取出当前要去的页面标签 设置给title
  document.title= to.meta.title
})

// 暴露出去
export default router

