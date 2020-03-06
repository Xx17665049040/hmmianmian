<template>
  <el-cascader
    v-model="city"
    :options="options"
    :props="{ expandTrigger: 'hover',value:'label' }"
    @change="handleChange"
  ></el-cascader>
</template>

<script>
// 导入省市区一级全部选项的联动数据 regionDataPlus
import {regionDataPlus} from 'element-china-area-data'
export default {
    //接收父组件传过来的值
    props:{
        value:{
            default:""
        }
    },
    data(){
        return{
          city:this.value,
          options:regionDataPlus
        }
    },
    methods:{
        //将选择框city的值 传给父组件 
        handleChange(){
            this.$emit('input',this.city)
        }
    }
};
</script>

<style></style>
