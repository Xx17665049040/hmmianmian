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

//导入子路由
import children from './childrenRouter.js'


// 设置路由规则
const routes = [
  //路由重定向,什么都不输就自己跳到login
  { path:"/",component:login,meta:{title:"登录",roles:['超级管理员','管理员','老师','学生']} },

  { path:"/login",component:login,meta:{title:"登录"}},
  
  { path:"/index",component:index,meta:{title:"首页",roles:['超级管理员','管理员']},
    children:children
  //子路由的东西封装在childrenRouter.js了
}  
]  
     
        //meta 路由元信息 标签上可以写任何想记录的东西 常用来设置 标题 获取:在相对应的路由上(this.$route.meta.名字)   
          //设置好了  meta:{title:"首页"} 后 还要在 进入页面后 取出标题 也就是导航守卫里面的afterEach   to参数进入                                                                                  

  // 设置子路由的方法 子路由出口放在哪里,就在那加一个children属性 再加路由路径 子路由的路径写法稍微有不同 不用加/
  
  //权限设置: 每个路由都应该设置不同的角色来访问,也就是说需要在meta标签里,写上 roles:[] 设置谁可以访问


// 创建路由对象
const router = new VueRouter({
  routes
})

// 白名单:  现实中有很多页面都不需要登录判断 直接放行 比如注册,广告,新闻,产品展示....因此就有路由白名单,里面存放着一些不需要做验证的路径,遇到这些白名单里的路径就直接放行

let whiteUrl =['/login','/register']




//把导航守卫写在 创建路由对象 的后面
// 这个回调函数 在即将跳转路由之前调用  to:到哪去(能看到去哪的路径)  from:从哪来  next:是一个函数 调用了才能跳转

// 作用1.:进度条   在即将要跳转的时候 可以放进度条 (npm i --save nprogress) 页面跳转的时候 上面有一根进度线
  // 在beforeeach开始进度条  在aftereach结束进度条

//作用2.token判断前置  发送请求才能判断token是否有效,而axios请求又是异步的,(也是要等界面加载完毕才会发请求,所以这时候可能别人已经看到主页,又因为token不对,重新回去)
//                  所以要把token的判断 放到页面跳转前(路由的跳转之前) 也就是导航守卫beforeeach

//作用3. 权限设置  一: 在获取info信息的时候 就进行判断状态 是启用1还是禁用0
          //     二:该用户如果是启用的 还要进行 是否有没有权限进行访问 
           //     用to.meta.roles可以得到这个要去的页面里 哪些角色是可以访问的 如果该用户不在访问角色对象里 那么他就不能进这个页面

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
     
        if(res.data.code == 200){
          console.log(res);

          // 请求到数据后 还要进行状态的判断
          if(res.data.data.status==1){
             //把服务器返回的用户名取出来存到vuex
             store.commit('changeUserName',res.data.data.username);
             store.commit('changeAvatar',process.env.VUE_APP_URL+'/'+res.data.data.avatar);
             
             // 从登录跳过来的，才提示登录成功 别的页面跳转就不会显示登录成功了
              if(from.path == '/login'){

                Message.success('登录成功')
              }

            // 状态判断后还要 进行权限判断   //to.meta.roles这里存放了可以访问页面的 角色对象(有权限的对象们)
            //将res.data.data.role存在vuex 因为在首页要用
            store.commit('changeRole',res.data.data.role)
            if (to.meta.roles.includes(res.data.data.role)) {
              next()
            } else {

              //代表没有权限访问，就从哪来的就回到哪
              Message.warning('该页面，你无权访问！')
              NProgress.done();
              next(from.path)
            }
            
           }else{
             //如果状态是禁用: 弹出消息 终结进度条 回到login页面
             Message.warning('账号被禁用,请和管理员联系')
             NProgress.done()
             next('/login')
           }
       
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

