<template>
  <el-dialog title="用户注册" center width="603px" :visible.sync="dialogFormVisible">
    <el-form :model="form" :rules="rules" ref="regForm">

    <el-form-item label="头像" prop="avatar" :label-width="formLabelWidth">
        <!-- 头像上传 1.动态修改action属性 改成自己的接口地址 2.要上传的键值name属性 改成image 默认是file -->
         <el-upload 
            v-model="form.avatar"
            name="image"
            class="avatar-uploader"
            :action="uploadUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
       </el-form-item>

      <el-form-item label="昵称" prop="name" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="邮箱" prop="email" :label-width="formLabelWidth">
        <el-input v-model="form.email" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="手机" prop="phone" :label-width="formLabelWidth">
        <el-input v-model="form.phone" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="密码" prop="password" :label-width="formLabelWidth">
        <el-input show-password v-model="form.password" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="图形码" prop="imgCode" :label-width="formLabelWidth">
        <el-row>
          <el-col :span="16">
            <el-input v-model="form.imgCode" autocomplete="off"></el-input>
          </el-col>
          <el-col :span="7" :offset="1">
            <img class="img_code" @click="getNewCode" :src="picCodeUrl" alt />
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="验证码"  prop="rcode" :label-width="formLabelWidth">
        <el-row>
          <el-col :span="16">
            <el-input v-model="form.rcode" autocomplete="off"></el-input>
          </el-col>
          <el-col :span="7" :offset="1">
            <!-- 
              倒计时不为0禁用按钮
              倒计时不为0，代表还有倒计时在数，所以按钮就不能被点，不能被点就是要禁用他
            -->
            <el-button
              :disabled="sec != 0"
              @click="getPhoneCode"
            >{{ sec == 0 ? '获取用户验证码' : '还有' + sec + '秒' }}</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="doReg">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// import axios from "axios";
// 导入某个文件的方法的 写法
// import {sendMS,register} from  '../api/register.js'

import {sendMS,register} from '@/api/register.js'
    // 这里{}写法不懂  @是vue-cli提供的符号 只有在这里能用 代表的是src这个文件 意思就是从src开始找

export default {
  name:"reg",
  data() {
    return {
      // 倒计时的秒数
      sec: 0,

      // 图形验证码的接口地址
      picCodeUrl: process.env.VUE_APP_URL + "/captcha?type=sendsms",

      // 是否显示对话框
      dialogFormVisible: false,

      // 设置文字宽度
      formLabelWidth: "65px",

     // 上传头像的图片临时路径
      imageUrl: '',
      //要上传的图片接口
      uploadUrl:process.env.VUE_APP_URL+"/uploads",

      // 跟表单元素双向绑定的对象
      form: {
        name: "",
        email: "",
        phone: "",
        password: "",
        imgCode: "",
        // 头像地址
        avatar:"",
        //验证码
        rcode:""
      },

      // 规则对象
      rules: {
        avatar:[{required: true, message: "头像不能为空", trigger: "change" }],
        imgCode:[{required: true, message: "图片验证码不能为空", trigger: "blur" },{length:4,message: "图片验证码只能是四位数", trigger: "blur"}],
        name: [{ required: true, message: "昵称不能为空", trigger: "blur" }],
        email: [
          { required: true, message: "邮箱不能为空", trigger: "blur" },

          {
            pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
            message: "邮箱格式不正确",
            trigger: "blur"
          }
        ],
        phone: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          {
            pattern: /0?(13|14|15|18|17)[0-9]{9}/,
            message: "手机号格式错误",
            trigger: "blur"
          }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 5, max: 14, message: "长度在5-14之间", trigger: "blur" }
        ]
      }
    };
  },

  methods: {
    //   判断不能为空

     doReg() {
      // 找到表单对象，调用validate方法
      this.$refs.regForm.validate(v => {
        if (v) {
        //   alert("全部通过");
        // 校验成功就 调用注册方法
            register({
               username:this.form.name,
               phone:this.form.phone,
               email:this.form.email, 
               avatar:this.form.avatar,
               password:this.form.password,
               rcode:this.form.rcode
            }).then(res=>{
                window.console.log("验证信息",res)
                if(res.data.code==200){
                    // 注册成功,
                    this.$message.success('注册成功')
                    //关闭注册框
                    this.dialogFormVisible = false
                    //注册成功后,要重置表单为空 方法在饿了么找   此时图片清空不了 因为img不是表单元素
                    this.$refs.regForm.resetFields()
                    this.imageUrl=""
                }else{
                    //注册失败,弹出失败信息
                    this.$message.error(res.data.message)
                }
            })
        }
      });
     },
      //上传的头像照片
      // 上传成功的钩子函数 
        handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
                                //表单验证 验证的是表单元素的值 而不是imguurl有没有值  img不是表单元素
                                //为什么img有值，表单元素没值，那是因为上传成功只给img赋值了， 但是表单元素绑定的头像属性还是没有值，
                                //所以当表单校验的时候还是觉得你的头像是为空的
                                //上传成功 还要将服务器上的路径file_path  (log出来可以看到) 赋值给avatar
        this.form.avatar= res.data.file_path
        //依然校验不成功,是因为是手动赋值的 还需要单独对他校验  校验方法 饿了么上有  this.$refs.表单名.validateField("需要校验的名字")
        this.$refs.regForm.validateField("avatar")
      },
      //  上传之前的钩子函数 修改图片的类型限制
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg'||'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error('上传头像图片只能是图片格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },

    // 图片的点击事件
    getNewCode() {
      // 浏览器缓存机制
      // 浏览器发现你这次请求，我刚刚才请求过，他就不会真的去发请求，而是会把上次请求得到的结果
      // 再拿出来用
      // 专门用来解决请求缓存的两套方案
      // 1. 随机数（用的少一点）
      // 2. 时间戳（用的多一点）
      // this.picCodeUrl = process.env.VUE_APP_URL +  "/captcha?type=sendsms&sb=" + Math.random()

      // 2.时间戳
      this.picCodeUrl =
        process.env.VUE_APP_URL + "/captcha?type=sendsms&sb=" + Date.now();
    },

    // 获取手机验证码的点击事件
    getPhoneCode() {
        //先判断手机号是否合格
        // 这里有问题 正则判断对象

        // if(! (/0?(13|14|15|18|17)[0-9]{9}/.test(this.from.phone))){
        //     //取反 如果不合格 不往下执行 
        //    return this.$message.success('手机号码不正确')  
        // }

        // //判断验证码是否四位
        // if(this.from.imgCode.length!= 4){
        //     return this.$message.error('验证码长度不对')
        // }

      this.sec = 60;
      // 写一个每隔一秒触发的计时器
      // 这里一定要传箭头函数
      let timerID = setInterval(() => {
        this.sec--;
        // 如果倒计时为0，就要停止计时器了
        if (this.sec == 0) {
          clearInterval(timerID);
        }
      }, 1000);

     // 发送短信的axios已经封装在register.js里面 调用就行
     sendMS({
           code: this.form.imgCode,
           phone: this.form.phone
        })
        .then(res => {
        window.console.log(res);
        if(res.data.code == 200){
          // 获取验证码成功
          this.$message.success('获取验证码成功，验证码为' + res.data.data.captcha)
        }else{
          this.$message.error(res.data.message)
        }
      });

   
    }
  }
};
</script>

<style lang="less">
.el-dialog__header {
  background: linear-gradient(to right, #11bfee, #2491e9);
}

.el-dialog__title {
  color: white;
  font-size: 17px;
}

.img_code {
  width: 100%;
  height: 41px;
  vertical-align: top;
}

 .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .avatar-uploader{
      text-align: center
  }
</style>