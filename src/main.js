import Vue from 'vue'
import App from './App.vue'

// 饿了么样式
import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui';

Vue.use(ElementUI);

//导入路由对象
import router from './router/index'

//导入vuex
import store from '@/store/index'

//导入全局过滤器
import '@/utilis/filter'  //这里能这样简单导入 是因为不需要引用具体某个方法,只要能执行里面的代码就行

//导入全局样式
import "./style/base.css"   


Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')

