<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--客户数据-->
      <el-col :span="24" :xs="24">
        <div v-show="showType === 0">
          <el-form
            :model="queryParams"
            ref="queryForm"
            @submit.native.prevent
            :inline="true"
            label-width="68px"
          >
            <el-form-item prop="orderNumber" class="MytoUpper">
              <el-input
                v-model.trim="queryParams.orderNumber"
                placeholder="订单编号"
                clearable
                size="small"
                style="width: 200px"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item>
              <el-input
                clearable
                v-model.trim="queryParams.blNo"
                placeholder="请输入提单号"
                class="MytoUpper"
                @keyup.enter.native="handleQuery"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
              <el-popover width="380" popper-class="myPopover" v-model="searchVisible">
                <!-- 高级搜索 -->
                <advanced-search
                  :searchVisible.sync="searchVisible"
                  :showType="2"
                  @search-success="onSearchSuccess"
                ></advanced-search>
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
                icon="el-icon-plus"
                size="mini"
                @click="handleAdd"
                v-hasPermi="['oms:shippingimports:add']"
              >新增</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                type="success"
                icon="el-icon-document-copy"
                size="mini"
                :disabled="single"
                @click="handleCopy"
              >复制订单</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                type="primary"
                icon="el-icon-download"
                size="mini"
                @click="exportList"
                plain
                v-hasPermi="['oms:shippingimports:export']"
              >导出箱货清单</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                type="primary"
                icon="el-icon-s-grid"
                size="mini"
                @click="editTableHeader"
                plain
              >自定义表头</el-button>
            </el-col>
          </el-row>

          <el-table
            v-loading="loading"
            ref="shippingimportsTable"
            :data="orderList"
            @selection-change="handleSelectionChange"
            @row-dblclick="updateDate"
            highlight-current-row
            :row-class-name="tableRowClassName"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column
              label="序号"
              type="index"
              :index="indexMethod"
              width="50"
              align="center"
            />
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
                <span
                  v-if="item.rowField==='businessState'"
                  :style="scope.row.businessState | styleFilter"
                >{{ scope.row.businessState | businessStateFiter}}</span>
                <span
                  v-else-if="item.rowField==='orderType'"
                >{{ scope.row.orderType | orderTypeFiter}}</span>
                <span
                  v-else-if="(item.rowField==='orderTime')"
                >{{ formatDate(scope.row.orderTime, 'yyyy-MM-dd hh:mm') }}</span>
                <span
                  v-else-if="(item.rowField==='openingDate')"
                >{{ formatDate(scope.row.openingDate, 'yyyy-MM-dd hh:mm') }}</span>
                <span
                  v-else-if="(item.rowField==='plannedDocking')"
                >{{ formatDate(scope.row.plannedDocking, 'yyyy-MM-dd hh:mm') }}</span>
                <span
                  v-else-if="(item.rowField==='cutOffDate')"
                >{{ formatDate(scope.row.cutOffDate, 'yyyy-MM-dd hh:mm') }}</span>
                <span
                  v-else-if="(item.rowField==='dueDate')"
                >{{ formatDate(scope.row.dueDate, 'yyyy-MM-dd hh:mm') }}</span>
                <span
                  v-else-if="(item.rowField==='actualBerthing')"
                >{{ formatDate(scope.row.actualBerthing, 'yyyy-MM-dd hh:mm') }}</span>
                <span
                  v-else-if="(item.rowField==='shippingDay')"
                >{{ formatDate(scope.row.shippingDay, 'yyyy-MM-dd hh:mm') }}</span>
                <span
                  v-else-if="item.rowField==='putTheBoxTime'"
                >{{ formatDate(scope.row.putTheBoxTime, 'yyyy-MM-dd hh:mm') }}</span>
                <span
                  v-else-if="item.rowField==='vesselAndVoyage'"
                >{{ scope.row.vesselAndVoyage | vesselAndVoyageFiter}}</span>
                <span v-else>{{ scope.row[item.rowField]}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              fixed="right"
              width="100"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="updateDate(scope.row,scope.$index)"
                  v-hasPermi="['oms:shippingimports:edit']"
                >编辑</el-button>
              </template>
            </el-table-column>
          </el-table>

          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList"
          />
        </div>

        <div v-if="showType === 1">
          <el-page-header v-show="showDlg" @back="goBack" content="海运进口详情"></el-page-header>
          <order-detail
            ref="headerChild"
            :temp="temp"
            :type="type"
            v-on:typeChanged="typeChanged"
            v-on:showChanged="showChanged"
          ></order-detail>
        </div>

        <!-- 弹框 -->
        <op-ration
          :isShow.sync="isShow"
          v-if="isShow"
          :isRow="isRow"
          :headerList="tableHeader"
          @getTableHeaderLoading="getTableHeaderLoading"
          @getTableHeader="getTableHeader"
          :userId="userId"
        ></op-ration>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getCorporateIdentify } from '@/utils/util';
import OrderDetail from './orderdetail/index.vue';
import {
  listBusinessOrder,
  exportData,
  messageRedis,
  updateStatusChat
} from '@/api/oms/businessOrder';
import { exportExcel } from '@/utils/util';
import AdvancedSearch from '@/views/oms/advancedSearch/index.vue';
import Operation from '@/views/tableheader/index.vue';
import { orderHeader } from '@/api/oms/tableHeader';
import { mapState } from 'vuex';
import { checkPermi } from '@/utils/permission';
import { createSocket, sendWSPush, onmessageWS } from '@/api/websocket.js';
import { validatenull } from '@/utils/validate';
export default {
  name: 'Shippingimports',
  components: {
    'order-detail': OrderDetail,
    'advanced-search': AdvancedSearch,
    'op-ration': Operation
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
    }
  },
  data() {
    return {
      isShow: false,
      sort: false,
      show: false,
      // 遮罩层
      loading: true,
      // 非单个禁用
      single: true,
      // 选中数组
      multipleSelection: [],
      // 总条数
      total: 0,
      // 客户表格数据
      orderList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        sort: 'create_date',
        order: 'desc',
        orderNumber: '',
        orderType: 2,
        corporateIdentify: getCorporateIdentify()
      },
      showType: 0,
      showDlg: true,
      temp: null,
      type: 1,
      searchVisible: false,
      tableHeader: [],
      // 表头数据表id  tableId
      queryHeader: {
        // 出口订单表id
        tableId: '3',
        // 当前账户id
        userId: ''
      },
      currentIndex: -1
    };
  },
  created() {
    // createSocket('ws://127.0.0.1:10086');
    this.loginSocket();
    this.getTableHeader();
    this.getList();
  },
  methods: {
    loginSocket() {
      var params = {
        action: '0',
        userId: this.userInfo.id,
        clientType: 'web'
      };
      //发送登录校验
      sendWSPush(params);
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === this.currentIndex && this.currentIndex > -1) {
        return 'warning-row';
      }
      return '';
    },
    getTableHeader() {
      this.queryHeader.userId = this.userInfo.id;
      // 根据表tableId获取表头
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
    /** 查询订单列表 */
    getList() {
      this.loading = true;
      listBusinessOrder(this.queryParams).then((response) => {
        this.orderList = response.data.list;
        this.total = response.data.total;
        this.$nextTick(() => {
          this.$refs.shippingimportsTable.doLayout();
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.multipleSelection = selection;
      this.single = selection.length != 1;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    // 高级弹出层
    advancedSearch() {
      this.searchVisible = true;
    },
    // 高级搜索
    onSearchSuccess(res) {
      this.loading = true;
      var params = {
        pageNum: 1,
        pageSize: 10,
        sort: 'create_date',
        order: 'desc',
        orderNumber: '',
        orderType: 2,
        customerName: res.customerName,
        customerId: res.customerId,
        //blNo: res.blNo,
        beginTime: res.beginTime,
        endTime: res.endTime,
        corporateIdentify: getCorporateIdentify()
      };
      Object.assign(this.queryParams, params);
      this.queryParams.orderNumber = '';
      this.getList();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.temp = null;
      this.type = 1;
      this.showType = 1;
    },
    // 复制订单
    handleCopy() {
      let obj = JSON.parse(JSON.stringify(this.multipleSelection[0]));
      obj.id = undefined;
      obj.orderNumber = undefined;
      obj.chestInfoId = undefined;
      if (obj.id == undefined && obj.orderNumber == undefined) {
        this.temp = obj;
        this.showType = 1;
      }
    },
    /** 修改按钮操作 */
    updateDate(row, index) {
      var query = {
        userId: this.userInfo.id,
        orderId: row.id,
        identifier: this.userInfo.identifier,
        name: this.userInfo.name
      };
      //根据订单id和用户id查询redis中有没有/保存
      // 1 如果有人在修改，当前只能浏览，即redis中存在<key,value> = <userId,orderId>
      messageRedis(query).then((response) => {
        this.currentIndex = index;
        let state = checkPermi(['oms:shippingexport:edit']);
        if (state) {
          this.temp = JSON.parse(JSON.stringify(row));
          // this.temp.messageBtn = response.data.total === 101 ? true : false;
          this.type = 2;
          this.showType = 1;
        } else {
          this.$notify.error({
            title: '当前操作没有权限'
          });
        }
      });
      // this.currentIndex = index;
      // let state = checkPermi(['oms:shippingexport:edit']);
      // if (state) {
      //   this.temp = JSON.parse(JSON.stringify(row));
      //   this.type = 2;
      //   this.showType = 1;
      // } else {
      //   this.$notify.error({
      //     title: '当前操作没有权限'
      //   });
      // }
    },
    // 返回事件
    goBack() {
      // 调用接口 管理消息redis中的数据
      // 获取userId  和orderId
      if (!validatenull(this.$refs.headerChild.form.id)) {
        var param = {
          userId: this.userInfo.id,
          orderId: this.$refs.headerChild.form.id,
          identifier: this.userInfo.identifier,
          name: this.userInfo.name
        };
        updateStatusChat(param).then((res) => {});
      }
      let chlidObj = this.$refs.headerChild.form;
      let addData =
        this.$refs.headerChild.$refs.makingChestChild.$refs.zxdTable.getInsertRecords()
          .length;
      let delData =
        this.$refs.headerChild.$refs.makingChestChild.$refs.zxdTable.getRemoveRecords()
          .length;
      let updateData =
        this.$refs.headerChild.$refs.makingChestChild.$refs.zxdTable.getUpdateRecords()
          .length;
      if (
        JSON.stringify(this.temp) == JSON.stringify(chlidObj) &&
        addData == 0 &&
        delData == 0 &&
        updateData == 0
      ) {
        this.showType = 0;
        this.single = true;
      } else {
        this.$confirm('订单部分变更尚未保存, 确定要离开吗?', '注意', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.showType = 0;
            this.single = true;
          })
          .catch(() => {});
      }
      this.getList();
    },
    typeChanged(data) {
      if (data == 'del') {
        this.showType = 0;
        this.getList();
      } else {
        this.temp = JSON.parse(JSON.stringify(data));
      }
    },
    // 页头显示隐藏事件
    showChanged(bl) {
      this.showDlg = bl;
    },
    //导出
    exportList() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '请选择订单信息',
          type: 'warning'
        });
      } else {
        var orderId = this.multipleSelection.map((item) => item.id);
        //根据订单id数组查找做箱信息
        this.multipleSelection.forEach((item) => {
          item.orderIdArray = orderId;
        });
        exportData(this.multipleSelection).then((response) => {
          exportExcel(response);
        });
      }
    },
    orderTypeFiters(orderType) {
      if (orderType == 1) {
        return '海运出口';
      } else if (orderType == 2) {
        return '海运进口';
      } else if (orderType == 3) {
        return '空运出口';
      } else if (orderType == 4) {
        return '空运进口';
      }
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
.el-table .warning-row {
  background: oldlace;
}
::v-deep .MytoUpper .el-input__inner {
  text-transform: uppercase;
}
.el-table .success-row {
  background: #f0f9eb;
}
</style>
