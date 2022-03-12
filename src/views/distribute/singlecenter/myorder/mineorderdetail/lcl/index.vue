<template>
  <el-dialog
    title="箱货信息"
    width="55%"
    ref="dialog"
    :visible.sync="newvb"
    :close-on-click-modal="false"
    :before-close="cancel"
    center
    append-to-body
  >
    <el-tabs type="border-card" v-model="lclTabsValue">
      <el-tab-pane
        v-for="(item, index) in lclTabs"
        :key="item.id"
        :label="item.boxPile + '/' + item.caseNumber"
        :name="index.toString()"
      >
        <div v-for="data in item.lclList" :key="data.id">
          <el-form label-width="80px">
            <el-row>
              <el-col :span="8">
                <el-form-item label="门点简称:">
                  <el-input v-model="data.door" readonly size="mini" placeholder="请输入门点地址" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="门点地址:">
                  <el-input v-model="data.address" readonly size="mini" placeholder="请输入门点地址" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="备注:">
                  <el-input v-model="data.remark" readonly size="mini" maxlength="50" placeholder="请输入门店备注" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

          <el-row>
            <el-col :span="24">
              <el-table :data="data.hairBodyList" highlight-current-row border style="width: 100%">
                <el-table-column
                  prop="blNo"
                  label="提单号"
                  min-width="200"
                  align="center"
                  :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column
                  prop="total"
                  label="件数(PKG)"
                  min-width="110"
                  align="center"
                  :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column
                  prop="grossWeight"
                  label="毛重(KG)"
                  min-width="110"
                  align="center"
                  :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column
                  prop="cbm"
                  label="体积(CBM)"
                  min-width="110"
                  align="center"
                  :show-overflow-tooltip="true"
                ></el-table-column>
                <el-table-column
                  prop="productName"
                  label="品名"
                  min-width="95"
                  align="center"
                  :show-overflow-tooltip="true"
                ></el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <el-divider></el-divider>
        </div>
        <el-row>
          <el-input v-model="item.bmRemarks" type="textarea" readonly size="mini" placeholder="请输入做箱要求..."></el-input>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script>
export default {
  name: "Lcl",
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    tabsData: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      lclTabsValue: "0",
      newvb: false,
      lclTabs: []
    };
  },
  created() {
    // 赋值给自己的 list ，保存时 传给父组件，取消不需要传
    const loading = this.$loading({
      lock: true,
      text: "Loading",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)"
    });
    setTimeout(() => {
      this.lclTabs = JSON.parse(JSON.stringify(this.tabsData));
      for (var i = 0, len1 = this.lclTabs.length; i < len1; i++) {
        if (this.lclTabs[i].lclList.length == 0) {
          this.lclTabs[i].lclList.push({
            door: "",
            address: "",
            remark: "",
            hairBodyList: [
              {
                blNo: '',
                total: 0,
                grossWeight: 0,
                cbm: 0
              }
            ]
          });
        }
      }
      loading.close();
      this.newvb = true;
    }, 200);
  },
  methods: {
    // 取消按钮
    cancel() {
      this.$emit("update:visible", false);
    }
  }
};
</script>
<style>
.el-dialog--center .el-dialog__body {
  padding-bottom: 0px;
  padding-top: 0px;
}
.el-tabs--border-card {
  box-shadow: none;
}
.el-tabs--border-card > .el-tabs__content {
  padding: 15px 8px;
}
.vxe-table--valid-error {
  z-index: 9997;
}
</style>
