<template>
  <div class="app-container">
    <div v-show="showCostType === 0">
      <!--输入搜索框-->
      <el-form
        :inline="true"
        :v-model="queryParams"
        class="demo-form-inline"
        @submit.native.prevent
      >
        <el-form-item prop="customerName">
          <el-select
            ref="customer"
            style="width: 100%"
            size="small"
            clearable
            v-model="queryParams.customerName"
            @change="customerNameQuery"
            filterable
            no-data-text="无匹配数据"
            placeholder="全部客户"
          >
            <template v-for="item in customerOptions">
              <el-option
                v-if="item.type == 1"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item prop="blNos">
          <el-input
            v-model.trim="queryParams.blNoStr"
            placeholder="提单号"
            class="MytoUpper"
            clearable
            size="small"
            style="width: 200px"
            @keyup.enter.native="searchCaseNumber"
          />
        </el-form-item>
        <el-form-item>
          <el-button @click="searchCaseNumber" type="primary" size="small" icon="el-icon-search">搜索</el-button>
          <el-popover width="380" popper-class="myPopover" v-model="searchVisible">
            <advanced-search :searchVisible.sync="searchVisible" @search-success="onSearchSuccess"></advanced-search>
            <el-button type="primary" icon="el-icon-search" size="small" plain slot="reference">高级搜索</el-button>
          </el-popover>
        </el-form-item>
      </el-form>

      <el-table
        border
        :summary-method="getSummaries"
        :show-summary="true"
        ref="multipleTable"
        :data="profitData"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
        @row-dblclick="updateDate"
        :row-class-name="tableRowClassName"
      >
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column
          prop="orderNumber"
          label="订单编号"
          align="center"
          size="mini"
          width="150"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="orderType" label="业务类型" width="80" size="mini">
          <template slot-scope="scope">
            <span>{{ scope.row.orderType | orderTypeFiter }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="customerName"
          label="客户名称"
          size="mini"
          align="center"
          width="120"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="vehicle" label="车牌号" align="center" size="mini" width="100"></el-table-column>
        <el-table-column prop="caseNumber" label="箱号" width="120" align="center"></el-table-column>
        <el-table-column
          prop="blNoStr"
          label="提单号"
          align="center"
          width="120"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="makingStatus" label="做箱状态" width="80" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span :style="{ color: scope.row.makingStatus == 0 ? 'red' : '' }">
              {{
              scope.row.makingStatus | makingStatusFilet
              }}
            </span>
            <span
              v-if="scope.row.makingStatus==0"
              style="color: black"
            >({{ scope.row.makingReason }})</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="achieve"
          sortable
          label="应收"
          align="center"
          width="75"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="pay"
          sortable
          label="应付"
          align="center"
          width="75"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="extraAchieve"
          label="其它应收"
          sortable
          align="center"
          width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="extraPay"
          label="其他应付"
          sortable
          align="center"
          width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="grossProfit"
          label="毛利"
          sortable
          :sort-method="sortByPrice"
          align="center"
          width="80"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="packingTime"
          label="做箱日期"
          align="center"
          width="100"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span
              v-if="scope.row.packingTime!=null"
            >{{ formatDate(scope.row.packingTime, "yyyy-MM-dd") }}</span>
            <span v-else>{{scope.row.packingTime}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="orderTime"
          label="接单日期"
          align="center"
          width="100"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ formatDate(scope.row.orderTime, "yyyy-MM-dd") }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :formatter="clfFiters"
          prop="vehicleOwnership"
          label="车辆归属"
          width="80"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getProfitList"
      />
    </div>
    <div v-if="showCostType === 1">
      <el-page-header @back="reverseBack" content="费用录入"></el-page-header>
      <motorcade-cost-details :objForm="formData"></motorcade-cost-details>
    </div>
  </div>
</template>

<script>
import store from '@/store';
import { getCorporateIdentify } from '@/utils/util';
import { getProfitList } from '@/api/cost/costMgt.js';
import MotorcadeCostDetails from '@/views/cost/motorcadeCostDetails/index.vue';
import AdvancedSearch from '../analysicSearch/index.vue';

export default {
  name: 'Analysis',
  components: {
    'motorcade-cost-details': MotorcadeCostDetails,
    'advanced-search': AdvancedSearch
  },
  data() {
    return {
      formData: null,
      //表格数据
      profitData: [],
      //查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 20,
        sort: '',
        order: '',
        belongCompaniesId: getCorporateIdentify(),
        vehicleOwnership: 1,
        blNos: ''
      },
      //选中的数据
      multipleSelection: [],
      showCostType: 0,
      total: 0,
      searchVisible: false,
      //车辆归属
      vehicleBelongOptions: [
        {
          value: 0,
          label: '全部车辆'
        },
        {
          value: 1,
          label: '公司车辆'
        },
        {
          value: 2,
          label: '外部车辆'
        }
      ],
      //修改当前行
      editRow: -1
    };
  },
  filters: {
    orderTypeFiter: function (value) {
      const statusMap = {
        1: '海运出口',
        2: '海运进口',
        3: '空运出口',
        4: '空运进口'
      };
      return statusMap[value];
    },
    makingStatusFilet: function (value) {
      return value == null
        ? '正常做箱'
        : value == 1
        ? '正常做箱'
        : value == 0
        ? '取消做箱'
        : '';
    }
  },
  created() {
    this.getProfitList();
    this.customerOptions = store.getters.customer; // 获取客户信息
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === this.editRow && this.editRow > -1) {
        return 'warning-row';
      }
      return '';
    },
    // 根据客单价排序
    sortByPrice(a, b) {
      return a.grossProfit - b.grossProfit;
    },
    //表格中车辆状态的校验
    clfFiters(row, column) {
      return row.vehicleOwnership == 1
        ? '公司车辆'
        : row.vehicleOwnership == 2
        ? '外部车辆'
        : '';
    },
    customerNameQuery(res) {
      this.queryParams = {
        pageNum: 1,
        pageSize: 20,
        sort: '',
        order: '',
        belongCompaniesId: getCorporateIdentify(),
        vehicleOwnership: '1',
        customerName: res
      };
      this.getProfitList();
    },
    //获取费用列表

    getProfitList() {
      getProfitList(this.queryParams).then((response) => {
        this.total = response.data.total;
        this.profitData = response.data.list;
        for (var i = 0; i < this.profitData.length; i++) {
          this.profitData[i].grossProfit = (
            Number(this.profitData[i].achieve) +
            Number(this.profitData[i].extraAchieve) -
            (Number(this.profitData[i].pay) +
              Number(this.profitData[i].extraPay))
          ).toFixed(2);
        }
      });
    },
    /** 修改双击操作 */
    updateDate(row, event) {
      this.profitData.filter((item, index) => {
        if (row.id == item.id) {
          this.editRow = index;
        }
      });
      this.formData = Object.assign({}, row);
      (this.formData.prPoint = row.suitcasePoint =
        null ? row.returnPoint : row.suitcasePoint),
        (this.formData.mcId = this.formData.id);
      this.showCostType = 1;
    },
    // 返回事件
    reverseBack() {
      this.getProfitList();
      this.showCostType = 0;
    },
    searchCaseNumber() {
      this.getProfitList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //高级搜索
    onSearchSuccess(res) {
      var params = {
        pageNum: 1,
        pageSize: 20,
        sort: '',
        order: '',
        belongCompaniesId: getCorporateIdentify(),
        orderType: res.orderType,
        customerName: res.customerName,
        vehicles: res.vehicle != undefined ? res.vehicle.join(',') : '',
        orderNumber: res.orderNumber,
        beginTime: res.beginTime,
        endTime: res.endTime,
        otEndTime: res.otEndTime,
        otBeginTime: res.otBeginTime
      };
      Object.assign(this.queryParams, params);
      this.getProfitList();
    },
    //指定列求和
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (
          column.property == 'achieve' ||
          column.property == 'pay' ||
          column.property == 'extraAchieve' ||
          column.property == 'extraPay' ||
          column.property == 'grossProfit'
        ) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return (Number(prev) + Number(curr)).toFixed(2);
            } else {
              return prev;
            }
          }, 0);
          // sums[index] += " 元";
        }
      });
      return sums;
    }
  }
};
</script>
<style scoped>
.el-popover.myPopover {
  padding: 0px;
}
.MytoUpper .el-input__inner {
  text-transform: uppercase;
}
::v-deep .el-table .warning-row {
  background: oldlace;
}

::v-deep .el-table .success-row {
  background: #f0f9eb;
}
</style>
