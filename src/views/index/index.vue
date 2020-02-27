<template>
  <el-container class="my-container">
    <el-header class="my-header">
      <div class="left">
          <!-- 这个图标需要控制导航栏的展开折叠,所以需要加取反 来控制true false -->
          <!-- 这里的class图标 不要写死 要随着isCollapse的结果 来换另一个图标  用三元表达式 -->
        <i @click="isCollapse=!isCollapse" :class="isCollapse? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
        <img src="./images/logo.png" alt="" />
        <span>黑马面面</span>
      </div>
      <div class="right">
        <img :src="$store.state.avatar" alt="" />
        <span class="name">{{ $store.state.username }},你好</span>
        <el-button @click="doLogout" type="primary" size="small"
          >退出</el-button
        >
      </div>
    </el-header>

    <el-container>
        <!-- 左侧导航栏 -->
        <!-- 这里的width不能写死,要随着内容折叠变小 只要换成auto -->
      <el-aside class="my-asid" width="auto">
          <!-- :collapse="isCollapse" 用来控制折叠或者展开   写上router 代表启用路由模式 点击菜单会跳转 到修改子标题的index路径-->
          <el-menu :collapse="isCollapse" router="" default-active="1" class="el-menu-vertical-demo">
            <el-menu-item index="/index/chart">
               <i class="el-icon-pie-chart"></i>
               <span slot="title">数据概览</span>
             </el-menu-item> 

             <el-menu-item index="/index/user">
               <i class="el-icon-user"></i>
               <span slot="title">用户列表</span>
             </el-menu-item> 

            <el-menu-item index="/index/question">
               <i class="el-icon-edit-outline"></i>
               <span slot="title">题库列表</span>
             </el-menu-item> 

             <el-menu-item index="/index/business">
               <i class="el-icon-office-building"></i>
               <span slot="title">企业列表</span>
             </el-menu-item> 

             <el-menu-item index="/index/subject">
               <i class="el-icon-notebook-2"></i>
               <span slot="title">学科列表</span>
             </el-menu-item> 
          </el-menu>
      </el-aside>

      <!-- 这个区域需要显示不同的页面,就在这里放子路由出口,也就是需要路由嵌套 -->
      <el-main class="my-main">

          <router-view></router-view>

      </el-main>
    </el-container>
  </el-container>
</template>

<script>
//导入个人信息接口
import { logout } from "@/api/index.js";
//导入操作token接口
import { removeToken,getToken} from "@/utilis/token.js";

// import store from '@/store/index.js'
export default {
  data() {
    return {
      // username: "",
      // avatar: "",
      isCollapse:false
    };
  },
  //判断是否登录 越早越好 如果登录了就有token 没有登录就没有 要判断getToken()==null  如果没有返回登录页面
  //写在beforecreat里面 因为他比较早 也不需要访问页面data数据 直接判断就行

  beforeCreate(){   //如果没有登录就输入网址 就不要让进去
    if( getToken()==null ){
      this.$message.error('请先登录'),
      this.$router.push('/login')
    }
    // document.title='首页'
  },

  created() {
    //获取个人信息的请求  
    //要判断loken的值是否正确 如果正确 就将返回信息渲染 不正确回到登录页 清除错误token

    // info().then(res => {
    //   // console.log(res),
    //   if(res.data.code==200){
    //     this.username = res.data.data.username;
    //     // 记得在前面还要拼接基地址，因为返回的头像路径不完整，要拼接
    //     // 还要拼接/，不然就连在一起了
    //     this.avatar = process.env.VUE_APP_URL + "/" + res.data.data.avatar
    //   }else if(res.data.code == 206){
    //     this.$message.error('登录状态异常,请重新登录')
    //     this.$router.push('/login');
    //     removeToken()
    //   }
       
    // });
  },
  methods: {
    doLogout() {
      this.$confirm("您将退出登录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
         //确定就调用.then  发请求退出 再删除token,并跳转登录页
         logout().then(()=>{
            this.$message.success("退出成功");
            removeToken();
            this.$router.push("/login")
            //退出后 头像信息都还在 需要清除vuex的东西 赋值为空就行
            this.$store.commit.changeUserName=""
            this.$store.commit.changeAvatar=""

         })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消本次退出"
          });
        });
    }
  }
};
</script>

<style lang="less">
.my-container {
  width: 100%;
  height: 100%;
//   background: rgba(232, 233, 236, 1);
  .my-header {
    width: 100%;
    height: 60px;
   
    display: flex;
    justify-content: space-between;
    .left {
      display: flex;
      align-items: center;
      height: 100%;
      i {
        font-size: 24px;
        margin-right: 22px;
      }
      img {
        width: 33px;
        height: 28px;
        margin-right: 11px;
      }
      span {
        width: 92px;
        height: 22px;
        font-size: 22px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: rgba(73, 161, 255, 1);
      }
    }
    .right {
      display: flex;
      align-items: center;
      height: 100%;
      img {
        margin-right: 9px;
        width: 43px;
        height: 43px;
      }
      .name {
        font-size: 14px;
        margin-right: 38px;
      }
    }
  }
  
   .my-main {
    background-color:  rgba(232, 233, 236, 1);
  }
//   这几行代码是饿了么复制的,能控制展开折叠时候 动画流畅
  .el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
    }
}
</style>
