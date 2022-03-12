<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="出口订单" name="export">
        <export-order></export-order>
      </el-tab-pane>
      <el-tab-pane label="进口订单" name="import">
        <import-order></import-order>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import ExportOrder from "./exportorder/index.vue";
import ImportOrder from "./importorder/index.vue";
export default {
  name: "Placeorder",
  components: {
    "export-order": ExportOrder,
    "import-order": ImportOrder

  },
  data() {
    return {
      activeName: "export"
    };
  },
  methods: {
    handleClick(tab, event) {
    }
  }
};
</script>