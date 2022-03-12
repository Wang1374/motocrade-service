<template>
  <div>
    <div v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
      <!-- 客户信息 -->
      <el-row :gutter="20">
        <el-col :span="23" class="divider">
          <el-divider direction="vertical" />
          <h4>客户信息</h4>
        </el-col>
        <el-row>
          <el-col :span="23" style="padding-left: 46px; padding-bottom: 15px">
            <el-col :span="6">
              <span style="font-weight: bold">客户名称：</span>
              {{ temp.companyName }}
            </el-col>
            <el-col :span="6">
              <span style="font-weight: bold">客户编号：</span>
              {{ temp.customerNum }}
            </el-col>
            <el-col :span="6">
              <span style="font-weight: bold">联系人：</span>
              {{ temp.singleUser }}
            </el-col>
            <el-col :span="6">
              <span style="font-weight: bold">联系电话：</span>
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
              {{ temp.dock }}
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
              {{ temp.portOfLoading }}
            </el-col>
            <el-col :span="6">
              <span style="font-weight: bold">中转港：</span>
              {{ temp.portOfDischarge }}
            </el-col>
            <el-col :span="6">
              <span style="font-weight: bold">目的港：</span>
              {{ temp.placeOfDelivery }}
            </el-col>
            <el-col :span="6">
              <span style="font-weight: bold">放箱时间：</span>
              {{ formatDate(temp.putTheBoxTime, "yyyy-MM-dd hh:mm") }}
            </el-col>
          </el-col>
        </el-row>
        <el-row>
          <div v-if="temp.blNos !== null">
            <el-col :span="23" style="padding-left: 46px; padding-bottom: 15px">
              <el-col :span="6" v-for="(item, index) in temp.blNos.split(',')" :key="index">
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
        <el-row>
          <el-col :span="23" style="padding-left: 46px; padding-bottom: 15px">
            <span style="font-weight: bold">操作记录：</span>
            {{ temp.exceptionRecord }}
          </el-col>
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
            <el-table-column type="index" label="序号" width="60"></el-table-column>
            <el-table-column
              prop="makingStatus"
              label="做箱状态"
              width="100"
              :show-overflow-tooltip="true"
            >
              <template v-slot="scope">
                <span
                  :style="{ color: scope.row.makingStatus == 0 ? '#F56C6C' : '#67C23A' }"
                >{{ scope.row.makingStatus | makingStatusFilet }}</span>
                <span
                  v-if="scope.row.makingStatus==0"
                  style="color: black"
                >({{ scope.row.makingReason }})</span>
              </template>
            </el-table-column>
            <el-table-column prop="boxPile" label="箱型" width="100" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column
              prop="packingTime"
              label="做箱时间"
              width="200"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span>{{ formatDate(scope.row.packingTime, "yyyy-MM-dd hh:mm") }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="blNoStr" label="提单号" width="150" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="caseNumber" label="箱号" width="150" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="sealNumber" label="封号" width="120" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column
              prop="tareWeight"
              label="箱皮重(KG)"
              width="100"
              :show-overflow-tooltip="true"
            ></el-table-column>

            <el-table-column
              prop="total"
              label="总件数(PKG)"
              width="110"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column
              prop="grossWeight"
              label="总毛重(KG)"
              width="100"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column prop="cbm" label="总体积(CBM)" width="110" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column
              prop="scheduleTime"
              label="排计划"
              width="200"
              :show-overflow-tooltip="true"
            ></el-table-column>

            <el-table-column
              prop="suitcasePoint"
              label="还箱点"
              width="140"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column prop="door" label="门店简称" width="150" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="address" label="门店地址" width="150" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column
              prop="typeOfShipping"
              label="运输方式"
              width="100"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{
                scope.row.typeOfShipping | typeOfShippingFilet
                }}
              </template>
            </el-table-column>
            <el-table-column
              prop="carrierCompany"
              label="承运公司"
              width="140"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column prop="vehicle" label="车辆" width="140" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="driver" label="司机" width="140" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="phone" label="电话" width="140" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column
              prop="bmRemarks"
              label="做箱要求"
              width="140"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column label="操作" align="center" fixed="right" width="150">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  @click="pictureDialog(scope.row, scope.$rowIndex)"
                >箱货照片</el-button>
                <el-button size="mini" type="text" @click="packingListDialog(scope.row)">装箱单</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="23" class="divider">
          <el-divider direction="vertical" />
          <h4>内部信息</h4>
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
    <lcl ref="Lcl" v-if="lclEditVisible" :tabsData="mcData" :visible.sync="lclEditVisible"></lcl>

    <!-- 装箱单 -->
    <packing-list
      ref
      v-if="packingListVisible"
      :visible.sync="packingListVisible"
      :packingList="packingList"
    ></packing-list>
  </div>
</template>
<script>
import { getMakingChestList } from '@/api/oms/makingChest';
import { validatenull } from '@/utils/ruoyi';
import lcl from './lcl/index.vue';
import PackingList from '@/views/oms/packingList/index.vue';
import { parseTime } from '@/utils/ruoyi';

export default {
  name: 'PlatformBox',
  components: {
    'packing-list': PackingList,
    lcl: lcl
  },
  props: {
    temp: {
      type: Object
    }
  },
  filters: {
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
      lclEditVisible: false,
      packingList: {},
      packingListVisible: false
    };
  },
  created() {
    // 赋值 船名航次 过滤
    if (this.temp.vesselAndVoyage !== null) {
      var last = this.temp.vesselAndVoyage.lastIndexOf('/');
      this.shipsName = this.temp.vesselAndVoyage.substring(0, last);
      this.voyage = this.temp.vesselAndVoyage.substring(
        last + 1,
        this.temp.vesselAndVoyage.length
      );
    }
    // 通过下单id 去查询做箱计划
    this.getMccList();
  },
  methods: {
    /** 查询做箱信息列表 */
    getMccList() {
      if (this.temp.id !== '') {
        this.loadingList = true;
        let params = {
          businessOrderId: this.temp.id,
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
    },
    // 箱货编辑
    lclClick() {
      this.lclEditVisible = true;
    },
    // 装箱单
    packingListDialog(row) {
      let obj = {};
      obj.vesselAndVoyage = this.temp.vesselAndVoyage;
      if (this.temp.dock == null) {
        obj.dock = '港区：';
      } else {
        obj.dock = '港区：' + this.temp.dock;
      }
      if (this.temp.openingDate == null) {
        obj.openingDate = '开港日期：';
      } else {
        obj.openingDate = '开港日期：' + parseTime(this.temp.openingDate);
      }
      if (this.temp.cutOffDate == null) {
        obj.cutOffDate = '截港日期：';
      } else {
        obj.cutOffDate = '截港日期：' + parseTime(this.temp.cutOffDate);
      }
      obj.portOfLoading = this.temp.portOfLoading;
      obj.portOfDischarge = this.temp.portOfDischarge;
      obj.placeOfDelivery = this.temp.placeOfDelivery;

      obj.caseNumber = row.caseNumber;
      obj.sealNumber = row.sealNumber;
      obj.boxPile = row.boxPile;
      obj.packingTime = row.packingTime;
      obj.driver = row.driver;
      obj.phone = row.phone;
      obj.vehicle = row.vehicle;
      obj.total = row.total;
      obj.grossWeight = row.grossWeight;
      obj.cbm = row.cbm;
      obj.tareWeight = row.tareWeight;
      obj.lclList = row.lclList;
      obj.contTotalWt = Number(row.tareWeight) + Number(row.grossWeight);
      obj.bmRemarks = row.bmRemarks;

      this.packingList = obj;
      this.packingListVisible = true;
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