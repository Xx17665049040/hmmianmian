//设置全局过滤器
import Vue from 'vue'
import moment  from 'moment'
//过滤器有两个参数 1.过滤器名字  2.function(value)  value是事件格式 年-月-日
//处理日期 还要用到moment库 要下载
Vue.filter( 'formatTime',function(value){
    return moment(value).format('YYYY-MM-DD')
})


//这里写完了 还要去main.就是导入 才算全局