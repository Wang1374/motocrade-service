<template>
  <el-row>
    <el-col :span="23" class="divider">
      <el-divider direction="vertical" />
      <h4>应付明细</h4>
    </el-col>
    <el-col :span="22" :offset="1">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" size="mini" @click="copeRow()" plain>复制成应收</el-button>
        </el-col>
        <el-col :span="1.5">
          <vxe-switch
            v-model="costData.ysState"
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
        @checkbox-all="selectAllEvent"
        @checkbox-change="selectChangeEvent"
      >
        <vxe-table-column type="checkbox" width="60"></vxe-table-column>
        <vxe-table-column type="seq" title="序号" width="60"></vxe-table-column>
        <vxe-table-column field="fleetName" title="往来单位" width="160"></vxe-table-column>
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
        <vxe-table-column field="remark" title="备注" mini-width="9%"></vxe-table-column>
      </vxe-table>
    </el-col>
  </el-row>
</template>
<script>
import store from '@/store';
import { getCostList } from '@/api/cost/costMgt';
import Bus from '@/api/bus';

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
      receivablesList: [],
      // 选中数组
      multipleSelection: []
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
        costTypes: 1
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
    },
    // 全选事件
    selectAllEvent({ checked, records }) {
      this.multipleSelection = records;
    },
    // 勾选事件
    selectChangeEvent({ checked, records }) {
      this.multipleSelection = records;
    },
    // 复制
    copeRow() {
      if (this.multipleSelection.length > 0) {
        let array = JSON.parse(JSON.stringify(this.multipleSelection));
        for (var i = 0; i < array.length; i++) {
          array[i].id = undefined;
          // array[i].btype = undefined;
          array[i].affirmState = false;
          array[i].invoiceState = false;
          array[i].paymentReceivedState = false;
          array[i].expenseStatus = 0;
          array[i].costTypes = 5;
          array[i].invoiceNo = undefined;
        }
        Bus.$emit('copePTYF', array);
      } else {
        this.$message({
          message: '请勾选需要复制的数据',
          type: 'warning'
        });
      }
    }
  }
};
</script>
<style scoped>
.vxe-switch {
  padding: 0;
}
.el-input.is-disabled .el-input__inner {
  color: black !important;
}

.el-textarea.is-disabled .el-textarea__inner {
  color: black;
}
</style>
