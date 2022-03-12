<template>
  <div class="app-container">
    <el-form class="demo-form-inline" :model="queryParams" :inline="true" @submit.native.prevent>
      <el-form-item>
        <el-select
          v-model="queryParams.orderStatus"
          size="small"
          @change="handleQuery"
          placeholder="订单状态"
        >
          <el-option
            v-for="item in OrderStatusOperation"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          size="small"
          clearable
          v-model.trim="queryParams.blNos"
          placeholder="请输入提单号"
          @keyup.enter.native="handleQuery"
          class="MytoUpper"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery" type="primary" size="small" icon="el-icon-search">搜索</el-button>
        <el-button @click="refresh" size="small" icon="el-icon-refresh">刷新</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="loading"
      :data="orderData"
      border
      highlight-current-row
      style="width: 100%"
      :row-class-name="tableRowClassName"
    >
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column
        prop="placeOrderNumber"
        label="下单编号"
        width="160"
        align="center"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="createDate"
        label="下单时间"
        width="160"
        align="center"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span>{{ formatDate(scope.row.createDate, "yyyy-MM-dd hh:mm") }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="orderStatus"
        label="订单状态"
        width="120"
        align="center"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span
            :style="{
              color:
                scope.row.orderStatus == 0
                  ? 'red'
                  : scope.row.orderStatus == 2
                  ? 'green'
                  : 'orange',
            }"
          >
            {{ scope.row.orderStatus | osFilter }}
            <span
              v-if="scope.row.orderStatus == 0"
              style="color: black"
            >({{ scope.row.reason }})</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="orderType"
        label="业务类型"
        width="80"
        align="center"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          {{ scope.row.orderType | orderTypeFiter }}
          <span></span>
        </template>
      </el-table-column>
      <el-table-column
        prop="blNos"
        label="提单号"
        width="130"
        align="center"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="boxQuantity"
        label="箱型箱量"
        width="150"
        align="center"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="vesselAndVoyage"
        label="船名航次"
        width="150"
        align="center"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          {{ scope.row.vesselAndVoyage | vesselAndVoyageFiter }}
          <span></span>
        </template>
      </el-table-column>
      <el-table-column
        prop="appendixName"
        label="附件"
        width="150"
        align="center"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column prop="placeOfDelivery" label="目的港" width="100" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column
        prop="dock"
        label="停靠码头"
        width="100"
        align="center"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="singleUser"
        label="下单用户"
        width="80"
        align="center"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="customerNum"
        label="客户编号"
        width="130"
        align="center"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        prop="operator"
        label="操作人员"
        width="80"
        align="center"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        label="操作"
        align="center"
        fixed="right"
        width="120"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="small"
            type="text"
            icon="el-icon-check"
            :disabled="scope.row.orderStatus != 1"
            @click="receivingOrders(scope.row,scope.$index)"
          >接单</el-button>
          <el-button
            size="small"
            type="text"
            icon="el-icon-circle-close"
            :disabled="scope.row.orderStatus!= 1"
            @click="cancelBusiness(scope.row,scope.$index)"
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

    <!-- 接单对话框 -->
    <jd-detail
      ref="jddetail"
      v-if="jddetailVisible"
      :visible.sync="jddetailVisible"
      :temp="orderInfo"
      @jd-detail-success="jdDetailSuccess"
    ></jd-detail>

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
  </div>
</template>
<script>
import { getCorporateIdentify } from '@/utils/util';
import {
  getBusinessCenter,
  cancelOrder
} from '@/api/distribute/businessCenter';
import JdDetail from './jddetail/index';
import { mapState } from 'vuex';
export default {
  name: 'Orderlist',
  components: {
    'jd-detail': JdDetail
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
    vesselAndVoyageFiter: function (value) {
      if (value != undefined) {
        return value.replace('/', ' ');
      }
    }
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 总条数
      total: 0,
      // 接单表格数据
      orderData: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderType: 0,
        sort: 'create_date',
        order: 'desc'
      },
      //订单类型
      OrderStatusOperation: [
        {
          value: -1,
          label: '全部订单'
        },
        {
          value: 1,
          label: '待接单'
        },
        {
          value: 2,
          label: '已接单'
        },
        {
          value: 3,
          label: '已派单'
        },
        {
          value: 4,
          label: '已完结'
        },
        {
          value: 0,
          label: '已取消'
        }
      ],
      //当前行信息
      orderInfo: {},
      jddetailVisible: false,
      cancelVisible: false,
      rowId: '',
      belongCompaniesId: '',
      reason: '',
      rowPlaceOrderNumber: '',
      //当前行索引
      currentIndex: -1,
      findIndex: 0
    };
  },
  watch: {
    // 如果路由发生变化，再次执行该方法
    $route: 'getData'
  },
  created() {
    this.getList();
    this.getData();
  },
  mounted() {
    var that = this;
    that.$goEasy.subscribe({
      channel: getCorporateIdentify(),
      onMessage: function (message) {
        if (message.content == '003') {
          that.$notify({
            title: '警告',
            message: '客户取消订单了...',
            type: 'warning',
            duration: 0
          });
          that.getList();
        } else {
          that.$notify.info({
            title: '消息',
            message: message.content,
            duration: 0
          });
          that.getList();
        }
      },
      onSuccess: function () {
        console.log('新订单/取消订单订阅成功.');
      }
    });
  },
  computed: {
    ...mapState({
      company: (state) => state.constant.company
    })
  },
  methods: {
    //消息查看定位行
    getData() {
      if (this.$route.params.currentRouter == '/user/message') {
        //this.getList();
        getBusinessCenter(this.queryParams).then((response) => {
          this.orderData = response.data.list;
          let params = this.$route.params.numberParams;
          this.orderData.map((item, index) => {
            if (item.placeOrderNumber === params) {
              this.findIndex = index;
            }
          });
          this.currentIndex = this.findIndex;
        });
        // let params = this.$route.params.numberParams;
        // this.orderData.map((item, index) => {
        //   if (item.placeOrderNumber === params) {
        //     this.findIndex = index;
        //   }
        // });
        // this.currentIndex = this.findIndex;
      }
    },
    // 查询列表
    getList() {
      this.loading = true;
      getBusinessCenter(this.queryParams).then((response) => {
        this.orderData = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === this.currentIndex && this.currentIndex > -1) {
        return 'warning-row';
      }
      return '';
    },
    // 搜索按钮操作
    handleQuery() {
      this.getList();
    },
    // 刷新
    refresh() {
      this.getList();
    },
    // 接单
    receivingOrders(row, index) {
      this.currentIndex = index;
      this.orderInfo = row;
      this.jddetailVisible = true;
    },
    // 接单成功返回刷新
    jdDetailSuccess() {
      this.getList();
    },
    // 取消
    cancelBusiness(row, index) {
      this.currentIndex = index;
      this.blNosAndBox = '提单号：' + row.blNos + ';箱型箱量' + row.boxQuantity;
      this.rowId = row.id;
      this.rowPlaceOrderNumber = row.placeOrderNumber;
      this.belongCompaniesId = row.belongCompaniesId;
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
          belongCompaniesId: this.belongCompaniesId,
          reason: '客服取消原因：' + this.reason,
          type: 0,
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
    }
  }
};
</script>
<style scoped>
::v-deep .el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: oldlace;
}
</style>
