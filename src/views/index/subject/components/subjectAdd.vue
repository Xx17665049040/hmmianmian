<template>
    <el-dialog title="新增学科" :visible.sync="dialogFormVisible"  center >
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
          <el-button type="primary" @click="doAdd" >确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { subjectAdd } from '@/api/subject.js'
export default {
    data(){
        return{
            //控制显示掩藏
             dialogFormVisible: false,
            //跟表单绑定的对象
             form: {},
             formLabelWidth:'80px',

            //表单验证
             rules:{
                 rid:[ {required:true,message:'学科编号不能为空',trigger:'blur'} ],
                 name:[ {required:true,message:'学科名称不能为空',trigger:'blur'} ]
             }
             

        }
    },
    methods: {
        //整个的表单验证
        doAdd(){
            this.$refs.form.validate( v => {
                if(v){
                    this.$message.success('验证通过')
                    //通过后调用请求数据的接口
                    // subjectAdd({
                        // 传入需要的参数
                        // rid:this.form.rid,
                        // name:this.form.name,
                        // short_name:this.form.short_name,
                        // intro:this.form.intro,
                        // remark:this.form.remark,
                        // 简写方式一   ...对象 ,可以将对象里面的内容都变了添加进去  
                        // ...this.form
                        //下面最优化写法: 直接将对象this.form当做参数写到括号
                    // })
                    subjectAdd(this.form)
                    .then( res =>{
                        window.console.log(res)
                        if(res.data.code == 200){
                            this.$message.success('新增成功')
                            this.dialogFormVisible=false
                            //刷新表格数据 也就是重新调用学科请求的接口
                            this.$parent.getList()
                        }else{
                            this.$message.error(res.data.message)
                        }
                    })
                }
            })
            
        }
    },
}
</script>

<style >
    
</style>