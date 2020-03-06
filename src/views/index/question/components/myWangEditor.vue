<template>
  <div>
    <div class="toolbar" ref="toolbar"></div>
    <div class="content" ref="content"> {{value}}</div>
  </div>
</template>

<script>
// 导入编辑器
import wangEditor from "wangeditor";
export default {
  data() {},
  props:{
      value:{
         type:String,
         default:'' 
      }
  },
  mounted() {
    // 实例化编辑器对象,并传入div
    let editor = new wangEditor( this.$refs.toolbar,this.$refs.content);

    //获取内容editor.txt.html()   设置内容editor.txt.html('今天天气很好')

    // 注意:  wangEditor的内容改变事件(只要内容修改就会触发)  可以用来传值给父组件
        //   editor.customConfig.onchange=function(html){}   html是参数
        
    editor.customConfig.onchange = html=>{
        //传值给父组件  这里只能箭头函数 因为this指向了window,所以要用箭头函数
        this.$emit('input',html)
    }

        
    //直接调用
    editor.create();
  }
};
</script>

<style>
.toolbar {
  border: 1px solid #ccc;
}
.content {
  border: 1px solid #ccc;
  height: 150px;
}
</style>
