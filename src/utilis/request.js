//把各个请求文件 相同的代码块 封装在这里 别的请求页面直接导入request 再直接写请求接口

import axios from "axios"
import {getToken} from '@/utilis/token.js'



//   (可以去之前配置过的请求页面 复制)
let request = axios.create({
    baseURL:process.env.VUE_APP_URL,
    withCredentials:true 
})

//添加请求拦截 
request.interceptors.request.use(function(config) {
    config.headers.token=getToken()  //代表每次首页里的请求都会被拦下来,并且加一个token

    //在发送之前做些什么
    return config
},function(error){
    //对请求错误做些什么
    return Promise.reject(error)
    }
)

export default request