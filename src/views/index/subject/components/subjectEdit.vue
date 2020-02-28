<template>
    <el-dialog title="编辑学科" :visible.sync="dialogFormVisible"  center >
        <el-form :model="form" :rules="rules" ref="form">
          <el-form-item prop="rid" label="学科编号" :label-width="formLabelWidth">
            <el-input v-model="form.rid" autocomplete="off"></el-input>
          </el-form-item>
           <el-form-item prop="name" label="学科名称" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
           <el-form-item label="学科简称" :label-width="formLabelWidth">
            <el-input v-model="form.short_name" autocomplete="off"></el-input>
          </el-form-item>
           <el-form-item label="学科简介" :label-width="formLabelWidth">
            <el-input v-model="form.intro" autocomplete="off"></el-input>
          </el-form-item>
           <el-form-item label="学科备注" :label-width="formLabelWidth">
            <el-input v-model="form.remark" autocomplete="off"></el-input>
          </el-form-item>
         
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveEdit" >保 存</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { subjectEdit } from '@/api/subject.js'
export default {
    data(){
        return{
            //控制显示掩藏
             dialogFormVisible: false,
            //跟表单绑定的对象  先拿到界面上的表单的数据 然后复制在这里 ,那么弹出框也就有内容了
             form: { },
             formLabelWidth:'80px',

            //表单验证
             rules:{
                 rid:[ {required:true,message:'学科编号不能为空',trigger:'blur'} ],
                 name:[ {required:true,message:'学科名称不能为空',trigger:'blur'} ]
             }
             

        }
    },
    methods: {
      saveEdit(){
          //调用接口   
          subjectEdit(
            //   传入数据
            this.form 
          ).then(res=>{
              console.log("编辑",res)
              if(res.data.code==200){
                  //成功后 弹出成功消息,隐藏对话框, 重新加载表格数据
                  this.$message.success('修改成功')
                  this.dialogFormVisible=false
                  this.$parent.getList()
              }else{
                  this.$message.error(res.data.message)
              }
          })
      }
    },
}
</script>

<style >
    
</style>