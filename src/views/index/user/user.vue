<template>
  <div>
    <el-card class="box-card">
      <el-form
        ref="formInline"
        :inline="true"
        :model="formInline"
        class="demo-form-inline"
      >
        <el-form-item label="用户名称" prop="username">
          <el-input class="short" v-model="formInline.username"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input class="normal" v-model="formInline.email"></el-input>
        </el-form-item>

        <el-form-item label="角色" prop="rele_id">
          <el-select class="normal" v-model="formInline.rele_id">
            <el-option label="管理员" value="2"></el-option>
            <el-option label="老师" value="3"></el-option>
            <el-option label="学生" value="4"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="doSearch">搜索</el-button>
          <el-button @click="clear">清除</el-button>
          <!-- 二.准备新增对话框,导入组件 并点击弹出对话框 -->
          <el-button type="primary" icon="el-icon-plus" @click="showDialog">新增用户</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="phone" label="电话"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="role" label="角色"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column prop="status" label="状态">
          <!-- 如果不仅仅是想显示字符串1 那就要用自定义内容 -->
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">启用</span>
            <span v-else style="color:red;">禁用</span>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="editDiaog(scope.row)">编辑</el-button>
            <el-button type="text" @click="changeStatus(scope.row)">{{scope.row.status == 1 ? "禁用" : "启用" }}</el-button>
            <el-button type="text" @click="remove(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        background
        @current-change="pageChange"
        @size-change="sizeChanged"
        :current-page="page"
        :page-sizes="[5, 10, 20, 30, 40]"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 弹出框 -->
    <user-dialog ref="userDialog"></user-dialog>
  </div>
</template>

<script>
// 导入请求数据 删除数据 修改启用状态  的请求方法
import { userList,userRemove,userStatus } from "@/api/user.js";
// 导入弹出框文件
import userDialog from './components/userDialog'

export default {
  name: "user",
  components: {
      userDialog
  },

  data() {
    return {
      formInline: {},
      tableData: [],
      page: 1,
      size: 5,
      total: 0,

      olditem: null
    };
  },

  methods: {
    //获取用户信息
    getUser() {
      userList({
        page: this.page,
        limit: this.size,
        ...this.formInline
      }).then(res => {
        console.log("用户", res);
        this.tableData = res.data.data.items;
        this.total = res.data.data.pagination.total;
      });
    },

    //点击搜索 拿到表单的内容 ...this.formInline 传递给接口 重新获取数据
    doSearch() {
      (this.page = 1), this.getUser();
    },

    //清除筛选三个步骤  清除表单的方法 页码改1 然后重新刷新用户数据
    clear() {
      this.$refs.formInline.resetFields();
      this.page = 1;
      this.getUser();
    },

    //下面页码的分页: 把改变后的页码赋值给page  重新调用用户数据
    pageChange(page) {
      this.page = page;
      this.getUser();
    },
    //页容量改变:把改变后的页容量赋值给size 然后page改为1 重新请求用户
    sizeChanged(size) {
      this.size = size;
      this.page = 1;
      this.getUser();
    },

    //删除用户:导入删除用户的接口 传入这行的数据当做参数 拿到id 发送删除的请求 然后重新刷新用户数据
    remove(item){
        userRemove({
            id:item.id
        }).then(res=>{
            if(res.data.code==200){
                this.$message.success('删除成功')
                this.getUser()
            }else{
                this.$message.error(res.data.message)
            }
        })
    },

    //新增用户的点击事件: 弹出对话框 清空对话框内容
    showDialog(){
        this.$refs.userDialog.dialogFormVisible=true
        this.$refs.userDialog.form={}
    },

    //编辑用户事件: 传入这行的数据 修改isAdd 显示出编辑对话框  发送编辑请求
    editDiaog(item){
        this.$refs.userDialog.dialogFormVisible = true;
        this.$refs.userDialog.isAdd = false;
        //将当行的数据传入  要先判断是不是那行
        if(this.olditem!=item){
            this.$refs.userDialog.form={...item}
            this.olditem=item
        }
    },

    //改变启用禁用状态: 传入这行的数据 导入修改状态接口 重新请求数据
    changeStatus(item){
        userStatus({
            id:item.id
        }).then(res=>{
            if(res.data.code==200){
                this.$message.success('状态修改完成')
                this.getUser()
            }else{
                this.$message.error(res.data.message)
            }
        })

        

        
    }


  },

  created() {
    this.getUser();
  }
};
</script>

<style>
.box-card {
  margin-bottom: 19px;
}
.short {
  width: 90px;
}

.normal {
  width: 169px;
}
</style>
