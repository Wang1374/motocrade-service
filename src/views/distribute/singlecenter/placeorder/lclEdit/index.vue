<template>
  <el-dialog
    title="箱货编辑"
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
        <div v-for="(data, i) in item.lclList" :key="data.id">
          <el-form label-width="80px">
            <el-row>
              <el-col :span="8">
                <el-row>
                  <el-col :span="2">
                    <el-tooltip
                      v-if="i == 0"
                      class="item"
                      effect="dark"
                      content="添加箱货"
                      placement="left"
                    >
                      <el-button
                        type="text"
                        icon="el-icon-circle-plus"
                        @click="addData(data.door, index)"
                      />
                    </el-tooltip>
                    <el-tooltip v-else class="item" effect="dark" content="删除箱货" placement="left">
                      <el-button
                        type="text"
                        icon="el-icon-remove"
                        style="color: #f56c6c"
                        @click="delData(i, item.lclList)"
                      />
                    </el-tooltip>
                  </el-col>
                  <el-col :span="22">
                    <el-form-item label="门点简称" :rules="[{ required: true }]">
                      <el-select
                        ref="doorsSelect"
                        size="mini"
                        v-model="data.door"
                        @change="doorChange(data.door, index, i)"
                        placeholder="请选择"
                        @visible-change="
                          (v) =>
                            visibleChange(
                              v,
                              'doorsSelect',
                              i,
                              addDoorsClick,
                              '添加门点'
                            )
                        "
                      >
                        <el-option
                          v-for="item in doorsOptions"
                          :key="item.id"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="8">
                <el-form-item label="门点地址">
                  <el-input v-model="data.address" size="mini" placeholder="请输入门点地址" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="备注">
                  <el-input v-model="data.remark" size="mini" maxlength="50" placeholder="请输入门店备注" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

          <el-row>
            <el-col :offset="1" :span="23">
              <vxe-table
                border
                keep-source
                show-overflow
                size="mini"
                ref="xhTable"
                align="center"
                class="my-xtable-element"
                :data="data.hairBodyList"
                :edit-config="{ trigger: 'click', mode: 'row' }"
              >
                <vxe-table-column
                  field="blNo"
                  title="提单号"
                  min-width="200"
                  :edit-render="{ name: 'ElSelect' }"
                >
                  <template v-slot:edit="scope">
                    <el-select
                      v-model="scope.row.blNo"
                      size="mini"
                      clearable
                      no-data-text="无匹配数据"
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in blNoOptions"
                        :key="item.blNo"
                        :label="item.blNo"
                        :value="item.blNo"
                      ></el-option>
                    </el-select>
                  </template>
                </vxe-table-column>
                <vxe-table-column field="total" title="件数(PKG)" width="110" :edit-render="{}">
                  <template v-slot:edit="scope">
                    <el-input
                      v-model="scope.row.total"
                      size="mini"
                      onkeyup="this.value = this.value.replace(/\D/g, '');"
                    ></el-input>
                  </template>
                </vxe-table-column>
                <vxe-table-column field="grossWeight" title="毛重(KG)" width="110" :edit-render="{}">
                  <template v-slot:edit="scope">
                    <el-input
                      v-model="scope.row.grossWeight"
                      size="mini"
                      onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"
                    ></el-input>
                  </template>
                </vxe-table-column>
                <vxe-table-column field="cbm" title="体积(CBM)" min-width="110" :edit-render="{}">
                  <template v-slot:edit="scope">
                    <el-input
                      size="mini"
                      v-model="scope.row.cbm"
                      onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"
                    ></el-input>
                  </template>
                </vxe-table-column>
                <vxe-table-column
                  field="productName"
                  title="品名"
                  :edit-render="{ name: 'input' }"
                  width="95"
                >
                  <template v-slot:edit="scope">
                    <el-input v-model="scope.row.productName" size="mini"></el-input>
                  </template>
                </vxe-table-column>
                <vxe-table-column title="操作" width="115">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="text"
                      v-if="scope.rowIndex == data.hairBodyList.length - 1"
                      @click="addRow(scope.row, index, i)"
                    >新增</el-button>
                    <el-button
                      size="mini"
                      type="text"
                      style="color: #f56c6c"
                      v-if="data.hairBodyList.length > 1"
                      @click="deleteRow(scope.rowIndex, data.hairBodyList)"
                    >删除</el-button>
                  </template>
                </vxe-table-column>
              </vxe-table>
            </el-col>
          </el-row>
          <el-divider></el-divider>
        </div>
        <el-row>
          <el-input v-model="item.bmRemarks" type="textarea" size="mini" placeholder="请输入做箱要求..."></el-input>
        </el-row>
      </el-tab-pane>
    </el-tabs>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitLcl">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>

    <!-- 添加门点 -->
    <!-- 添加门点 -->
    <add-door :visibleDoor.sync="visibleDoor" @door-success="onDoorSuccess"></add-door>
  </el-dialog>
</template>
<script>
import { selectBottomAction } from '@/utils/mixins.js';
import { validatenull } from '@/utils/validate';
import { getAllDoors } from '@/api/distribute/clientdoors';
import AddDoor from '../adddoor/index';
import { getCorporateIdentify } from '@/utils/util';
export default {
  name: 'LclEdit',
  mixins: [selectBottomAction],
  components: {
    'add-door': AddDoor
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    tabsData: {
      type: Array,
      default: []
    },

    childBlNoList: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      lclTabsValue: '0',
      newvb: false,
      lclTabs: [],
      // 门点数据
      doorsOptions: [],
      // 提单号数据
      blNoOptions: [],
      //添加门点框
      visibleDoor: false
    };
  },
  created() {
    this.getDoorsList();
    // 赋值给自己的 list ，保存时 传给父组件，取消不需要传
    const loading = this.$loading({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
    setTimeout(() => {
      this.lclTabs = JSON.parse(JSON.stringify(this.tabsData));
      for (var i = 0, len1 = this.lclTabs.length; i < len1; i++) {
        if (this.lclTabs[i].lclList.length == 0) {
          this.lclTabs[i].lclList.push({
            door: '',
            address: '',
            remark: '',
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
    }, 100);
  },
  mounted() {
    if (this.childBlNoList.length > 0) {
      this.blNoOptions = this.childBlNoList;
    }
  },
  methods: {
    //查询所有的门点
    getDoorsList() {
      var param = {
        belongCompaniesId: getCorporateIdentify()
      };
      getAllDoors(param).then((res) => {
        this.doorsOptions = res.data;
      });
    },
    // 取消按钮
    cancel() {
      this.$emit('update:visible', false);
    },
    // 添加门点与数据
    addData(door, index) {
      if (door == '') {
        this.$message({
          message: '门点简称不能为空',
          type: 'warning'
        });
      } else {
        this.lclTabs[index].lclList.push({
          door: '',
          address: '',
          remark: '',
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
    },
    // 删除表单
    delData(index, data) {
      data.splice(index, 1);
    },
    // 添加行
    addRow(row, index, i) {
      this.lclTabs[index].lclList[i].hairBodyList.push({
        blNo: '',
        total: 0,
        grossWeight: 0,
        cbm: 0
      });
    },
    // 删除行
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    // 门点选择事件
    doorChange(val, index, i) {
      let obj = {};
      obj = this.doorsOptions.find((item) => {
        return item.value === val;
      });
      if (obj !== null) {
        this.lclTabs[index].lclList[i].contacts = obj.contacts;
        this.lclTabs[index].lclList[i].contactNumber = obj.contactNumber;
        this.lclTabs[index].lclList[i].address = obj.address;
        this.lclTabs[index].lclList[i].remark = obj.remark;
      }
    },
    // 添加门点
    addDoorsClick() {
      if (this.childCustomerId == '') {
        this.$message({
          message: "客服信息中 '客户名称' 为空",
          type: 'warning'
        });
      } else {
        this.visibleDoor = true;
      }
    },
    //添加门点成功回调
    onDoorSuccess(res) {
      var obj = {
        door: res.doorAs,
        address: res.address,
        contacts: res.contacts,
        contactNumber: res.contactNumber,
        value: res.doorAs,
        label: res.doorAs
      };
      this.doorsOptions.push(obj);
    },
    // // 添加承运公司 成功回调
    // onDoorsSuccess(res) {
    //   let arry = {
    //     value: res.doorAs,
    //     label: res.doorAs,
    //     customerId: res.customerId,
    //     address: res.address,
    //   };
    //   this.doorsOptions.push(arry);
    // },
    // 保存
    submitLcl: function () {
      // 遍历箱号
      var state = true;
      for (var i = 0, len1 = this.lclTabs.length; i < len1; i++) {
        var door = '';
        var address = '';
        var contacts = '';
        var contactNumber = '';
        var remark = '';
        var blNoStr = '';
        var total = 0;
        var grossWeight = 0;
        var cbm = 0;
        // 遍历表单
        let lclList = this.lclTabs[i].lclList;
        for (var j = 0, len2 = lclList.length; j < len2; j++) {
          if (validatenull(lclList[j].door)) {
            // this.$message({
            //   message:
            //     '箱号：' + this.lclTabs[i].caseNumber + ' 的门点简称不能为空',
            //   type: 'warning'
            // });
            state = true;
            //return false;
          } else {
            door += lclList[j].door + '/';
            address += lclList[j].address + '/';
            if (!validatenull(lclList[j].contacts)) {
              contacts += lclList[j].contacts + '/';
            }
            if (!validatenull(lclList[j].contactNumber)) {
              contactNumber += lclList[j].contactNumber + '/';
            }
            if (!validatenull(lclList[j].remark)) {
              remark += lclList[j].remark + '/';
            }
            // 遍历表格
            let hairBodyList = lclList[j].hairBodyList;
            for (var k = 0, len3 = hairBodyList.length; k < len3; k++) {
              blNoStr += hairBodyList[k].blNo + ',';
              if (!isNaN(hairBodyList[k].total)) {
                total += Number(hairBodyList[k].total);
              }
              if (!isNaN(hairBodyList[k].grossWeight)) {
                grossWeight += Number(hairBodyList[k].grossWeight);
              }
              if (!isNaN(hairBodyList[k].cbm)) {
                cbm += Number(hairBodyList[k].cbm);
              }
            }
          }
        }
        this.lclTabs[i].door = door.substring(0, door.lastIndexOf('/'));
        this.lclTabs[i].address = address.substring(
          0,
          address.lastIndexOf('/')
        );
        this.lclTabs[i].contacts = contacts.substring(
          0,
          contacts.lastIndexOf('/')
        );
        this.lclTabs[i].contactNumber = contactNumber.substring(
          0,
          contactNumber.lastIndexOf('/')
        );
        this.lclTabs[i].remark = remark.substring(0, remark.lastIndexOf('/'));
        this.lclTabs[i].blNoStr = blNoStr.substring(
          0,
          blNoStr.lastIndexOf(',')
        );
        this.lclTabs[i].total = total;
        this.lclTabs[i].grossWeight = grossWeight.toFixed(5);
        this.lclTabs[i].cbm = cbm.toFixed(3);
      }
      if (state) {
        this.$emit('typeChanged', this.lclTabs);
        this.$emit('update:visible', false);
      }
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
