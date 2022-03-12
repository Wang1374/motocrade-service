<template>
  <el-dialog
    title="代垫发票"
    :visible.sync="invoiceOpenVisible"
    width="500px"
    :close-on-click-modal="false"
    append-to-body
    :before-close="close"
    style="text-align: center"
  >
    <div v-loading="loading" class="demo-image" style="height: 400px; color: red; padding: 10px">
      <el-scrollbar style="height: 100%">
        <div class="block" v-for="item in costUrlList" :key="item.id">
          <div class="itemLeft" style="width: 150px; margin-right: 15px; float: left">
            <div style="text-align: left; margin: auto">
              <p>往来单位：{{ item.btype }}</p>
            </div>
            <div style="text-align: left; margin-top: 5px">项目: {{ item.payItems }}</div>
          </div>
          <div class="flex-demo" style="width: 450px">
            <div v-for="items in item.invoiceUrlList" :key="items" style="word-break: break-all">
              <el-image
                :preview-src-list="item.invoiceUrlList"
                style="width: 100px; height: 100px"
                :src="items"
                :fit="fit"
              ></el-image>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </el-dialog>
</template>
<script>
import { getInvoiceUrl } from '@/api/cost/costMgt';
export default {
  name: 'InvoiceImage',
  props: {
    invoiceOpenVisible: {
      type: Boolean
    },
    mcId: {
      type: String
    },
    vehicle: {
      type: String
    }
  },
  data() {
    return {
      loading: true,
      fit: 'contain',
      //定义图片数组
      urlList: [],
      //图片数据
      costUrlList: []
    };
  },
  created() {
    this.getInvoiceUrlList();
  },
  methods: {
    close() {
      this.$emit('update:invoiceOpenVisible', false);
    },
    //查询代垫发票from  order_cost where caseNumber and orderNumber and orderType
    getInvoiceUrlList() {
      var params = {
        mcId: this.mcId,
        costTypes: 2,
        vehicleCost: this.vehicle
      };
      getInvoiceUrl(params).then((response) => {
        this.costUrlList = response.data;
        for (var i = 0; i < this.costUrlList.length; i++) {
          if (
            this.costUrlList[i].invoiceUrl != null &&
            this.costUrlList[i].invoiceUrl != ''
          ) {
            var imgUrl = this.costUrlList[i].invoiceUrl.split(',');
            this.costUrlList[i]['invoiceUrlList'] = imgUrl;
          }
        }
        this.loading = false;
      });
    }
  }
};
</script>
<style scoped>
body .el-scrollbar__wrap {
  overflow-x: hidden;
}
.imgDiv {
  display: inline-block;
}
.demonstration {
  margin-bottom: 10px;
}
.block {
  display: flex;
  border: 1px solid black;
}
.itemLeft {
  width: 150px;
  text-align: center;
  border-right: 1px solid black;
  font-size: 12px;
  color: #3e3939;
  font-family: 'PingFangSC-Regular', sans-serif;
}
.flex-demo {
  display: flex;
  flex-wrap: wrap;
  padding-top: 10px;
}
</style>