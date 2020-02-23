
import axios from 'axios'


//需要被调用 要暴露出去
//把接口需要的数据,当做data传入
export function login(data){
   return  axios({
        url: process.env.VUE_APP_URL + "/login",
        method: "post",
        data,
        // 允许携带cookie
        withCredentials:true  
   })
}