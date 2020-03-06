<template>
<!-- 这里封装的选项的每一项,所以不是在这里进行v-for  这里只写选项  在外面v-for再生成四个-->
  <div class="options">
    <!-- 按条件isRadio来显示单选还是多选  在多选框加一个isRadio=false,-->
    <el-radio v-if="isRadio" :label="label"></el-radio>
    <el-checkbox v-else :label="label"></el-checkbox>
    <el-input class="input" v-model="selfText" @input="onInput"> </el-input>  

    <el-upload class="avatar-uploader"  
     :action="uploadUrl"   
      :show-file-list="false"  
      :on-success="handleAvatarSuccess"   
      :before-upload="beforeAvatarUpload" >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>

  </div>

</template>

<script>
export default {
  //需要把父组件中的 存放选项内容select_options  传过来
    props:{
      label:String,
      text:String,
      image:String,
      isRadio:{
        type:Boolean,
        default:true
      }
    },
    
    data() {
        return{
            // input和图片的内容因为会发生改变,所以要另外取一个名字,否则的话 他改变,那么父组件的也会直接改变 这是不允许的 
            selfText:this.text,
            imageUrl:this.image,
            uploadUrl:process.env.VUE_APP_URL+'/question/upload',
            
        }
    },
    methods: {
      //将输入框内容传到父组件  用sync的方法 (子组件 用update:传值对象名 , 子组件输入框绑定的名字) 父组件 :text.sync
        onInput(){
          this.$emit('update:text',this.selfText)
        },

          //文件上传的 方法  res就是响应报文 里面有上传成功后的图片地址
        handleAvatarSuccess(res, file) {
          this.imageUrl = URL.createObjectURL(file.raw);
          //上传成功后,传给父组件  
          this.$emit("update:image",res.data.url) 
        },
        beforeAvatarUpload(file) {
          const isJPG = file.type === "image/jpeg"||"image/png"||"image/gif";
          const isLt2M = file.size / 1024 / 1024 < 2;
    
          if (!isJPG) {
            this.$message.error("上传头像图片只能是 图片 格式!");
          }
          if (!isLt2M) {
            this.$message.error("上传头像图片大小不能超过 2MB!");
          }
          return isJPG && isLt2M;
        }
    },
}

</script>

<style lang="less">
    .options {
    display: flex;
    align-items: center;
    margin-bottom: 40px;

    .el-input {
      width: 476px;
      height: 40px;
      margin-right: 20px;
      margin-left: 10px;
    }

    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409eff;
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
  }
</style>
