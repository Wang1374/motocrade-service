<template>
  <div>
    <el-row>
      <el-col :span="23" class="divider">
        <el-divider direction="vertical" />
        <h4>基础信息</h4>
      </el-col>
      <el-col :span="23">
        <el-form ref="form" :model="form" label-width="110px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="下单编号">
                <el-input v-model="form.placeOrderNumber" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="业务类型">
                <el-select v-model="form.orderType" style="width: 100%" disabled>
                  <el-option
                    v-for="item in orderTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="箱型">
                <el-input v-model="form.boxPile" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="箱号">
                <el-input v-model="form.caseNumber" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="提单号">
                <el-input v-model.trim="form.blNoStr" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="船名航次">
                <el-input v-model="form.vesselAndVoyage" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="停靠码头">
                <el-input v-model="form.dock" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="提/还箱点">
                <el-input v-model="form.prPoint" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="门点地址">
                <el-input v-model.trim="form.address" disabled />
              </el-form-item>
            </el-col>
            
            <el-col :span="6">
              <el-form-item label="毛重">
                <el-input v-model.trim="form.grossWeight" disabled />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>

    <!-- 应付明细 -->
    <cope-with ref="copeWithChild" :costObj="form"></cope-with>
  </div>
</template>
<script>
import CopeWith from "./copeWith/index.vue";
import store from "@/store";

export default {
  name: "CostDetails",
  components: {
    "cope-with": CopeWith,
  },
  props: {
    objForm: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      form: {},
      // 订单类型
      orderTypeOptions: [
        {
          value: 1,
          label: "海运出口",
        },
        {
          value: 2,
          label: "海运进口",
        },
      ],
      // 运输方式
      typeOfShippingOptions: [
        {
          value: 1,
          label: "自做",
        },
        {
          value: 2,
          label: "外发",
        },
      ],
    };
  },
  computed: {
    profit() {
      let profit = 0;
      if (this.$route.name == "Analysis") {
        profit = (
          Number(store.getters.ys_total_analysis) -
          Number(store.getters.yf_total_analysis) +
          Number(store.getters.qtys_total_analysis) -
          Number(store.getters.qtyf_total_analysis)
        ).toFixed(2);
      } else {
        profit = (
          Number(store.getters.ys_total_cost) -
          Number(store.getters.yf_total_cost) +
          Number(store.getters.qtys_total_cost) -
          Number(store.getters.qtyf_total_cost)
        ).toFixed(2);
      }
      return profit;
    },
  },
  created() {
    this.form = JSON.parse(JSON.stringify(this.objForm));
    if(this.form.orderType==1){
      this.form.prPoint = this.form.suitcasePoint;
    }else if(this.form.orderType==2){
      this.form.profit = this.form.returnPoint;
    } 
  },
  mounted() {
    window.scrollTo(0, 0);
  },
  methods: {
    // 上下箱事件
    upAndDown(index) {
      this.$emit("up-down-events", index, (data) => {
        if (data == null) {
          this.$message({
            message: "没有数据了...",
            type: "warning",
          });
        } else {
          this.form = JSON.parse(JSON.stringify(data));
        }
      });
    }
  }
};
</script>
<style scoped>
.divider {
  height: 56px;
  padding: 0 15px;
  align-items: center;
  display: flex;
}
.el-divider--vertical {
  border-left: 3px solid #408eff;
}
</style>
