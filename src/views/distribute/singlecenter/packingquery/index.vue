<template>
  <div class="app-container">
    <el-form class="demo-form-inline" :model="queryParams" :inline="true" @submit.native.prevent>
      <el-form-item>
        <el-input
          v-model="queryParams.blNos"
          placeholder="提单号"
          clearable
          size="small"
          style="width: 200px"
          @keyup.enter.native="handleQuery"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery" type="primary" size="small" icon="el-icon-search">搜索</el-button>
        <el-popover width="380" popper-class="myPopover" v-model="searchVisible">
          <!-- 高级搜索 -->
          <box-search :searchVisible.sync="searchVisible" @search-success="onSearchSuccess"></box-search>
          <el-button type="primary" icon="el-icon-search" size="small" plain slot="reference">高级搜索</el-button>
        </el-popover>
      </el-form-item>
    </el-form>

    <el-table
      border
      highlight-current-row
      :data="boxList"
      v-loading="loading"
      :span-method="objectSpanMethod"
      style="width: 100%"
    >
      <el-table-column
        prop="placeOrderNumber"
        label="下单编号"
        align="center"
        width="155"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="orderType"
        label="业务类型"
        align="center"
        width="80"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.orderType | orderTypeFiter }}
          <span></span>
        </template>
      </el-table-column>
      <el-table-column prop="blNoStr" label="提单号" align="center" width="130" show-overflow-tooltip></el-table-column>
      <el-table-column prop="boxPile" label="箱型" align="center" width="70" show-overflow-tooltip></el-table-column>
      <el-table-column
        prop="caseNumber"
        label="箱号"
        align="center"
        width="160"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="sealNumber"
        label="封号"
        align="center"
        width="120"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="makingStatus"
        label="做箱状态"
        align="center"
        width="180"
        show-overflow-tooltip
      >
        <template v-slot="{ row }">
          <span :style="{ color: row.makingStatus == 0 ? 'red' : '' }">
            {{ row.makingStatus | makingStatusFilet }}
            <span
              v-if="row.makingStatus==0"
              style="color: black"
            >({{ row.makingReason }})</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="door" label="门点简称" align="center" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="address" label="门点地址" align="center" width="120" show-overflow-tooltip></el-table-column>
      <el-table-column prop="dock" label="停靠码头" align="center" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column
        prop="vesselAndVoyage"
        label="船名航次"
        align="center"
        width="130"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{ scope.row.vesselAndVoyage | vesselAndVoyageFiter }}
          <span></span>
        </template>
      </el-table-column>
      <el-table-column
        prop="operator"
        label="接单人员"
        align="center"
        width="120"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="openingDate" label="开港日期" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column
        prop="customerNum"
        label="客户编号"
        align="center"
        width="170"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="packingTime"
        label="实际做箱时间"
        align="center"
        width="140"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>
            {{
            formatDate(scope.row.packingTime, "yyyy-MM-dd hh:mm")
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="planPackingTime"
        label="预计做箱时间"
        align="center"
        width="140"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>
            {{
            formatDate(scope.row.planPackingTime, "yyyy-MM-dd hh:mm")
            }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="箱信息" align="center" width="140" fixed="right">
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

    <!-- 装箱单 -->
    <packing-list
      ref
      v-if="packingListVisible"
      :visible.sync="packingListVisible"
      :packingList="packingList"
    ></packing-list>
    <!-- 箱货照片 -->
    <box-picture v-if="boxPictureVisible" :visible.sync="boxPictureVisible" :boxRow="boxRow"></box-picture>
  </div>
</template>
<script>
import { parseTime } from '@/utils/ruoyi';
import { getCorporateIdentify } from '@/utils/util';
import { clientlistBoxMaking } from '@/api/boxMaking/makeBox';
import BoxAdvancedSearch from '../boxacvancedsearch/index';
import PackingList from './packingList/index';
import { getLclList } from '@/api/oms/makingChest';
import BoxPicture from './boxpicture/index';
export default {
  name: 'PackingQuery',
  components: {
    'box-search': BoxAdvancedSearch,
    'packing-list': PackingList,
    'box-picture': BoxPicture
  },
  created() {
    this.getList();
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      //做箱列表
      boxList: [],
      //查询参数
      queryParams: {
        pageName: 1,
        pageSize: 10,
        orderType: 0,
        corporateIdentify: getCorporateIdentify(),
        sort: 'create_date',
        order: 'desc'
      },
      total: 0,
      //高级搜索
      searchVisible: false,
      spanArr: [],
      //装箱单
      packingList: {},
      packingListVisible: false,
      //箱货照片
      boxPictureVisible: false,
      //箱货照片当前行
      boxRow: {}
    };
  },
  filters: {
    osFilter: function (value) {
      if (value == 1) {
        return '待接单';
      } else if (value == 2) {
        return '已接单';
      } else if (value == 3) {
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
  methods: {
    getList() {
      this.loading = true;
      clientlistBoxMaking(this.queryParams).then((response) => {
        this.boxList = response.data.list;
        this.getRowSpan();
        this.total = response.data.total;
        this.loading = false;
      });
    },
    //搜索
    handleQuery() {
      this.getList();
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // 只合并区域位置
      if (columnIndex === 0) {
        const _row = this.rowSpanArr[rowIndex];
        return {
          rowspan: _row, //行
          colspan: 1 //列
        };
      }
    },
    getRowSpan() {
      this.rowSpanArr = [];
      this.boxList.forEach((item, index) => {
        if (index == 0) {
          this.rowSpanArr.push(1);
          this.position = 0;
        } else {
          if (
            this.boxList[index].placeOrderNumber ==
            this.boxList[index - 1].placeOrderNumber
          ) {
            this.rowSpanArr[this.position] += 1; //项目名称相同，合并到同一个数组中
            this.rowSpanArr.push(0);
            this.boxList[index].placeOrderNumber =
              this.boxList[index - 1].placeOrderNumber;
          } else {
            this.rowSpanArr.push(1);
            this.position = index;
          }
        }
      });
    },
    //高级搜索
    onSearchSuccess(res) {
      this.loading = true;
      var params = {
        pageNum: 1,
        pageSize: 20,
        sort: 'create_date',
        order: 'desc',
        orderType: res.orderType,
        caseNumber: res.caseNumber,
        sealNumber: res.sealNumber,
        beginTime: res.beginTime,
        endTime: res.endTime,
        corporateIdentify: getCorporateIdentify()
      };
      Object.assign(this.queryParams, params);
      this.getList();
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