<template>
  <el-dialog
    title="操作记录"
    :visible.sync="visible"
    width="700px"
    :close-on-click-modal="false"
    :before-close="cancel"
    center
    append-to-body
  >
    <el-table v-loading="loading" :data="orderLogList">
      <el-table-column label="订单编号" align="center" width="160" prop="orderNumberLog" />
      <el-table-column label="操作者" align="center" width="150" prop="creator" />
      <el-table-column
        label="操作时间"
        align="center"
        width="160"
        prop="createDate"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作行为" align="center" width="180" prop="title" />
    </el-table>
  </el-dialog>
</template>
<script>
import { getOrderLog } from "@/api/system/log";

export default {
  name: "OperatingRecord",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    orderNumber: {
      type: String,
      default: ""
    }
  },
  created() {
    this.getList();
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 操作记录表格数据
      orderLogList: []
    };
  },
  methods: {
    getList() {
      getOrderLog(this.orderNumber).then(response => {
        this.orderLogList = response.data;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.$emit("update:visible", false);
    }
  }
};
</script>
