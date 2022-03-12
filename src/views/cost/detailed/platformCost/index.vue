<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--客户数据-->
      <el-col :span="24" :xs="24">
        <div v-show="showCostType === 0">
          <el-form
            :model="queryParams"
            ref="queryForm"
            @submit.native.prevent
            :inline="true"
            label-width="68px"
          >
            <el-form-item prop="costTypes">
              <el-select
                v-model="queryParams.costTypes"
                @change="costTypesQuery"
                size="small"
                clearable
                placeholder="请选择账单属性"
              >
                <el-option
                  v-for="item in costTypesOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              prop="expenseStatus"
              v-if="queryParams.costTypes == 1 || queryParams.costTypes == 3"
            >
              <el-select
                v-model="queryParams.expenseStatus"
                @change="handleQuery"
                size="small"
                placeholder="请选择费用状态"
              >
                <el-option
                  v-for="item in ysStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              prop="expenseStatus"
              v-else-if="queryParams.costTypes == 2|| queryParams.costTypes == 4"
            >
              <el-select
                v-model="queryParams.expenseStatus"
                @change="handleQuery"
                size="small"
                placeholder="请选择费用状态"
              >
                <el-option
                  v-for="item in yfStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="caseNumber">
              <el-input
                v-model.trim="queryParams.caseNumber"
                placeholder="箱号"
                class="MytoUpper"
                clearable
                size="small"
                style="width: 200px"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
              <el-popover width="380" popper-class="myPopover" v-model="searchVisible">
                <!-- 高级搜索 -->
                <cost-search :searchVisible.sync="searchVisible" @search-success="onSearchSuccess"></cost-search>
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  size="small"
                  plain
                  slot="reference"
                >高级搜索</el-button>
              </el-popover>
            </el-form-item>
          </el-form>

          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-download"
                @click="exportFees"
                plain
                v-hasPermi="['cost:detailed:export']"
              >导出费用</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                @click="editTableHeader"
                type="primary"
                icon="el-icon-s-grid"
                size="mini"
                plain
              >自定义表头</el-button>
            </el-col>
          </el-row>

          <el-table
            v-loading="loading"
            border
            ref="costTable"
            height="400px"
            :data="costList"
            @selection-change="handleSelectionChange"
            @cell-dblclick="updateDate"
            highlight-current-row
            :row-class-name="tableRowClassName"
            row-key="id"
            :default-sort="{prop: 'customerName'}"
          >
            <el-table-column
              type="selection"
              prop="selection"
              width="50"
              align="center"
              :reserve-selection="true"
            />
            <el-table-column
              label="序号"
              type="index"
              :index="indexMethod"
              width="70"
              align="center"
            />
            <el-table-column
              v-for="item in tableHeaderList"
              :key="item.id"
              :label="item.rowName"
              :prop="item.rowField"
              align="center"
              :min-width="item.width"
              :sortable="item.rowField == 'customerName'"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span
                  v-if="item.rowField==='costTypes'"
                  :style="scope.row.costTypes | statusFilter"
                >{{ scope.row.costTypes | costTypesFiter}}</span>
                <span
                  v-else-if="item.rowField==='orderType'"
                >{{ scope.row.orderType | orderTypeFiter}}</span>
                <span
                  v-else-if="item.rowField==='expenseStatus'"
                >{{ scope.row.expenseStatus | stateFiter(scope.row.costTypes) }}</span>
                <span v-else-if="item.rowField==='btype'">{{ scope.row.fleetName }}</span>
                <span
                  v-else-if="item.rowField==='packingTime'"
                >{{ formatDate(scope.row.packingTime, 'yyyy-MM-dd hh:mm') }}</span>
                <span
                  v-else-if="item.rowField==='createDate'"
                >{{ formatDate(scope.row.createDate, 'yyyy-MM-dd hh:mm') }}</span>
                <span
                  v-else-if="item.rowField==='vesselAndVoyage'"
                >{{ scope.row.vesselAndVoyage | vesselAndVoyageFiter}}</span>
                <span v-else-if="item.rowField==='customerName'">{{ scope.row.companyName }}</span>
                <span v-else>{{ scope.row[item.rowField] }}</span>
              </template>
            </el-table-column>
          </el-table>

          <el-row>
            <el-col :span="24" style="display:table">
              <div class="content">
                <span style="font-weight:bold;margin-left: 20px;margin-right: 20px;">选中总计：</span>
                <span v-if="multipleSelection.length == 0">当前无选中</span>
                <span v-else>
                  <span style="margin-right: 30px;">
                    <span style="font-weight:bold;">应收：</span>
                    <span style="color: red">{{ ysTotal }}</span>
                    <span>CNY</span>
                  </span>
                  <span style="margin-right: 30px;">
                    <span style="font-weight:bold;">应付：</span>
                    <span style="color: red">{{ yfTotal }}</span>
                    <span>CNY</span>
                  </span>
                  <span style="margin-right: 30px;">
                    <span style="font-weight:bold;">其他应收：</span>
                    <span style="color: red">{{ qtysTotal }}</span>
                    <span>CNY</span>
                  </span>
                  <span style="margin-right: 30px;">
                    <span style="font-weight:bold;">其他应付：</span>
                    <span style="color: red">{{ qtyfTotal }}</span>
                    <span>CNY</span>
                  </span>
                </span>
              </div>
            </el-col>
          </el-row>

          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
          />
        </div>

        <div v-if="showCostType === 1">
          <el-page-header @back="reverseBack" content="费用录入"></el-page-header>
          <platform-cost-details :objForm="formData"></platform-cost-details>
        </div>

        <el-dialog
          title="导出费用数据"
          :visible.sync="expenseDataVisible"
          :close-on-click-modal="false"
          center
          append-to-body
          :destroy-on-close="true"
          width="400px"
        >
          <el-form ref="edForm" :model="edForm" label-width="80px">
            <el-form-item label="导出类型" prop="type">
              <el-select v-model="edForm.type" placeholder="请选择" style="width: 100%">
                <el-option
                  v-for="item in edOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="expenseDataVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitType">确 定</el-button>
          </span>
        </el-dialog>

        <!-- 表头排序弹框 -->
        <op-ration
          :isShow.sync="isShow"
          v-if="isShow"
          @getTableHeaderLoading="getTableHeaderLoading"
          @getTableHeader="getTableHeader"
          :isRow="isRow"
          :headerList="tableHeader"
          :userId="userId"
        ></op-ration>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getCorporateIdentify } from '@/utils/util';
import { getCostListPage, batchUpdate, exportFees } from '@/api/cost/costMgt';
import CostSearch from '../../costSearch/index.vue';
import PlatformCostDetails from '@/views/cost/platformCostDetails/index.vue';
import { validatenull } from '@/utils/validate';
import Operation from '@/views/tableheader/index.vue';
import { mapState } from 'vuex';
import { orderHeader } from '@/api/oms/tableHeader';
import { exportExcel } from '@/utils/util';
import { checkPermi } from '@/utils/permission';

export default {
  name: 'Detailed',
  components: {
    'cost-search': CostSearch,
    'platform-cost-details': PlatformCostDetails,
    'op-ration': Operation
  },
  filters: {
    vesselAndVoyageFiter: function (value) {
      if (value != undefined) {
        return value.replace('/', ' ');
      }
    },
    statusFilter: function (status) {
      const statusMap = {
        5: 'color: #67C23A',
        1: 'color: #F56C6C'
      };
      return statusMap[status];
    },
    costTypesFiter: function (value) {
      const statusMap = {
        5: '应收',
        1: '应付'
      };
      return statusMap[value];
    },
    orderTypeFiter: function (value) {
      const statusMap = {
        1: '海运出口',
        2: '海运进口',
        3: '空运出口',
        4: '空运进口'
      };
      return statusMap[value];
    },
    stateFiter: function (state, type) {
      if (type == 1 || type == 3) {
        const statusMap = {
          0: '未确认',
          1: '已确认 未开票',
          2: '已开票 未实收',
          3: '已实收'
        };
        return statusMap[state];
      } else {
        const statusMap = {
          0: '未确认',
          1: '已确认 未开票',
          2: '已开票 未实付',
          3: '已实付'
        };
        return statusMap[state];
      }
    }
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 总条数
      total: 0,
      // 表格数据
      costList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 20,
        sort: 'create_date',
        order: 'desc',
        belongCompaniesId: getCorporateIdentify(),
        caseNumber: '',
        costTypes: null,
        expenseStatus: null,
        type: 0
      },
      // 账单类型
      costTypesOptions: [
        {
          value: 0,
          label: '全部属性'
        },
        {
          value: 5,
          label: '应收'
        },
        {
          value: 1,
          label: '应付'
        }
      ],
      ysStatusOptions: [
        {
          value: -1,
          label: '全部属性'
        },
        {
          value: 0,
          label: '未确认'
        },
        {
          value: 1,
          label: '已确认 未开票'
        },
        {
          value: 2,
          label: '已开票 未实收'
        },
        {
          value: 3,
          label: '已实收'
        }
      ],
      yfStatusOptions: [
        {
          value: -1,
          label: '全部属性'
        },
        {
          value: 0,
          label: '未确认'
        },
        {
          value: 1,
          label: '已确认 未开票'
        },
        {
          value: 2,
          label: '已开票 未实付'
        },
        {
          value: 3,
          label: '已实付'
        }
      ],
      edOptions: [
        {
          value: 1,
          label: '导出费用明细表'
        },
        {
          value: 2,
          label: '导出客户费用表'
        }
      ],
      showCostType: 0,
      searchVisible: false,
      formData: null,
      // 选中数组
      multipleSelection: [],
      expenseDataVisible: false,
      fphForm: {
        invoiceNo: ''
      },
      rules: {
        invoiceNo: [
          { required: true, message: '请输入发票号', trigger: 'blur' }
        ]
      },
      edForm: {
        type: 1
      },
      ysTotal: 0,
      yfTotal: 0,
      qtysTotal: 0,
      qtyfTotal: 0,
      //表头数据表id  tableId
      queryHeader: {
        //出口订单表id
        tableId: '5',
        //当前账户id
        userId: ''
      },
      //表头数据
      tableHeader: [],
      //是否展示表头排序
      isShow: false,
      show: false
    };
  },
  computed: {
    tableHeaderList: function () {
      return this.tableHeader.filter(function (item) {
        return item.show1;
      });
    },
    ...mapState({
      userInfo: (state) => state.user.userInfo
    })
  },
  created() {
    this.getTableHeader();
    this.getList();
  },
  mounted() {},
  methods: {
    getTableHeader() {
      this.queryHeader.userId = this.userInfo.id;
      //根据表tableId获取表头
      orderHeader(this.queryHeader).then((response) => {
        this.tableHeader = response.data;
      });
    },
    getTableHeaderLoading() {
      this.loading = true;
      this.queryHeader.userId = this.userInfo.id;
      // 根据表tableId获取表头
      orderHeader(this.queryHeader).then((response) => {
        this.tableHeader = response.data;
      });
      this.loading = false;
    },
    editTableHeader() {
      this.isShow = true;
      this.isRow = true;
      this.userId = this.userInfo.id;
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.expenseStatus === 3) {
        return 'success-row';
      } else if (row.expenseStatus === 2) {
        return 'warning-row';
      } else if (row.expenseStatus === 1) {
        return 'danger-row';
      }
      return '';
    },
    getList() {
      this.loading = true;
      getCostListPage(this.queryParams).then((response) => {
        this.costList = response.data.list;
        this.total = response.data.total;
        this.$nextTick(() => {
          this.$refs.costTable.doLayout();
        });
        this.loading = false;
      });
    },
    // 翻页序号递增
    indexMethod(index) {
      let curpage = this.queryParams.pageNum;
      let limitpage = this.queryParams.pageSize;
      return index + 1 + (curpage - 1) * limitpage;
    },
    // 账单属性搜索
    costTypesQuery() {
      this.queryParams.expenseStatus = null;
      this.queryParams.page = 1;
      this.getList();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.$refs.costTable.clearSelection();
      this.getList();
    },
    // 高级搜索
    onSearchSuccess(res) {
      this.loading = true;
      var params = {
        pageNum: 1,
        pageSize: 10,
        sort: 'create_date',
        order: 'desc',
        orderType: res.orderType,
        orderNumber: res.orderNumber,
        customerId: res.customerId,
        fleetId: res.btypeId,
        partner: res.partner,
        blNo: res.blNo,
        invoiceNo: res.invoiceNo,
        vehicle: res.vehicle,
        jdBeginTime: res.jdBeginTime,
        jdEndTime: res.jdEndTime,
        zxBeginTime: res.zxBeginTime,
        zxEndTime: res.zxEndTime,
        belongCompaniesId: getCorporateIdentify()
      };
      Object.assign(this.queryParams, params);
      this.queryParams.caseNumber = '';
      this.queryParams.costTypes = null;
      this.queryParams.expenseStatus = null;
      this.$refs.costTable.clearSelection();
      this.getList();
    },
    /** 修改双击操作 */
    updateDate(row, column) {
      let state = checkPermi(['cost:detailed:edit']);
      if (state) {
        if (column.property !== 'selection') {
          this.formData = Object.assign({}, row);
          this.showCostType = 1;
        }
      } else {
        this.$notify.error({
          title: '当前操作没有权限'
        });
      }
    },
    // 返回事件
    reverseBack() {
      this.getList();
      this.showCostType = 0;
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      let ys = 0;
      let yf = 0;
      let qtys = 0;
      let qtyf = 0;
      for (var i = 0; i < selection.length; i++) {
        if (selection[i].costTypes == 1) {
          ys += Number(selection[i].totalPrice);
        } else if (selection[i].costTypes == 2) {
          yf += Number(selection[i].totalPrice);
        } else if (selection[i].costTypes == 3) {
          qtys += Number(selection[i].totalPrice);
        } else if (selection[i].costTypes == 4) {
          qtyf += Number(selection[i].totalPrice);
        }
      }
      this.ysTotal = ys.toFixed(2);
      this.yfTotal = yf.toFixed(2);
      this.qtysTotal = qtys.toFixed(2);
      this.qtyfTotal = qtyf.toFixed(2);
      this.multipleSelection = selection;
    },
    // 导出费用
    exportFees() {
      if (this.multipleSelection.length !== 0) {
        if (this.multipleSelection.length <= 2000) {
          this.expenseDataVisible = true;
        } else {
          this.$message({
            message: '一次只能导出2000条',
            type: 'warning'
          });
        }
      } else {
        this.$message({
          message: '请勾选需要导出的费用明细',
          type: 'warning'
        });
      }
    },
    submitType() {
      this.multipleSelection[0].achieve = this.ysTotal;
      this.multipleSelection[0].pay = this.yfTotal;
      this.multipleSelection[0].extraAchieve = this.qtysTotal;
      this.multipleSelection[0].extraPay = this.qtyfTotal;
      if (this.edForm.type == 1) {
        exportFees(this.multipleSelection, '1').then((response) => {
          exportExcel(response);
          this.expenseDataVisible = false;
        });
      } else {
        exportFees(this.multipleSelection, '2').then((response) => {
          exportExcel(response);
          this.expenseDataVisible = false;
        });
      }
    }
  }
};
</script>
<style scoped>
.el-table .success-row {
  background: #d5f9c3;
}
.el-table .danger-row {
  background: #ffd7d7;
}
.el-table .warning-row {
  background: #ffe6c1;
}
.el-popover.myPopover {
  padding: 0px;
}
.content {
  height: 50px;
  background-color: #e1e1e1;
  display: table-cell;
  vertical-align: middle;
}
.el-page-header__left .el-icon-back {
  color: #409eff;
}
.el-page-header__title {
  color: #409eff;
}
.MytoUpper .el-input__inner {
  text-transform: uppercase;
}
</style>
