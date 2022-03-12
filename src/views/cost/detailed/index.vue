<template>
  <div>
    <div v-if="ctype == 1">
      <!-- 车队费用明细 -->
      <motorcade-cost></motorcade-cost>
    </div>
    <div v-if="ctype == 0">
      <!-- 平台费用明细 -->
      <platform-cost></platform-cost>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import MotorcadeCost from "./motorcadeCost/index";
import PlatformCost from "./platformCost/index";

export default {
  name: "Detailed",
  components: {
    "motorcade-cost": MotorcadeCost,
    "platform-cost": PlatformCost,
  },
  data() {
    return {
      //公司类型
      ctype: 0
    };
  },
  computed: {
    ...mapState({
      company: state => state.constant.company
    })
  },
  created() {
    this.ctype = this.company.accountType;
  }
};
</script>
