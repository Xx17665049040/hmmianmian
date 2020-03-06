<template>
  <div class="question-wrap">
    <!-- 上部卡片 -->
    <el-card>
      <!-- inline可以转成行内(一行多个) -->
      <el-form
        ref="formInline"
        class="demo-form-inline"
        :inline="true"
        :model="formInline"
      >
        <!-- 学科已经封装全局组件  不是input框的组件默认没有v-model 要有的话 需要在子组件满足 父传子 子传父 的规则 (在子组件写props  和this.$emit)   -->
        <el-form-item label="学科">
          <subject-select
            :isSearch="true"
            v-model="formInline.subject"
          ></subject-select>
        </el-form-item>

        <el-form-item label="阶段" prop="step">
          <el-select v-model="formInline.step" placeholder="请选择阶段">
            <el-option label="初级" value="1"></el-option>
            <el-option label="中级" value="2"></el-option>
            <el-option label="高级" value="3"></el-option>
          </el-select>
        </el-form-item>
        <!-- 企业模块已经封装 -->
        <el-form-item label="企业" prop="enterprise">
          <business-select
            :isSearch="true"
            v-model="formInline.enterprise"
          ></business-select>
        </el-form-item>

        <el-form-item label="题型" prop="type">
          <el-select v-model="formInline.type" placeholder="请选择题型">
            <el-option label="单选" value="1"></el-option>
            <el-option label="多选" value="2"></el-option>
            <el-option label="简答" value="3"></el-option>
          </el-select>
        </el-form-item>
        <!-- 注意:一行只需要显示四个 可以用br直接换行 -->
        <br />
        <el-form-item label="难度" prop="difficulty">
          <el-select v-model="formInline.difficulty" placeholder="请选择难度">
            <el-option label="简单" value="1"></el-option>
            <el-option label="一般" value="2"></el-option>
            <el-option label="困难" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="作者" prop="username">
          <el-input v-model="formInline.username"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="formInline.status" placeholder="请选择状态">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期" prop="create_date">
          <el-date-picker
            v-model="formInline.create_date"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>

        <br />
        <el-form-item label="标题" prop="title" class="title-item">
          <el-input v-model="formInline.title"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList()">搜索</el-button>
          <el-button @click="doClear">清除</el-button>
          <el-button
            type="primary"
            icon="el-icon-plus"
            @click="$refs.questionAdd.dialogFormVisible = true"
            >新增试题</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 下部卡片 -->
    <el-card class="bottom-card">
      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column type="index" prop="index" label="序号" width="80">
        </el-table-column>
        <el-table-column
          prop="title"
          label="题目"
          width="180"
        ></el-table-column>
        <el-table-column prop="name" label="学科.阶段">
          <!-- 利用过滤器filters来做这个特殊的字符 注意: |前面的内容 是参数  也就是scope.row 相当于下面函数的val -->
          <template slot-scope="scope">
            {{ scope.row | formatSubject }}
          </template>
        </el-table-column>

        <el-table-column prop="type" label="题型">
          <template slot-scope="scope">
            <span v-if="scope.row.type == 1">单选</span>
            <span v-else-if="scope.row.type == 2">多选</span>
            <span v-else>简答</span>
          </template>
        </el-table-column>

        <el-table-column prop="enterprise_name" label="企业"> </el-table-column>
        <el-table-column prop="username" label="创建者"> </el-table-column>

        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            {{ scope.row.status == 1 ? "启用" : "禁用" }}
          </template>
        </el-table-column>

        <el-table-column prop="reads" label="访问量"> </el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="showEdit(scope.row)">编辑</el-button>
            <el-button type="text" @click="changeStatus(scope.row)">{{
              scope.row.status == 1 ? "禁用" : "启用"
            }}</el-button>
            <el-button type="text" @click="doDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        class="my-pagination"
        background
        :current-page="page"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @current-change="pageChange"
        @size-change="sizeChange"
      ></el-pagination>
    </el-card>

    <!-- 新增试题的对话框 -->
    <question-add ref="questionAdd" />
    <!-- 新增编辑框 -->
    <question-edit ref="questionEdit" />
  </div>
</template>

<script>
//导入获取学科列表的接口
// import { subjectList } from "@/api/subject.js";
//导入获取企业列表接口
// import { businessList } from "@/api/business.js";
// 导入题目列表接口
import {
  questionList,
  questionStatus,
  questionRemove
} from "@/api/question.js";

//导入组件
// import subjectSelect from '@/components/subjectSelect'
import questionAdd from "./components/questionAdd.vue";

import questionEdit from "./components/questionEdit.vue";

export default {
  name: "question",
  components: {
    questionAdd,
    questionEdit
  },
  data() {
    return {
      formInline: {},
      // formLabelWidth:"280px",
      subjectList: [],
      businessList: [],
      questionList: [],
      tableData: [],
      //分页
      page: 1,
      size: 5,
      total: 0
    };
  },
  methods: {
    getList() {
      //获取题目列表 参数:
      questionList({
        page: this.page,
        limit: this.size,
        ...this.formInline
      }).then(res => {
        this.tableData = res.data.data.items;
        this.total = res.data.data.pagination.total;
      });
    },
    //编辑事件: 拿到这行数据  赋值给对话框的form属性  显示出对话框
    showEdit(item) {
      console.log("111");
      //拿到的数据{...item} 赋值给编辑框的form
      this.$refs.questionEdit.form = { ...item };
      //点击编辑的时候 要把我们的字符串变成接口需要的数组(城市 和 多选答案 都是展现的额数组)

      this.$refs.questionEdit.form.city = this.$refs.questionEdit.form.city.split(
        ","
      );
      this.$refs.questionEdit.form.multiple_select_answer = this.$refs.questionEdit.form.multiple_select_answer.split(
        ","
      );
      //显示出对话框
      this.$refs.questionEdit.dialogFormVisible = true;
    },

    // 页码改变事件 自带的page参数 是 改变后的页码
    pageChange(page) {
      this.page = page;
      this.gerList();
    },
    //页容量 (显示多少条一页)
    sizeChange(size) {
      this.size = size;
      this.page = 1;
      this.gerList();
    },

    //点击搜索筛选 直接在行内 调用getList(0)即可 注意:需要在getList()方法里 加一个...this.formInline 来传入顶部表单的参数

    //点击清除: 调用重置表单的方法(重置要起效 还要在每个框加 prop属性)  重新调用列表数据
    doClear() {
      this.$refs.formInline.resetFields();
      this.getList();
    },

    //点击修改状态 : 调用修改接口的方法
    changeStatus(item) {
      questionStatus({
        id: item.id
      }).then(res => {
        if (res.data.code == 200) {
          this.$message.success("修改成功");
          this.getList();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    //点击删除 :调用删除接口
    doDel(item) {
      //先询问是否删除 确定删除再调用接口
      this.$confirm("请问是否要删除")
        .then(() => {
          questionRemove({
            id: item.id
          }).then(res => {
            if (res.data.code == 200) {
              this.$message.success("删除成功");
              this.getList();
            } else {
              this.$message.error(res.data.message);
            }
          });
        })
        .catch(() => {
          this.$message('取消删除')
        });
    }
  },
  created() {
    //获取学科列表 注意:只获取启用的学科(已经封装)
    //获取企业列表 注意:只获取启用的企业(已经封装)
    this.getList();
  },
  filters: {
    //这里的val相当于 scope.row | formatSubject 里面的 scope.row
    formatSubject(val) {
      //拿到并返回学科名字和阶段对应名字  学科名字是val.subject.name  阶段对应的初中高级 就要进行判断表格上的数据step是1,2,3
      let stepName = "";
      if (val.step == 1) {
        stepName = "初级";
      } else if (val.step == 2) {
        stepName = "中级";
      } else {
        stepName = "高级";
      }
      return val.subject_name + " · " + stepName;
    }
  }
};
</script>

<style lang="less">
.question-wrap {
  .el-form--inline {
    //    :not 找到除了他()里面的
    .el-form-item:not(:last-child) .el-form-item__content {
      width: 150px;
    }
    //   这是标题栏的宽度
    .el-form-item.title-item .el-form-item__content {
      width: 388px;
    }
    //   设置日期选择器
    .el-form-item .el-form-item__content .el-date-editor {
      width: 150px;
    }

    /* 设置每个表单元素前面文字的左右内间距 */
    .el-form-item__label {
      padding-right: 31px;
      padding-left: 30px;
    }
  }

  /* 设置卡片的内间距 */
  .el-card__body {
    padding-left: 0;
  }

  .bottom-card {
    margin-top: 21px;
  }

  .my-pagination {
    text-align: center;
    margin-top: 31px;
  }
}
</style>
