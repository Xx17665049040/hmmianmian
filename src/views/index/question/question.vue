<template>
  <div class="question-wrap">
    <!-- 上部卡片 -->
    <el-card>
      <!-- inline可以转成行内(一行多个) -->
      <el-form class="demo-form-inline" :inline="true" :model="formInline">
        <el-form-item label="学科">
          <el-select v-model="formInline.subject" placeholder="请选择学科">
            <el-option
              v-for="(item, index) in subjectList"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="阶段">
          <el-select v-model="formInline.step" placeholder="请选择阶段">
            <el-option label="初级" value="1"></el-option>
            <el-option label="中级" value="2"></el-option>
            <el-option label="高级" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业">
          <el-select v-model="formInline.enterprise" placeholder="请选择企业">
            <el-option
              v-for="(item, index) in businessList"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="题型">
          <el-select v-model="formInline.type" placeholder="请选择题型">
            <el-option label="单选" value="1"></el-option>
            <el-option label="多选" value="2"></el-option>
            <el-option label="简答" value="3"></el-option>
          </el-select>
        </el-form-item>
        <!-- 注意:一行只需要显示四个 可以用br直接换行 -->
        <br />
        <el-form-item label="难度">
          <el-select v-model="formInline.difficulty" placeholder="请选择难度">
            <el-option label="简单" value="1"></el-option>
            <el-option label="一般" value="2"></el-option>
            <el-option label="困难" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="formInline.username"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="formInline.status" placeholder="请选择状态">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="formInline.create_date"
            type="date"
          
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>

        <br />
        <el-form-item label="标题" class="title-item">
          <el-input v-model="formInline.title"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">搜索</el-button>
          <el-button>清除</el-button>
          <el-button type="primary" icon="el-icon-plus ">新增实体</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 下部卡片 -->
    <el-card class="bottom-card">
      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%" border >
        <el-table-column type="index"  prop="index" label="序号" width="80"> </el-table-column>
        <el-table-column prop="title" label="题目" width="180"></el-table-column>
        <el-table-column prop="subject" label="学科.阶段"> </el-table-column>

        <el-table-column prop="type" label="题型"> 
            <template slot-scope="scope">
               <span v-if="scope.row.status==1">单选</span>
               <span v-else-if="scope.row.status==2">多选</span>
               <span v-else>简答</span>
            </template>
        </el-table-column>

        <el-table-column prop="enterprise_name" label="企业"> </el-table-column>
        <el-table-column prop="username" label="创建者"> </el-table-column>

        <!-- 利用过滤器filters来做这个特殊的字符 注意: |前面的内容 是参数  也就是scope.row 相当于下面函数的val -->
        <el-table-column prop="status" label="状态"> 
            <template slot-scope="scope">
                 {{ scope.row | formatSubject }}
            </template>
               
        </el-table-column>

        <el-table-column prop="reads" label="访问量"> </el-table-column>
        <el-table-column prop="address" label="操作">
                <template>
                   <el-button type="text">编辑</el-button>
                   <el-button type="text">启用</el-button>
                   <el-button type="text">删除</el-button>
                </template>
        </el-table-column>

      </el-table>

    <!-- 分页 -->
      <el-pagination
        class="my-pagination"
        background
        :current-page="page"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
//导入获取学科列表的接口
import { subjectList } from "@/api/subject.js";
//导入获取企业列表接口
import { businessList } from "@/api/business.js";
// 导入题目列表接口
import { questionList } from '@/api/question.js';

export default {
  name: "question",
  data() {
    return {
      formInline: {},
      subjectList: [],
      businessList: [],
      questionList: [],
      tableData:[],
      //分页
      page:1,
      size:10,
      total:0
    };
  },
  methods: {},
  created() {
    //获取学科列表 注意:只获取启用的学科
    subjectList({
      status: 1
    }).then(res => {
      this.subjectList = res.data.data.items;
    });

    //获取企业列表 注意:只获取启用的企业
    businessList({
      status: 1
    }).then(res => {
      this.businessList = res.data.data.items;
    });

    //获取题目列表 参数:
    questionList({
        page:this.page,
        limit:this.size
    }).then(res=>{
        this.tableData=res.data.data.items
        this.total=res.data.data.pagination.total
    })
  },
  filters:{
      //这里的val相当于 scope.row | formatSubject 里面的 scope.row 
      formatSubject(val){
          //拿到并返回学科名字和阶段对应名字  学科名字是val.subject.name  阶段对应的初中高级 就要进行判断表格上的数据step是1,2,3
        let stepName="" ;
        if(val.step==1){
            stepName="初级"
        }else if(val.step==2){
             stepName="中级"
        }else{
             stepName="高级"
        }
        return val.subject_name + " · " +stepName
      }
  },
};
</script>

<style lang="less">
.question-wrap {
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
