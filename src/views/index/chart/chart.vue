<template>
  <div class="chart">
    <!-- 顶部卡片 -->
    <el-card>
      <ul>
        <li>
          <span class="circle">{{ topData.increment_users }}</span>
          <span>今日新增用户</span>
        </li>
        <li>
          <span class="circle">{{ topData.total_users }} </span>
          <span> 总用户量</span>
        </li>
        <li>
          <span class="circle orange">{{ topData.increment_questions }}</span>
          <span> 新增试题</span>
        </li>
        <li>
          <span class="circle orange">{{ topData.total_questions }}</span>
          <span> 总试题量</span>
        </li>
        <li>
          <span class="circle green">{{ topData.total_done_questions }}</span>
          <span> 总刷题量</span>
        </li>
        <li>
          <span class="circle green">{{ topData.personal_questions }}</span>
          <span>人均刷题量</span>
        </li>
      </ul>
    </el-card>

    <!-- 底部卡片 -->
    <el-card class="card-bottom">
      <div ref="box" class="box"></div>
    </el-card>
  </div>
</template>

<script>

import { getTop,statistics } from "@/api/chart.js";

// 导入echarts
import echarts from "echarts";

export default {
  
  data() {
    return {
      topData: {}
    };
  },
  created() {
    getTop().then(res => {
      this.topData = res.data.data;
    });
  },
  mounted() {
    var myChart = echarts.init(this.$refs.box);

    //掉用请求数据接口  .then的回调函数里才有数据，所以我们的配置和应用配置应该写到.then里
    statistics().then(res => {
        console.log(res)
      // 把数据里的公司名，单独提取出来构成一个新的字符串数组 把res.data.data里面的数组取出来
      // map是新方法，专门用来提取元素内容组成新数组 item是每个元素 
      let names = res.data.data.map( item => {
        //return item.name  把数组中每个元素的name值取出来组成一个新的数组
        return item.name;
      })
      
      // 准备一个配置  复制官网内容
      var option = {
        title: {
          text: "整体数据"
        },

        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          right: 10,
          // 我们需要有一个数组，长下面这样子
          // 数组中每个元素是字符串
          data: names
        },
       
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "30",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: res.data.data
          }
        ]
      };

      myChart.setOption(option);
    });
  }
};
</script>

<style lang="less">
.chart {
    // 不给高度的话 显示不出来
    .box {
    height: 500px;
  }
  ul {
    list-style: none;
    padding: 0px;
    display: flex;
    justify-content: space-around;
    li {
      display: flex;
      // 修改主轴方向为y轴
      flex-direction: column;
      .circle {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        border: 1px solid #2281db;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        margin-bottom: 20px;

        // 交集，既要满足circle也要满足orange，两个类都要有
        &.orange {
          border-color: #dc6b54;
        }

        &.green {
          border-color: #74be8a;
        }
      }
    }
    span {
      text-align: center;
    }
  }
}
</style>
