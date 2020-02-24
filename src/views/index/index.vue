<template>

   <el-container class="my-container">
        <el-header class="my-header">
            <div class="left">
                <i class="el-icon-s-fold"></i>
                <img src="./images/logo.png" alt="">
                <span>黑马面面</span>
            </div>
            <div class="right">
                <img src="./images/logo.png" alt="">
                <span class="name">李达,你好</span>
                <el-button type="primary" size="small">退出</el-button>
            </div>

        </el-header>
        <el-container>
          <el-aside class="my-asid" width="200px">Aside</el-aside>
          <el-main class="my-main">Main</el-main>
        </el-container>
  </el-container>

</template>

<script>
export default {
    
}
</script>

<style lang="less">
    .my-container{
        width: 100%;
        height: 100%;
        background:rgba(232,233,236,1);
        .my-header{
            width: 100%;
            height:60px;
            background:rgba(255,255,255,1);
            box-shadow:0px 2px 5px 0px rgba(63, 63, 63, 0.35);
            display: flex;
            justify-content: space-between;
            .left{
                display: flex;
                align-items: center;
                height: 100%;
                i{
                    font-size: 24px;
                    margin-right: 22px;
                }
                img{
                    width: 33px;
                    height: 28px;
                    margin-right: 11px;
                }
                span{
                    width:92px;
                    height:22px;
                    font-size:22px;
                    font-family:Microsoft YaHei;
                    font-weight:bold;
                    color:rgba(73,161,255,1);
                }
            }
            .right{
                display: flex;
                align-items: center;
                height: 100%;
                img{
                    margin-right: 9px;
                    width:43px;
                    height:43px;
                }
                .name{
                    font-size: 14px;
                    margin-right: 38px;
                }

            }
        }
        .my-asid{
            width:201px;
            height:100%;
            background:rgba(255,255,255,1);
            box-shadow:0px 2px 5px 0px rgba(63, 63, 63, 0.35);
        }
        .my-main{
            background-color: yellow;
             height:100%;
            box-shadow:0px 2px 5px 0px rgba(63, 63, 63, 0.35);
            background:rgba(255,255,255,1);

        }

    }
 
</style>