<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryParams" class="demo-form-inline" @submit.native.prevent>
      <el-form-item prop="truckLicenseNumber">
        <!-- <el-input  v-model="queryParams.truckLicenseNumber"></el-input> -->
        <el-select
          ref="vehicle"
          clearable
          allow-create
          style="width: 100%"
          v-model="queryParams.truckLicenseNumber"
          no-data-text="无匹配数据"
          placeholder="全部车辆"
          filterable
          @change="vehicleNameQuery"
        >
          <el-option
            v-for="item in vehicleOptions"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="creatDate">
        <el-date-picker
          v-model="queryParams.addOilTime"
          style="width: 100%"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="searchOilCard">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-row></el-row>

    <!-- 邮费记录列表 @row-dblclick="handleEdit" v-loading="loading" -->
    <template>
      <el-table
        border
        :summary-method="getSummaries"
        :show-summary="true"
        ref="multipleTable"
        :data="oilzyList"
        tooltip-effect="dark"
        style="width: 100%"
        highlight-current-row
      >
        <!--多选框-->
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="车牌号" align="center" prop="truckLicenseNumber"></el-table-column>
        <el-table-column label="司机姓名" align="center" prop="truckerName"></el-table-column>
        <el-table-column label="司机手机号" align="center" prop="truckerMobile"></el-table-column>
        <el-table-column label="加油地点" align="center" prop="stationName"></el-table-column>
        <el-table-column label="用油类型" align="center" prop="skuName"></el-table-column>
        <!--  :formatter="clfFiters" -->
        <el-table-column prop="litre" align="center" label="加油量(L)"></el-table-column>
        <el-table-column prop="price" label="单价(元/L)" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="paymentAmount" label="订单金额(元)" align="center"></el-table-column>
        <el-table-column label="服务日期" align="center" prop="orderTime"></el-table-column>
        <el-table-column prop="status" label="订单状态" align="center" :formatter="orderStatus"></el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="params.pageNum"
        :limit.sync="params.pageSize"
        @pagination="getOilzyList"
      />
    </template>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { getOilzyCardList } from '@/api/basic/carOilCard';
import { formatDate } from '@/utils/ruoyi';
import store from '@/store';
import { validatenull } from '@/utils/ruoyi';
export default {
  name: 'Oilzyward',

  data() {
    return {
      //0921
      oilzyList: [],
      total: 0,
      temp: null,
      queryParams: {
        addOilTime: []
      },
      params: {
        pageNum: 1,
        pageSize: 10,
        truckLicenseNumber: ''
      },
      //企业信息
      companyInfo: {},
      //车牌号数组
      vehicleOptions: []
    };
  },
  created() {
    this.companyInfo = store.getters.company;
    this.getCurrentTime();
    this.getOilzyList();
    this.vehicleOptions = store.getters.vehicle.filter((item) => {
      return item.vehicleBelongState == 1;
    });
    var array = [];
    array = this.vehicleOptions;
    var array1 = [];
    if (validatenull(this.userInfo.corporateIdentify)) {
      //不是管理员账号进行筛选
      if (this.userInfo.vehicles === '-1') {
        if (!validatenull(this.userInfo.vehicles)) {
          var carArray = this.userInfo.vehicles.split(',');
          for (var i = 0; i < carArray.length; i++) {
            array1.push(array.filter((item) => item.value == carArray[i])[0]);
          }
          this.vehicleOptions = array1;
        } else {
          this.vehicleOptions = [];
        }
      }
    }
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo
    })
  },
  methods: {
    //车牌号搜索框
    vehicleNameQuery() {
      this.getOilzyList();
    },

    //当前时间
    getCurrentTime() {
      var date1 = new Date();
      var year1 = date1.getFullYear();
      var firstMonth = year1 + '-' + '01' + '-' + '01' + ' ' + '00:00:00';
      var month = date1.getMonth() + 1;
      var day = date1.getDate();
      if (month < 10) {
        month = '0' + month;
      }
      if (day < 10) {
        day = '0' + day;
      }
      var currentdate = year1 + '-' + month + '-' + day + ' ' + '23:59:59';
      this.queryParams.addOilTime[0] = firstMonth;
      this.queryParams.addOilTime[1] = currentdate;
    },
    //订单状态
    orderStatus(row, column) {
      if (row.status == 'new') {
        return '新订单待支付';
      } else if (row.status == 'success') {
        return '成功订单';
      } else if (row.status == 'cancel') {
        return '订单取消';
      } else if (row.status == 'payfaild') {
        return '支付失败';
      } else if (row.status == 'refunding') {
        return '退款中';
      } else if (row.status == 'refundsuccess') {
        return '退款成功';
      } else if (row.status == 'refundfaild') {
        return '退款失败';
      } else {
        return '';
      }
    },
    //搜索按钮
    searchOilCard() {
      if (this.queryParams.addOilTime == null) {
        this.queryParams.addOilTime = [];
        this.getCurrentTime();
      }
      this.getOilzyList();
    },
    getOilzyList() {
      if (this.queryParams.addOilTime.length > 0) {
        this.params.startTime = formatDate(
          this.queryParams.addOilTime[0],
          'yyyy-MM-dd hh:mm:ss'
        );
        this.params.endTime = formatDate(
          this.queryParams.addOilTime[1],
          'yyyy-MM-dd hh:mm:ss'
        );
      }
      this.params.zyCompanyId = this.companyInfo.zyCompanyId;
      this.params.truckLicenseNumber = this.queryParams.truckLicenseNumber;
      getOilzyCardList(this.params).then((response) => {
        this.total = response.data.total;
        this.oilzyList = response.data.data;
      });
    },
    formatTiem(value, format) {
      return this.$utils.toDateString(value, format);
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (column.property == 'paymentAmount' || column.property == 'litre') {
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
<style  scoped>
.el-delete {
  margin-left: 10px;
}
.dialog-footer >>> .el-dialog__footer {
  text-align: center;
}
</style>
