<template>
  <div>
    <!-- 上面卡片 -->
    <el-card class="box-card">
      <!-- 表单  :inline="true" true 一行显示多个 false一行只显示一个-->
      <el-form ref="formInline" :inline="true" :model="formInline" class="demo-form-inline ">
        <el-form-item label="学科编号" prop="rid">
          <el-input
            class="short"
            v-model="formInline.rid"
            placeholder="审批人"
          ></el-input>
        </el-form-item>
        <el-form-item label="学科名称" prop="name">
          <el-input
            class="normal"
            v-model="formInline.name"
            placeholder="审批人"
          ></el-input>
        </el-form-item>
        <el-form-item label="创建者" prop="username">
          <el-input
            class="short"
            v-model="formInline.username"
            placeholder="审批人"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            class="normal"
            v-model="formInline.status"
            placeholder="请选择">
            <!-- el-option 下拉框  label是默认的显示内容   value是你选中的label 真正的值 比如你选则了启用 那他的值就是1 -->
            <!-- 1是true 启用  0是false 禁用 -->
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doSearch()">搜索</el-button>
          <el-button @click="doClear">清除</el-button>
          <el-button type="primary" @click="$refs.subjectAdd.dialogFormVisible=true">新增学科</el-button>
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

        <el-table-column prop="create_time" label="创建日期"> 
            <!-- 要用自定义的时间 就要用template包裹   把创建日期用全局过滤器显示-->
          <template slot-scope="scope">
                {{scope.row.create_time | formatTime }}   
          </template>

        </el-table-column>

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
            <!--scope.$index这一行的索引(索引一般不需要)  scope.row这一行的数据 用它当参数,就是把这一行的数据传过去 -->
           
            <el-button type="text" @click="showEdit(scope.row)">编辑</el-button>
            <!-- scope.row.status===1 的时候 是启用 这里就要给禁用    因为这里文字颜色没有变化 所以只用字符串 三元表达就可以  但是字符串在这要用{{}}包起来-->
            
            <el-button type="text" @click="changeStatus(scope.row)">{{
              scope.row.status === 1 ? "禁用" : "启用"
            }}</el-button>
            <!-- 把这一行的数据scope.row当做形参传过去 -->
           
            <el-button type="text" @click="doDel(scope.row)">删除</el-button>
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

    
      <!-- 添加框 -->
      <subjectAdd ref="subjectAdd"></subjectAdd>
      <subject-edit ref="subjectEdit"></subject-edit>

  </div>
</template>

<script>
import { subjectList, subjectStatus,subjectDel } from "@/api/subject.js";

import subjectAdd from './components/subjectAdd.vue'  //这两个界面都有自己的界面,所以在这导入了 就不需要再上面导入
import subjectEdit from './components/subjectEdit.vue'

export default {
  name:"subject",
  components:{
    subjectAdd,
    subjectEdit
  },
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
      //页容量
      size: 5,
      total: 0,

      //设置一个变量保存弹出框编辑的内容
      newEdit:null
    };
  },
  methods: {
   



  },

  created() {
   
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
