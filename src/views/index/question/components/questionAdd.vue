<template>
  <el-dialog
    class="myDialog"
    title="新增题库"
    center
    fullscreen
    :visible.sync="dialogFormVisible"
    destroy-on-close
  >
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item label="学科" prop="subject" :label-width="formLabelWidth">
        <!-- 这里的学科已经有注册好的全局 学科下拉框 -->
        <subjectSelect v-model="form.subject"></subjectSelect>
      </el-form-item>
      <el-form-item label="阶段" prop="step" :label-width="formLabelWidth">
        <el-select v-model="form.step" placeholder="请选择活动区域">
          <el-option label="初级" value="1"></el-option>
          <el-option label="中级" value="2"></el-option>
          <el-option label="高级" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="企业"
        prop="enterprise"
        :label-width="formLabelWidth"
      >
        <business-select v-model="form.enterprise"></business-select>
      </el-form-item>
      <el-form-item label="城市" prop="city" :label-width="formLabelWidth">
        <china-area v-model="form.city"> </china-area>
      </el-form-item>

      <el-form-item label="题型" prop="type" :label-width="formLabelWidth">
        <el-radio-group v-model="form.type">
          <el-radio label="1">单选</el-radio>
          <el-radio label="2">多选</el-radio>
          <el-radio label="3">简答</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        label="难度"
        prop="difficulty"
        :label-width="formLabelWidth"
      >
        <el-radio-group v-model="form.difficulty">
          <el-radio label="1">简单</el-radio>
          <el-radio label="2">一般</el-radio>
          <el-radio label="3">困难</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item>
        <!-- 分割线 -->
        <el-divider></el-divider>
      </el-form-item>

      <!-- 富文本编辑器(已封装)-->
      <el-form-item label="试题标题" prop="title" :label-width="formLabelWidth">
        <myWangEditor v-model="form.title"></myWangEditor>
      </el-form-item>

      <!-- 根据上面的单选,用form.type进行判断  -->
      <el-form-item
        v-if="form.type == 1"
        label="单选"
        prop="single_select_answer"
        :label-width="formLabelWidth"
      >
        <el-radio-group v-model="form.single_select_answer">
          <!-- 因为有四个需要遍历select_options 来生成四个(选项已经封装) -->
          <question-options
            v-for="(item, index) in form.select_options"
            :key="index"
            :label="item.label"
            :text.sync="item.text"
            :image.sync="item.image"
          >
          </question-options>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        label="多选"
        prop="multiple_select_answer"
        v-else-if="form.type == 2"
        :label-width="formLabelWidth"
      >
        <div>
          <el-checkbox-group v-model="form.multiple_select_answer">
            <!-- 导入封装好的 选项 -->
            <question-options
              v-for="(item, index) in form.select_options"
              :key="index"
              :label="item.label"
              :text.sync="item.text"
              :image.sync="item.image"
              :isRadio="false"
            >
            </question-options>
          </el-checkbox-group>
        </div>
      </el-form-item>

      <el-form-item
        label="简答"
        prop="short_answer"
        v-else
        :label-width="formLabelWidth"
      >
        <el-input type="area" v-model="form.short_answer" :rows="2"></el-input>
      </el-form-item>

      <!-- 上传视频 -->
      <el-form-item> <el-divider></el-divider> </el-form-item>
      <!-- 导入视频组件 -->
      <video-upload :video.sync="form.video"></video-upload>

      <el-form-item> <el-divider></el-divider> </el-form-item>

      <el-form-item
        label="答案解析"
        prop="answer_analyze"
        :label-width="formLabelWidth"
      >
        <myWangEditor v-model="form.answer_analyze"></myWangEditor>
      </el-form-item>

      <el-form-item
        label="试题备注"
        prop="remark"
        :label-width="formLabelWidth"
      >
        <el-input type="area" v-model="form.remark" :rows="2"></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="doSure">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
//导入省市区一级全部选项的联动数据 regionDataPlus(已经单独封装)
// import {regionDataPlus} from 'element-china-area-data'
//导入封装好的省市选择器
import chinaArea from "./chinaArea.vue";
//导入富文本编辑
import myWangEditor from "./myWangEditor.vue";
//导入封装的选项组件
import questionOptions from "./questionOption.vue";
//导入封装好的视频组件
import videoUpload from "./videoUpload.vue";
// 导入新增
import { questionAdd } from "@/api/question.js";

export default {
  components: {
    chinaArea,
    myWangEditor,
    questionOptions,
    videoUpload
  },
  data() {
    return {
      dialogFormVisible: false,
      form: {
        // 表单的就要放在form里面 这样才能绑定数据 在浏览器查看
        type: "1", //默认选中单选
        // 单选 多选 简答绑定的值 多选要用数组
        multiple_select_answer: [],
        short_answer: "",
        single_select_answer: "",
        //单选 绑定的内容  可以用来循环生成
        select_options: [
          { label: "A", text: "狗不理包子", image: "" },
          { label: "B", text: "麻花", image: "" },
          { label: "C", text: "炸酱面", image: "" },
          { label: "D", text: "汤圆", image: "" }
        ],
        video: ""
      },
      formLabelWidth: "280px",
      //表单验证 给form表单加:rules  每一项加prop
      rules: {
        title: { required: true, message: "标题不能为空", trigger: "blur" },
        subject: { required: true, message: "学科不能为空", trigger: "change" },
        step: { required: true, message: "阶段不能为空", trigger: "change" },
        enterprise: {
          required: true,
          message: "企业不能为空",
          trigger: "change"
        },
        city: { required: true, message: "城市不能为空", trigger: "change" },
        type: { required: true, message: "题型不能为空", trigger: "change" },
        difficulty: {
          required: true,
          message: "难度不能为空",
          trigger: "change"
        },
        single_select_answer: {
          required: true,
          message: "单选答案不能为空",
          trigger: "change"
        },
        multiple_select_answer: {
          required: true,
          message: "多选答案不能为空",
          trigger: "change"
        },
        short_answer: {
          required: true,
          message: "简答题的答案不能为空",
          trigger: "blur"
        },
        answer_analyze: {
          required: true,
          message: "答案解析不能为空",
          trigger: "blur"
        },
        remark: { required: true, message: "试题备注不能为空", trigger: "blur" }
      }
    };
  },
  methods: {
    //表单确认事件:先验证表单 调用新增请求 还要清楚表单内容
    doSure() {
      this.$refs.form.validate(v => {
        if (v) {
          questionAdd(this.form).then(res => {
            if (res.data.code == 200) {
              this.$message.success("新增成功");
              //重置表单元素,只能重置表单元素,封装的组件就不会被清除,只能销毁表单(destroy-on-close)
              this.$refs.form.resetFields();
              this.dialogFormVisible = false;
              //刷新题库数据
              this.$parent.getList();
              window.console.log(this.$parent)
            } else {
              this.$message.error(res.data.message);
            }
          });
        }
      });
    }
  }
};
</script>

<style lang="less">
.myDialog {
  .el-select {
    width: 364px;
  }
  .el-form-item__label {
    padding-right: 40px;
  }
  .avatar-uploader {
    text-align: left;
  }
}
</style>
