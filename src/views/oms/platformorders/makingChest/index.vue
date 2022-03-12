<template>
  <el-row>
    <el-col :span="23" class="divider">
      <el-divider direction="vertical" />
      <h4>做箱信息</h4>
    </el-col>
    <el-col :span="22" :offset="1">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            size="mini"
            @click="submitTable"
            :disabled="messageBtn"
            :loading="loadingBut"
          >{{ loadingText }}</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            :disabled="messageBtn"
            size="mini"
            plain
            @click="lclClick"
          >查看箱货信息</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="mb8">
        <el-input
          v-model="exceptionRecordCar"
          type="textarea"
          style="width:99%;margin-left:5px"
          placeholder="操作记录"
          :autosize="{ minRows:2, maxRows: 3}"
        ></el-input>
      </el-row>

      <vxe-table
        border
        keep-source
        show-overflow
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
                :content="scope.row.ysState == 0 ? '应收未全' : '应收已全'"
                placement="top-start"
              >
                <span
                  class="cost-left"
                  :style="{
                    color: scope.row.ysState == 0 ? '#F56C6C' : '#67C23A',
                  }"
                >(收</span>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                :content="scope.row.yfState == 0 ? '应付未全' : '应付已全'"
                placement="top-start"
              >
                <span
                  class="cost-right"
                  :style="{
                    color: scope.row.yfState == 0 ? '#F56C6C' : '#67C23A',
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
            <span :style="{ color: row.makingStatus == 0 ? '#F56C6C' : '#67C23A' }">
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
              disabled
              filterable
              @focus="boxPileFocus"
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
          field="blNoStr"
          title="提单号"
          show-overflow="tooltip"
          :edit-render="{ name: 'input' }"
          width="150"
        >
          <template v-slot:edit="{ row }">
            <vxe-input v-model="row.blNoStr" disabled></vxe-input>
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
              :disabled="row.makingStatus == 0 || extras.orderType==2"
              :min="0"
              v-model.trim="row.caseNumber"
              @blur="toUpper(row)"
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
              :disabled="row.makingStatus == 0 || extras.orderType==2"
              v-model.trim="row.sealNumber"
              @blur="toUpper(row)"
            ></vxe-input>
          </template>
        </vxe-table-column>
        <vxe-table-column
          field="tareWeight"
          title="箱皮重(KG)"
          :edit-render="{ name: 'input' }"
          width="100"
        >
          <template v-slot:edit="{ row }">
            <vxe-input v-model.trim="row.tareWeight" :disabled="row.makingStatus == 0"></vxe-input>
          </template>
        </vxe-table-column>
        <vxe-table-column
          field="total"
          title="总件数(PKG)"
          :edit-render="{ name: 'input' }"
          width="110"
        >
          <template v-slot:edit="{ row }">
            <vxe-input v-model="row.total" disabled></vxe-input>
          </template>
        </vxe-table-column>
        <vxe-table-column
          field="grossWeight"
          title="总毛重(KG)"
          :edit-render="{ name: 'input' }"
          width="100"
        >
          <template v-slot:edit="{ row }">
            <vxe-input v-model="row.grossWeight" disabled></vxe-input>
          </template>
        </vxe-table-column>
        <vxe-table-column field="cbm" title="总体积(CBM)" :edit-render="{ name: 'input' }" width="110">
          <template v-slot:edit="{ row }">
            <vxe-input v-model="row.cbm" disabled></vxe-input>
          </template>
        </vxe-table-column>
        <vxe-table-column
          field="suitcasePoint"
          title="提箱点"
          width="140"
          v-if="extras.orderType == 1"
          :edit-render="{ name: 'ElSelect' }"
        >
          <template v-slot:edit="scope">
            <el-select
              :disabled="scope.row.makingStatus == 0"
              v-model="scope.row.suitcasePoint"
              clearable
              filterable
              @focus="placeFocus"
              default-first-option
              no-data-text="无匹配数据"
              placeholder="请选择"
            >
              <el-option
                v-for="item in placeOptions"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </vxe-table-column>
        <vxe-table-column field="planPackingTime" title="预计做箱" width="200" :edit-render="{}">
          <template v-slot:edit="{ row }">
            <el-date-picker v-model="row.planPackingTime" type="datetime" format="yyyy-MM-dd HH:mm"></el-date-picker>
          </template>
          <template v-slot="{ row }">{{ formatDate(row.planPackingTime, "yyyy-MM-dd hh:mm") }}</template>
        </vxe-table-column>
        <vxe-table-column field="packingTime" title="实际做箱" width="200" :edit-render="{}">
          <template v-slot:edit="{ row }">
            <el-date-picker v-model="row.packingTime" type="datetime" format="yyyy-MM-dd HH:mm"></el-date-picker>
          </template>
          <template v-slot="{ row }">{{ formatDate(row.packingTime, "yyyy-MM-dd hh:mm") }}</template>
        </vxe-table-column>
        <vxe-table-column
          field="sendReceipStatus"
          title="是否寄单"
          width="80"
          :edit-render="{ name: 'ElSelect' }"
        >
          <!-- @change="isSendDocumentChange(scope.row)" -->
          <template v-slot:edit="scope">
            <el-select v-model="scope.row.sendReceipStatus" placeholder="请选择">
              <el-option
                v-for="item in sendDocumentOption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <span style="float: left;margin-right:30px">{{ item.label }}</span>
              </el-option>
            </el-select>
          </template>
          <template v-slot="{ row }">
            {{
            row.sendReceipStatus | isSendDocumentFilet
            }}
          </template>
        </vxe-table-column>
        <!-- <vxe-table-column title="寄单地址" width="100">
          <template v-slot="scope">
            <el-button
              :disabled="scope.row.sendReceipStatus===1 ||scope.row.sendReceipStatus===2 ||scope.row.sendReceipStatus==0"
              size="mini"
              type="text"
              @click="openSendReceip(scope.row)"
            >寄单地址</el-button>
          </template>
        </vxe-table-column>-->
        <vxe-table-column
          field="scheduleTime"
          title="排计划"
          width="200"
          v-if="extras.orderType == 2"
          :edit-render="{}"
        >
          <template v-slot:edit="{ row }">
            <el-date-picker v-model="row.scheduleTime" type="datetime" format="yyyy-MM-dd HH:mm"></el-date-picker>
          </template>
          <template v-slot="{ row }">{{ formatDate(row.scheduleTime, "yyyy-MM-dd hh:mm") }}</template>
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
          field="address"
          title="门点地址"
          show-overflow="tooltip"
          :edit-render="{ name: 'input' }"
          width="150"
        >
          <template v-slot:edit="{ row }">
            <vxe-input v-model="row.address" disabled></vxe-input>
          </template>
        </vxe-table-column>

        <vxe-table-column
          field="returnPoint"
          title="还箱点"
          width="140"
          v-if="extras.orderType == 2"
          :edit-render="{ name: 'ElSelect' }"
        >
          <template v-slot:edit="scope">
            <el-select
              v-model="scope.row.returnPoint"
              filterable
              @focus="placeFocus"
              default-first-option
              no-data-text="无匹配数据"
              placeholder="请选择"
            >
              <el-option
                v-for="item in placeOptions"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </vxe-table-column>
        <vxe-table-column
          field="typeOfShipping"
          title="运输方式"
          width="100"
          :edit-render="{ name: 'ElSelect' }"
        >
          <template v-slot:edit="scope">
            <el-select
              v-model="scope.row.typeOfShipping"
              :disabled="scope.row.makingStatus == 0"
              @change="typeOfShippingChange(scope.row)"
              placeholder="请选择"
            >
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
          :edit-render="{ name: 'ElSelect' }"
        >
          <template v-slot:edit="scope">
            <el-select
              ref="carrierCompany"
              :disabled="scope.row.typeOfShipping == 1"
              v-model="scope.row.carrierCompany"
              clearable
              allow-create
              filterable
              @focus="carrierCompanyFocus"
              no-data-text="无匹配数据"
              placeholder="输入承运公司"
              @visible-change="(v) => visibleChange(v, 'carrierCompany', 0, addCarrierCompanyClick, '添加供应商')"
            >
              <template v-for="item in carrierCompanyOptions">
                <el-option :key="item.id" :label="item.label" :value="item.value"></el-option>
              </template>
            </el-select>
          </template>
        </vxe-table-column>

        <vxe-table-column field="driver" title="司机" width="190" :edit-render="{ name: 'ElSelect' }">
          <template v-slot:edit="scope">
            <el-select
              ref="driverSelect"
              clearable
              filterable
              :multiple-limit="scope.row.typeOfShipping == 1 ? 0 : 1"
              v-model="scope.row.driver"
              @focus="driverFocus(scope.row.typeOfShipping)"
              @change="driverChange(scope.row, scope.row.driver)"
              no-data-text="无匹配数据"
              placeholder="请选择输入"
              @visible-change="(v) => visibleChange(v, 'driverSelect', 0, addDriverClick, '添加司机')"
            >
              <el-option
                v-for="item in driverOptions"
                :key="item.id"
                :label="item.label"
                :value="item"
              >
                <span style="float: left">{{ item.value }}</span>
                <span style="float: right; color: #8492a6; font-size: 9px">{{ item.phone }}</span>
              </el-option>
            </el-select>
          </template>
        </vxe-table-column>
        <!-- :disabled="scope.row.makingStatus == 0 || scope.row.typeOfShipping == 1 ? true : false" -->
        <vxe-table-column field="phone" title="电话" :edit-render="{ name: 'input' }" width="160">
          <template v-slot:edit="scope">
            <el-input
              v-model.trim="scope.row.phone"
              :disabled="scope.row.makingStatus == 0 || scope.row.typeOfShipping == 1 ? true : false"
            ></el-input>
          </template>
        </vxe-table-column>
        <vxe-table-column
          field="vehicle"
          title="车辆"
          width="205"
          :edit-render="{ name: 'ElSelect' }"
        >
          <template v-slot:edit="scope">
            <el-select
              ref="vehicleSelect"
              clearable
              filterable
              :multiple-limit="scope.row.typeOfShipping == 1 ? 0 : 1"
              :disabled="scope.row.makingStatus == 0"
              v-model="scope.row.vehicle"
              @focus="vehicleFocus()"
              @change="vehicleChange(scope.row, scope.row.vehicle)"
              no-data-text="无匹配数据"
              placeholder="请选择输入"
              @visible-change="(v) => visibleChange(v, 'vehicleSelect', 0, addVehicleClick, '添加车辆')"
            >
              <template v-for="item in vehicleOptions">
                <el-option
                  v-if="scope.row.typeOfShipping == 1 ? item.vehicleBelongState == 1 : item.vehicleBelongState == 2"
                  :key="item.id"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </template>
            </el-select>
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
        <vxe-table-column title="操作" fixed="right" width="140">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="pictureDialog(scope.row, scope.$rowIndex)"
            >箱货照片</el-button>
            <el-button size="mini" type="text" @click="packingListDialog(scope.row)">装箱单</el-button>
          </template>
        </vxe-table-column>
      </vxe-table>

      <!-- <el-dialog
        :visible.sync="sendialogVisible"
        width="30%"
        top="50vh"
        :modal="false"
        :rules="sendRules"
      >
        <el-form ref="sendForm" :model="sendForm" :rules="sendRules">
          <el-form-item prop="address" style="margin-top:30px">
            <v-distpicker
              @selected="onSelected"
              :province="sendForm.province"
              :city="sendForm.city"
              :area="sendForm.area"
              style="display: inline-block"
            ></v-distpicker>
            <el-input style="padding-top: 5px" v-model="sendForm.address" placeholder="详细地址" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cencelReceip">取 消</el-button>
          <el-button type="primary" @click="submitSendReceip">确 定</el-button>
        </span>
      </el-dialog>-->

      <!-- 添加供应商 -->
      <add-customer
        ref="addCarrierCompany"
        v-if="addCarrierCompanyVisible"
        :title="'添加供应商'"
        :nature="2"
        :visible.sync="addCarrierCompanyVisible"
        @customer-success="onCarrierCompanySuccess"
      ></add-customer>

      <!-- 添加车辆 -->
      <insert-vehicle
        ref="addVehicle"
        v-if="addVehicleVisible"
        :visible.sync="addVehicleVisible"
        @vehicle-success="onVehicleSuccess"
      ></insert-vehicle>

      <!-- 添加司机 -->
      <add-driver
        ref="addDriver"
        v-if="addDriverVisible"
        :visible.sync="addDriverVisible"
        @driver-success="onDriverSuccess"
      ></add-driver>

      <!-- 箱货照片添加 -->
      <box-picture
        :getMcList="getMcList"
        v-if="visiblePicture"
        :visible.sync="visiblePicture"
        :temp="rowPictureInfo"
      ></box-picture>
      <!-- 箱货编辑 -->
      <lcl ref="Lcl" v-if="lclEditVisible" :tabsData="tabsData" :visible.sync="lclEditVisible"></lcl>

      <!-- 装箱单 -->
      <packing-list
        ref
        v-if="packingListVisible"
        :visible.sync="packingListVisible"
        :packingList="packingList"
        :businessState="businessState"
      ></packing-list>
    </el-col>
  </el-row>
</template>
<script>
import store from '@/store';
import {
  getMakingChestList,
  cudMakingChest,
  findMakingChestById
} from '@/api/oms/makingChest';
import { mapState } from 'vuex';
import { getCorporateIdentify, isImage } from '@/utils/util';
import { parseTime } from '@/utils/ruoyi';
import { getToken } from '@/utils/auth';
import ElImageViewer from 'element-ui/packages/image/src/image-viewer';
import { delAttachment } from '@/api/system/attachment';
import Lcl from '@/views/boxmaking/platformbox/lcl/index.vue';
import PackingList from '../../packingList/index.vue';
import AddVehicle from '../../addVehicle/index.vue';
import AddCustomer from '../../addCustomer/index.vue';
import AddDriver from '../../addDriver/index.vue';
import { selectBottomAction } from '@/utils/mixins.js';
import { validatenull } from '@/utils/ruoyi';
import { checkPermi } from '@/utils/permission';
import BoxPicture from '../../boxpicture/index';
export default {
  name: 'PlatformMakingChest',
  mixins: [selectBottomAction],
  components: {
    ElImageViewer,
    lcl: Lcl,
    'insert-vehicle': AddVehicle,
    'add-customer': AddCustomer,
    'add-driver': AddDriver,
    'packing-list': PackingList,
    'box-picture': BoxPicture
  },
  props: {
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
    vesselAndVoyage: {
      type: String,
      default: ''
    },
    exceptionRecordCarTemp: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo
    }),

    getApplyId() {
      return this.$store.getters.order_diable;
    }
  },
  watch: {
    blNoList: function (newVal, oldVal) {
      this.childBlNoList = newVal;
    },
    customerId: function (newVal, oldVal) {
      this.childCustomerId = newVal;
    },
    baseForm: function (newVal, oldVal) {
      this.extras = newVal;
    },
    exceptionRecordCarTemp: function (newVal, oldVal) {
      this.exceptionRecordCar = newVal;
    },
    getApplyId(newValue, oldValue) {
      if (this.userInfo.id === newValue.userId) {
        this.messageBtn = newValue.isDisable;
      }
      this.$forceUpdate();
    }
  },
  filters: {
    typeOfShippingFilet: function (value) {
      return value == 1 ? '自做' : '外发';
    },
    isSendDocumentFilet: function (value) {
      return value == 1
        ? '待寄'
        : value == 2
        ? '不寄'
        : value == 3
        ? '已寄'
        : '';
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
      exceptionRecordCar: '',
      sendForm: {},
      // exceptionRecords: '',
      loadingList: false,
      loadingBut: false,
      loadingText: '保存',
      // 做箱信息列表
      makingChestList: [],
      // 箱型
      boxQuantityOptions: [],
      // 提箱点还箱点
      placeOptions: [],
      // 运输方式
      typeOfShippingOptions: [
        {
          value: 0,
          label: ''
        },
        {
          value: 1,
          label: '自做'
        },
        {
          value: 2,
          label: '外发'
        }
      ],
      sendDocumentOption: [
        {
          value: 1,
          label: '待寄'
        },
        {
          value: 2,
          label: '不寄'
        },
        {
          value: 3,
          label: '已寄'
        }
      ],
      // 承运公司
      carrierCompanyOptions: [],
      // 添加供应商
      addCarrierCompanyVisible: false,
      // 车辆
      vehicleOptions: [],
      addVehicleVisible: false,
      // 司机
      driverOptions: [],
      addDriverVisible: false,
      // 箱货照片属性
      plpIndex: 0,
      plpOpenVisible: false,
      doorHide: false,
      sealHide: false,
      eirHide: false,
      signForHide: false,
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      isMultiple: false,
      imgLimit: 1,
      // 显示查看器
      showViewer: false,
      url: '',
      form: {},
      doorUrlArray: [],
      sealUrlArray: [],
      eirUrlArray: [],
      signForUrlArray: [],
      // 箱货编辑 弹出层
      lclEditVisible: false,
      // 标签页数据
      tabsData: [],
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
      sendRules: {
        address: [
          { required: true, message: '请填写详细地址', trigger: 'change' }
        ]
      },
      packingList: {},
      packingListVisible: false,
      //箱货照片
      visiblePicture: false,

      /////////////////////
      rowPictureInfo: {},
      sendReceipAddress: '',
      addCurrentRow: {},
      businessState: 0,
      messageBtn: false
    };
  },
  created() {
    this.extras = this.baseForm;
    this.driverOptions = store.getters.driver.filter((res) => {
      if (res.driverBelongState == 1 && res.inState == 1) {
        return res;
      }
    });
    this.exceptionRecordCar = this.exceptionRecordCarTemp;
    this.getMcList();
  },
  methods: {
    cencelReceip() {
      this.sendForm = {};
      this.sendialogVisible = false;

      this.$refs['sendForm'].resetFields();
    },
    submitSendReceip() {
      this.$refs['sendForm'].validate((valid) => {
        if (valid) {
          this.addCurrentRow.sendReceipAddress = JSON.stringify(this.sendForm);
          this.sendialogVisible = false;
          this.$refs['sendForm'].resetFields();
        }
      });
    },
    onSelected(data) {
      this.sendForm.province = data.province.value;
      this.sendForm.city = data.city.value;
      this.sendForm.area = data.area.value;
    },
    openSendReceip(row) {
      this.sendForm = {};
      this.addCurrentRow = row;
      if (!validatenull(row.sendReceipAddress)) {
        this.sendForm = JSON.parse(row.sendReceipAddress);
      }
      this.sendialogVisible = true;
    },
    /** 查询做箱信息列表 */
    getMcList() {
      if (this.extras.id !== '') {
        this.loadingList = true;
        // 根据当前的公司id 查询所需要做箱的列表
        let params = {
          businessOrderId: this.extras.id,
          companyId: getCorporateIdentify()
        };
        getMakingChestList(params).then((response) => {
          response.data.forEach((item, index) => {
            if (!validatenull(item.vehicleList)) {
              item.vehicle = item.vehicleList[0];
            }
            if (!validatenull(item.driverList)) {
              item.driver = item.driverList[0];
            }
          });
          this.$refs.zxdTable.loadData(response.data);
          this.loadingList = false;
        });
      }
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
    // 箱型鼠标移入事件
    boxPileFocus(e) {
      if (this.boxQuantityOptions.length == 0) {
        this.boxQuantityOptions = store.getters.box_pile;
      }
    },
    // 提箱点 还箱点 鼠标移入事件
    placeFocus(e) {
      if (this.placeOptions.length == 0) {
        this.placeOptions = store.getters.dock;
      }
    },
    // 运输方式值 变更事件
    typeOfShippingChange(row) {
      if (row.typeOfShipping == 1) {
        this.carrierCompanyOptions = [];
        row.carrierCompany = store.getters.company.companyName;
        row.phone = '';
      } else {
        this.carrierCompanyOptions = store.getters.customer;
        row.carrierCompany = undefined;
        row.phone = '';
      }
    },
    // 添加承运公司
    addCarrierCompanyClick() {
      this.addCarrierCompanyVisible = true;
    },
    // 承运公司 鼠标移入事件
    carrierCompanyFocus(e) {
      if (this.carrierCompanyOptions.length == 0) {
        this.carrierCompanyOptions = store.getters.customer;
      }
    },
    // 添加承运公司 成功回调
    onCarrierCompanySuccess() {
      var that = this;
      setTimeout(function () {
        that.carrierCompanyOptions = store.getters.customer;
      }, 1000);
    },
    // 车辆鼠标移入事件
    vehicleFocus(e) {
      if (this.vehicleOptions.length === 0) {
        this.vehicleOptions = store.getters.vehicle;
      }
    },
    // 车辆值 变更事件
    vehicleChange(row, val) {
      // row.driverList = [];
      row.phone = '';
      let obj = {};
      obj = this.vehicleOptions.find((item) => {
        return item.value === val;
      });
      if (obj != null) {
        row.vehicleOwnership = obj.vehicleBelongState;
        if (obj.driverName != null) {
          row.driver = obj.driverName;
          row.phone = obj.driverPhone;
        }
      }
    },
    // 添加车辆
    addVehicleClick() {
      this.addVehicleVisible = true;
    },
    // 添加车辆 成功回调
    onVehicleSuccess(res) {
      var that = this;
      setTimeout(function () {
        that.vehicleOptions = store.getters.vehicle;
      }, 1000);
    },
    // 司机鼠标移入事件
    driverFocus(e) {
      if (e === 1) {
        this.driverOptions = store.getters.driver.filter((res) => {
          if (res.driverBelongState == 1 && res.inState == 1) {
            return res;
          }
        });
      } else if (e === 2) {
        this.driverOptions = store.getters.driver.filter((res) => {
          if (res.driverBelongState == '2') {
            return res;
          }
        });
      }
    },
    // 司机 值 变更事件
    driverChange(row, val) {
      //根据
      row.phone = '';
      row.phone = val.phone;
      row.driver = val.value;
      row.vehicle = val.vehicles;
      row.driverId = val.id;
      row.belongCompaniesId = getCorporateIdentify();
      // row.phone = '';
      // let obj = {};
      // obj = this.driverOptions.find((item) => {
      //   return item.value === val;
      // });
      // row.phone = obj.phone;
    },
    // 添加司机
    addDriverClick() {
      this.addDriverVisible = true;
    },
    // 添加司机 成功回调
    onDriverSuccess(res) {
      let arry = {
        value: res.driverName,
        label: res.driverName,
        phone: res.driverPhone
      };
      this.driverOptions.push(arry);
    },
    // 保存做箱
    async submitTable() {
      this.loadingBut = true;
      this.loadingText = '保存中';
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
        this.loadingBut = false;
        this.loadingText = '保存';
      } else {
        let fullData = this.$refs.zxdTable.getTableData().fullData;
        fullData.forEach((element) => {
          delete element.doorUrl;
          delete element.sealUrl;
          delete element.signForUrl;
          delete element.eirUrl;
          element.exceptionRecordCar = this.exceptionRecordCar;
        });
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
          this.loadingBut = false;
          this.loadingText = '保存';
        } else {
          this.loadingList = true;
          let addData = this.$refs.zxdTable.getInsertRecords();
          let data = this.$refs.zxdTable.getTableData().fullData;
          let allData = [];
          // 增加
          if (addData.length > 0) {
            for (var i = 0, len = addData.length; i < len; i++) {
              addData[i].operationType = 1;
              addData[i].isNews = 1;
              allData.push(addData[i]);
            }
          }
          // 修改
          for (var i = 0; i < data.length; i++) {
            if (!validatenull(data[i].id)) {
              data[i].operationType = 3;
              data[i].isNews = 1;
              allData.push(data[i]);
            }
          }
          cudMakingChest(allData).then((response) => {
            if (response.data.code === 200) {
              this.msgSuccess('保存成功');
              this.$emit('changeException', this.exceptionRecordCar);
              this.getMcList();
              setTimeout(() => {
                this.loadingList = false;
                this.loadingBut = false;
                this.loadingText = '保存';
              }, 1000);
            } else {
              this.msgError(response.data.msg);
            }
          });
        }
      }
    },
    // 箱货照片
    pictureDialog(row, index) {
      // this.rowPictureInfo = row;
      // this.visiblePicture = true;

      //根据id查询做箱信息
      //
      findMakingChestById(row.id).then((res) => {
        if (res.status === 200) {
          this.rowPictureInfo = res.data;
        }
      });
      //this.rowPictureInfo = row;
      this.visiblePicture = true;
    },
    // 预览图片时调用
    handlePictureCardPreview(file) {
      this.url = file.url;
      this.showViewer = true;
    },
    // 关闭图片浏览
    closeViewer() {
      this.showViewer = false;
    },
    // 文件上传之前调用做一些拦截限制
    beforeAvatarUpload(file) {
      const isJPG = isImage(file.name);
      if (!isJPG) {
        this.$message.error('只允许上传图片');
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        this.$message.error('上传图片大小不能超过 10MB!');
      }
      return isJPG && isLt10M;
    },
    // 箱门图片上传成功调用
    handleDoorSuccess(res, file) {
      this.form.doorUrl = res.data.previewUrl;
    },
    // 封条图片上传成功调用
    handleSealSuccess(res, file) {
      this.form.sealUrl = res.data.previewUrl;
    },
    // 设备交接单图片上传成功调用
    handleEirSuccess(res, file) {
      this.form.eirUrl = res.data.previewUrl;
    },
    // 签收照片上传成功调用
    handleSignForSuccess(res, file) {
      this.form.signForUrl = res.data.previewUrl;
    },
    // 图片上传失败调用
    imgUploadError(err, file, fileList) {
      console.log(err);
      this.$message.error('上传图片失败!');
    },
    // 箱门隐藏添加框
    doorChange(file, fileList) {
      this.doorHide = fileList.length >= this.imgLimit;
    },
    // 封条隐藏添加框
    sealChange(file, fileList) {
      this.sealHide = fileList.length >= this.imgLimit;
    },
    // 设备交接单隐藏添加框
    eirChange(file, fileList) {
      this.eirHide = fileList.length >= this.imgLimit;
    },
    // 签收照片隐藏添加框
    signForChange(file, fileList) {
      this.signForHide = fileList.length >= this.imgLimit;
    },
    // 箱门移除图片
    handleRemove(file, fileList) {
      if (file.response !== undefined) {
        delAttachment(file.response.data.id).then((response) => {
          if (response.data.code == 200) {
            this.doorHide = fileList.length >= this.imgLimit;
          }
        });
      } else {
        this.doorHide = fileList.length >= this.imgLimit;
      }
    },
    // 封条移除图片
    sealRemove(file, fileList) {
      if (file.response !== undefined) {
        delAttachment(file.response.data.id).then((response) => {
          if (response.data.code == 200) {
            this.sealHide = fileList.length >= this.imgLimit;
          }
        });
      } else {
        this.sealHide = fileList.length >= this.imgLimit;
      }
    },
    // 设备交接单移除图片
    eirRemove(file, fileList) {
      if (file.response !== undefined) {
        delAttachment(file.response.data.id).then((response) => {
          if (response.data.code == 200) {
            this.eirHide = fileList.length >= this.imgLimit;
          }
        });
      } else {
        this.eirHide = fileList.length >= this.imgLimit;
      }
    },
    // 签收照片移除拖
    signForRemove(file, fileList) {
      if (file.response !== undefined) {
        delAttachment(file.response.data.id).then((response) => {
          if (response.data.code == 200) {
            this.signForHide = fileList.length >= this.imgLimit;
          }
        });
      } else {
        this.signForHide = fileList.length >= this.imgLimit;
      }
    },
    // 箱货照片提交
    submitPicture: function () {
      let fullData = this.$refs.zxdTable.getTableData().fullData;
      // 给当前行赋值
      fullData[this.plpIndex].doorUrl = this.form.doorUrl;
      fullData[this.plpIndex].sealUrl = this.form.sealUrl;
      fullData[this.plpIndex].eirUrl = this.form.eirUrl;
      fullData[this.plpIndex].signForUrl = this.form.signForUrl;
      this.doorUrlArray = [];
      this.sealUrlArray = [];
      this.eirUrlArray = [];
      this.signForUrlArray = [];
      this.form = {
        doorUrl: undefined,
        sealUrl: undefined,
        eirUrl: undefined,
        signForUrl: undefined
      };
      this.plpOpenVisible = false;
    },
    // 箱货照片关闭
    cancel() {
      this.doorUrlArray = [];
      this.sealUrlArray = [];
      this.eirUrlArray = [];
      this.signForUrlArray = [];
      this.form = {
        doorUrl: undefined,
        sealUrl: undefined,
        eirUrl: undefined,
        signForUrl: undefined
      };
      this.plpOpenVisible = false;
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
          fullData[i].remark = data[i].remark;
          fullData[i].blNoStr = data[i].blNoStr;
          fullData[i].total = Number(data[i].total);
          fullData[i].grossWeight = Number(data[i].grossWeight);
          fullData[i].cbm = Number(data[i].cbm);
          fullData[i].lclList = data[i].lclList;
          fullData[i].bmRemarks = data[i].bmRemarks;
        }
      }
      this.submitTable();
    },
    // 装箱单
    packingListDialog(row) {
      this.businessState = this.extras.businessState;
      let obj = {};
      obj.vesselAndVoyage = this.vesselAndVoyage;
      if (this.extras.dock == null) {
        obj.dock = '港区：';
      } else {
        obj.dock = '港区：' + this.extras.dock;
      }
      if (this.extras.openingDate == null) {
        obj.openingDate = '开港日期：';
      } else {
        obj.openingDate = '开港日期：' + parseTime(this.extras.openingDate);
      }
      if (this.extras.cutOffDate == null) {
        obj.cutOffDate = '截港日期：';
      } else {
        obj.cutOffDate = '截港日期：' + parseTime(this.extras.cutOffDate);
      }
      obj.portOfLoading = this.extras.portOfLoading;
      obj.portOfDischarge = this.extras.portOfDischarge;
      obj.placeOfDelivery = this.extras.placeOfDelivery;

      obj.caseNumber = row.caseNumber;
      obj.sealNumber = row.sealNumber;
      obj.boxPile = row.boxPile;
      obj.packingTime = row.packingTime;
      //obj.driver = row.driverList[0];
      obj.driver = row.driver;
      obj.phone = row.phone;
      //obj.vehicle = row.vehicleList[0];
      obj.vehicle = row.vehicle;
      obj.total = row.total;
      obj.grossWeight = row.grossWeight;
      obj.cbm = row.cbm;
      obj.tareWeight = row.tareWeight;
      obj.lclList = row.lclList;
      obj.contTotalWt = Number(row.tareWeight) + Number(row.grossWeight);
      obj.bmRemarks = row.bmRemarks;
      obj.shippingCompany = this.extras.shippingCompany;
      this.packingList = obj;
      this.packingListVisible = true;
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
            if (row.makingStatus != 0) {
              //if (!validatenull(row.vehicle)) {
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
                exceptionRecord: this.exceptionRecordCar,
                dispatchType: this.extras.dispatchType,
                mcId: row.id,
                blNoStr: row.blNoStr,
                prPoint:
                  row.suitcasePoint == null
                    ? row.returnPoint
                    : row.suitcasePoint,
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
                yfState: row.yfState
              };
              this.$emit('change-childForm', obj);
              // } else {
              //   this.$message({
              //     message: '车辆不能为空',
              //     type: 'warning'
              //   });
              // }
            } else {
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
                exceptionRecord: this.exceptionRecordCar,
                dispatchType: this.extras.dispatchType,
                mcId: row.id,
                blNoStr: row.blNoStr,
                prPoint:
                  row.suitcasePoint == null
                    ? row.returnPoint
                    : row.suitcasePoint,
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
                yfState: row.yfState
              };
              this.$emit('change-childForm', obj);
            }
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
            yfState: fullData[index].yfState
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
