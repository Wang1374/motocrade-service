<template>
  <div>
    <div v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
      <el-row :gutter="20">
        <el-col :span="23" style="font-weight:bold;margin-left:15px;margin-top:10px">
          <span
            :style="{  
              color:
                temp.orderStatus == 0
                  ? 'red'
                  : temp.orderStatus == 2
                  ? 'green'
                  : 'orange',
            }"
          >{{ temp.orderStatus | osFilter }}</span>
        </el-col>
      </el-row>
      <!-- 客户信息 -->
      <el-row :gutter="20">
        <el-col :span="23" class="divider">
          <el-divider direction="vertical" />
          <h4>下单信息</h4>
        </el-col>
        <el-row>
          <el-col :span="23" style="padding-left: 46px; padding-bottom: 15px">
            <el-col :span="6">
              <span style="font-weight: bold">下单公司：</span>
              {{ temp.companyName }}
            </el-col>
            <el-col :span="6">
              <span style="font-weight: bold">业务编号：</span>
              {{ temp.customerNum }}
            </el-col>
            <el-col :span="6">
              <span style="font-weight: bold">下单人：</span>
              {{ temp.singleUser }}
            </el-col>
            <el-col :span="6">
              <span style="font-weight: bold">下单电话：</span>
              {{ temp.singlePhone }}
            </el-col>
          </el-col>
        </el-row>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="23" class="divider">
          <el-divider direction="vertical" />
          <h4>业务信息</h4>
        </el-col>
        <el-row>
          <el-col :span="23" style="padding-left: 46px; padding-bottom: 15px">
            <el-col :span="6">
              <span style="font-weight: bold">下单编号：</span>
              {{ temp.placeOrderNumber }}
            </el-col>
            <el-col :span="6">
              <span style="font-weight: bold">船名：</span>
              {{ shipsName }}
            </el-col>
            <el-col :span="6">
              <span style="font-weight: bold">航次：</span>
              {{ voyage }}
            </el-col>
            <el-col :span="6">
              <span style="font-weight: bold">船公司：</span>
              {{ temp.shippingCompany }}
            </el-col>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="23" style="padding-left: 46px; padding-bottom: 15px">
            <el-col :span="6">
              <span style="font-weight: bold">开港日期：</span>
              {{ formatDate(temp.openingDate, "yyyy-MM-dd hh:mm") }}
            </el-col>
            <el-col :span="6">
              <span style="font-weight: bold">截港日期：</span>
              {{ formatDate(temp.cutOffDate, "yyyy-MM-dd hh:mm") }}
            </el-col>
            <el-col :span="6">
              <span style="font-weight: bold">截单日期：</span>
              {{ formatDate(temp.dueDate, "yyyy-MM-dd hh:mm") }}
            </el-col>
            <el-col :span="6">
              <span style="font-weight: bold">停靠码头：</span>
              {{ temp.dock1 }}
            </el-col>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="23" style="padding-left: 46px; padding-bottom: 15px">
            <el-col :span="6">
              <span style="font-weight: bold">计划靠泊：</span>
              {{ formatDate(temp.plannedDocking, "yyyy-MM-dd hh:mm") }}
            </el-col>
            <el-col :span="6">
              <span style="font-weight: bold">实际靠泊：</span>
              {{ formatDate(temp.actualBerthing, "yyyy-MM-dd hh:mm") }}
            </el-col>
            <el-col :span="6">
              <span style="font-weight: bold">开船日期：</span>
              {{ formatDate(temp.shippingDay, "yyyy-MM-dd hh:mm") }}
            </el-col>
            <el-col :span="6">
              <span style="font-weight: bold">放箱公司：</span>
              {{ temp.putTheBoxCompany }}
            </el-col>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="23" style="padding-left: 46px; padding-bottom: 15px">
            <el-col :span="6">
              <span style="font-weight: bold">起运港：</span>
              {{ temp.portOfLoading1 }}
            </el-col>
            <el-col :span="6">
              <span style="font-weight: bold">中转港：</span>
              {{ temp.portOfDischarge1 }}
            </el-col>
            <el-col :span="6">
              <span style="font-weight: bold">目的港：</span>
              {{ temp.placeOfDelivery1 }}
            </el-col>
            <el-col :span="6">
              <span style="font-weight: bold">放箱时间：</span>
              {{ formatDate(temp.putTheBoxTime, "yyyy-MM-dd hh:mm") }}
            </el-col>
          </el-col>
        </el-row>
        <el-row>
          <div v-if="temp.blNos1 !== null">
            <el-col :span="23" style="padding-left: 46px; padding-bottom: 15px">
              <el-col :span="6" v-for="(item, index) in temp.blNos1.split(',')" :key="index">
                <span style="font-weight: bold">提单号{{ index + 1 }}：</span>
                {{ item }}
              </el-col>
            </el-col>
          </div>
          <div v-else>
            <el-col :span="5">
              <span style="font-weight: bold">提单号1：</span>
            </el-col>
          </div>
        </el-row>
      </el-row>

      <el-row>
        <el-col :span="23" class="divider">
          <el-divider direction="vertical" />
          <h4>做箱信息</h4>
        </el-col>
        <el-col :span="22" :offset="1">
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button type="primary" size="mini" plain @click="lclClick">查看箱货信息</el-button>
            </el-col>
          </el-row>
          <el-table
            :data="mcData"
            v-loading="loadingList"
            highlight-current-row
            border
            style="width: 100%"
          >
            <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>

            <el-table-column
              prop="boxPile"
              label="箱型"
              width="100"
              :show-overflow-tooltip="true"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="makingStatus"
              label="做箱状态"
              width="80"
              :show-overflow-tooltip="true"
            >
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
              prop="blNoStr"
              label="提单号"
              width="150"
              :show-overflow-tooltip="true"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="caseNumber"
              label="箱号"
              width="150"
              :show-overflow-tooltip="true"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="sealNumber"
              label="封号"
              width="120"
              :show-overflow-tooltip="true"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="tareWeight"
              label="箱皮重(KG)"
              width="100"
              align="center"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column
              prop="total"
              label="总件数(PKG)"
              width="110"
              align="center"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column
              prop="grossWeight"
              label="总毛重(KG)"
              width="100"
              align="center"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column prop="cbm" label="总体积(CBM)" width="110" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column
              prop="scheduleTime"
              label="排计划"
              width="200"
              align="center"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column
              prop="planPackingTime"
              label="预计做箱时间"
              width="200"
              align="center"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span>{{ formatDate(scope.row.planPackingTime, "yyyy-MM-dd hh:mm") }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="suitcasePoint"
              label="还箱点"
              width="140"
              align="center"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column
              prop="door"
              label="门店简称"
              width="150"
              :show-overflow-tooltip="true"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="address"
              label="门店地址"
              width="150"
              :show-overflow-tooltip="true"
              align="center"
            ></el-table-column>
            <!-- <el-table-column
              prop="typeOfShipping"
              label="运输方式"
              width="100"
              align="center"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{
                scope.row.typeOfShipping | typeOfShippingFilet
                }}
              </template>
            </el-table-column>-->
            <!-- <el-table-column
              align="center"
              prop="carrierCompany"
              label="承运公司"
              width="140"
              :show-overflow-tooltip="true"
            ></el-table-column>-->
            <el-table-column
              prop="vehicle"
              label="车辆"
              width="140"
              :show-overflow-tooltip="true"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="driver"
              label="司机"
              width="140"
              :show-overflow-tooltip="true"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="phone"
              label="电话"
              width="140"
              :show-overflow-tooltip="true"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="bmRemarks"
              label="做箱要求"
              align="center"
              width="140"
              :show-overflow-tooltip="true"
            ></el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="23" class="divider">
          <el-divider direction="vertical" />
          <h4>接单信息</h4>
        </el-col>
        <el-row>
          <el-col :span="23" style="padding-left: 46px; padding-bottom: 15px">
            <el-col :span="6">
              <span style="font-weight: bold">操作员：</span>
              {{ temp.operator }}
            </el-col>
            <el-col :span="6">
              <span style="font-weight: bold">业务员：</span>
              {{ temp.salesman }}
            </el-col>
            <el-col :span="6">
              <span style="font-weight: bold">接单日期：</span>
              {{ formatDate(temp.orderTime, "yyyy-MM-dd hh:mm") }}
            </el-col>
          </el-col>
        </el-row>
      </el-row>
    </div>

    <!-- 箱货编辑 -->
    <lcl ref="lclEdit" v-if="lclEditVisible" :tabsData="mcData" :visible.sync="lclEditVisible"></lcl>
  </div>
</template>
<script>
import { getMakingChestList } from '@/api/oms/makingChest';
import { validatenull } from '@/utils/ruoyi';
import lcl from './lcl/index.vue';
export default {
  name: 'MineOrderDetail',
  components: {
    lcl: lcl
  },
  props: {
    temp: {
      type: Object
    }
  },
  filters: {
    osFilter: function (value) {
      if (value == 1) {
        return '待接单';
      } else if (value == 2) {
        return '已接单';
      } else if (value == 3) {
        return '已派单';
      } else if (value == 4) {
        return '已完结';
      } else if (value == 0) {
        return '已取消';
      } else {
        return '';
      }
    },
    typeOfShippingFilet: function (value) {
      return value == 1 ? '自做' : value == 2 ? '外发' : '';
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
  data() {
    return {
      loadingList: false,
      loading: false,
      loadingBtn: false,
      //船名
      shipsName: '',
      //航次
      voyage: '',
      // 做箱表格数据
      mcData: [],
      // 箱货编辑 弹出层
      lclEditVisible: false
    };
  },
  created() {
    // 赋值 船名航次 过滤
    if (this.temp.vesselAndVoyage0 !== null) {
      var last = this.temp.vesselAndVoyage0.lastIndexOf('/');
      this.shipsName = this.temp.vesselAndVoyage0.substring(0, last);
      this.voyage = this.temp.vesselAndVoyage0.substring(
        last + 1,
        this.temp.vesselAndVoyage0.length
      );
    }
    // 通过下单id 去查询做箱计划
    this.getMccList();
  },
  methods: {
    // 箱货编辑
    lclClick() {
      this.lclEditVisible = true;
    },
    /** 查询做箱信息列表 */
    getMccList() {
      if (!validatenull(this.temp.orderId)) {
        this.loadingList = true;
        let params = {
          businessOrderId: this.temp.orderId,
          companyId: ''
        };
        getMakingChestList(params).then((response) => {
          let data = JSON.parse(JSON.stringify(response.data));
          for (var i = 0, l = data.length; i < l; i++) {
            let lclCenterList = data[i].lclList;
            let contacts = '';
            let contactNumber = '';
            let remark = '';
            for (var j = 0, t = lclCenterList.length; j < t; j++) {
              if (!validatenull(lclCenterList[j].contacts)) {
                contacts += lclCenterList[j].contacts + '/';
              }
              if (!validatenull(lclCenterList[j].contactNumber)) {
                contactNumber += lclCenterList[j].contactNumber + '/';
              }
              if (!validatenull(lclCenterList[j].remark)) {
                remark += lclCenterList[j].remark + '/';
              }
            }
            data[i].contacts = contacts.substring(0, contacts.lastIndexOf('/'));
            data[i].contactNumber = contactNumber.substring(
              0,
              contactNumber.lastIndexOf('/')
            );
            data[i].remark = remark.substring(0, remark.lastIndexOf('/'));
          }
          this.mcData = data;
          this.loadingList = false;
        });
      }
    }
  }
};
</script>
<style scoped>
.divider {
  height: 56px;
  padding: 0;
  align-items: center;
  display: flex;
}
.el-divider--vertical {
  border-left: 3px solid #408eff;
}
</style>