//存放vuex的代码
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state:{
        username:"",
        avatar:""
    },
    mutations:{
        changeUserName(state,val){
            state.username=val
        },
        changeAvatar(state,val){
            state.avatar=val
        }
    }
})
export default store;