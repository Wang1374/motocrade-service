<template>
  <el-row>
    <el-col :span="23" class="divider">
      <el-divider direction="vertical" />
      <h4>其他应付明细</h4>
      <!-- <span>&nbsp;&nbsp;{{ costData.caseNumber }}&nbsp;&nbsp;{{ costData.vehicle }}</span> -->
    </el-col>
    <el-col :span="22" :offset="1">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            size="mini"
            @click="submitTable"
            :loading="loadingBut"
          >{{ loadingText }}</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="primary" size="mini" @click="addRow(null)" plain>新增</el-button>
        </el-col>
      </el-row>

      <vxe-table
        border
        keep-source
        show-overflow
        show-footer
        ref="qtyfTable"
        align="center"
        :loading="loadingList"
        :data="receivablesList"
        :edit-rules="validRules"
        :footer-method="footerMethod"
        :edit-config="{trigger: 'click', mode: 'row'}"
      >
        <vxe-table-column type="checkbox" width="60"></vxe-table-column>
        <vxe-table-column
          field="btype"
          title="往来单位"
          width="160"
          :edit-render="{ name: 'ElSelect' }"
        >
          <template v-slot:edit="scope">
            <el-select
              ref="btype"
              v-model="scope.row.btype"
              :disabled="scope.row.expenseStatus == 3"
              clearable
              @change="btypeIdChange(scope.row)"
              filterable
              no-data-text="无匹配数据"
              placeholder="请选择"
              @visible-change="v => visibleChange(v, 'btype', 0, addBtypeClick, '添加往来单位')"
            >
              <el-option
                v-for="item in customerOptions"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </vxe-table-column>
        <vxe-table-column
          field="payItems"
          title="付费项目"
          width="120"
          :edit-render="{ name: 'ElSelect' }"
        >
          <template v-slot:edit="scope">
            <el-select
              ref="payItems"
              v-model="scope.row.payItems"
              :disabled="scope.row.expenseStatus == 3"
              clearable
              filterable
              no-data-text="无匹配数据"
              placeholder="请选择"
              @visible-change="v => visibleChange(v, 'payItems', 0, addPyItemsClick, '添加费用名称')"
            >
              <el-option
                v-for="item in chargesOptions"
                :key="item.id"
                :label="item.feeName"
                :value="item.feeName"
              ></el-option>
            </el-select>
          </template>
        </vxe-table-column>
        <vxe-table-column field="unitPrice" title="单价" :edit-render="{name: 'input'}" width="110">
          <template v-slot:edit="{ row }">
            <vxe-input
              v-model="row.unitPrice"
              type="float"
              step="0.1"
              :disabled="row.expenseStatus == 3"
              clearable
            ></vxe-input>
          </template>
        </vxe-table-column>
        <vxe-table-column field="amount" title="数量" :edit-render="{name: 'input'}" width="90">
          <template v-slot:edit="{ row }">
            <vxe-input
              v-model="row.amount"
              type="float"
              step="1"
              :disabled="row.expenseStatus == 3"
              clearable
            ></vxe-input>
          </template>
        </vxe-table-column>
        <vxe-table-column field="totalPrice" title="总价" width="100">
          <template v-slot="{ row }">
            <span>{{ countAmount(row) }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column field="invoiceNo" title="发票号" :edit-render="{name: 'input'}" width="110">
          <template v-slot:edit="{ row }">
            <vxe-input :min="0" v-model.trim="row.invoiceNo" :disabled="row.expenseStatus == 3"></vxe-input>
          </template>
        </vxe-table-column>
        <vxe-table-column field="affirmState" title="确认" width="90">
          <template v-slot="{ row }">
            <vxe-switch
              v-model="row.affirmState"
              :disabled="row.expenseStatus == 3"
              @change="switchAffirm(row)"
              on-label="是"
              off-label="否"
            ></vxe-switch>
          </template>
        </vxe-table-column>
        <vxe-table-column field="invoiceState" title="开票" width="90">
          <template v-slot="{ row }">
            <vxe-switch
              v-model="row.invoiceState"
              :disabled="row.affirmState == false || row.expenseStatus == 3"
              @change="switchInvoice(row)"
              on-label="是"
              off-label="否"
            ></vxe-switch>
          </template>
        </vxe-table-column>
        <vxe-table-column field="paymentReceivedState" title="实付" width="90">
          <template v-slot="{ row }">
            <vxe-switch
              v-model="row.paymentReceivedState"
              :disabled="getDisabled(row.invoiceState, row.expenseStatus)"
              @change="switchActualPayment(row)"
              on-label="是"
              off-label="否"
            ></vxe-switch>
          </template>
        </vxe-table-column>
        <vxe-table-column field="remark" title="备注" :edit-render="{name: 'input'}" width="15%">
          <template v-slot:edit="{ row }">
            <vxe-input :min="0" v-model="row.remark"></vxe-input>
          </template>
        </vxe-table-column>
        <vxe-table-column title="操作" fixed="right" width="120">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              style="color: #F56C6C"
              :disabled="getDisabled2(scope.row.expenseStatus)"
              @click="deleteRow(scope.row)"
            >删除</el-button>
          </template>
        </vxe-table-column>
      </vxe-table>

      <!-- 添加往来单位 -->
      <add-customer
        ref="addBtype"
        v-if="addBtypeVisible"
        :title="'添加往来单位'"
        :nature="3"
        :visible.sync="addBtypeVisible"
        @customer-success="onBtypeSuccess"
      ></add-customer>

      <!-- 添加费用名称 -->
      <add-payItems
        ref="addPayItems"
        v-if="addPayItemsVisible"
        :title="'添加费用名称'"
        :visible.sync="addPayItemsVisible"
        @costs-success="onPayItemsSuccess"
      ></add-payItems>
    </el-col>
  </el-row>
</template>
<script>
import store from '@/store';
import { getCorporateIdentify } from '@/utils/util';
import { getCostList, updateCost } from '@/api/cost/costMgt';
import { validatenull } from '@/utils/validate';
import { selectBottomAction } from '@/utils/mixins.js';
import AddCustomer from '@/views/oms/addCustomer/index.vue';
import addPayItems from '../../addPayItems/index.vue';
import { checkPermi } from '@/utils/permission';

export default {
  name: 'OtherCopeWith',
  mixins: [selectBottomAction],
  components: {
    'add-customer': AddCustomer,
    'add-payItems': addPayItems
  },
  props: {
    costObj: {
      type: Object,
      default: null
    },
    vehicle: {
      type: String,
      default: ''
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
      loadingBut: false,
      loadingText: '保存',
      loadingList: false,
      // 表格数据
      receivablesList: [],
      // 往来单位
      customerOptions: [],
      // 添加往来单位
      addBtypeVisible: false,
      // 收费项目
      chargesOptions: [],
      // 添加费用名称
      addPayItemsVisible: false,
      validRules: {
        btype: [{ required: true, message: '往来单位必须填写' }],
        payItems: [{ required: true, message: '收费项目必须填写' }]
      }
    };
  },
  created() {
    this.costData = this.costObj;
    this.getList();
  },
  mounted() {
    this.customerOptions = store.getters.customer; // 获取往来单位
    this.chargesOptions = store.getters.costs_set; // 获取费用设置
  },
  methods: {
    //判断应收是否有改变
    isNotChange() {
      //1 长度不同
      var insert = this.$refs.qtyfTable.getInsertRecords().length;
      var update = this.$refs.qtyfTable.getUpdateRecords().length;
      var remove = this.$refs.qtyfTable.getRemoveRecords().length;
      if (insert != 0 || update != 0 || remove != 0) {
        return true;
      } else {
        return false;
      }
    },
    getList() {
      this.loadingList = true;
      var params = {
        mcId: this.costData.mcId,
        costTypes: 4,
        vehicleCost: this.vehicle
      };
      // 做箱id 费用类型 查询其他应付
      getCostList(params).then((response) => {
        this.$refs.qtyfTable.loadData(response.data);
        this.loadingList = false;
      });
    },
    // 添加行
    addRow(row) {
      let qtyfTable = this.$refs.qtyfTable;
      let record = {
        id: undefined,
        belongCompaniesId: getCorporateIdentify(),
        mcId: this.costData.mcId,
        vehicleCost: this.vehicle,
        btypeId: undefined,
        btype: undefined,
        partner: undefined,
        payer: undefined,
        payItems: undefined,
        unitPrice: undefined,
        amount: undefined,
        totalPrice: undefined,
        affirmState: false, // 确认
        invoiceState: false, // 应收开票/实付开票
        paymentReceivedState: false, // 实收/实付
        expenseStatus: 0,
        invoiceNo: undefined,
        remark: undefined,
        costTypes: 4
      };
      qtyfTable.insertAt(record, row).then(({ row }) => {
        qtyfTable.setActiveRow(row);
      });
    },
    // 删除行
    deleteRow(row) {
      this.$XModal.confirm('您确定要删除该数据?').then((type) => {
        if (type === 'confirm') {
          this.$refs.qtyfTable.remove(row);
        }
      });
    },
    // 总价
    countAmount(row) {
      let totalPrice = this.$utils
        .multiply(row.unitPrice, row.amount)
        .toFixed(2);
      row.totalPrice = totalPrice;
      return totalPrice;
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
              store.dispatch('setQtyfTotalAnalysis', total).then(() => {});
            } else {
              store.dispatch('setQtyfTotalCost', total).then(() => {});
            }
            return total;
          }
          return null;
        })
      ];
    },
    // 添加往来单位
    addBtypeClick() {
      this.addBtypeVisible = true;
    },
    btypeIdChange(row) {
      var newArr = this.customerOptions.filter(function (obj) {
        return obj.value == row.btype;
      });
      if (newArr.length > 0) {
        row.btypeId = newArr[0].id;
        row.partner = newArr[0].partner;
        row.payer = newArr[0].payer;
      }
    },
    // 添加往来单位 成功回调
    onBtypeSuccess() {
      var that = this;
      setTimeout(function () {
        that.customerOptions = store.getters.customer;
      }, 1000);
    },
    // 添加费用名称
    addPyItemsClick() {
      this.addPayItemsVisible = true;
    },
    // 添加费用名称 成功回调
    onPayItemsSuccess() {
      var that = this;
      setTimeout(function () {
        that.chargesOptions = store.getters.costs_set;
      }, 1000);
    },
    // 判断是否禁用
    getDisabled(invoiceState, expenseStatus) {
      let corporateIdentify = store.getters.userInfo.corporateIdentify;
      if (invoiceState == false) {
        return true;
      } else if (corporateIdentify.length > 5) {
        return false;
      } else if (expenseStatus == 3) {
        return true;
      }
    },
    getDisabled2(expenseStatus) {
      let corporateIdentify = store.getters.userInfo.corporateIdentify;
      if (corporateIdentify.length > 5) {
        return false;
      } else if (expenseStatus == 3) {
        return true;
      }
    },
    // 确认选中事件
    switchAffirm(row) {
      let state = checkPermi(['cost:detailed:confirm']);
      if (state) {
        if (row.affirmState == false) {
          row.invoiceState = false;
          row.paymentReceivedState = false;
          row.expenseStatus = 0;
        } else {
          row.expenseStatus = 1;
        }
      } else {
        row.affirmState = false;
        this.$notify.error({
          title: '当前操作没有权限'
        });
      }
    },
    // 开票选中事件
    switchInvoice(row) {
      let state = checkPermi(['cost:detailed:invoice']);
      if (state) {
        if (!validatenull(row.invoiceNo)) {
          row.expenseStatus = 2;
        } else {
          row.invoiceState = false;
          this.$message({
            message: '请先输入发票号',
            type: 'warning'
          });
        }
      } else {
        row.invoiceState = false;
        this.$notify.error({
          title: '当前操作没有权限'
        });
      }
    },
    // 实付选中事件
    switchActualPayment(row) {
      let state = checkPermi(['cost:detailed:payment']);
      if (state) {
        if (row.paymentReceivedState == true) {
          this.$confirm('实付后无法修改, 是否继续?', '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(function () {
              row.expenseStatus = 3;
            })
            .catch(function () {
              row.paymentReceivedState = false;
            });
        } else {
          row.expenseStatus = 2;
        }
      } else {
        row.paymentReceivedState = false;
        this.$notify.error({
          title: '当前操作没有权限'
        });
      }
    },
    // 保存应收明细
    async submitTable() {
      this.loadingBut = true;
      this.loadingText = '保存中';
      const errMap = await this.$refs.qtyfTable
        .fullValidate()
        .catch((errMap) => errMap);
      if (errMap) {
        let msgList = [];
        Object.values(errMap).forEach((errList) => {
          errList.forEach((params) => {
            let { rowIndex, column, rules } = params;
            rules.forEach((rule) => {
              msgList.push(`${column.title} 校验错误：${rule.message}`);
            });
          });
        });
        this.$XModal.message({
          status: 'error',
          message: () => {
            return [
              <div class="red" style="max-height: 400px;overflow: auto;">
                {msgList.map((msg) => (
                  <div>{msg}</div>
                ))}
              </div>
            ];
          }
        });
        this.loadingBut = false;
        this.loadingText = '保存';
      } else {
        let fullData = this.$refs.qtyfTable.getTableData().fullData;
        for (var i = 0, len = fullData.length; i < len; i++) {
          fullData[i].vehicleCost = this.vehicle;
        }
        this.loadingList = true;
        if (fullData.length == 0) {
          let arry = [
            {
              mcId: this.costData.mcId,
              costTypes: 4,
              vehicleCost: this.vehicle
            }
          ];
          updateCost(arry).then((response) => {
            if (response.data.code === 200) {
              this.msgSuccess('保存成功');
              this.$emit('updateMakingProfit');
              setTimeout(() => {
                this.getList();
                this.loadingList = false;
                this.loadingBut = false;
                this.loadingText = '保存';
              }, 1000);
            }
          });
        } else {
          updateCost(fullData).then((response) => {
            if (response.data.code === 200) {
              this.msgSuccess('保存成功');
              this.$emit('updateMakingProfit');
              setTimeout(() => {
                this.getList();
                this.loadingList = false;
                this.loadingBut = false;
                this.loadingText = '保存';
              }, 1000);
            }
          });
        }
      }
    }
  }
};
</script>