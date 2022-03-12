<template>
  <el-row>
    <el-col :span="23" class="divider">
      <el-divider direction="vertical" />
      <h4>应付明细</h4>
    </el-col>
    <el-col :span="22" :offset="1">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <vxe-switch
            v-model="costData.ptysState"
            disabled
            on-label="已全"
            :on-value="1"
            off-label="未全"
            :off-value="0"
          ></vxe-switch>
        </el-col>
      </el-row>
      <vxe-table
        border
        show-overflow
        show-footer
        ref="yfTable"
        align="center"
        :loading="loadingList"
        :data="receivablesList"
        :footer-method="footerMethod"
      >
        <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
        <vxe-table-column field="btype" title="往来单位" width="160"></vxe-table-column>
        <vxe-table-column field="payItems" title="付费项目" width="120"></vxe-table-column>
        <vxe-table-column field="unitPrice" title="单价" width="110"></vxe-table-column>
        <vxe-table-column field="amount" title="数量" width="90"></vxe-table-column>
        <vxe-table-column field="totalPrice" title="总价" width="100"></vxe-table-column>
        <vxe-table-column field="invoiceNo" title="发票号" width="110"></vxe-table-column>
        <vxe-table-column field="affirmState" title="确认" width="90">
          <template v-slot="{ row }">
            <vxe-switch v-model="row.affirmState" disabled on-label="是" off-label="否"></vxe-switch>
          </template>
        </vxe-table-column>
        <vxe-table-column field="invoiceState" title="开票" width="90">
          <template v-slot="{ row }">
            <vxe-switch v-model="row.invoiceState" disabled on-label="是" off-label="否"></vxe-switch>
          </template>
        </vxe-table-column>
        <vxe-table-column field="paymentReceivedState" title="实付" width="90">
          <template v-slot="{ row }">
            <vxe-switch v-model="row.paymentReceivedState" disabled on-label="是" off-label="否"></vxe-switch>
          </template>
        </vxe-table-column>
        <vxe-table-column field="remark" title="备注"></vxe-table-column>
      </vxe-table>
    </el-col>
  </el-row>
</template>
<script>
import store from '@/store';
import { getCostList } from '@/api/cost/costMgt';

export default {
  name: 'CopeWith',
  props: {
    costObj: {
      type: Object,
      default: null
    }
  },
  watch: {
    costObj: function (newVal, oldVal) {
      this.costData = newVal;
      this.getList();
    }
  },
  data() {
    return {
      costData: null,
      loadingList: false,
      // 表格数据
      receivablesList: []
    };
  },
  created() {
    this.costData = this.costObj;
    this.getList();
  },
  methods: {
    // 获取列表
    getList() {
      this.loadingList = true;
      var params = {
        mcId: this.costData.mcId,
        costTypes: 5
      };
      // 做箱id 查询费用状态为1 的车队应收费用
      getCostList(params).then((response) => {
        this.$refs.yfTable.loadData(response.data);
        this.loadingList = false;
      });
    },
    // 表尾合计
    footerMethod({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 1) {
            return '合计金额';
          }
          if (['totalPrice'].includes(column.property)) {
            let total = this.$utils.sum(data, column.property).toFixed(2);
            if (this.$route.name == 'Analysis') {
              store.dispatch('setYfTotalAnalysis', total).then(() => {});
            } else {
              store.dispatch('setYfTotalCost', total).then(() => {});
            }
            return total;
          }
          return null;
        })
      ];
    }
  }
};
</script>
<style scoped>
.vxe-switch {
  padding: 0;
}
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
