<template>
  <div>
 
    <el-card class="box-card">
      <el-form ref="formInline" :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="企业编号" prop="rid">
          <el-input class="short" v-model="formInline.rid"></el-input>
        </el-form-item>
        <el-form-item label="企业名称" prop="name">
          <el-input class="normal" v-model="formInline.name"></el-input>
        </el-form-item>
        <el-form-item label="创建者" prop="username">
          <el-input class="short" v-model="formInline.username"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select class="normal" v-model="formInline.status">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doSearch">搜索</el-button>
          <el-button @click="doClear">清除</el-button>
           <!-- 二.准备新增对话框,导入组件 并点击弹出对话框 -->
          <el-button type="primary" icon="el-icon-plus" @click="showAdd">新增企业</el-button>
        </el-form-item>
      </el-form>
    </el-card>

 
    <el-card class="box-card">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="rid" label="企业编号"></el-table-column>
        <el-table-column prop="name" label="企业名称"></el-table-column>
        <el-table-column prop="username" label="创建者"></el-table-column>
        <el-table-column prop="create_time" label="创建日期">
          <template slot-scope="scope">
          
            {{ scope.row.create_time | formatTime }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 1">启用</span>
            <span v-else style="color:red;">禁用</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" v-if="['超级管理员','管理员','老师'].includes($store.state.role)">
          <template slot-scope="scope" >
            <el-button type="text" @click="showEdit(scope.row)" v-if="['超级管理员','管理员','老师'].includes($store.state.role)">编辑</el-button>
            <el-button type="text" @click="changeStatus(scope.row)" v-if="['超级管理员','管理员'].includes($store.state.role)">{{ scope.row.status==1?'禁用':'启用'}}</el-button>
            <el-button type="text" @click="remove(scope.row)"  v-if="['超级管理员','管理员'].includes($store.state.role)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        background
        @current-change="pageChange"
        @size-change="sizeChanged"
        :current-page="page"
        :page-sizes="[ 5, 10, 20, 30, 40]"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    
    <!-- 弹出框 -->
    <!-- <business-add ref="businessAdd"></business-add>
     <business-edit ref='businessEdit'></business-edit> -->
     <business-dialog ref="businessDialog"></business-dialog>
  </div>
</template>

<script>
// 导入请求数据 删除数据 修改启用状态  的请求方法 
import {businessList,businessRemove,businessStatus} from '@/api/business.js'
// import businessAdd from './components/businessAdd.vue'
// import businessEdit from './components/businessEdit.vue'
import businessDialog from './components/businessDialog'

export default {
  name: "business",
  components: {
    // businessAdd,
    // businessEdit
    businessDialog
  },

  data() {
    return {
      formInline:{},
      tableData:[],
      page:1,
      size:5,
      total:0,

      olditem:null,
    };
  },

  methods: {
      getList(){
          // 一:获取数据 这段代码很多地方要用 所以封装一下
        businessList(
           // 传入参数 设置一页多少条  还有搜索条件即 formInline里面的每一项
          {page:this.page,limit:this.size, ...this.formInline}
        ).then( res => {
             console.log("企业信息",res)
             //拿到企业的信息后 存到table  而table的数据 是绑定tableData的
             this.tableData=res.data.data.items
             // 还有将返回数据中的 total数 赋值进表格
             this.total=res.data.data.pagination.total
        }) 
      },
      //点击搜索
      doSearch(){
          // 刷选数据的时候 调用获取数据的方法
          //这里还有问题.如果去了别的页 那么搜索的时候 就执搜那一页的  要把page该为1
          this.page=1
          this.getList()
      },
      // 点击清除
      doClear(){
          //调用表单的重置方法
          this.$refs.formInline.resetFields() 
          //重置后,重新请求 第一页 的数据
          this.page=1
          this.getList()
      },
      //修改页码  参数page 修改后的页码   将修改后的页码 串改this,page 然后调用那页数据
       pageChange(page) {
          this.page = page;
          this.getList();
        },
        // 修改页容量  size 改变后的页容量  这些参数都是饿了么上面要求的
      sizeChanged(size) {
       this.size = size;
       this.page = 1;
       this.getList();
      },

      //点击删除 
      remove(item){
        //这里要注意的问题  如果是最后一条 就要刷新到上一页 如果是第一页的最后一条 就不用刷新到上一页
          businessRemove({
              id:item.id
          }).then(res=>{
              if(res.data.code==200){
                
                this.$message.success('删除成功')
                // this.tableData.length==1  数据只剩一条的意思
                if(this.tableData.length==1){
                    this.page--;
                }

                if(this.page<1){
                  this.page=1
                }
                
                this.getList()

              }else{
                this.$message.error(res.data.message)
              }
          })
      },

      // 点击修改启用状态
      changeStatus(item){
        businessStatus({
          id:item.id
        }).then(res=>{
          if(res.data.code==200){
            this.$message.success('状态修改成功')
            this.getList()
          }else{
          this.$message.error(res.data.message);

          }
        })
      },

      //弹出编辑对话框 点击那一行就要拿到那行的数据要添加 slot-scope="scope" 并拿到数据 scope.row 传进这里item
      showEdit(item){
          //显示
          this.$refs.businessDialog.dialogFormVisible=true 
          // 点击后 要修改isAdd的值 
          this.$refs.businessDialog.isAdd=false
          if(this.olditem != item ){ //这能解决点开不同一行时,修改后
            //将table传过来的数据显示到 对话框(对话框放数据的地方 就是 form:{})   {...item}能拿到item对象里所有的内容
          this.$refs.businessDialog.form= { ...item }
          this.olditem=item
          }
        
 
      },
      showAdd(){
        this.$refs.businessDialog.dialogFormVisible=true,
        //每次点击新增的时候 要将对话框改为true 还要将对话框里的内容清空
        this.$refs.businessDialog.isAdd=true
        this.$refs.businessDialog.form={}
      }
  },

  created() {
      this.getList()
  },


 
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
  width: 139px;
}
</style>