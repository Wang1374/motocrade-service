<template>
  <div style="padding: 10px 20px 20px 20px;">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="费用设置" name="costsSet">
        <costs-set></costs-set>
      </el-tab-pane>
      <el-tab-pane label="订单编号设置" name="orderNumberSet">
        <order-number-set></order-number-set>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import CostsSet from "./costsset/index.vue";
import OrderNumberSet from "./orderNumberSet/index.vue";
export default {
  name: "Parameter",
  components: {
    "costs-set": CostsSet,
    "order-number-set": OrderNumberSet
  },
  data() {
    return {
      activeName: "costsSet"
    };
  },
  methods: {
    handleClick(tab, event) {}
  }
};
</script>
