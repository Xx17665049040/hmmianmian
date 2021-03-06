// import axios from "axios"
// import { getToken } from '@/utilis/token.js'


// //   (可以去之前配置过的请求页面 复制)
// let subjectRequest = axios.create({
//     baseURL:process.env.VUE_APP_URL,
//     withCredentials:true 
// })

// //添加请求拦截 
// subjectRequest.interceptors.request.use(function(config) {
//     config.headers.token=getToken()  //代表每次首页里的请求都会被拦下来,并且加一个token

//     //在发送之前做些什么
//     return config
// },function(error){
//     //对请求错误做些什么
//     return Promise.reject(error)
//     }
// )

// 导入request(公共的请求拦截)
import request from '@/utilis/request.js'

//封装学科请求的接口
export function subjectList(params){

    return request({
        url:'/subject/list',
        method:'get',
        params
    })
}

//封装一个修改学科状态的接口
export function subjectStatus(data){
    
    return request({
        url:'/subject/status',
        method:'post',
        data
    })
}

//封装一个添加学科的接口
export function subjectAdd(data){
    
    return request({
        url:'/subject/add',
        method:'post',
        data
    })
}

//封装一个编辑学科的接口
export function subjectEdit(data){
    
    return request({
        url:'/subject/edit',
        method:'post',
        data
    })
}


//封装一个删学科的接口
export function subjectDel(data){
    
    return request({
        url:'/subject/remove',
        method:'post',
        data
    })
}