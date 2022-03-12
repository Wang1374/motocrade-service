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
        <el-form-item prop="blNos">
          <el-input
            class="MytoUpper"
            v-model.trim="queryParams.blNos"
            placeholder="提单号"
            clearable
            size="small"
            style="width: 200px"
            @keyup.enter.native="searchCost"
          />
        </el-form-item>
        <el-form-item prop="packingTime">
          <el-date-picker
            v-model="queryParams.packingTime"
            style="width: 100%"
            type="daterange"
            range-separator="至"
            start-placeholder="做箱开始日期"
            end-placeholder="做箱结束日期"
            :default-time="['00:00:00', '23:59:59']"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="searchCost" type="primary" size="small" icon="el-icon-search">搜索</el-button>
        </el-form-item>
      </el-form>

      <el-table
        border
        ref="multipleTable"
        :data="costData"
        tooltip-effect="dark"
        @row-dblclick="updateDate"
      >
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column
          prop="placeOrderNumber"
          label="下单编号"
          width="170"
          align="center"
          size="mini"
          show-overflow-tooltip
        ></el-table-column>

        <el-table-column prop="boxPile" label="箱型" width="100" align="center"></el-table-column>
        <el-table-column prop="caseNumber" label="箱号" align="center"></el-table-column>
        <el-table-column prop="blNoStr" label="提单号" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="pay" label="应付" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="orderType" label="业务类型" size="mini" align="center" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.orderType | orderTypeFiter }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="singleUser"
          label="下单人"
          size="mini"
          align="center"
          show-overflow-tooltip
        ></el-table-column>

        <el-table-column
          prop="placeOrderTime"
          label="下单时间"
          align="center"
          width="165"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="packingTime"
          label="实际做箱时间"
          align="center"
          width="165"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="orderTime"
          label="接单时间"
          align="center"
          width="165"
          show-overflow-tooltip
        ></el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
    <div v-if="showCostType === 1">
      <el-page-header @back="reverseBack" content="费用详情"></el-page-header>
      <cost-details :objForm="formData"></cost-details>
    </div>
  </div>
</template>
<script>
import { getCorporateIdentify } from '@/utils/util';
import { getClientCost } from '@/api/distribute/clientCost';
import CostDetails from './costClientDetails/index';
import { formatDate } from '@/utils/ruoyi';

export default {
  name: 'ClientAnalysis',
  components: {
    'cost-details': CostDetails
  },
  data() {
    return {
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        sort: '',
        order: '',
        belongCompaniesId: getCorporateIdentify(),
        blNos: ''
      },

      showCostType: 0,
      //总条数
      total: 0,
      //表格数据
      costData: [],
      formData: null
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
    }
  },
  created() {
    this.getList();
  },
  methods: {
    //查询费用
    getList() {
      getClientCost(this.queryParams).then((response) => {
        this.costData = response.data.list;
        this.total = response.data.total;
      });
    },
    //搜索
    searchCost() {
      if (this.queryParams.packingTime != null) {
        this.queryParams.beginTime = formatDate(
          this.queryParams.packingTime[0],
          'yyyy-MM-dd hh:mm'
        );
        this.queryParams.endTime = formatDate(
          this.queryParams.packingTime[1],
          'yyyy-MM-dd hh:mm'
        );
      }
      delete this.queryParams.packingTime;
      this.getList();
    },
    /** 修改双击操作 */
    updateDate(row) {
      this.formData = Object.assign({}, row);
      this.showCostType = 1;
    },
    // 返回事件
    reverseBack() {
      this.getList();
      this.showCostType = 0;
    }
  }
};
</script>
<style scoped>
.MytoUpper .el-input__inner {
  text-transform: uppercase;
}
</style>