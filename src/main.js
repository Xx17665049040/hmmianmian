import Vue from 'vue'
import App from './App.vue'

// 饿了么样式
import 'element-ui/lib/theme-chalk/index.css';

//导入路由对象
import router from './router/index'


Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')

