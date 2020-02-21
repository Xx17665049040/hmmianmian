import Vue from 'vue'
import App from './App.vue'

// 饿了么样式
import 'element-ui/lib/theme-chalk/index.css';


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


Vue.config.productionTip = false

new Vue({
 
  render: h => h(App),
  router
}).$mount('#app')
