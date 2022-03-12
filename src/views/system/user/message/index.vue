<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="info" icon="el-icon-message" size="mini" @click="setAlreadyRead">标为已读</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-document-checked"
          size="mini"
          @click="setAllRead"
        >全部已读</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteMessage">删除</el-button>
      </el-col>
    </el-row>

    <el-table
      ref="multipleTable"
      :data="messageList"
      tooltip-effect="dark"
      style="width: 100%"
      highlight-current-row
      @row-click="checkRowInfo"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="60" align="center"></el-table-column>
      <el-table-column width="60">
        <template slot-scope="scope">
          <span v-if="scope.row.readStatus==1" class="iconfont icon-yidu"></span>
          <span v-else class="iconfont icon-weidu" style="color: orange"></span>
        </template>
      </el-table-column>

      <el-table-column label="发件人" width="120" prop="sendUser" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column label="主题" prop="messageTitle" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column
        label="日期"
        prop="createDate"
        width="150"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>
            {{
            formatDate(scope.row.createDate, "yyyy-MM-dd hh:mm")
            }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getMessage"
    />
    <!-- 消息弹框 -->
    <el-dialog title="消息" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <h4>订单信息:</h4>
      <span>{{currentInfo.messageContext}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sumitBtn">查 看</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { validatenull } from '@/utils/ruoyi';
import {
  getUserMessage,
  updateStatusByIds,
  updateAllRead,
  deleteMessageByIds,
  getMessageNotRead
} from '@/api/system/message';
import { getCorporateIdentify } from '@/utils/util';
import { getDataByOrderNumber } from '@/api/oms/businessOrder';
import store from '@/store';
import { mapState } from 'vuex';
export default {
  name: 'Message',
  data() {
    return {
      //消息列表
      messageList: [],
      //dialog弹框
      dialogVisible: false,
      //当前行信息
      currentInfo: {},
      //选中行信息
      messageIds: '',
      queryParams: {
        pageName: 1,
        pageSize: 10,
        corporateIdentify: '',
        sort: 'create_date',
        order: 'desc',
        corporateIdentify: getCorporateIdentify()
      },
      total: 0
    };
  },
  created() {
    this.getMessage();
  },
  computed: {
    ...mapState({
      company: (state) => state.constant.company
    })
  },
  methods: {
    //查询消息未读数量
    getNotRead() {
      var belongCompaniesId = getCorporateIdentify();
      getMessageNotRead(belongCompaniesId).then((response) => {
        store.dispatch('setMessageNumber', response.data.data).then(() => {});
      });
    },
    //获取消息列表
    getMessage() {
      getUserMessage(this.queryParams).then((response) => {
        if (response.status === 200) {
          this.messageList = response.data.list;
          this.total = response.data.total;
          this.getNotRead();
        }
      });
    },
    //单击查看
    checkRowInfo(row) {
      this.dialogVisible = true;
      this.currentInfo = JSON.parse(JSON.stringify(row));
    },
    //确定按钮
    sumitBtn() {
      //根据订单号查询数据
      if (this.company.accountType === 1) {
        getDataByOrderNumber(this.currentInfo.numberParams).then((response) => {
          if (!validatenull(response.data.data)) {
            this.$router.push({
              name: this.currentInfo.routerAddress,
              params: {
                dataInfo: response.data.data,
                numberParams: this.currentInfo.numberParams,
                currentRouter: '/user/message'
              }
            });

            var params = {
              messageIds: this.currentInfo.id
            };
            updateStatusByIds(params).then((response) => {
              this.getMessage();
            });
          } else {
            this.msgSuccess('订单不存在');
          }
          // this.updateDate(response.data, -1);
          this.dialogVisible = false;
        });
      } else if (
        this.company.accountType === 0 ||
        this.company.accountType === 2
      ) {
        this.$router.push({
          name: this.currentInfo.routerAddress,
          params: {
            numberParams: this.currentInfo.numberParams,
            currentRouter: '/user/message'
          }
        });

        var params = {
          messageIds: this.currentInfo.id
        };
        updateStatusByIds(params).then((response) => {
          this.getMessage();
        });
        this.dialogVisible = false;
      }
    },
    //关闭
    handleClose() {
      this.dialogVisible = false;
    },
    //多选
    handleSelectionChange(val) {
      this.messageIds = val
        .map((item) => {
          return item.id;
        })
        .join(',');
    },
    //标为已读
    setAlreadyRead() {
      if (!validatenull(this.messageIds)) {
        var params = {
          messageIds: this.messageIds
        };
        updateStatusByIds(params).then((response) => {
          if (response.data.code === 200) {
            this.msgSuccess('标记成功');
            this.getMessage();
            this.getNotRead();
          }
        });
      }
    },
    //标记为全部已读
    setAllRead() {
      var belongCompaniesId = getCorporateIdentify();
      updateAllRead(belongCompaniesId).then((response) => {
        if (response.data.code === 200) {
          this.msgSuccess('标记成功');
          this.getMessage();
          this.getNotRead();
        }
      });
    },
    //删除消息
    deleteMessage() {
      if (!validatenull(this.messageIds)) {
        var params = {
          messageIds: this.messageIds
        };
        this.$confirm('是否要删除数据', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(function () {
            return deleteMessageByIds(params);
          })
          .then(() => {
            this.getMessage();
            this.msgSuccess('删除成功');
            this.getNotRead();
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
      }
    }
  }
};
</script>
<style scoped>
.el-table__body tr:hover > td {
  background-color: #877213 !important;
}
</style>
