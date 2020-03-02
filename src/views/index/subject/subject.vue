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
         
        <el-table-column label="操作" v-if="['超级管理员','管理员','老师'].includes($store.state.role)">
          <template slot-scope="scope">
            <!--scope.$index这一行的索引(索引一般不需要)  scope.row这一行的数据 用它当参数,就是把这一行的数据传过去 -->
           
            <el-button type="text" @click="showEdit(scope.row)" v-if="['超级管理员','管理员','老师'].includes($store.state.role)">编辑</el-button>
            <!-- scope.row.status===1 的时候 是启用 这里就要给禁用    因为这里文字颜色没有变化 所以只用字符串 三元表达就可以  但是字符串在这要用{{}}包起来-->
            
            <el-button type="text" @click="changeStatus(scope.row)" v-if="['超级管理员','管理员'].includes($store.state.role)">
              {{scope.row.status === 1 ? "禁用" : "启用"}}
              </el-button>
              
            <!-- 把这一行的数据scope.row当做形参传过去 -->
            <el-button type="text" @click="doDel(scope.row)"  v-if="['超级管理员','管理员'].includes($store.state.role)">删除</el-button>
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
    //  按钮事件
    changeStatus(item) {
      subjectStatus({
        id: item.id
      }).then(() => {
        //需要重新刷新页面和表格才出来  也就是重新调用一下请求数据方法
        this.getList();
      });
    },

    //搜索事件
    doSearch(){
      // 直接调用获取到的文章内容getList 
      this.getList()
    },
    //清除事件
    doClear(){
      //表单对象的重置办法restFields  也需要给每一项添加prop属性
      this.$refs.formInline.resetFields();
      this.page=1
      this.getList()
    },

    //分页事件
    //页码数改变就触发 参数是改变后的页容量
    handleSizeChange(page) {
      //改变后的页码 赋值给this.page  这样再去请求数据的时候 就是改变后的页码数据了
      this.page=page
      this.getList()
    },
    //当前页码改变就触发  参数是改变后的页码
    handleCurrentChange(size) {
      this.size=size 
      //只要页容量改变了 就让显示第一页的内容
      this.page=1
      this.getList()
    },
     //封装一下subjectList() 因为被调用了多次
    getList() {
      subjectList({
        //表格参数设置
        page: this.page,
        //上面设置的页容量多少 这里设置查出来的数量也多少
        limit: this.size,

        // rid:this.formInline.rid,
        // name:this.formInline.name,
        // username:this.formInline.username,
        // status:this.formInline.status
        // 这些代码的简写 解构  ...数组(或者对象) 会帮你遍历解构出数组(对象)所有内容
        ...this.formInline

      }).then(res => {
        window.console.log("学科数据", res);
        this.tableData = res.data.data.items;
       this.total=res.data.data.pagination.total
      });
    },

    // 编辑框事件 
    showEdit(item){
      console.log(item)
      //显示出来
      this.$refs.subjectEdit.dialogFormVisible=true
      //将拿到的内容赋值给 弹出框
      // this.$refs.subjectEdit.form= item

      //问题一:这里是地址之间的传值,当弹出框的内容在修改时, 会影响item(界面上的数据) ,所以不能用对象之间直接赋值
      // 要先拷贝一个对象来存储弹出框的内容  这就是新对象{...item}  地址不一样了 不会同步改变 解决如下
      // this.$refs.subjectEdit.form= {...item}

      //第二个问题 填了弹出框的东西后,点了取消,再点编辑,上次填的东西没了  所以需要设置一个变量 来保存弹出框填的东西
      //并判断 若点开的还是这一行,就返回之前填好的(也就是不需要把数据覆盖到这一行),若不是这一行 就将界面的覆盖掉弹出框内容
        
        if( item != this.newEdit){   //如果界面的内容 和 弹出框的内容不一样 
          this.$refs.subjectEdit.form = {...item };
          this.newEdit = item     
        }

    },

    //删除事件
    doDel(item){
        subjectDel({
          id:item.id
        }).then(res => {
            if(res.data.code ==200 ){
               this.$message.success("删除成功");
              //但是 这里有问题,如果是最后一条数据删完了 请求的时候 依旧是那一页, 所以显示空  ,所以需要在页面最后一条删除后
              //请求的页面page 要往前一页请求
              if(this.tableData.length == 1) {   //表格存了多少条数据 要看tableData的长度
                  this.page--
              }
              //如果第一页的最后一条也删除了,就不能继续减到0了 停留在页码1
              if(this.page==0){
                this.page=1
              }
                // 上面的条件判断完 才请求刷新
               this.getList()  //删除后 重新请求界面内容
            }else{
              //请求失败
              this.$message.error(res.data.message)
            }
        })
    }


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
