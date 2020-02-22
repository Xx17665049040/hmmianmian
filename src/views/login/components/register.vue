<template>
     <!-- 注册对话框 -->
     <el-dialog title="用户注册" :visible.sync="dialogFormVisible" width="603px" center >

        <el-form :model="form" :rules="rules">

          <el-form-item label="昵称" :label-width="formLabelWidth" prop="name">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="邮箱" :label-width="formLabelWidth" prop="mail">
            <el-input v-model="form.mail" autocomplete="off"></el-input>
          </el-form-item> 

           <el-form-item label="手机" :label-width="formLabelWidth" prop="phone">
            <el-input v-model="form.phone" autocomplete="off"></el-input>
          </el-form-item>

           <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
            <el-input v-model="form.password" autocomplete="off"></el-input>
          </el-form-item>

           <el-form-item label="图形码" :label-width="formLabelWidth">
               <el-row>
                   <el-col :span="16">
                        <el-input v-model="form.code" autocomplete="off"></el-input>
                   </el-col>
                   <el-col :span="7" :offset="1">
                       <!-- 图片会超出,设置宽度100% -->
                       <!-- 栅格布局里的偏移   :offset  也算24份里的 超过24会挤下去-->
                       <img class="img_code" @click="changeCode" :src="picCode" alt="">
                   </el-col>
               </el-row>
          </el-form-item>

           <el-form-item label="验证码" :label-width="formLabelWidth">
               <el-row>
                   <el-col :span="16">
                        <el-input v-model="form.imgcode" autocomplete="off"></el-input>
                   </el-col>
                   <el-col :span="7" :offset="1">
                      <!-- :disabled="sec!=0" 倒计时不为0 就要禁用按钮 -->
                      <el-button :disabled="sec!=0" @click="getPhoneCode" >{{sec == 0 ?'获取用户验证码':'还有'+sec+'秒'}}</el-button>
                   </el-col>
               </el-row>
          </el-form-item>

        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>

      </el-dialog>
</template>

<script>
import axios from 'axios'
export default {
    data(){
         return{

              // 对话框
             dialogFormVisible:false,
             //文字右边  与左边框的距离 
             formLabelWidth:'65px',
            //  验证码接口地址
            picCode:process.env.VUE_APP_URL+"/captcha?type=sendsms",
            //用来倒计时 和 判断控制按钮是否禁用
            sec:0,

             form:{
                 name:"",
                 mail:"",
                 phone:"",
                 password:"",
                 imgcode:'',
                },
              // 规则对象
             rules: {
              name: [{ required: true, message: "昵称不能为空", trigger: "blur" }],
              mail: [{ required: true, message: "邮箱不能为空", trigger: "blur" },
                     {pattern:/\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/, message: "邮箱格式错误", trigger: "blur" }],
              phone: [{ required: true, message: "手机号不能为空", trigger: "blur" },
              {pattern:/0?(13|14|15|18|17)[0-9]{9}/, message: "手机格式错误", trigger: "blur" }],
              password:[{ required: true, message: "密码不能为空", trigger: "blur" },
              {min:5,max:14,message:"长度在4-14位数",trigger:"change"}]
             }
        }
    },
    methods: {
        // 获取图形验证码 
        changeCode(){
            // 这里有浏览器缓存机制问题,浏览器发现刚才请求了,就会把刚才的结果还给你,
            // 解决浏览器缓存的两套方案   加一个随机数或者时间戳  时间戳用的多
            this.picCode=process.env.VUE_APP_URL+"/captcha?type=sendsms"+ Date.now()
        },
        // 获取手机验证码 
        getPhoneCode(){
            this.sec=60;
            let timeId= setInterval(()=>{
                this.sec--;
                //倒计时为0结束计时
                if(this.sec==0){
                    clearInterval(timeId)
                }
            },1000);

            //点击的同时除了倒计时 还要发请求
            //axios发请求 默认不会携带cookie  需要写 withCredentials:true
            axios({
                url:process.env.VUE_APP_URL+'/sendsms',
                method:'post',
                data: { code:this.form.imgcode , 
                         phone:this.form.phone
                         },
               withCredentials: true
            
            }).then(res=>{
                //成功回调
                window.console.log(res)
                if(res.data.code==200){
                    alert('验证码为'+res.data.data.captcha)
                }else{
                    alert(res.data.message)
                }
            });
        }
    },
}
</script>

<style lang="less">
        .el-dialog__header{
            background:linear-gradient(to right,rgb(1, 197, 251),rgb(20, 149, 253))
        }
        .el-dialog__title{  //放里面层级权重不够 试着拿出来
            color:white;
            font-size:17px
        }
        .img_code{
            width: 100%;
            height: 41px;
            vertical-align: middle;
        }
        
</style>