<template>
  <el-dialog :title=" isAdd ? '新增用户':'编辑用户' " center :visible.sync="dialogFormVisible" width="447px">
    <el-form :rules="rules" :model="form">
      <el-form-item prop="username" label="用户名" :label-width="formLabelWidth">
        <el-input v-model="form.username" autocomplete="off"></el-input>
      </el-form-item>
       <el-form-item prop="email" label="邮箱" :label-width="formLabelWidth">
        <el-input v-model="form.email" autocomplete="off"></el-input>
      </el-form-item>
       <el-form-item prop="phone" label="电话" :label-width="formLabelWidth">
        <el-input v-model="form.phone" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item prop="role" label="角色" :label-width="formLabelWidth">
        <el-select v-model="form.role" @change="form.role_id = form.role" placeholder="请选择角色">
            <!-- 记住:这里不能直接就绑定role 要用change事件 进行赋值操作 才能在切换时 role_id也进行变化-->
          <el-option label="管理员" value="2"></el-option>
          <el-option label="老师" value="3"></el-option>
          <el-option label="学生" value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" :label-width="formLabelWidth">
        <el-select v-model="form.status" placeholder="请选择状态">
          <el-option label="启用" value="1"></el-option>
          <el-option label="禁用" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户备注" :label-width="formLabelWidth">
        <el-input v-model="form.remark" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <!-- 按钮 -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="save"
        >确 定</el-button
      >
    </div>
  </el-dialog>

  <!--  表单中的每个元素的双向绑定  需要将label的值改为接口上给的名字 -->
</template>


<script>
import { userAdd,userEdit } from '@/api/user.js'
export default {
    name:"userDialog",
    data(){
        return{
            dialogFormVisible: false,
            form:{},
            formLabelWidth:'80px',
            //因为编辑对话框 和 新增对话框基本一样, 所以用isAdd来判断
            isAdd:true,

            // 表单验证
            rules:{
                username:[{ required: true, message: "用户名不能为空", trigger: "blur" }],
                email:[{ required: true, message: "邮箱不能为空", trigger: "blur" },
                        {pattern:/\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,message: "邮箱格式错误",trigger: "blur"}],
                phone:[{required: true, message: "电话不能为空", trigger: "blur"},
                        {pattern: /0?(13|14|15|18|17)[0-9]{9}/, message: "电话不能为空", trigger: "blur"}],
                role: [{ required: true, message: "角色不能为空", trigger: "change" }]             
            }
        }
    },

    methods: {
        //给弹出框加 增加用户事件: 导入接口 调用请求(需要传入对象) 提示 并调用父组件的刷新数据接口  判断是新增请求框 还是 编辑的请求框
        save(){
            if(this.isAdd){
                //新增请求
               userAdd(this.form).then(res=>{
              if(res.data.code==200){
                  this.$message.success('添加成功')
                  this.dialogFormVisible=false
                  this.$parent.getUser()
              }else{
                  this.$message.error(res.data.message)
              }
              })
            }else{
                //编辑请求
                 userEdit(this.form).then(res=>{
              if(res.data.code==200){
                  this.$message.success('编辑成功')
                  this.dialogFormVisible=false
                  this.$parent.getUser()
              }else{
                  this.$message.error(res.data.message)
              }
              })
            }
           
        },
    },
};
</script>

<style></style>
