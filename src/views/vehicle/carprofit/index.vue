<template>
  <div style="padding: 10px 20px 20px 20px;">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="列表分析" name="list">
        <list-analysis v-if="activeIndex == 0"></list-analysis>
      </el-tab-pane>
      <el-tab-pane label="图表分析" name="charts">
        <charts-analysis v-if="activeIndex == 1"></charts-analysis>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import listAnalysis from "./listAnalysis/index.vue";
import chartsAnalysis from "./chartsAnalysis/index.vue";

export default {
  name: "Carprofit",
  components: {
    "list-analysis": listAnalysis,
    "charts-analysis": chartsAnalysis
  },
  data() {
    return {
      activeName: "list",
      activeIndex: 0
    };
  },
  methods: {
    handleClick(tab, event) {
      this.activeIndex = tab.index
    }
  }
};
</script>
