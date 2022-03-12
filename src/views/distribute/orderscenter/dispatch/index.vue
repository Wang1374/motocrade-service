<template>
  <div class="app-container" ref="sendout">
    <div v-if="!showDispatch" :key="1">
      <el-form class="demo-form-inline" :model="queryParams" :inline="true" @submit.native.prevent>
        <el-form-item>
          <el-select
            v-model="params.orderStatus"
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
        <el-form-item prop="orderType">
          <el-select
            v-model="params.orderType"
            size="small"
            placeholder="业务类型"
            @change="handleQuery"
          >
            <el-option
              v-for="item in orderTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item prop="blNos" class="MytoUpper">
          <el-input
            v-model.trim="params.blNos"
            placeholder="提单号"
            @keyup.enter.native="handleQuery"
            clearable
            size="small"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item prop="orderNumber" class="MytoUpper">
          <el-input
            v-model.trim="params.orderNumber"
            placeholder="业务编号"
            @keyup.enter.native="handleQuery"
            clearable
            size="small"
            style="width: 200px"
          ></el-input> 
        </el-form-item>
        <el-form-item  prop="packingTime">
        <el-date-picker
          v-model="params.dueDate"
          style="width: 100%;"
          type="daterange"
           size="small"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </el-form-item>
        <el-form-item>
          <el-button @click="handleQuery" type="primary" size="small" icon="el-icon-search">搜索</el-button>
          <el-button @click="refresh" size="small" icon="el-icon-refresh">刷新</el-button>
          <el-button
                type="primary"
                icon="el-icon-s-grid"
                size="small"
                plain
                @click="editTableHeader" 
              >自定义表头</el-button>
        </el-form-item>
      </el-form>

      <div class="scopell">
        <el-table
              v-loading="loading"
              :data="orderData"
              border
              highlight-current-row
              :row-class-name="tableRowClassName"
            >
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
              <el-table-column
                v-for="item in tableHeaderList"
                :key="item.id"
                :label="item.rowName"
                :prop="item.rowField"
                align="center"
                :width="item.width"
                :show-overflow-tooltip="true"
              >
              <template slot-scope="scope">
                 <span
                    v-if="item.rowField === 'orderType'"
                  >
                    {{
                    scope.row.orderType | orderTypeFiter
                    }}
                  </span>
                  <span
                    v-else-if="item.rowField === 'vesselAndVoyage'"
                  >
                    {{
                    scope.row.vesselAndVoyage | vesselAndVoyageFiter
                    }}
                  </span>
                  <span
                    v-else-if="item.rowField === 'shippingDay'"
                  >
                    {{ formatDate(scope.row.shippingDay, "yyyy-MM-dd hh:mm") }}
                  </span>
                  <span
                    v-else-if="item.rowField === 'putTheBoxTime'"
                  >
                    {{ formatDate(scope.row.putTheBoxTime, "yyyy-MM-dd hh:mm") }}
                  </span>
                  <span
                    v-else-if="item.rowField === 'openingDate'"
                  >
                    {{ formatDate(scope.row.openingDate, "yyyy-MM-dd hh:mm") }}
                  </span>
                  <span
                    v-else-if="item.rowField === 'dueDate'"
                  >
                    {{ formatDate(scope.row.dueDate, "yyyy-MM-dd hh:mm") }}
                  </span>
                   <span
                    v-else-if="item.rowField === 'singleTime'"
                  >
                    {{ formatDate(scope.row.singleTime, "yyyy-MM-dd hh:mm") }}
                  </span>
                  <span
                    v-else-if="item.rowField === 'orderTime'"
                  >
                    {{ formatDate(scope.row.orderTime, "yyyy-MM-dd hh:mm") }}
                  </span>
                  <span v-else-if="item.rowField === 'orderStatus'"
                       :style="{
                        color:
                          scope.row.orderStatus == 0
                              ? 'red'
                              : scope.row.orderStatus == 2
                              ? 'green'
                            : 'orange',
                    }">
                  {{ scope.row.orderStatus | osFilter }}
                  <span v-if="scope.row.orderStatus == 0" style="color: black">( {{ scope.row.reason }})</span>
                  </span>
                  <span v-else>{{ scope.row[item.rowField] }}</span>
              </template>
              </el-table-column>
            <el-table-column
            label="操作"
            align="center"
            fixed="right"
            width="80"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="small"
                type="text"
                icon="el-icon-document-checked"
                @click="dispatchOrder(scope.row,scope.$index)"
              >派单</el-button>
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

    <!-- 派单弹出层 -->
    <div v-if="showDispatch" :key="2">
      <el-page-header v-show="showDlg" @back="goBack" content="派单"></el-page-header>
      <pddetail
        ref="pddetailChild"
        :temp="orderInfo"
        v-on:typeChanged="typeChanged"
        v-on:showChanged="showChanged"
      ></pddetail>
    </div>

    <!-- 弹框 -->
        <op-ration
          :isShow.sync="isShow"
          @getTableHeaderLoading="getTableHeaderLoading"
          @getTableHeader="getTableHeader"
          v-if="isShow"
          :isRow3="isRow2"
          :headerList="tableHeader"
          :userId="userId"
        ></op-ration>
  </div>
</template>
<script>
import { getDispatchList } from '@/api/distribute/businessCenter';
import pddetail from './pddetail/index';
import store from '@/store';
import { getCorporateIdentify } from '@/utils/util';
import { removeSessionStorage } from '@/utils/sessionStorage';
import { mapState } from 'vuex';
import { orderHeader } from '@/api/oms/tableHeader';
import Operation from '@/views/tableheader/index.vue';
import { validatenull } from '@/utils/validate';
export default {
  name: 'Dispatch',
  components: {
    pddetail: pddetail,
    'op-ration': Operation,
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
        order: 'desc',
       
      },
      //订单类型
      OrderStatusOperation: [
        {
          value: -1,
          label: '全部订单'
        },
        // {
        //   value: 1,
        //   label: "待接单",
        // },
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
      showDlg: true,
      //当前行信息
      orderInfo: {},
      showDispatch: false,
      //当前行索引
      currentIndex: -1,
      tableHeight: 0,
      // 订单类型
      orderTypeOptions: [
        {
          value: 0,
          label: '所有类型'
        },
        {
          value: 1,
          label: '海运出口'
        },
        {
          value: 2,
          label: '海运进口'
        }
      ],
      scrollTopData: 0,
            //表头数据表id  tableId
      queryHeader: {
        //出口订单表id
        tableId: '8',
        //当前账户id
        userId: '',
         
      },
      params:{
        orderStatus: 3,
        orderType: 1
      },
      isShow: false,
      tableHeader: [],
    };
  },
  created() {
    this.getTableHeader();
    this.getList();
  },
  computed: {
    tableHeaderList: function () {
      return this.tableHeader.filter(function (item) {
        return item.show1;
      });
    },
    ...mapState({
      userInfo: (state) => state.user.userInfo,
    })
  },
  mounted() {
    var that = this;
    that.$goEasy.subscribe({
      channel: getCorporateIdentify(),
      onMessage: function (message) {
        if (message.content == 'updateDoorCache') {
          // 删除缓存，重新拉取并存入缓存
          removeSessionStorage({ name: 'customer' });
          const corporateIdentify = getCorporateIdentify();
          let obj = {
            corporateIdentify: corporateIdentify,
            state: 1
          };
          store.dispatch('GetConstant', obj).then(() => {});
        }
      }
    });
  },
  methods: {
    //自定义表头
    editTableHeader() {
      this.isShow = true;
      this.isRow2 = true;
      this.userId = this.userInfo.id;
    },
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
    setParams(params){
      if(this.params.dueDate!=undefined){
          this.queryParams.beginTime = params.dueDate[0];
          this.queryParams.endTime = params.dueDate[1];
          //delete this.queryParams.dueDate
      }else {
        this.queryParams.beginTime = undefined;
        this.queryParams.endTime = undefined;
      }
      this.queryParams.orderStatus = params.orderStatus;
      this.queryParams.orderType = params.orderType;
      this.queryParams.orderNumber = params.orderNumber;
      this.queryParams.blNos = params.blNos;
    },
    // 查询列表
    getList() {
      this.loading = true;
      this.setParams(this.params)
      //  根据登录账户 查询订单表 与 下单表 （下单编号关联）
      getDispatchList(this.queryParams).then((response) => {
        this.orderData = response.data.list; 
        this.total = response.data.total;
        this.loading = false;
       });

    },
    // 搜索按钮操作
    handleQuery() {
      this.getList();
    },
    // 刷新
    refresh() {
      this.getList();
    },
    // 派单
    dispatchOrder(row, index) {
      this.scrollTopData = document.documentElement.scrollTop;
      this.currentIndex = index;
      // 根据下单编号查询 接单订单，并传入 派单页面
      this.orderInfo = row;
      // this.$router.push({
      //   // name: '/orderscenter/dispatch/Dispatch',
      //   // params: this.orderInfo // sendData是给详情页传的数据信息
      // });
      this.showDispatch = true;
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === this.currentIndex && this.currentIndex > -1) {
        return 'warning-row';
      }
      return '';
    },
    // 返回事件
    goBack() {
      let chlidObj = this.$refs.pddetailChild.form;
      let addData = this.$refs.pddetailChild.$refs.makingChestChild.$refs.zxdTable.getInsertRecords()
        .length;
      let delData = this.$refs.pddetailChild.$refs.makingChestChild.$refs.zxdTable.getRemoveRecords()
        .length;
      let updateData = this.$refs.pddetailChild.$refs.makingChestChild.$refs.zxdTable.getUpdateRecords()
        .length;
      // 此处箱型箱量 在业务信息中 赋值了  ，未保存 所有会提示需要保存后就不存在提示
      if (
        JSON.stringify(this.orderInfo) == JSON.stringify(chlidObj) &&
        addData == 0 &&
        delData == 0 &&
        updateData == 0
      ) {
        this.showDispatch = false;
      } else {
        this.$confirm('订单部分变更尚未保存, 确定要离开吗?', '注意', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.showDispatch = false;
          })
          .catch(() => {});
      }
      this.getList();
    },
    // 成功回调事件
    typeChanged(data) {
      this.orderInfo = JSON.parse(JSON.stringify(data));
    },
    // 页头显示隐藏事件
    showChanged(bl) {
      this.showDlg = bl;
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

.el-table .success-row {
  background: #f0f9eb;
}
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}

/* .el-table {
  position: absolute;
  min-width: 1300px;
  overflow: auto;
} */
</style>
