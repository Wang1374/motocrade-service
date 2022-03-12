<template>
  <el-row>
    <el-col :span="23" class="divider">
      <el-divider direction="vertical" />
      <h4>做箱信息</h4>
    </el-col>
    <el-col :span="22" :offset="1">
      <el-row :gutter="10" class="mb8">
        <!-- <el-col :span="1.5">
          <el-button type="primary" size="mini" @click="submitFormData">保存</el-button>
        </el-col>-->
        <el-col :span="1.5">
          <el-button
            type="primary"
            icon="el-icon-circle-plus"
            :disabled="extras.orderStatus==0"
            size="mini"
            @click="addRow(null)"
            plain
          >箱货信息</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="primary" size="mini" plain @click="lclClick">箱货编辑</el-button>
        </el-col>
      </el-row>

      <vxe-table
        border
        keep-source
        show-overflow
        resizable
        ref="zxdTable"
        align="center"
        class="my-xtable-element"
        highlight-current-row
        :auto-resize="true"
        :loading="loadingList"
        :edit-rules="validRules"
        :data="makingChestList"
        :edit-config="{
          trigger: 'click',
          mode: 'row',
          showStatus: true,
          icon: 'fa fa-pencil-square-o',
        }"
      >
        <vxe-table-column fixed="left" width="70">
          <template slot-scope="scope">
            <div style="height: 20px">
              <el-tooltip
                class="item"
                effect="dark"
                :content="scope.row.ptysState == 0 ? '应收未全' : '应收已全'"
                placement="top-start"
              >
                <span
                  class="cost-left"
                  :style="{
                    color: scope.row.ptysState == 0 ? '#F56C6C' : '#67C23A',
                  }"
                >(收</span>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                :content="scope.row.ysState == 0 ? '应付未全' : '应付已全'"
                placement="top-start"
              >
                <span
                  class="cost-right"
                  :style="{
                    color: scope.row.ysState == 0 ? '#F56C6C' : '#67C23A',
                  }"
                >付)</span>
              </el-tooltip>
            </div>
            <div style="height: 20px; float: left">
              <el-button size="mini" type="text" @click="openCost(scope.row, scope.$rowIndex)">费用录入</el-button>
            </div>
          </template>
        </vxe-table-column>
        <vxe-table-column field="makingStatus" title="做箱状态" width="90">
          <template v-slot="{ row }">
            <span :style="{ color: row.makingStatus == 0 ? 'red' : '#67C23A' }">
              {{
              row.makingStatus | makingStatusFilet
              }}
            </span>
            <span v-if="row.makingStatus == 0" style="color: black">({{ row.makingReason }})</span>
          </template>
        </vxe-table-column>
        <vxe-table-column
          field="boxPile"
          title="箱型"
          width="100"
          :edit-render="{ name: 'ElSelect' }"
        >
          <template v-slot:edit="scope">
            <el-select
              v-model="scope.row.boxPile"
              clearable
              filterable
              :disabled="scope.row.makingStatus == 0"
              @focus="boxPileFocus"
              @change="changeBoxPile"
              no-data-text="无匹配数据"
              placeholder="请选择"
            >
              <el-option
                v-for="item in boxQuantityOptions"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </vxe-table-column>
        <vxe-table-column
          field="companyId"
          title="做箱车队"
          width="150"
          :edit-render="{ name: 'ElSelect' }"
        >
          <template v-slot:edit="scope">
            <el-select
              v-model="scope.row.companyId"
              clearable
              filterable
              :disabled="scope.row.isDispatch == 1 || scope.row.makingStatus == 0"
              @change="companyIdChange(scope.row)"
              no-data-text="无匹配数据"
              placeholder="请选择"
            >
              <el-option
                v-for="item in motorcadeArray"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
          <template v-slot="{ row }">
            {{
            getSelectLabel(row.companyId, motorcadeArray)
            }}
          </template>
        </vxe-table-column>
        <vxe-table-column field="planPackingTime" title="预计做箱时间" width="160" :edit-render="{}">
          <!-- <template v-slot:edit="{ row }">
            <el-date-picker
              :disabled="row.makingStatus == 0"
              v-model="row.packingTime"
              type="datetime"
              format="yyyy-MM-dd HH:mm"
            ></el-date-picker>
          </template>
          <template v-slot="{ row }">{{ formatDate(row.packingTime, "yyyy-MM-dd hh:mm") }}</template>-->
          <template v-slot:edit="{ row }">
            <el-date-picker v-model="row.planPackingTime" type="datetime" format="yyyy-MM-dd HH:mm"></el-date-picker>
          </template>
          <template v-slot="{ row }">{{ formatDate(row.planPackingTime, "yyyy-MM-dd hh:mm") }}</template>
        </vxe-table-column>
        <vxe-table-column field="packingTime" title="实际做箱时间" width="160" :edit-render="{}">
          <template v-slot:edit="{ row }">
            <el-date-picker
              :disabled="row.makingStatus == 0 || company.accountType==0"
              v-model="row.packingTime"
              type="datetime"
              format="yyyy-MM-dd HH:mm"
            ></el-date-picker>
          </template>
          <template v-slot="{ row }">{{ formatDate(row.packingTime, "yyyy-MM-dd hh:mm") }}</template>
          <!-- <template v-slot:edit="{ row }">
            <el-date-picker v-model="row.planPackingTime" type="datetime" format="yyyy-MM-dd HH:mm"></el-date-picker>
          </template>
          <template v-slot="{ row }">{{ formatDate(row.planPackingTime, "yyyy-MM-dd hh:mm") }}</template>-->
        </vxe-table-column>
        <vxe-table-column
          field="blNoStr"
          title="提单号"
          show-overflow="tooltip"
          :edit-render="{ name: 'input' }"
          width="150"
        >
          <template v-slot:edit="{ row }">
            <vxe-input v-model="row.blNoStr" disabled placeholder="在箱货编辑中输入"></vxe-input>
          </template>
        </vxe-table-column>
        <vxe-table-column
          field="caseNumber"
          title="箱号"
          :edit-render="{ name: 'input' }"
          width="150"
        >
          <template v-slot:edit="{ row }">
            <vxe-input
              :min="0"
              v-model.trim="row.caseNumber"
              @blur="toUpper(row)"
              :disabled="row.makingStatus == 0"
            ></vxe-input>
          </template>
        </vxe-table-column>
        <vxe-table-column
          field="sealNumber"
          title="封号"
          :edit-render="{ name: 'input' }"
          width="120"
        >
          <template v-slot:edit="{ row }">
            <vxe-input
              v-model.trim="row.sealNumber"
              @blur="toUpper(row)"
              :disabled="row.makingStatus == 0"
            ></vxe-input>
          </template>
        </vxe-table-column>
        <vxe-table-column
          field="tareWeight"
          title="箱皮重"
          :edit-render="{ name: 'input' }"
          width="100"
        >
          <template v-slot:edit="{ row }">
            <vxe-input v-model.trim="row.tareWeight"></vxe-input>
          </template>
        </vxe-table-column>
        <vxe-table-column field="total" title="总件数" :edit-render="{ name: 'input' }" width="100">
          <template v-slot:edit="{ row }">
            <vxe-input v-model="row.total" disabled></vxe-input>
          </template>
        </vxe-table-column>
        <vxe-table-column
          field="grossWeight"
          title="总毛重"
          :edit-render="{ name: 'input' }"
          width="100"
        >
          <template v-slot:edit="{ row }">
            <vxe-input v-model="row.grossWeight" disabled></vxe-input>
          </template>
        </vxe-table-column>
        <vxe-table-column field="cbm" title="总体积" :edit-render="{ name: 'input' }" width="100">
          <template v-slot:edit="{ row }">
            <vxe-input v-model="row.cbm" disabled></vxe-input>
          </template>
        </vxe-table-column>
        <vxe-table-column
          field="scheduleTime"
          title="排计划"
          width="200"
          v-if="extras.orderType == 2"
          :edit-render="{}"
        >
          <template v-slot:edit="{ row }">
            <el-date-picker
              disabled
              v-model="row.scheduleTime"
              type="datetime"
              format="yyyy-MM-dd HH:mm"
            ></el-date-picker>
          </template>
          <template v-slot="{ row }">{{ formatDate(row.scheduleTime, "yyyy-MM-dd hh:mm") }}</template>
        </vxe-table-column>
        <vxe-table-column
          field="suitcasePoint"
          title="提箱点"
          width="140"
          v-if="extras.orderType == 1"
          :edit-render="{ name: 'input' }"
        >
          <template v-slot:edit="{ row }">
            <vxe-input v-model="row.suitcasePoint" disabled></vxe-input>
          </template>
        </vxe-table-column>
        <vxe-table-column
          field="returnPoint"
          title="还箱点"
          width="140"
          v-if="extras.orderType == 2"
          :edit-render="{ name: 'input' }"
        >
          <template v-slot:edit="{ row }">
            <vxe-input v-model="row.returnPoint" disabled></vxe-input>
          </template>
        </vxe-table-column>
        <vxe-table-column
          field="door"
          title="门点简称"
          show-overflow="tooltip"
          :edit-render="{ name: 'input' }"
          width="150"
        >
          <template v-slot:edit="{ row }">
            <vxe-input v-model="row.door" disabled></vxe-input>
          </template>
        </vxe-table-column>
        <vxe-table-column
          field="typeOfShipping"
          title="运输方式"
          width="100"
          :edit-render="{ name: 'ElSelect' }"
        >
          <template v-slot:edit="scope">
            <el-select v-model="scope.row.typeOfShipping" placeholder="请选择" disabled>
              <el-option
                v-for="item in typeOfShippingOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
          <template v-slot="{ row }">{{ row.typeOfShipping | typeOfShippingFilet }}</template>
        </vxe-table-column>
        <vxe-table-column
          field="carrierCompany"
          title="承运公司"
          width="140"
          :edit-render="{ name: 'input' }"
        >
          <template v-slot:edit="{ row }">
            <vxe-input v-model="row.carrierCompany" disabled></vxe-input>
          </template>
        </vxe-table-column>
        <vxe-table-column field="vehicle" title="车辆" width="140" :edit-render="{ name: 'input' }">
          <template v-slot:edit="{ row }">
            <vxe-input v-model="row.vehicle" disabled></vxe-input>
          </template>
        </vxe-table-column>
        <vxe-table-column field="driver" title="司机" width="140" :edit-render="{ name: 'input' }">
          <template v-slot:edit="{ row }">
            <vxe-input v-model="row.driver" disabled></vxe-input>
          </template>
        </vxe-table-column>
        <vxe-table-column field="phone" title="电话" :edit-render="{ name: 'input' }" width="140">
          <template v-slot:edit="scope">
            <el-input v-model.trim="scope.row.phone" disabled></el-input>
          </template>
        </vxe-table-column>
        <vxe-table-column
          field="bmRemarks"
          title="做箱要求"
          :edit-render="{ name: 'input' }"
          width="140"
        >
          <template v-slot:edit="scope">
            <el-input v-model.trim="scope.row.bmRemarks" disabled></el-input>
          </template>
        </vxe-table-column>
        <vxe-table-column title="操作" fixed="right" width="120">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              :disabled="scope.row.makingStatus == 0"
              @click="cancelRow(scope.row)"
            >取消</el-button>
            <el-button
              size="mini"
              type="text"
              :style="scope.row.isDispatch == 1 ? 'color: #C0C4CC' : (scope.row.makingStatus == 0 ? 'color: #C0C4CC' : 'color: #F56C6C')"
              :disabled="scope.row.isDispatch == 1 || scope.row.makingStatus == 0"
              @click="deleteRow(scope.row)"
            >删除</el-button>
          </template>
        </vxe-table-column>
      </vxe-table>

      <!-- 取消对话框 -->
      <el-dialog
        title="取消做箱"
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
          v-model="makingReason"
          maxlength="100"
          show-word-limit
        ></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitCancel">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 箱货编辑 -->
      <lcl-edit
        ref="lclEdit"
        v-if="lclEditVisible"
        :tabsData="tabsData"
        :childDoorsList="childDoorsList"
        :childBlNoList="childBlNoList"
        :childCustomerId="childCustomerId"
        :visible.sync="lclEditVisible"
        v-on:typeChanged="typeChanged"
      ></lcl-edit>
    </el-col>
  </el-row>
</template>
<script>
import store from '@/store';
import {
  getMakingChestList,
  cudMakingChest,
  updateMakStatusById
} from '@/api/oms/makingChest';
import { getCorporateIdentify } from '@/utils/util';
import LclEdit from '@/views/oms/lclEdit/index.vue';
import { validatenull } from '@/utils/ruoyi';
import { checkPermi } from '@/utils/permission';
import { getMotorcade } from '@/api/system/company';
import { mapState } from 'vuex';
export default {
  name: 'MakingChest',
  components: {
    'lcl-edit': LclEdit
  },
  props: {
    doorsList: {
      type: Array,
      default: []
    },
    blNoList: {
      type: Array,
      default: []
    },
    customerId: {
      type: String,
      default: ''
    },
    // 外部form 表单数据
    baseForm: {
      type: Object,
      default: null
    },
    orderId: {
      type: String,
      default: ''
    },
    placeOrderNumber: {
      type: String,
      default: ''
    },
    //订单状态
    status: {
      type: Number
    },
    exceptionRecord: {
      type: String
    }
  },
  watch: {
    doorsList: function (newVal, oldVal) {
      this.childDoorsList = newVal;
    },
    blNoList: function (newVal, oldVal) {
      this.childBlNoList = newVal;
    },
    customerId: function (newVal, oldVal) {
      this.childCustomerId = newVal;
    },
    baseForm: function (newVal, oldVal) {
      this.extras = newVal;
      this.getMcList();
    }
  },
  filters: {
    typeOfShippingFilet: function (value) {
      return value == 1 ? '自做' : value == 2 ? '外发' : '';
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
  data() {
    return {
      loadingList: false,
      // 做箱信息列表
      makingChestList: [],
      //车队数组
      motorcadeArray: [],
      // 箱型
      boxQuantityOptions: [],
      // 运输方式
      typeOfShippingOptions: [
        {
          value: 1,
          label: '自做'
        },
        {
          value: 2,
          label: '外发'
        }
      ],
      // 箱货编辑 弹出层
      lclEditVisible: false,
      // 标签页数据
      tabsData: [],
      childDoorsList: [],
      childBlNoList: [],
      childCustomerId: '',
      extras: {},
      validRules: {
        boxPile: [
          { required: true, message: '箱型必须填写', trigger: 'change' }
        ],
        tareWeight: [
          { type: 'number', message: '请输入数字', trigger: 'change' }
        ]
      },
      //取消对话框
      cancelVisible: false,
      //取消原因
      makingReason: '',
      //选中的箱型箱量
      selectBoxPile: '',
      //是否操作箱型箱量
      isChangeBox: false
    };
  },
  created() {
    this.extras = this.baseForm;
    this.getMcList();
  },
  mounted() {
    this.getMotorcadeList();
  },
  computed: {
    ...mapState({
      company: (state) => state.constant.company
    })
  },
  methods: {
    changeBoxPile(val) {
      this.isChangeBox = true;
      let fullData = this.$refs.zxdTable.getTableData().fullData;
      var obj = this.getRepeatNum(fullData);
      var props = '';
      for (var p in obj) {
        if (typeof obj[p] == 'function') {
          obj[p]();
        } else {
          props += p + ' * ' + obj[p] + ' + ';
        }
      }
      this.selectBoxPile = props.substring(0, props.length - 2);
    },
    // submitFormData() {
    //   this.$parent.submitForm();
    // },
    /** 查询做箱信息列表 */
    getMcList() {
      if (!validatenull(this.extras.id)) {
        this.loadingList = true;
        let params = {
          businessOrderId: this.extras.id,
          companyId: ''
        };
        getMakingChestList(params).then((response) => {
          this.makingChestList = response.data;
          this.$refs.zxdTable.loadData(response.data);
          this.loadingList = false;
        });
      }
    },
    //查询所有的车队
    getMotorcadeList() {
      getMotorcade().then((response) => {
        this.motorcadeArray = response.data;
      });
    },
    // 转大写
    toUpper(row) {
      if (row.caseNumber != null) {
        row.caseNumber = row.caseNumber.toUpperCase();
      }
      if (row.sealNumber != null) {
        row.sealNumber = row.sealNumber.toUpperCase();
      }
    },
    // 添加行
    addRow(row) {
      let zxdTable = this.$refs.zxdTable;
      let record = {
        businessOrderId: this.extras.id,
        tareWeight: 0,
        total: 0,
        grossWeight: 0,
        cbm: 0,
        lclList: [],
        ysState: 0,
        yfState: 0,
        ptysState: 0,
        typeOfShipping: 1,
        modifier: null
      };
      zxdTable.insertAt(record, row).then(({ row }) => {
        zxdTable.setActiveRow(row);
      });
    },
    // 删除行
    deleteRow(row) {
      this.$XModal.confirm('您确定要删除该数据?').then((type) => {
        if (type === 'confirm') {
          this.$refs.zxdTable.remove(row);
          let fullData = this.$refs.zxdTable.getTableData().fullData;
          var obj = this.getRepeatNum(fullData);
          var props = '';
          for (var p in obj) {
            if (typeof obj[p] == 'function') {
              obj[p]();
            } else {
              props += p + ' * ' + obj[p] + ' + ';
            }
          }
          this.selectBoxPile = props.substring(0, props.length - 2);
          this.isChangeBox = true;
        }
      });
    },
    // 做箱车队选择事件
    companyIdChange(row) {
      let obj = {};
      obj = this.motorcadeArray.find((item) => {
        return item.value === row.companyId;
      });
      if (obj) {
        row.carrierCompany = obj.label;
      }
    },
    // 取消
    cancelRow(row) {
      this.rowCompanyId = row.companyId;
      this.rowId = row.id;
      this.cancelVisible = true;
    },
    cancel() {
      this.cancelVisible = false;
    },
    //取消做箱????
    submitCancel(row) {
      if (this.makingReason == '') {
        this.$message({
          message: '请填写取消原因',
          type: 'warning'
        });
      } else {
        var params = {
          id: this.rowId,
          makingReason: '客服取消原因：' + this.makingReason,
          orderId: this.orderId,
          placeOrderNumber: this.placeOrderNumber,
          companyId: this.rowCompanyId,
          orderNumber: this.extras.orderNumber,
          companyName: this.company.companyName
        };
        updateMakStatusById(params).then((response) => {
          if (response.data.code === 200) {
            if (response.data.data == 1) {
              this.msgSuccess('取消成功');
              if (response.data.idStr != '') {
                this.$emit('update:status', 0);
              }
            } else {
              this.$message({
                message: response.data.msg,
                type: 'warning'
              });
            }
            this.getMcList();
            this.makingReason = '';
            this.cancelVisible = false;
          } else {
            this.msgError(response.data.msg);
          }
        });
      }
    },
    // 箱型鼠标移入事件
    boxPileFocus(e) {
      if (this.boxQuantityOptions.length == 0) {
        this.boxQuantityOptions = store.getters.box_pile;
      }
    },
    // 获取lable
    getSelectLabel(value, list) {
      let obj = {};
      if (value !== undefined) {
        obj = list.find((item) => {
          return item.value === value;
        });
      }
      return obj == null ? null : obj.label;
    },
    // 保存做箱
    async submitTable() {
      const errMap = await this.$refs.zxdTable
        .fullValidate()
        .catch((errMap) => errMap);
      if (errMap) {
        let msgList = [];
        Object.values(errMap).forEach((errList) => {
          errList.forEach((params) => {
            let { rowIndex, column, rules } = params;
            rules.forEach((rule) => {
              msgList.push(`${column.title} 校验错误：${rule.message}`);
            });
          });
        });
        this.$XModal.message({
          status: 'error',
          message: () => {
            return [
              <div class="red" style="max-height: 400px;overflow: auto;">
                {msgList.map((msg) => (
                  <div>{msg}</div>
                ))}
              </div>
            ];
          }
        });
      } else {
        let fullData = this.$refs.zxdTable.getTableData().fullData;
        var flag = false;
        var number;
        for (var i = 0; i < fullData.length - 1; i++) {
          for (var j = i + 1; j < fullData.length; j++) {
            if (
              fullData[i].caseNumber == null &&
              fullData[j].caseNumber == null
            ) {
              continue;
            }
            if (fullData[i].caseNumber === fullData[j].caseNumber) {
              number = fullData[i].caseNumber;
              flag = true;
              break;
            }
          }
        }
        if (flag) {
          this.$message({
            message: '箱号: ' + number + '已经存在',
            type: 'warning'
          });
        } else {
          this.loadingList = true;
          let addData = this.$refs.zxdTable.getInsertRecords();
          let delData = this.$refs.zxdTable.getRemoveRecords();
          let data = this.$refs.zxdTable.getTableData().fullData;
          let allData = [];
          // 增加
          if (addData.length > 0) {
            for (var i = 0, len = addData.length; i < len; i++) {
              addData[i].operationType = 1;
              addData[i].companyName = this.company.companyName;
              addData[i].orderNumber = this.extras.orderNumber;
              if (data[i].companyId && data[i].isDispatch == 1) {
                data[i].isNews = 1;
              } else if (data[i].companyId && data[i].isDispatch == 0) {
                data[i].isNews = 0;
                data[i].isDispatch = 1;
              } else {
                data[i].isNews = 1;
              }
              allData.push(addData[i]);
            }
          }
          // 删除
          if (delData.length > 0) {
            for (var i = 0, len = delData.length; i < len; i++) {
              delData[i].operationType = 2;
              data[i].companyName = this.company.companyName;
              data[i].orderNumber = this.extras.orderNumber;
              allData.push(delData[i]);
            }
          }
          // 修改
          for (var i = 0; i < data.length; i++) {
            if (!validatenull(data[i].id)) {
              data[i].operationType = 3;
              data[i].companyName = this.company.companyName;
              data[i].orderNumber = this.extras.orderNumber;
              if (data[i].companyId && data[i].isDispatch == 1) {
                data[i].isNews = 1;
              } else if (data[i].companyId && data[i].isDispatch == 0) {
                data[i].isNews = 0;
                data[i].isDispatch = 1;
              } else {
                data[i].isNews = 1;
              }
              allData.push(data[i]);
            }
          }

          return new Promise((resolve, reject) => {
            cudMakingChest(allData).then((response) => {
              if (response.data.code === 200) {
                var repeat = this.getRepeatNum(fullData);
                this.$emit('change-boxPile', repeat);
                // this.msgSuccess("保存成功");
                this.getMcList();
                resolve(response.data.code);
              } else {
                this.msgError(response.data.msg);
              }
            });
          });
        }
      }
    },
    // 返回数组中箱型相同的个数
    getRepeatNum(data) {
      var obj = {};
      for (var i = 0, l = data.length; i < l; i++) {
        var item = data[i].boxPile;
        obj[item] = obj[item] + 1 || 1;
      }
      return obj;
    },
    // 判断箱号是否为空
    makingIsNull(data) {
      let st = true;
      for (var i = 0, len = data.length; i < len; i++) {
        if (data[i].caseNumber == undefined || data[i].caseNumber == '') {
          st = false;
          break;
        }
      }
      return st;
    },
    // 箱货编辑
    lclClick() {
      let fullData = this.$refs.zxdTable.getTableData().fullData;
      if (fullData.length == 0) {
        this.$message({
          message: '箱货信息不能为空',
          type: 'warning'
        });
      } else {
        let bl = this.makingIsNull(fullData);
        if (bl) {
          this.tabsData = fullData;
          this.childDoorsList = this.doorsList;
          this.childBlNoList = this.blNoList;
          this.childCustomerId = this.customerId;
          this.lclEditVisible = true;
        } else {
          this.$message({
            message: '箱号不能为空',
            type: 'warning'
          });
        }
      }
    },
    // 箱货编辑确认回调事件
    typeChanged(data) {
      let fullData = this.$refs.zxdTable.getTableData().fullData;
      for (var i = 0, len = data.length; i < len; i++) {
        if (fullData[i]._XID == data[i]._XID) {
          fullData[i].door = data[i].door;
          fullData[i].address = data[i].address;
          fullData[i].blNoStr = data[i].blNoStr;
          fullData[i].total = Number(data[i].total);
          fullData[i].grossWeight = Number(data[i].grossWeight);
          fullData[i].cbm = Number(data[i].cbm);
          fullData[i].lclList = data[i].lclList;
          fullData[i].bmRemarks = data[i].bmRemarks;
        }
      }
    },
    // 费用录入
    openCost(row, i) {
      let state = checkPermi(['cost:detailed:edit']);
      if (state) {
        let fullData = this.$refs.zxdTable.getRecordset();
        if (
          fullData.insertRecords.length == 0 &&
          fullData.removeRecords.length == 0 &&
          fullData.updateRecords.length == 0
        ) {
          if (!validatenull(row.caseNumber)) {
            let len = this.$refs.zxdTable.getTableData().fullData.length;
            var obj = {
              index: i,
              allIndex: len - 1,
              orderNumber: this.extras.orderNumber,
              orderType: this.extras.orderType,
              customerName: this.extras.customerName,
              customerNum: this.extras.customerNum,
              vesselAndVoyage: this.extras.vesselAndVoyage,
              dock: this.extras.dock,
              exceptionRecord: this.extras.exceptionRecord,
              mcId: row.id,
              blNoStr: row.blNoStr,
              prPoint:
                row.suitcasePoint == null ? row.returnPoint : row.suitcasePoint,
              address: row.address,
              typeOfShipping: row.typeOfShipping,
              carrierCompany: row.carrierCompany,
              grossWeight: row.grossWeight,
              packingTime: row.packingTime,
              vehicleOwnership: row.vehicleOwnership,
              caseNumber: row.caseNumber,
              boxPile: row.boxPile,
              vehicle: row.vehicle,
              driver: row.driver,
              ysState: row.ysState,
              yfState: row.yfState,
              ptysState: row.ptysState
            };
            this.$emit('change-childForm', obj);
          } else {
            this.$message({
              message: '箱号不能为空',
              type: 'warning'
            });
          }
        } else {
          this.$message({
            message: '请先保存修改',
            type: 'warning'
          });
        }
      } else {
        this.$notify.error({
          title: '当前操作没有权限'
        });
      }
    },
    // 通过索引获取行数据，并返回
    getRowByIndex(index) {
      let fullData = this.$refs.zxdTable.getTableData().fullData;
      if (fullData[index] == undefined) {
        return null;
      } else {
        if (
          fullData[index].caseNumber == null ||
          fullData[index].caseNumber == ''
        ) {
          return null;
        } else {
          var obj = {
            index: index,
            allIndex: fullData.length - 1,
            orderNumber: this.extras.orderNumber,
            orderType: this.extras.orderType,
            customerName: this.extras.customerName,
            customerNum: this.extras.customerNum,
            vesselAndVoyage: this.extras.vesselAndVoyage,
            dock: this.extras.dock,
            exceptionRecord: this.extras.exceptionRecord,
            mcId: fullData[index].id,
            blNoStr: fullData[index].blNoStr,
            prPoint:
              fullData[index].suitcasePoint == null
                ? fullData[index].returnPoint
                : fullData[index].suitcasePoint,
            address: fullData[index].address,
            typeOfShipping: fullData[index].typeOfShipping,
            carrierCompany: fullData[index].carrierCompany,
            grossWeight: fullData[index].grossWeight,
            packingTime: fullData[index].packingTime,
            vehicleOwnership: fullData[index].vehicleOwnership,
            caseNumber: fullData[index].caseNumber,
            boxPile: fullData[index].boxPile,
            vehicle: fullData[index].vehicle,
            driver: fullData[index].driver,
            ysState: fullData[index].ysState,
            yfState: fullData[index].yfState,
            ptysState: fullData[index].ptysState
          };
          return obj;
        }
      }
    }
  }
};
</script>
<style>
.hide .el-upload--picture-card {
  display: none;
}
.el-dialog__body {
  padding-bottom: 0px;
  padding-top: 0px;
}
.vxe-input--inner {
  text-transform: uppercase;
}
.cost-left {
  float: left;
  font-size: 13px;
}
.cost-right {
  float: right;
  font-size: 13px;
}
</style>
