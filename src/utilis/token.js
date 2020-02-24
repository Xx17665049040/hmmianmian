// 因为token要经常被使用,所以单独封装  
//定义一个常量
const TOKENKEY = 'mmtoken'

//获取token   
export function getToken(){
    return window.localStorage.getItem(TOKENKEY)
}

//设置token 有一个参数 接收token
export function setToken(token){

     window.localStorage.setItem(TOKENKEY,token)
}

//删除token
export function removeToken(){
     window.localStorage.removeItem(TOKENKEY)
}