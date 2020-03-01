// import axios from "axios"
// import {getToken} from '@/utilis/token.js'

// 导入request(公共的请求拦截)
import request from '@/utilis/request.js'



// //   (可以去之前配置过的请求页面 复制)
// let bRequest = axios.create({
//     baseURL:process.env.VUE_APP_URL,
//     withCredentials:true 
// })

// //添加请求拦截 
// bRequest.interceptors.request.use(function(config) {
//     config.headers.token=getToken()  //代表每次首页里的请求都会被拦下来,并且加一个token

//     //在发送之前做些什么
//     return config
// },function(error){
//     //对请求错误做些什么
//     return Promise.reject(error)
//     }
// )

//封装企业列表接口
export function businessList(params){

    return request({
        url:'/enterprise/list',
        method:'get',
        params
    })
}

//企业添加
export function businessAdd(data){

    return request({
        url:'/enterprise/add',
        method:'post',
        data
    })
}

//企业修改状态
export function businessStatus(data){

    return request({
        url:'/enterprise/status',
        method:'post',
        data
    })
}

//企业删除
export function businessDell(data){

    return request({
        url:'/enterprise/remove',
        method:'post',
        data
    })
}

//企业编辑
export function businessEdit(data){

    return request({
        url:'/enterprise/edit',
        method:'post',
        data
    })
}