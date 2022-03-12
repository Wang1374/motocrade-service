<template>
  <!-- 柱状图 月统计 -->
  <div class="dashboard-editor-container">
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <el-col :span="22">
        <div id="myChart" :style="{height:height,width:width}"></div>
      </el-col>
      <el-col :span="2">
        <el-date-picker
          v-model="params.year"
          @change="dataTime"
          :clearable="false"
          :picker-options="pickerOptions"
          type="year"
          size="mini"
          style="width: 100%;margin-top: 80px;"
          format="yyyy年度"
          value-format="yyyy"
          placeholder="选择年度"
        ></el-date-picker>
      </el-col>
    </el-row>
  </div>
  <!-- 折线图 年统计 -->
  <!-- 饼状图 总统计 -->
</template>
<script>
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import { mapState } from "vuex";
import { getMonthlyProfit } from "@/api/basic/carProfit";
import { getCorporateIdentify } from "@/utils/util";

export default {
  name: "ChartsAnalysis",
  props: {
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "550px"
    }
  },
  data() {
    return {
      params: {
        belongCompaniesId: getCorporateIdentify(),
        year: new Date().getFullYear().toString(),
        isManage: "",
        vehicles: ""
      },
      legendData: [],
      selectedData: {},
      seriesData: [],
      pickerOptions: {
        disabledDate(time) {
          return (
            time.getFullYear() < "2019" ||
            time.getFullYear() > new Date().getFullYear()
          );
        }
      }
    };
  },
  created() {
    this.getData();
  },
  mounted() {},
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  methods: {
    // 获取月份数据
    getData() {
      this.params.isManage = this.userInfo.corporateIdentify;
      this.params.vehicles = this.userInfo.vehicles;
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
      getMonthlyProfit(this.params).then(response => {
        if (response.status == 200) {
          this.legendData = [];
          this.selectedData = {};
          this.seriesData = [];
          let list = response.data;
          for (var i = 0, size = list.length; i < size; i++) {
            this.legendData.push(list[i].vehicle);
            this.seriesData.push({
              name: list[i].vehicle,
              type: "bar",
              data: [
                list[i].jan,
                list[i].feb,
                list[i].mar,
                list[i].apr,
                list[i].may,
                list[i].june,
                list[i].july,
                list[i].aug,
                list[i].sept,
                list[i].oct,
                list[i].nov,
                list[i].dece
              ]
            });
            this.selectedData[list[i].vehicle] = i < 5;
          }
          loading.close();
          this.drawLine();
        }
      });
    },
    // 日期选择事件
    dataTime() {
      this.getData();
    },
    // 绘制echarts
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(
        document.getElementById("myChart"),
        "macarons"
      );
      myChart.clear();
      window.onresize = function() {
        myChart.resize();
        // myChart2.resize();
        // myChart3.resize();
      };
      // 绘制图表
      myChart.setOption({
        title: {
          text: "月度统计（单位:元）",
          top: "2%",
          left: "center",
          textStyle: {
            //文本样式
            fontSize: 24
          }
        },
        legend: {
          type: "scroll",
          top: "15%",
          left: "2%",
          right: "2%",
          selector: true,
          data: this.legendData,
          selected: this.selectedData
        },
        grid: {
          top: "30%",
          left: "2%",
          right: "2%",
          containLabel: true
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        xAxis: {
          type: "category",
          data: [
            "1月",
            "2月",
            "3月",
            "4月",
            "5月",
            "6月",
            "7月",
            "8月",
            "9月",
            "10月",
            "11月",
            "12月"
          ],
          axisTick: {
            alignWithLabel: true
          }
        },
        yAxis: [
          {
            type: "value"
          }
        ],
        series: this.seriesData
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
<style >
.el-input--suffix .el-input__inner {
  padding-right: 1px;
}
</style>
