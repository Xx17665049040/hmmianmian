
// 导入request(公共的请求拦截)
import request from '@/utilis/request.js'

//封装顶部数据
export function getTop(){

    return request({
        url:'/data/title',
        method:'post',
       
    })
}

//封装底部数据
export function statistics(){

    return request({
        url:'/data/statistics',
        method:'post',
       
    })
}