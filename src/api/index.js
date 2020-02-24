// 封装首页用到的接口
import axios from 'axios'
import { getToken } from '@/utilis/token.js'

// axios的create方法  给axios创建一份副本(相当于把axiso对象克隆出来一份)  
// 可以用来优化代码 给新克隆出来的对象设置一些共有的属性,例如共有的基地址,请求头 例如用设置好的indexRequest来发请求,会自带基地址和请求头

let indexRequest = axios.create({
    //基地址
    baseURL:process.env.VUE_APP_URL,
    //请求头
    headers:{
        token:getToken()
    },
    // withCredentials:true  
})

//用户信息
export function info(){
    // axios({
    //     url:process.env.VUE_APP_URL+'/info' ,
    //     method:'get',
    //     //从本地存储中读取token
    //     headers:{
    //         token: getToken()
    //     }
    // }).then(res=>{
    //     //成功回调
    //     console.log(res)
    // });

    //优化
    return indexRequest({
        url:'/info',
        method:'get',
    })
}

//请求退出
export function logout(){
    // axios({
    //     url:process.env.VUE_APP_URL+'/logout',
    //     method:'get',
    //     headers:{
    //         token: getToken()
    //     }
    // }).then(res=>{
    //     //成功回调
    //     console.log(res)
    // });

    //优化
    return indexRequest({
        url:'/logout',
        method:'get',
    })
}
