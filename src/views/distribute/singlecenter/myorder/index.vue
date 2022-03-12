<template>
  <div class="app-container">
    <div v-show="showStatus === 0 && editOrder === 0">
      <el-form
        :model="queryParams"
        ref="queryForm"
        @submit.native.prevent
        :inline="true"
        label-width="68px"
      >
        <el-form-item prop="placeOrderNumber" class="MytoUpper">
          <el-input
            v-model.trim="queryParams.blNos"
            placeholder="提单号"
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
            <advanced-search :searchVisible.sync="searchVisible" @search-success="onSearchSuccess"></advanced-search>
            <el-button type="primary" icon="el-icon-search" size="small" plain slot="reference">高级搜索</el-button>
          </el-popover>
          <el-button
            type="primary"
            icon="el-icon-s-grid"
            size="small"
            @click="editTableHeader"
            plain
          >自定义表头</el-button>
        </el-form-item>
      </el-form>
      <!-- 订单数据 -->
      <el-table
        v-loading="loading"
        border
        ref="multipleTable"
        :data="mineOrderList"
        highlight-current-row
        style="width: 100%"
        :row-class-name="tableRowClassName"
      >
        <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
        <el-table-column
          v-for="item in tableHeaderList"
          :key="item.id"
          :label="item.rowName"
          :prop="item.rowField"
          align="center"
          :min-width="item.width"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span v-if="item.rowField == 'blNos'">
              <span
                v-if="
                  scope.row['orderStatus'] === 1 ||
                  scope.row['orderStatus'] === 0
                "
              >{{ scope.row["blNos0"] }}</span>
              <span v-else>{{ scope.row["blNos1"] }}</span>
            </span>
            <span v-else-if="item.rowField == 'vesselAndVoyage'">
              <span
                v-if="
                  scope.row['orderStatus'] === 1 ||
                  scope.row['orderStatus'] === 0
                "
              >{{ scope.row["vesselAndVoyage0"] }}</span>
              <span v-else>{{ scope.row["vesselAndVoyage1"] }}</span>
            </span>

            <span v-else-if="item.rowField == 'boxQuantity'">
              <span
                v-if="
                  scope.row['orderStatus'] === 1 ||
                  scope.row['orderStatus'] === 0
                "
              >{{ scope.row["boxQuantity0"] }}</span>
              <span v-else>{{ scope.row["boxQuantity1"] }}</span>
            </span>
            <span v-else-if="item.rowField == 'portOfLoading'">
              <span
                v-if="
                  scope.row['orderStatus'] === 1 ||
                  scope.row['orderStatus'] === 0
                "
              >{{ scope.row["portOfLoading0"] }}</span>
              <span v-else>{{ scope.row["portOfLoading1"] }}</span>
            </span>

            <span v-else-if="item.rowField == 'portOfDischarge'">
              <span
                v-if="
                  scope.row['orderStatus'] === 1 ||
                  scope.row['orderStatus'] === 0
                "
              >{{ scope.row["portOfDischarge0"] }}</span>
              <span v-else>{{ scope.row["portOfDischarge1"] }}</span>
            </span>

            <span v-else-if="item.rowField == 'customerNum'">
              <span
                v-if="
                  scope.row['orderStatus'] === 1 ||
                  scope.row['orderStatus'] === 0
                "
              >{{ scope.row["customerNum0"] }}</span>
              <span v-else>{{ scope.row["customerNum1"] }}</span>
            </span>

            <span v-else-if="item.rowField == 'placeOfDelivery'">
              <span
                v-if="
                  scope.row['orderStatus'] === 1 ||
                  scope.row['orderStatus'] === 0
                "
              >{{ scope.row["placeOfDelivery0"] }}</span>
              <span v-else>{{ scope.row["placeOfDelivery1"] }}</span>
            </span>

            <span v-else-if="item.rowField == 'dock'">
              <span
                v-if="
                  scope.row['orderStatus'] === 1 ||
                  scope.row['orderStatus'] === 0
                "
              >{{ scope.row["dock0"] }}</span>
              <span v-else>{{ scope.row["dock1"] }}</span>
            </span>

            <span v-else-if="item.rowField === 'orderType'">
              {{
              scope.row.orderType | orderTypeFiter
              }}
            </span>
            <span
              v-else-if="item.rowField === 'orderStatus'"
              :style="{
                color:
                  scope.row['orderStatus'] == 0
                    ? 'red'
                    : scope.row['orderStatus'] == 2
                    ? 'green'
                    : 'orange',
              }"
            >
              {{ scope.row.orderStatus | orderStatusFiter }}
              <span
                v-if="scope.row['orderStatus'] == 0"
                style="color: black"
              >( {{ scope.row["reason"] }})</span>
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
            <span v-else-if="item.rowField === 'openingDate'">
              {{
              formatDate(scope.row.openingDate, "yyyy-MM-dd hh:mm")
              }}
            </span>
            <span v-else-if="item.rowField === 'shippingDay'">
              {{
              formatDate(scope.row.shippingDay, "yyyy-MM-dd hh:mm")
              }}
            </span>
            <span v-else-if="item.rowField === 'actualBerthing'">
              {{
              formatDate(scope.row.actualBerthing, "yyyy-MM-dd hh:mm")
              }}
            </span>
            <span v-else-if="item.rowField === 'plannedDocking'">
              {{
              formatDate(scope.row.plannedDocking, "yyyy-MM-dd hh:mm")
              }}
            </span>
            <span v-else-if="item.rowField === 'placeOrderTime'">
              {{
              formatDate(scope.row.placeOrderTime, "yyyy-MM-dd hh:mm")
              }}
            </span>
            <span v-else>{{ scope.row[item.rowField] }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          align="center"
          fixed="right"
          width="180"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              @click="checkOrder(scope.row,scope.$index)"
            >查看</el-button>
            <el-button
              size="small"
              type="text"
              icon="el-icon-edit"
              :disabled="scope.row.orderStatus != 1"
              @click="updateOrder(scope.row)"
            >修改</el-button>
            <el-button
              size="small"
              type="text"
              icon="el-icon-circle-close"
              :disabled="scope.row.orderStatus != 1"
              @click="cancelBusiness(scope.row)"
            >取消</el-button>
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

    <!-- 已接单对话框 -->
    <div v-if="showStatus === 2">
      <el-page-header @back="goBack" content="订单详情"></el-page-header>
      <mineorder-detail :temp="orderInfo"></mineorder-detail>
    </div>

    <!-- 表头排序弹框 -->
    <op-ration
      :isShow.sync="isShow"
      v-if="isShow"
      :isRow="isRow"
      :headerList="tableHeader"
      :userId="userId"
    ></op-ration>

    <!-- 待接单对话框 -->
    <pd-detail
      ref="jddetail"
      v-if="pddetailVisible"
      :visible.sync="pddetailVisible"
      :temp="orderInfo"
    ></pd-detail>

    <!-- 取消对话框 -->
    <el-dialog
      title="取消订单"
      width="30%"
      :visible.sync="cancelVisible"
      :close-on-click-modal="false"
      :before-close="cancel"
      append-to-body
    >
      <el-input
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4 }"
        placeholder="请输入取消原因"
        v-model="reason"
        maxlength="100"
        show-word-limit
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitCancel">确 定</el-button>
      </span>
    </el-dialog>

    <div v-if="editOrder === 1">
      <el-page-header @back="editexportBack" content="出口订单"></el-page-header>
      <!-- 修改出口对话框 -->
      <edit-export
        v-if="visibleExport"
        :visibleExport.sync="visibleExport"
        :editRowInfo="editRowInfo"
      ></edit-export>
    </div>

    <div v-if="editOrder === 3">
      <el-page-header @back="editimportBack" content="进口订单"></el-page-header>
      <!-- 修改进口对话框 -->
      <edit-import
        v-if="visibleImport"
        :visibleImport.sync="visibleImport"
        :editImportRowInfo="editImportRowInfo"
      ></edit-import>
    </div>
  </div>
</template>
<script>
import { cancelOrder } from '@/api/distribute/businessCenter';
import { orderHeader } from '@/api/oms/tableHeader';
import { mapState } from 'vuex';
import Operation from '../tableheaders/index';
import { getCorporateIdentify } from '@/utils/util';
import { getMineOrderList } from '@/api/distribute/mineOrder';
import PdDetail from './pddetail/index';
import MineOrderDetail from './mineorderdetail/index';
import OrderAdvanced from '../orderadvancedsearch/index';
import EditExport from './editexport/index';
import EditImport from './editimport/index';
import { validatenull } from '@/utils/validate';
export default {
  name: 'Myorder',
  components: {
    'op-ration': Operation,
    'pd-detail': PdDetail,
    'mineorder-detail': MineOrderDetail,
    'advanced-search': OrderAdvanced,
    'edit-export': EditExport,
    'edit-import': EditImport
  },

  computed: {
    tableHeaderList: function () {
      return this.tableHeader.filter(function (item) {
        return item.show1;
      });
    },
    ...mapState({
      userInfo: (state) => state.user.userInfo,
      company: (state) => state.constant.company
    })
  },
  data() {
    return {
      editOrder: 0,
      //修改出口
      visibleExport: false,
      //修改进口
      visibleImport: false,
      // 遮罩层
      loading: false,
      //是否展示表头排序
      isShow: false,
      show: false,
      //订单数据
      mineOrderList: [],
      //查询参数
      queryParams: {
        pageName: 1,
        pageSize: 20,
        belongCompaniesId: getCorporateIdentify(),
        sort: 'create_date',
        order: 'desc'
      },
      total: 0,
      //高级搜索弹框
      searchVisible: false,
      queryHeader: {
        // 出口订单表id
        tableId: '6',
        // 当前账户id
        userId: ''
      },
      // 表头数据
      tableHeader: [],
      //查看框
      pddetailVisible: false,
      //查看当前行信息
      orderInfo: {},
      cancelVisible: false,
      rowId: '',
      reason: '',
      //是否已接单
      showStatus: 0,
      //编辑当前行信息
      editRowInfo: {},
      //进口当前行
      editImportRowInfo: {},
      currentIndex: -1
    };
  },
  filters: {
    vesselAndVoyageFiter: function (value) {
      if (value != undefined) {
        return value.replace('/', ' ');
      }
    },
    orderTypeFiter: function (value) {
      if (value == 1) {
        return '海运出口';
      } else if (value == 2) {
        return '海运进口';
      } else if (value == 3) {
        return '空运出口';
      } else if (value == 4) {
        return '空运进口';
      }
    },
    orderStatusFiter: function (value) {
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
    }
  },
  created() {
    this.getTableHeader();
    this.getList();
    this.getData();
  },
  watch: {
    // 如果路由发生变化，再次执行该方法
    $route: 'getData'
  },
  mounted() {
    var that = this;
    that.$goEasy.subscribe({
      channel: getCorporateIdentify(),
      onMessage: function (message) {
        if (message.content == '003') {
          that.$notify({
            title: '警告',
            message: '平台取消订单了...',
            type: 'warning'
          });
          that.getList();
        } else {
          that.$notify({
            title: '消息',
            message: '你的订单已被接单',
            type: 'success'
          });
          that.getList();
        }
      },
      onSuccess: function () {
        console.log('接单/取消信息订阅成功.');
      }
    });
  },
  methods: {
    //定位行
    getData() {
      if (this.$route.params.currentRouter == '/user/message') {
        // this.getList();
        getMineOrderList(this.queryParams).then((response) => {
          this.mineOrderList = response.data.list;
          let params = this.$route.params.numberParams;
          this.mineOrderList.map((item, index) => {
            if (item.placeOrderNumber === params) {
              this.findIndex = index;
            }
          });
          this.currentIndex = this.findIndex;
        });
      }
    },
    //定位行
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === this.currentIndex && this.currentIndex) {
        return 'warning-row';
      }
      return '';
    },
    //查询下单表和接单表
    getList() {
      this.loading = true;
      //根据所属公司id查询下单
      if (!validatenull(this.queryParams.blNos)) {
        this.queryParams.blNos = this.queryParams.blNos.toUpperCase();
      }
      getMineOrderList(this.queryParams).then((response) => {
        this.mineOrderList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    //高级搜索
    onSearchSuccess(res) {
      var params = {
        pageName: 1,
        pageSize: 20,
        belongCompaniesId: getCorporateIdentify(),
        sort: 'create_date',
        order: 'desc',
        orderStatus: res.orderStatus,
        orderType: res.orderType,
        placeOrderNumber: res.placeOrderNumber,
        customerNum: res.customerNum,
        beginTime: res.beginTime,
        endTime: res.endTime
      };
      Object.assign(this.queryParams, params);
      this.getList();
    },
    //搜索
    handleQuery() {
      this.getList();
    },
    // 取消
    cancelBusiness(row) {
      this.blNosAndBox =
        '提单号：' + row.blNos0 + ';箱型箱量' + row.boxQuantity0;
      this.rowId = row.id;
      this.rowPlaceOrderNumber = row.placeOrderNumber;
      this.cancelVisible = true;
    },
    cancel() {
      this.cancelVisible = false;
    },
    // 提交取消
    submitCancel() {
      if (this.reason == '') {
        this.$message({
          message: '请填写取消原因',
          type: 'warning'
        });
      } else {
        var params = {
          id: this.rowId,
          belongCompaniesId: '',
          reason: '取消原因:' + this.reason,
          type: 1,
          companyName: this.company.companyName,
          placeOrderNumber: this.rowPlaceOrderNumber,
          blNosAndBox: this.blNosAndBox
        };
        cancelOrder(params).then((response) => {
          if (response.data.code === 200) {
            if (response.data.data == 1) {
              this.msgSuccess('取消成功');
            } else {
              this.$message({
                message: response.data.msg,
                type: 'warning'
              });
            }
            this.getList();
            this.reason = '';
            this.cancelVisible = false;
          } else {
            this.msgError(response.data.msg);
          }
        });
      }
    },
    //查看订单
    checkOrder(row, index) {
      this.currentIndex = index;
      //待接单和已经取消
      if (
        (row.orderStatus === 1 || row.orderStatus == 0) &&
        row.orderId == null
      ) {
        this.orderInfo = row;
        this.pddetailVisible = true;
      }
      //已经接单，已经完结，已派单
      if (
        row.orderStatus === 2 ||
        row.orderStatus == 4 ||
        row.orderStatus == 3 ||
        row.orderId != null
      ) {
        this.orderInfo = row;
        this.showStatus = 2;
      }
    },
    //修改订单
    updateOrder(row) {
      //待接单
      if (row.orderStatus == 1 && row.orderType == 1) {
        this.visibleExport = true;
        this.editOrder = 1;
        this.editRowInfo = JSON.parse(JSON.stringify(row));
      }
      //已接单
      if (row.orderStatus == 1 && row.orderType == 2) {
        this.visibleImport = true;
        this.editOrder = 3;
        this.editImportRowInfo = JSON.parse(JSON.stringify(row));
      }
    },
    // 返回事件
    goBack() {
      this.showStatus = 0;
      this.getList();
    },
    //修改出口订单返回
    editexportBack() {
      this.editOrder = 0;
      this.showStatus = 0;
    },
    //修改进口订单返回
    editimportBack() {
      this.editOrder = 0;
      this.showStatus = 0;
    },
    //获取表头
    getTableHeader() {
      this.loading = true;
      this.queryHeader.userId = this.userInfo.id;
      // 根据表tableId获取表头
      orderHeader(this.queryHeader).then((response) => {
        this.tableHeader = response.data;
      });
      this.loading = false;
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
    //编辑表头
    editTableHeader() {
      this.isShow = true;
      this.isRow = true;
      this.userId = this.userInfo.id;
    }
  }
};
</script>
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
.MytoUpper .el-input__inner {
  text-transform: uppercase;
}
.el-table .warning-row {
  background: oldlace;
}
</style>
