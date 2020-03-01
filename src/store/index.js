//存放vuex的代码
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state:{
        username:"",
        avatar:"",
        //角色
        role:''
    },
    mutations:{
        changeUserName(state,val){
            state.username=val
        },
        changeAvatar(state,val){
            state.avatar=val
        },
        //修改角色的方法
        changeRole(state,val){
            state.role=val
        }
    }
})
export default store;