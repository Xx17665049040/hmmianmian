<template>
  <!--  因为有多个地方用这个组件 所所以封装成全局 -->

    <el-select v-model="subject" @change="selChange" placeholder="请选择学科">
      <!-- 这个所有学科要按条件显示 -->
      <el-option v-if="isSearch">所有学科</el-option>
      <el-option
        v-for="(item,index) in subjectList"
        :key="index"
        :label="item.name"
        :value="item.id"
      ></el-option>
    </el-select>
 
</template>

<script>
import { subjectList } from "@/api/subject.js";
export default {
//  要实现父组件中的v-model  要有父传子 并且props要叫value  子传父写在方法上 并且事件名叫input
  props: {
    value: {
        // {}里面是对value的限制 
        defalut:""
    },
    isSearch:{
        type:Boolean,
        default:false
      }
  },

  data() {
    return {
        // 这里的subject的值 this.value 是从父组件传过来的 
      subject: this.value,
      subjectList: [],

      
    };
  },
  watch:{
      value(val){
      // 参数就是它改变后的值，只要把value改变后的值再赋值给subject就可以了
      // console.log('value变了，变成：' + val);
      this.subject = val;
      
    }
  },
  methods: {
    //   定义一个方法给父组件传值 传的值有两个参数 第一个事件名 "input"  第二个参数是子组件里的subject
      selChange(){
          //在这里给父组件传值(数据发生变化就传  饿了么有个change事件,所以直接在@change写)  'input'是事件名  this.subject是参数   $emit是一种给父组件传值的方法
          this.$emit('input',this.subject)
      }
  },
  created() {
    subjectList({
      status: 1
    }).then(res => {
      this.subjectList = res.data.data.items;
    });
  }
};
</script>

<style lang="less"></style>
