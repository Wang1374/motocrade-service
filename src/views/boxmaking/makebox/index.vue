<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="24" :xs="24">
        <div v-show="showType === 0">
          <el-form
            :model="queryParams"
            ref="queryForm"
            @submit.native.prevent
            :inline="true"
            label-width="68px"
          >
            <el-form-item prop="businessState">
              <el-select
                v-model="queryParams.businessState"
                @change="handleQuery"
                size="small"
                style="width: 120px"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in stateOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="dispatchType" v-if="company.accountType == 1">
              <el-select
                v-model="queryParams.dispatchType"
                @change="handleQuery"
                size="small"
                style="width: 130px"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in dispatchTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="blNo" class="MytoUpper">
              <el-input
                v-model.trim="queryParams.blNo"
                placeholder="提单号"
                clearable
                size="small"
                style="width: 200px"
                @keyup.enter.native="handleQuery"
              ></el-input>
            </el-form-item>
            <el-form-item prop="caseNumber" class="MytoUpper">
              <el-input
                v-model.trim="queryParams.caseNumber"
                size="small"
                clearable
                placeholder="请输入箱号"
                @keyup.enter.native="handleQuery"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
              <el-popover width="380" popper-class="myPopover" v-model="searchVisible">
                <!-- 高级搜索 -->
                <make-search
                  :searchVisible.sync="searchVisible"
                  :showType="0"
                  @search-success="onSearchSuccess"
                ></make-search>
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  size="small"
                  plain
                  slot="reference"
                >高级搜索</el-button>
              </el-popover>
              <el-button
                type="primary"
                icon="el-icon-s-grid"
                size="small"
                plain
                @click="editTableHeader"
              >自定义表头</el-button>
            </el-form-item>
          </el-form>

          <div class="bottomScroll">
            <el-table
              v-loading="loading"
              :data="boxMakingList"
              ref="makeboxTable"
              border
              :span-method="objectSpanMethod"
              highlight-current-row
              :default-sort="{prop: 'packingTime'}"
              :row-class-name="tableRowClassName"
            >
              <el-table-column
                v-for="item in tableHeaderList"
                :key="item.id"
                :label="item.rowName"
                :prop="item.rowField"
                :fixed="item.rowField == 'caseAndsealNumber' ? true : false"
                :sortable="item.rowField == 'packingTime'"
                align="center"
                :width="item.width"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">
                  <el-link
                    :underline="false"
                    v-if="item.rowField === 'caseAndsealNumber'"
                    type="primary"
                    @click="updateDate(scope.row,scope.$index)"
                  >
                    {{ scope.row.caseNumber }}/{{
                    scope.row.sealNumber
                    }}
                  </el-link>
                  <span
                    v-else-if="item.rowField === 'businessState'"
                    :style="scope.row.businessState | styleFilter"
                  >
                    {{
                    scope.row.businessState | businessStateFiter
                    }}
                  </span>
                  <span v-else-if="item.rowField === 'orderType'">
                    {{
                    scope.row.orderType | orderTypeFiter
                    }}
                  </span>
                  <span
                    v-else-if="item.rowField === 'dispatchType'"
                    :style="scope.row.dispatchType | statusFilter"
                  >{{ scope.row.dispatchType | dispatchTypeFiter }}</span>
                  <span v-else-if="item.rowField === 'putTheBoxTime'">
                    {{
                    formatDate(scope.row.putTheBoxTime, "yyyy-MM-dd hh:mm")
                    }}
                  </span>
                  <span v-else-if="item.rowField === 'scheduleTime'">
                    {{
                    formatDate(scope.row.scheduleTime, "yyyy-MM-dd hh:mm")
                    }}
                  </span>
                  <span v-else-if="item.rowField === 'packingTime'">
                    {{
                    formatDate(scope.row.packingTime, "yyyy-MM-dd hh:mm")
                    }}
                  </span>
                  <span v-else-if="item.rowField === 'planPackingTime'">
                    {{
                    formatDate(scope.row.planPackingTime, "yyyy-MM-dd hh:mm")
                    }}
                  </span>
                  <span v-else-if="item.rowField === 'orderTime'">
                    {{
                    formatDate(scope.row.orderTime, "yyyy-MM-dd hh:mm")
                    }}
                  </span>
                  <span v-else-if="item.rowField === 'plannedDocking'">
                    {{
                    formatDate(scope.row.plannedDocking, "yyyy-MM-dd hh:mm")
                    }}
                  </span>
                  <span v-else-if="item.rowField === 'actualBerthing'">
                    {{
                    formatDate(scope.row.actualBerthing, "yyyy-MM-dd hh:mm")
                    }}
                  </span>
                  <span v-else-if="item.rowField === 'openingDate'">
                    {{
                    formatDate(scope.row.openingDate, "yyyy-MM-dd hh:mm")
                    }}
                  </span>
                  <span v-else-if="item.rowField === 'dueDate'">
                    {{
                    formatDate(scope.row.dueDate, "yyyy-MM-dd hh:mm")
                    }}
                  </span>
                  <span v-else-if="item.rowField === 'cutOffDate'">
                    {{
                    formatDate(scope.row.cutOffDate, "yyyy-MM-dd hh:mm")
                    }}
                  </span>
                  <span v-else-if="item.rowField === 'shippingDay'">
                    {{
                    formatDate(scope.row.shippingDay, "yyyy-MM-dd hh:mm")
                    }}
                  </span>
                  <span v-else-if="item.rowField === 'vesselAndVoyage'">
                    {{
                    scope.row.vesselAndVoyage | vesselAndVoyageFiter
                    }}
                  </span>
                  <span
                    v-else-if="item.rowField === 'makingStatus'"
                    :style="scope.row.makingStatus | makingStatusFilter"
                  >
                    {{ scope.row.makingStatus | makingStatusFiter }}
                    <span
                      v-if="scope.row.makingStatus == 0"
                      style="color: black"
                    >({{ scope.row.makingReason }})</span>
                  </span>
                  <span v-else-if="item.rowField === 'typeOfShipping'">
                    {{
                    scope.row.typeOfShipping | typeOfShippingFiter
                    }}
                  </span>
                  <span v-else-if="item.rowField === 'sendReceipStatus'">
                    {{
                    scope.row.sendReceipStatus | sendReceipStatusFiter
                    }}
                  </span>
                  <span v-else-if="item.rowField === 'boxPoint'">
                    {{ scope.row.suitcasePoint
                    }}{{ scope.row.returnPoint }}
                  </span>
                  <!-- 目前平台与车队使用的同一个列表，索引他们的客户不一样，需要过滤处理 -->
                  <span
                    v-else-if="item.rowField === 'customerName'"
                  >{{ company.accountType === 0 ? scope.row.companyName : scope.row.customerName }}</span>
                  <span v-else>{{ scope.row[item.rowField] }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="箱信息"
                align="center"
                width="140"
                fixed="right"
                v-if="company.accountType == 0"
              >
                <template slot-scope="scope">
                  <el-button size="mini" type="text" @click="packingListDialog(scope.row)">装箱单</el-button>
                  <el-button size="mini" type="text" @click="boxPictureDialog(scope.row)">箱货照片</el-button>
                </template>
              </el-table-column>
            </el-table>

            <pagination
              v-show="total > 0"
              :total="total"
              :page.sync="queryParams.pageNum"
              :limit.sync="queryParams.pageSize"
              @pagination="getList"
            />
          </div>
        </div>

        <!-- 订单详情 -->
        <div v-if="showType === 1">
          <div v-if="company.accountType == 0">
            <el-page-header v-show="showDlg" @back="goBack" content="订单详情"></el-page-header>
            <platform-box ref="headerChild" :temp="temp"></platform-box>
          </div>
          <div v-if="company.accountType == 1">
            <div v-if="temp.dispatchType == 0">
              <div v-if="genre === 1">
                <el-page-header v-show="showDlg" @back="goBack" content="海运出口详情"></el-page-header>
                <order-detail-export
                  ref="headerChild"
                  :temp="temp"
                  :type="type"
                  v-on:typeChanged="typeChanged"
                  v-on:showChanged="showChanged"
                ></order-detail-export>
              </div>
              <div v-if="genre === 2">
                <el-page-header v-show="showDlg" @back="goBack" content="海运进口详情"></el-page-header>
                <order-detail-imports
                  ref="headerChild"
                  :temp="temp"
                  :type="type"
                  v-on:typeChanged="typeChanged"
                  v-on:showChanged="showChanged"
                ></order-detail-imports>
              </div>
            </div>
            <div v-if="temp.dispatchType == 1">
              <div v-if="genre === 1">
                <el-page-header v-show="showDlg" @back="goBack" content="海运出口详情"></el-page-header>
                <export-detail
                  ref="headerChild"
                  :temp="temp"
                  :type="type"
                  v-on:typeChanged="typeChanged"
                  v-on:showChanged="showChanged"
                ></export-detail>
              </div>
              <div v-if="genre === 2">
                <el-page-header v-show="showDlg" @back="goBack" content="海运进口详情"></el-page-header>
                <imports-detail
                  ref="headerChild"
                  :temp="temp"
                  :type="type"
                  v-on:typeChanged="typeChanged"
                  v-on:showChanged="showChanged"
                ></imports-detail>
              </div>
            </div>
          </div>
        </div>

        <!-- 弹框 -->
        <op-ration
          :isShow.sync="isShow"
          @getTableHeaderLoading="getTableHeaderLoading"
          @getTableHeader="getTableHeader"
          v-if="isShow"
          :isRow2="isRow2"
          :headerList="tableHeader"
          :userId="userId"
        ></op-ration>

        <!-- 装箱单 -->
        <packing-list
          ref
          v-if="packingListVisible"
          :visible.sync="packingListVisible"
          :packingList="packingList"
        ></packing-list>
        <!-- 箱货照片 -->
        <box-picture v-if="boxPictureVisible" :visible.sync="boxPictureVisible" :boxRow="boxRow"></box-picture>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getCorporateIdentify } from '@/utils/util';
import { listBoxMaking } from '@/api/boxMaking/makeBox';
import OrderDetailExport from '@/views/oms/shippingexport/orderdetail/index.vue';
import OrderDetailImports from '@/views/oms/shippingimports/orderdetail/index.vue';
import ExportDetail from '@/views/oms/platformorders/exportdetail/index.vue';
import ImportsDetail from '@/views/oms/platformorders/importsdetail/index.vue';
import MakeSearch from '../makeSearch/index.vue';
import { orderHeader } from '@/api/oms/tableHeader';
import Operation from '@/views/tableheader/index.vue';
import { mapState } from 'vuex';
import { checkPermi } from '@/utils/permission';
import PlatformBox from '../platformbox/index';
import PackingList from '../../distribute/singlecenter/packingquery/packingList/index';
import { getLclList } from '@/api/oms/makingChest';
import BoxPicture from '../../distribute/singlecenter/packingquery/boxpicture/index';
import { parseTime } from '@/utils/ruoyi';
export default {
  name: 'Makebox',
  components: {
    'order-detail-export': OrderDetailExport,
    'order-detail-imports': OrderDetailImports,
    'export-detail': ExportDetail,
    'imports-detail': ImportsDetail,
    'make-search': MakeSearch,
    'op-ration': Operation,
    'platform-box': PlatformBox,
    'packing-list': PackingList,
    'box-picture': BoxPicture
  },
  computed: {
    tableHeaderList: function () {
      return this.tableHeader.filter(function (item) {
        return item.show1;
      });
    },
    ...mapState({
      userInfo: (state) => state.user.userInfo,
      company: (state) => state.constant.company,
      vehicle: (state) => state.constantl.vehicle
    })
  },
  // computed: {
  //   tableMaxHeight() {
  //     return window.innerHeight - 170 + 'px';
  //   }
  // },
  filters: {
    vesselAndVoyageFiter: function (value) {
      if (value != undefined) {
        return value.replace('/', ' ');
      }
    },
    styleFilter: function (status) {
      const statusMap = {
        0: 'color: #F56C6C',
        1: 'color: #909399',
        2: 'color: #67C23A'
      };
      return statusMap[status];
    },
    businessStateFiter: function (value) {
      if (value == 0) {
        return '已取消';
      } else if (value == 1) {
        return '未完结';
      } else if (value == 2) {
        return '已完结';
      }
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
    statusFilter: function (status) {
      const statusMap = {
        1: 'color: #E6A23C'
      };
      return statusMap[status];
    },
    makingStatusFilter: function (status) {
      const statusMap = {
        0: 'color: #F56C6C',
        1: 'color: #67C23A'
      };
      return statusMap[status];
    },
    dispatchTypeFiter: function (value) {
      const statusMap = {
        0: '内部订单',
        1: '锦线订单'
      };
      return statusMap[value];
    },
    typeOfShippingFiter: function (value) {
      return value == 1 ? '自做' : '外发';
    },
    sendReceipStatusFiter: function (value) {
      return value == 1
        ? '待寄'
        : value == 2
        ? '不寄'
        : value == 3
        ? '已寄'
        : '';
    },
    makingStatusFiter: function (value) {
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
      isShow: false,
      sort: false,
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 做箱列表表格数据
      boxMakingList: [],
      stateOptions: [
        {
          value: -1,
          label: '全部'
        },
        {
          value: 0,
          label: '已取消'
        },
        {
          value: 1,
          label: '未完结'
        },
        {
          value: 2,
          label: '已完结'
        }
      ],
      dispatchTypeOptions: [
        {
          value: -1,
          label: '全部订单'
        },
        {
          value: 0,
          label: '内部订单'
        },
        {
          value: 1,
          label: '锦线订单'
        }
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        sort: 'create_date',
        order: 'desc',
        businessState: -1,
        blNo: '',
        corporateIdentify: getCorporateIdentify(),
        orderType: 0,
        dispatchType: -1,
        type: 1
      },
      searchVisible: false,
      showType: 0,
      showDlg: true,
      temp: null,
      type: 2,
      genre: 0,
      //表头数据表id  tableId
      queryHeader: {
        //出口订单表id
        tableId: '4',
        //当前账户id
        userId: ''
      },
      tableHeader: [],
      spanArr: [],
      //装箱单
      packingList: {},
      packingListVisible: false,
      //箱货照片
      boxPictureVisible: false,
      //箱货照片当前行
      boxRow: {},
      currentIndex: -1
    };
  },
  created() {
    this.getTableHeader();
    this.getList();
  },
  watch: {
    boxMakingList() {
      this.$nextTick(() => {
        this.spanArr = [];
        let contactDot = 0;
        this.boxMakingList.forEach((item, index) => {
          if (index === 0) {
            this.spanArr.push(1);
          } else {
            if (
              item.orderNumber === this.boxMakingList[index - 1].orderNumber
            ) {
              this.spanArr[contactDot] += 1;
              this.spanArr.push(0);
            } else {
              contactDot = index;
              this.spanArr.push(1);
            }
          }
        });
      });
    }
  },
  methods: {
    /////////////
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
      this.isRow2 = true;
      this.userId = this.userInfo.id;
    },
    /** 查询做箱列表 */
    getList() {
      this.loading = true;
      // 根据公司id 与 派单类型 查询所有订单，并查询出做箱信息。如果是平台 派单类型为0 车队为 1
      if (this.company.accountType == 0) {
        this.queryParams.type = 0;
      }
      listBoxMaking(this.queryParams).then((response) => {
        this.boxMakingList = JSON.parse(JSON.stringify(response.data.list));
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 合并列
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (column.label == '订单编号') {
        if (this.spanArr[rowIndex]) {
          return {
            rowspan: this.spanArr[rowIndex],
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    // 翻页序号递增
    indexMethod(index) {
      let curpage = this.queryParams.pageNum;
      let limitpage = this.queryParams.pageSize;
      return index + 1 + (curpage - 1) * limitpage;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    // 高级搜索
    onSearchSuccess(res) {
      this.loading = true;
      var params = {
        pageNum: 1,
        pageSize: 20,
        sort: 'create_date',
        order: 'desc',
        orderType: res.orderType,
        customerName: res.customerName,
        orderNumber: res.orderNumber,
        // sealNumber: res.sealNumber,
        //合作伙伴
        partner: res.partner,
        beginTime: res.beginTime,
        endTime: res.endTime,
        door: res.door,
        vehicles: res.vehicle != undefined ? res.vehicle.join(',') : '',
        driver: res.driver,
        typeOfShipping: res.typeOfShipping,
        carrierCompany: res.carrierCompany,
        corporateIdentify: getCorporateIdentify(),
        ysState: res.ysState,
        yfState: res.yfState,
        ptysState: res.ptysState,
        sendReceipStatus: res.sendReceipStatus
      };
      Object.assign(this.queryParams, params);
      // this.queryParams.blNo = '';
      this.getList();
    },

    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === this.currentIndex && this.currentIndex > -1) {
        return 'warning-row';
      }
      return '';
    },
    /** 修改按钮操作 */
    updateDate(row, index) {
      this.currentIndex = index;
      let state = checkPermi(['boxmaking:makebox:edit']);
      if (state) {
        this.temp = row;
        if (row.orderType === 1) {
          this.genre = 1;
        } else if (row.orderType === 2) {
          this.genre = 2;
        }
        this.showType = 1;
      } else {
        this.$notify.error({
          title: '当前操作没有权限'
        });
      }
    },
    // 返回事件
    goBack() {
      this.getList();
      if (this.$refs.headerChild.form) {
        if (
          JSON.stringify(this.temp) ==
          JSON.stringify(this.$refs.headerChild.form)
        ) {
          this.showType = 0;
        } else {
          this.$confirm('订单部分变更尚未保存, 确定要离开吗?', '注意', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.showType = 0;
            })
            .catch(() => {});
        }
      } else {
        this.showType = 0;
      }
    },
    typeChanged(str) {
      if (str) {
        // 刷新列表
        this.getList();
        this.showType = 0;
      }
    },
    // 页头显示隐藏事件
    showChanged(bl) {
      this.showDlg = bl;
    },
    //装箱单
    packingListDialog(row) {
      getLclList(row.mcId).then((response) => {
        var total = 0;
        var grossWeight = 0;
        var cbm = 0;

        for (var i = 0; i < response.data.length; i++) {
          for (var j = 0; j < response.data[i].hairBodyList.length; j++) {
            if (!isNaN(response.data[i].hairBodyList[j].total)) {
              total += Number(response.data[i].hairBodyList[j].total);
            }
            if (!isNaN(response.data[i].hairBodyList[j].grossWeight)) {
              grossWeight += Number(
                response.data[i].hairBodyList[j].grossWeight
              );
            }
            if (!isNaN(response.data[i].hairBodyList[j].cbm)) {
              cbm += Number(response.data[i].hairBodyList[j].cbm);
            }
          }
        }
        let obj = {};
        obj.vesselAndVoyage = row.vesselAndVoyage;
        if (row.dock == null) {
          obj.dock = '港区：';
        } else {
          obj.dock = '港区：' + row.dock;
        }
        if (row.openingDate == null) {
          obj.openingDate = '开港日期：';
        } else {
          obj.openingDate = '开港日期：' + parseTime(row.openingDate);
        }
        if (row.cutOffDate == null) {
          obj.cutOffDate = '截港日期：';
        } else {
          obj.cutOffDate = '截港日期：' + parseTime(row.cutOffDate);
        }
        obj.portOfLoading = row.portOfLoading;
        obj.portOfDischarge = row.portOfDischarge;
        obj.placeOfDelivery = row.placeOfDelivery;
        obj.caseNumber = row.caseNumber;
        obj.sealNumber = row.sealNumber;
        obj.boxPile = row.boxPile;
        obj.packingTime = row.packingTime;
        obj.driver = row.driver;
        obj.phone = row.phone;
        obj.vehicle = row.vehicle;
        obj.total = total;
        obj.grossWeight = grossWeight;
        obj.cbm = cbm;
        obj.tareWeight = row.tareWeight;
        obj.lclList = response.data;
        obj.contTotalWt = Number(row.tareWeight) + Number(grossWeight);
        obj.bmRemarks = row.bmRemarks;
        this.packingList = obj;
        this.packingListVisible = true;
      });
    },
    //箱货照片
    boxPictureDialog(row) {
      this.boxRow = row;
      this.boxPictureVisible = true;
    }
  }
};
</script>
<style scoped>
.MytoUpper .el-input__inner {
  text-transform: uppercase;
}
</style>
<style>
.el-popover.myPopover {
  padding: 0px;
}
.el-page-header__left .el-icon-back {
  color: #409eff;
}
.el-page-header__title {
  color: #409eff;
}
/* .el-table {
  position: absolute;
  min-width: 1300px;
  overflow: auto;
}
.bottomScroll {
  position: relative;
  overflow: auto;
} */
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
.el-table .warning-row {
  background: oldlace;
}
</style>
