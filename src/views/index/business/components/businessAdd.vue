<template>
  <el-dialog center title="新增企业" :visible.sync="dialogFormVisible">
    <el-form ref="form" :rules="rules" :model="form">
      <el-form-item prop="eid" label="企业编号" :label-width="formLabelWidth">
        <el-input v-model="form.eid" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item prop="name" label="企业名称" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="企业简称" :label-width="formLabelWidth">
        <el-input v-model="form.short_name" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="企业简介" :label-width="formLabelWidth">
        <el-input v-model="form.intro" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="企业备注" :label-width="formLabelWidth">
        <el-input v-model="form.remark" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="doAdd">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
// import { subjectAdd } from '@/api/subject.js'
import { businessAdd } from "@/api/business.js";

export default {
  data() {
    return {
      //控制显示掩藏
      dialogFormVisible: false,
      //跟表单绑定的对象
      form: {},
      formLabelWidth: "80px",

      //表单验证
      rules: {
        eid: [{ required: true, message: "企业编号不能为空", trigger: "blur" }],
        name: [{ required: true, message: "企业名称不能为空", trigger: "blur" }]
      }
    };
  },
  methods: {
    // 三.给新增对话框 添加点击事件, 先验证,再调用增加的请求方法,传值(就是form),请求成功后隐藏对话框,调用父组件 重新刷新table数据
    doAdd() {
      this.$refs.form.validate(v => {
        if (v) {
          businessAdd(this.form).then(res => {
            console.log("企业新增请求", res);
            if (res.data.code == 200) {
              this.$message.success("新增成功！");
              this.dialogFormVisible = false;
              // 调用父组件的刷新方法
              this.$parent.getList();
            } else {
              this.$messsage.error(res.data.message);
            }
          });
        }
      });
    }
  }
};
</script>

<style></style>
