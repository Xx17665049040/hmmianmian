<template>
  <div>
    <!-- 上面卡片 -->
    <el-card class="box-card">
      <!-- 表单  :inline="true" true 一行显示多个 false一行只显示一个-->
      <el-form :inline="true" :model="formInline" class="demo-form-inline ">
        <el-form-item label="学科编号">
          <el-input
            class="short"
            v-model="formInline.user"
            placeholder="审批人"
          ></el-input>
        </el-form-item>
        <el-form-item label="学科名称">
          <el-input
            class="normal"
            v-model="formInline.user"
            placeholder="审批人"
          ></el-input>
        </el-form-item>
        <el-form-item label="创建者">
          <el-input
            class="short"
            v-model="formInline.user"
            placeholder="审批人"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            class="normal"
            v-model="formInline.region"
            placeholder="活动区域"
          >
            <!-- el-option 下拉框  label是默认的显示内容   value是你选中的label 真正的值 比如你选则了区域一 那他的值就是shanghai-->
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">搜索</el-button>
          <el-button>清除</el-button>
          <el-button type="primary" >新增学科</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 下面卡片 -->
    <el-card class="box-card">
      <!-- 表格  -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="100">
        </el-table-column>

        <el-table-column prop="rid" label="学科编号" width="180">
        </el-table-column>

        <el-table-column prop="name" label="学科名称"> </el-table-column>

        <el-table-column prop="short_name" label="简称"> </el-table-column>

        <el-table-column prop="username" label="创建者"> </el-table-column>

        <el-table-column prop="create_time" label="创建日期"> </el-table-column>

        <el-table-column prop="status" label="状态">
          <!-- 需要添加自定义列 -->
          <template slot-scope="scope">
            <!-- scope.row.  拿这一行的数据 -->
            <span v-if="scope.row.status === 1">启用</span>
            <span v-else style="color:red">禁用</span>
          </template>
        </el-table-column>

        <!-- 表格中的按钮 -->
        <!-- 表格默认只能显示字符串 如果想放除了字符串以外的(比如按钮)
          就要用自定义列模板 就是在el-table-column 标签里 再写一个template标签包裹 这个标签里面slot-scope="scope" -->
         
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!--scope.$index这一行的索引(索引一般不需要)  scope.row这一行的数据  -->
            <el-button type="text">编辑</el-button>
            <!-- scope.row.status===1 的时候 是启用 这里就要给禁用    因为这里文字颜色没有变化 所以只用字符串 三元表达就可以  但是字符串在这要用{{}}包起来-->
            <el-button type="text" @click="changeStatus(scope.row)">{{
              scope.row.status === 1 ? "禁用" : "启用"
            }}</el-button>
            <!-- 把这一行的数据scope.row当做形参传过去 -->
            <el-button type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 page-sizes这是设置可以选择的页容量(每页显示多少条)  page-size设置当前页容量是几  layout分页的布局效果 一般不懂-  total设置数据总量 background设置背景框 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { subjectList, subjectStatus } from "@/api/subject.js";
export default {
  data() {
    return {
      //上面表单数据
      formInline: {
        user: "",
        region: ""
      },
      // 表格数据
      tableData: [],
      currentPage: 1,
      size: 10,
      total: 0
    };
  },
  methods: {
    //  按钮事件
    changeStatus(item) {
      subjectStatus({
        id: item.id
      }).then(() => {
        //需要重新刷新页面和表格才出来  也就是重新调用一下请求数据方法
        this.getList();
      });
    },

    //分页事件
    //页码数改变就触发 参数是改变后的页容量
    handleSizeChange(page) {
      console.log(page);
    },
    //当前页码改变就触发  参数是改变后的页码
    handleCurrentChange(size) {
      console.log(size);
    },
     //封装一下subjectList() 因为被调用了多次
    getList() {
      subjectList({
        //表格参数设置
        page: 1,
        limit: 5
      }).then(res => {
        window.console.log("学科数据", res);
        this.tableData = res.data.data.items;
       
      });
    },
  },

 

  created() {
    this.getList();
  }
};
</script>

<style>
.box-card {
  margin-bottom: 19px;
}
.short {
  width: 100px;
}
.normal {
  width: 149px;
}
.el-pagination {
  text-align: center;
  margin-top: 15px;
}
</style>
