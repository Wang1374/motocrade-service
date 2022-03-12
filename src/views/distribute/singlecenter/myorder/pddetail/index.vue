<template>
  <el-dialog
    title="接单详情"
    width="70%"
    ref="dialog1"
    :visible.sync="pdVisible"
    :close-on-click-modal="false"
    :before-close="cancel"
    v-dialogDrag
    append-to-body
  >
    <el-row :gutter="20">
      <el-row style="padding-left: 15px; padding-bottom: 15px">
        <el-col :span="6">
          <span style="font-weight: bold">下单编号：</span>
          {{ temp.placeOrderNumber }}
        </el-col>
        <el-col :span="6">
          <span style="font-weight: bold">业务编号：</span>
          {{ temp.customerNum0 }}
        </el-col>
        <el-col :span="4">
          <span style="font-weight: bold">订单状态：</span>
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
        <el-col :span="4">
          <span style="font-weight: bold">业务类型：</span>
          {{ temp.orderType | orderTypeFiter }}
        </el-col>
        <el-col :span="4">
          <span style="font-weight: bold">停靠码头：</span>
          {{ temp.dock0 }}
        </el-col>
      </el-row>
      <el-row style="padding-left: 15px; padding-bottom: 15px">
        <el-col :span="6">
          <span style="font-weight: bold">船名：</span>
          {{ shipsName }}
        </el-col>
        <el-col :span="6">
          <span style="font-weight: bold">航次：</span>
          {{ voyage }}
        </el-col>
        <el-col :span="4">
          <span style="font-weight: bold">启运港：</span>
          {{ temp.portOfLoading0 }}
        </el-col>
        <el-col :span="4">
          <span style="font-weight: bold">中转港：</span>
          {{ temp.portOfDischarge0 }}
        </el-col>
        <el-col :span="4">
          <span style="font-weight: bold">目的港：</span>
          {{ temp.placeOfDelivery0 }}
        </el-col>
      </el-row>

      <el-row style="padding-left: 15px; padding-bottom: 15px">
        <el-col :span="24">
          <span style="font-weight: bold">做箱备注:</span>
          {{ temp.remark }}
        </el-col>
      </el-row>

      <el-row style="padding-left: 15px; padding-bottom: 15px">
        <div v-if="temp.blNos0 !== null">
          <el-col :span="6" v-for="(item, index) in temp.blNos0.split(',')" :key="index">
            <span style="font-weight: bold">提单号{{ index + 1 }}：</span>
            {{ item }}
          </el-col>
        </div>
        <div v-else>
          <el-col :span="6">
            <span style="font-weight: bold">提单号1：</span>
          </el-col>
        </div>
      </el-row>

      <el-row style="padding-left: 15px; padding-bottom: 15px">
        <el-table
          :data="mcData"
          v-loading="loadingList"
          highlight-current-row
          border
          style="width: 100%"
        >
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column
            prop="planPackingTime"
            label="预计做箱时间"
            width="160"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{ formatDate(scope.row.planPackingTime, "yyyy-MM-dd hh:mm") }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="boxPile" label="箱型" width="80" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="blNoStr" label="提单号" width="150" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="total" label="总件数" width="70" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="grossWeight" label="总毛重" width="80" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="cbm" label="总体积" width="70" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="productName" label="品名" width="70" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="door" label="门店简称" width="100" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="address" label="门店地址" width="100" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="contacts" label="联系人" width="100" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column
            prop="contactNumber"
            label="联系电话"
            width="110"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column prop="remark" label="门店备注" width="100" :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="bmRemarks" label="做箱要求" width="100" :show-overflow-tooltip="true"></el-table-column>
        </el-table>
      </el-row>

      <el-row style="padding-left: 15px">
        <span style="font-weight: bold">附件：</span>
        <el-upload
          class="upload-detail"
          ref="upload"
          action="/api/user/v1/attachment/upload"
          accept=".doc, .docx, .xls, .xlsx, .ppt, .pptx, .pdf, .zip, .rar, .jpg, .png"
          disabled
          :limit="1"
          :file-list="appendixArray"
          :on-preview="handlePictureCardPreview"
        ></el-upload>
      </el-row>
    </el-row>

    <!-- 图片查看 -->
    <el-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="[url]" />
  </el-dialog>
</template>
<script>
import ElImageViewer from 'element-ui/packages/image/src/image-viewer';
import { getMakingChestCenterList } from '@/api/distribute/makingChestCenter';
import { validatenull } from '@/utils/ruoyi';
import '@/api/basic/drag.js';
export default {
  name: 'Pddetail',
  components: {
    ElImageViewer
  },
  props: {
    temp: {
      type: Object,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
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
    }
  },
  data() {
    return {
      // 弹出层
      pdVisible: false,
      // 表格加载等待
      loadingList: false,
      shipsName: '',
      voyage: '',
      // 做箱表格数据
      mcData: [],
      // 文件显示数组
      appendixArray: [],
      //显示图片查看器
      showViewer: false,
      url: ''
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
    if (this.temp.appendixUrl != null) {
      this.appendixArray.push({
        name: this.temp.appendixName,
        url: this.temp.appendixUrl
      });
    }
    // 通过下单id 去查询做箱计划
    this.getMccList();
    this.pdVisible = true;
  },
  methods: {
    /** 查询做箱信息列表 */
    getMccList() {
      if (this.temp.id !== '') {
        this.loadingList = true;
        getMakingChestCenterList(this.temp.id).then((response) => {
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
    // 取消按钮
    cancel() {
      this.$emit('update:visible', false);
    },
    // 预览图片时调用
    handlePictureCardPreview(file) {
      if (file.hasOwnProperty('url')) {
        //判断后缀名
        var index = file.url.lastIndexOf('.');
        var suffix = file.url.substring(index + 1);
        if (suffix == 'jpg' || suffix == 'png') {
          this.url = file.url;
          this.showViewer = true;
        } else {
          var newBlank = window.open('_blank');
          newBlank.location.href = file.url;
        }
      } else {
        //判断后缀名
        var index = file.response.data.previewUrl.lastIndexOf('.');
        var suffix = file.response.data.previewUrl.substring(index + 1);
        if (suffix == 'jpg' || suffix == 'png') {
          this.url = file.response.data.previewUrl;
          this.showViewer = true;
        } else {
          var newBlank = window.open('_blank');
          newBlank.location.href = file.response.data.previewUrl;
        }
      }
    },
    // 关闭图片浏览
    closeViewer() {
      this.showViewer = false;
    }
  }
};
</script>
<style scoped>
.upload-detail {
  display: initial;
}
</style>
<style>
.el-image-viewer__close {
  color: red;
}
.el-tooltip__popper {
  max-width: 400px;
}
.el-dialog__body {
  padding-bottom: 20px;
}
</style>

