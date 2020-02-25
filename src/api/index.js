// 封装首页用到的接口
import axios from 'axios'
import { getToken } from '@/utilis/token.js'

// axios的create方法  给axios创建一份副本(相当于把axiso对象克隆出来一份)  
// 可以用来优化代码 给新克隆出来的对象设置一些共有的属性,例如共有的基地址,请求头 例如用设置好的indexRequest来发请求,会自带基地址和请求头

let indexRequest = axios.create({
    //基地址
    baseURL:process.env.VUE_APP_URL,
    //请求头
    //因为接口文件index.js 是在项目一启动就执行,(所有导入的js文件 都是在项目启动就执行) 而此时是第一次访问网站,那么肯定没有token,
    //就导致了你的请求头headers里面的token是null,所以会出现登进去不能及时显示用户信息
    //为什么刷信又有了  那是因为重新启动了项目 此时token已经被保存,所以再执行index.js的时候 就能读取到token了

    //解决办法:  不要页面一加载就设置token给请求头,因为那时候还没有token,等发请求的时候 再获取token
            //  方法1 不要在这里设置请求头,请求头写回请求方法中  比较麻烦

            // 主要方法 -- axios的请求拦截 (只要axios发的请求 都会拦截下来)

    // headers:{
    //     token:getToken()
    // },
    // withCredentials:true  
})

//添加请求拦截 把axios替换成indexRequest  意思是 只要indexRequest发的请求 都会被拦截

indexRequest.interceptors.request.use(function(config) {
    config.headers.token=getToken()  //代表每次首页里的请求都会被拦下来,并且加一个token

    //在发送之前做些什么
    return config
},function(error){
    //对请求错误做些什么
    return Promise.reject(error)
    }
)

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
