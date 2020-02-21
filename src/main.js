import Vue from 'vue'
import App from './App.vue'

// 饿了么样式
import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui';

Vue.use(ElementUI);

//导入路由对象
import router from './router/index'

//导入全局样式
import "./style/base.css"


Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')

