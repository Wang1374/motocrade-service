<template>
  <div>
    <el-form :inline="true" :model="queryParams" class="demo-form-inline" @submit.native.prevent>
      <el-form-item prop="vehicle">
        <el-select
          ref="vehicle"
          clearable
          allow-create
          style="width: 100%"
          v-model="queryParams.vehicle"
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
          v-model="queryParams.packingTime"
          :clearable="false"
          style="width: 100%"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="searchExtraCost">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-table border :data="carProfitList" style="width: 100%" v-loading="loading" show-summary>
      <!-- <el-table-column type="selection" width="55"></el-table-column> -->
      <el-table-column label="车牌号" align="center" prop="vehicle"></el-table-column>
      <!-- <el-table-column
        label="司机"
        align="center"
        prop="driver"
      ></el-table-column>-->

      <el-table-column prop="achieveSumTotal" label="应收" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="paySumTotal" label="应付" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="carOilPrice" label="油费" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="carRoadPrice" label="路费" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="carExtraPrice" label="其它费用" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="carMaintainPrice" label="保养费用" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="carRepairPrice" label="维修费用" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="carTyrePrice" label="轮胎费用" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="oneCarProfit" label="单车利润" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="保险" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="checkGuarantee(scope.row)">保险费用</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="params.pageNum"
      :limit.sync="params.pageSize"
      @pagination="getList"
    />

    <!-- 查看保险 -->
    <carGuarantee-dialog
      v-if="guaranteeVisible"
      :guaranteeVisible.sync="guaranteeVisible"
      :vehicleTitle="vehicleTitle"
      :vehicleInfo="vehicleInfo"
    ></carGuarantee-dialog>
  </div>
</template>
<script>
import { validatenull } from '@/utils/validate';
import { mapState } from 'vuex';
import { getCorporateIdentify } from '@/utils/util';
import { getCarProfit } from '@/api/basic/carProfit';
import { formatDate } from '@/utils/ruoyi';
import Carguarantee from '../../carguaranteeDialog/index.vue';
import store from '@/store';
export default {
  name: 'ListAnalysis',
  components: {
    'carGuarantee-dialog': Carguarantee
  },
  data() {
    return {
      loading: true,
      vehicleTitle: '',
      //查看保养
      maintainVisible: false,
      //查看维修
      repairVisible: false,
      //查看保险
      guaranteeVisible: false,
      //车俩信息
      vehicleInfo: {},
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6; //如果没有后面的-8.64e6就是不可以选择今天的
        }
      },
      carProfitList: [],
      queryParams: {
        packingTime: []
      },
      params: {
        pageName: 1,
        pageSize: 10,
        belongCompaniesId: getCorporateIdentify(),
        sort: '',
        order: ''
      },
      total: 0,
      rowSpanArr: [],
      position: 0,
      //车牌号数组
      vehicleOptions: [],
      websock: null
    };
  },
  created() {
    this.getCurrentTime();
    this.getList();
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
      this.getList();
    },

    //获取当前年
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
      this.queryParams.packingTime[0] = firstMonth;
      this.queryParams.packingTime[1] = currentdate;
    },
    //设置参数
    setParams() {
      if (this.queryParams.packingTime.length > 0) {
        (this.params.beginTime = formatDate(
          this.queryParams.packingTime[0],
          'yyyy-MM-dd hh:mm:ss'
        )),
          (this.params.endTime = formatDate(
            this.queryParams.packingTime[1],
            'yyyy-MM-dd hh:mm:ss'
          )),
          (this.params.vehicle = this.queryParams.vehicle),
          (this.params.belongCompaniesId = getCorporateIdentify());
      } else {
        (this.params.beginTime = undefined),
          (this.params.endTime = undefined),
          (this.params.vehicle = this.queryParams.vehicle),
          (this.params.belongCompaniesId = getCorporateIdentify());
      }
    },

    //查看保险
    checkGuarantee(row) {
      (this.guaranteeVisible = true), (this.vehicleTitle = row.vehicle);
      this.vehicleInfo = row;
    },

    //对邮费记录分组求和
    //数据封装和处理
    handleProfit(carList, i) {
      if (carList[i].carExtraPrice == null) {
        carList[i].carExtraPrice = (1 - 1).toFixed(2);
      }
      if (carList[i].carRoadPrice == null) {
        carList[i].carRoadPrice = (1 - 1).toFixed(2);
      }
      if (carList[i].carRepairPrice == null) {
        carList[i].carRepairPrice = (1 - 1).toFixed(2);
      }
      if (carList[i].carMaintainPrice == null) {
        carList[i].carMaintainPrice = (1 - 1).toFixed(2);
      }
      if (carList[i].carTyrePrice == null) {
        carList[i].carTyrePrice = (1 - 1).toFixed(2);
      }
      if (carList[i].carOilPrice == null) {
        carList[i].carOilPrice = (1 - 1).toFixed(2);
      } else {
        carList[i].carOilPrice = carList[i].carOilPrice.toFixed(2);
      }
      //总应收
      carList[i].achieveSumTotal = (
        Number(carList[i].achieveSum) + Number(carList[i].extraAchieveSum)
      ).toFixed(2);
      //总应付
      carList[i].paySumTotal = (
        Number(carList[i].paySum) + Number(carList[i].extraPaySum)
      ).toFixed(2);
      //单车利润
      carList[i].oneCarProfit = (
        Number(carList[i].achieveSum) +
        Number(carList[i].extraAchieveSum) -
        (Number(carList[i].paySum) + Number(carList[i].extraPaySum)) -
        Number(carList[i].carExtraPrice) -
        Number(carList[i].carRoadPrice) -
        Number(carList[i].carOilPrice) -
        Number(carList[i].carRepairPrice) -
        Number(carList[i].carMaintainPrice) -
        Number(carList[i].carTyrePrice)
      ).toFixed(2);
    },
    //分页查询数据
    getList() {
      this.loading = true;
      this.setParams();
      if (this.userInfo.employeeId == -1) {
        this.params.isManage = this.userInfo.corporateIdentify;
      }
      var vehicles = this.userInfo.vehicles;
      this.params.vehicles = vehicles;
      getCarProfit(this.params).then((response) => {
        this.carProfitList = response.data.list;
        this.total = response.data.total;
        for (var i = 0; i < this.carProfitList.length; i++) {
          //处理数据，计算应收，应付，利润
          this.handleProfit(this.carProfitList, i);
        }
        this.loading = false;
      });
    },
    //查询
    searchExtraCost() {
      if (this.queryParams.packingTime == null) {
        this.queryParams.packingTime = [];
      }
      this.getList();
    }
  }
};
</script>

