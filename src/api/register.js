//注册接口都在这里

import axios from 'axios'


//需要被调用 要暴露出去
//把接口需要的数据,当做data传入
export function sendMS(data){
    // 直接return出去,再调用函数sendMS就行
   return  axios({
        url: process.env.VUE_APP_URL + "/sendsms",
        method: "post",
        data,
        // 允许携带cookie
        withCredentials:true  
    })

    //不要在这里写.then 不灵活 直接return出去 方便调用用
    // .then(res=>{
    //     //成功回调
    //     console.log(res)
    // });
}

//注册的请求
export function register(data){
    return axios({
        url:process.env.VUE_APP_URL +'/register',
        method:"post",
        data,
        withCredentials:true  
    })
}