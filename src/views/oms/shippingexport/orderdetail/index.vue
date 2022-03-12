<template>
  <div>
    <div
      v-show="showCostType === 0"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
    >
      <el-row style="padding-top: 15px;">
        <el-col :span="23">
          <el-button
            type="primary"
            :disabled="messageBtn"
            size="mini"
            @click="submitForm"
            style="width: 90px;"
          >保存</el-button>
          <el-button
            type="primary"
            size="mini"
            :disabled="messageBtn"
            @click="record"
            style="width: 90px;"
            plain
            v-if="type === 2"
            v-hasPermi="['oms:shippingexport:record']"
          >更改记录</el-button>
          <el-dropdown v-if="form.id">
            <el-button
              type="primary"
              :disabled="messageBtn"
              size="mini"
              style="width: 90px;margin-left: 10px;"
              plain
            >更多操作</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-hasPermi="['oms:shippingexport:del']">
                <span @click="delObject" style="color: #F56C6C;">删除订单</span>
              </el-dropdown-item>
              <el-dropdown-item v-hasPermi="['oms:shippingexport:del']">
                <span @click="cancelObject" style="color: #E6A23C;">取消订单</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span v-if="form.id">
            <span v-if="status == 0" style="margin-left: 30px;color: #F56C6C;">订单已取消</span>
            <el-checkbox
              v-else
              :disabled="messageBtn"
              v-model="status"
              :true-label="2"
              :false-label="1"
              @change="complete"
              style="margin-left: 30px;"
            >已完结</el-checkbox>
          </span>
          <div style="float: right;">
            <span style="font-weight: 900;">{{ form.boxQuantity }}</span>
          </div>
        </el-col>
      </el-row>

      <!-- 操作记录 -->
      <operating-record
        ref="operatingRecord"
        v-if="recordVisible"
        :orderNumber="form.orderNumber"
        :visible.sync="recordVisible"
      ></operating-record>

      <el-row>
        <el-col :span="23" class="divider">
          <el-divider direction="vertical" />
          <h4>客户信息</h4>
        </el-col>
        <el-col :span="23">
          <el-form ref="form1" :model="form" :rules="rules" label-width="110px">
            <el-col :span="6">
              <el-form-item label="客户名称" prop="customerName">
                <el-select
                  ref="customer"
                  style="width: 100%;"
                  v-model="form.customerName"
                  filterable
                  no-data-text="无匹配数据"
                  placeholder="请选择"
                  @change="customerChange"
                  @visible-change="v => visibleChange(v, 'customer', 0, addCustomerClick, '添加客户')"
                >
                  <template v-for="item in customerOptions">
                    <el-option :key="item.id" :label="item.label" :value="item.value"></el-option>
                  </template>
                </el-select>
                <!-- 添加客户 -->
                <add-customer
                  ref="addCustomer"
                  v-if="addCustomerVisible"
                  :title="'添加客户'"
                  :nature="1"
                  :visible.sync="addCustomerVisible"
                  @customer-success="onCustomerSuccess"
                ></add-customer>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="客户编号" class="MytoUpper">
                <el-input v-model.trim="form.customerNum" placeholder="请输入客户编号" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="联系人">
                <el-select
                  ref="contacts"
                  style="width: 100%;"
                  v-model="form.contacts"
                  clearable
                  filterable
                  @change="contactsChange"
                  no-data-text="无匹配数据"
                  placeholder="请选择"
                  @visible-change="v => visibleChange(v, 'contacts', 0, addContactsClick, '添加联系人')"
                >
                  <el-option
                    v-for="item in contactsOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
                <!-- 添加联系人 -->
                <add-contacts
                  ref="addContacts"
                  v-if="addContactsVisible && customerId"
                  :customerId="customerId"
                  :visible.sync="addContactsVisible"
                  @contacts-success="onContactsSuccess"
                ></add-contacts>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="联系电话">
                <el-input v-model.trim="form.contactNumber" placeholder="请输入联系电话" />
              </el-form-item>
            </el-col>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="23" class="divider">
          <el-divider direction="vertical" />
          <h4>业务信息</h4>
        </el-col>
        <el-col :span="23">
          <el-form ref="form2" :model="form" :rules="rules" label-width="110px">
            <el-row>
              <el-col :span="6">
                <el-form-item label="订单编号">
                  <el-input v-model="form.orderNumber" placeholder="系统自动生成" disabled />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="船名" class="MytoUpper">
                  <vxe-pulldown ref="xDown" style="width: 100%;">
                    <template v-slot>
                      <vxe-input
                        v-model="shipsName"
                        placeholder="请输入关键字"
                        @focus="focusEvent"
                        @keyup="keyupEvent"
                        style="width: 100%;"
                      ></vxe-input>
                    </template>
                    <template v-slot:dropdown>
                      <vxe-list
                        height="200"
                        class="my-dropdown"
                        :data="shipsNameOptions"
                        auto-resize
                      >
                        <template v-slot="{ items }">
                          <div
                            class="list-item"
                            v-for="item in items"
                            :key="item.value"
                            @click="selectEvent(item)"
                          >
                            <span>{{ item.label }}</span>
                          </div>
                        </template>
                      </vxe-list>
                    </template>
                  </vxe-pulldown>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="航次" class="MytoUpper">
                  <el-input v-model.trim="voyage1" placeholder="请输入航次" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="船公司" class="MytoUpper">
                  <el-select
                    ref="shipCompany"
                    style="width: 100%;"
                    clearable
                    filterable
                    v-model="form.shippingCompany"
                    no-data-text="无匹配数据"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in shippingCompanyOptions"
                      :disabled="item.type === 2"
                      :key="item.id"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="6">
                <el-form-item label="开港日期">
                  <el-date-picker
                    type="datetime"
                    format="yyyy-MM-dd HH:mm"
                    placeholder="选择日期"
                    v-model="form.openingDate"
                    style="width: 100%;"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="截港日期">
                  <el-date-picker
                    type="datetime"
                    format="yyyy-MM-dd HH:mm"
                    placeholder="选择日期"
                    v-model="form.cutOffDate"
                    style="width: 100%;"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="截单日期">
                  <el-date-picker
                    type="datetime"
                    format="yyyy-MM-dd HH:mm"
                    placeholder="选择日期"
                    v-model="form.dueDate"
                    style="width: 100%;"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="停靠码头">
                  <el-select
                    ref="dock"
                    style="width: 100%;"
                    clearable
                    filterable
                    v-model="form.dock"
                    @focus="dockFocus"
                    no-data-text="无匹配数据"
                    placeholder="请选择"
                  >
                    <template v-for="item in dockOptions">
                      <el-option
                        v-if="item.type == 0"
                        :key="item.id"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </template>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="6">
                <el-form-item label="计划靠泊">
                  <el-date-picker
                    type="datetime"
                    format="yyyy-MM-dd HH:mm"
                    placeholder="选择日期"
                    v-model="form.plannedDocking"
                    style="width: 100%;"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="实际靠泊">
                  <el-date-picker
                    type="datetime"
                    format="yyyy-MM-dd HH:mm"
                    placeholder="选择日期"
                    v-model="form.actualBerthing"
                    style="width: 100%;"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="开船日期">
                  <el-date-picker
                    type="datetime"
                    format="yyyy-MM-dd HH:mm"
                    placeholder="选择日期"
                    v-model="form.shippingDay"
                    style="width: 100%;"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="放箱公司">
                  <el-select
                    ref="putTheBoxCompany"
                    style="width: 100%;"
                    clearable
                    filterable
                    v-model="form.putTheBoxCompany"
                    placeholder="请选择"
                    @visible-change="v => visibleChange(v, 'putTheBoxCompany', 0, addSupplierClick, '添加供应商')"
                  >
                    <template v-for="item in customerOptions">
                      <el-option :key="item.id" :label="item.label" :value="item.value"></el-option>
                    </template>
                  </el-select>
                  <!-- 添加供应商 -->
                  <add-customer
                    ref="addSupplier"
                    v-if="addSupplierVisible"
                    :title="'添加供应商'"
                    :nature="2"
                    :visible.sync="addSupplierVisible"
                    @customer-success="onCustomerSuccess"
                  ></add-customer>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="6">
                <el-form-item label="起运港" class="MytoUpper">
                  <el-input v-model="form.portOfLoading" placeholder="请输入起运港" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="中转港" class="MytoUpper">
                  <el-input v-model="form.portOfDischarge" placeholder="请输入中转港" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="目的港" class="MytoUpper">
                  <el-input v-model="form.placeOfDelivery" placeholder="请输入目的港" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="放箱时间">
                  <el-date-picker
                    type="datetime"
                    format="yyyy-MM-dd HH:mm"
                    placeholder="选择日期"
                    v-model="form.putTheBoxTime"
                    style="width: 100%;"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6" v-for="(item, index) in blNoArray" :key="index">
                <el-form-item :label="'提单号' + (index+1)" class="MytoUpper">
                  <el-input
                    v-model.trim="blNoArray[index].blNo"
                    @change="((val) => {blNoChange(val, index)})"
                    placeholder="请输入提单号"
                  />
                  <el-link v-if="blNoArray.length > 1" :underline="false" class="container">
                    <i class="el-icon-error" @click.prevent="removeBlNo(index)" />
                  </el-link>
                </el-form-item>
              </el-col>
              <el-link
                type="primary"
                :underline="false"
                icon="el-icon-circle-plus"
                style="padding: 8px 0px 8px 50px;loat: left;"
                @click="addBlNo"
              >新增</el-link>
            </el-row>
            <el-row>
              <el-form-item label="操作记录">
                <el-input
                  type="textarea"
                  :rows="4"
                  resize="none"
                  placeholder="请输入操作记录"
                  v-model="form.exceptionRecord"
                ></el-input>
              </el-form-item>
            </el-row>
          </el-form>
        </el-col>
      </el-row>

      <!-- 做箱信息 -->
      <making-chest
        ref="makingChestChild"
        :doorsList="doorsList"
        :receipList="receipList"
        :blNoList="blNoArray"
        :customerId="customerId"
        :baseForm="form"
        :vesselAndVoyage="shipsName + '/' + voyage"
        @change-boxPile="onChangeboxPile"
        @change-childForm="changeChildForm"
      ></making-chest>

      <el-row>
        <el-col :span="23" class="divider">
          <el-divider direction="vertical" />
          <h4>内部信息</h4>
        </el-col>
        <el-col :span="23">
          <el-form ref="form3" :model="form" :rules="rules" label-width="110px">
            <el-col :span="6">
              <el-form-item label="操作员" prop="operator">
                <el-input v-model="form.operator" disabled placeholder="请选择操作员" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="业务员" prop="salesman">
                <el-select
                  ref="salesman"
                  style="width: 100%;"
                  v-model="form.salesman"
                  filterable
                  no-data-text="无匹配数据"
                  placeholder="请选择"
                >
                  <template v-for="item in salemanOptions">
                    <el-option :key="item.id" :label="item.label" :value="item.value"></el-option>
                  </template>
                </el-select>
                <!-- <el-input v-model="form.salesman" disabled placeholder="请选择业务员" /> -->
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="接单日期">
                <el-date-picker
                  type="datetime"
                  format="yyyy-MM-dd HH:mm"
                  placeholder="选择日期"
                  v-model="form.orderTime"
                  style="width: 100%;"
                />
              </el-form-item>
            </el-col>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <div v-if="showCostType === 1">
      <el-page-header @back="reverseBack" content="费用录入"></el-page-header>
      <motorcade-cost-details
        ref="motorcadeCost"
        @refreshList="refreshList()"
        :objForm="childForm"
        @up-down-events="upDownEvents"
      ></motorcade-cost-details>
    </div>

    <!-- 取消对话框 -->
    <el-dialog
      title="取消订单"
      width="30%"
      :visible.sync="cancelOrderVisible"
      :close-on-click-modal="false"
      :before-close="cancel"
      append-to-body
    >
      <el-input
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4 }"
        placeholder="请输入取消原因"
        v-model="reason"
        maxlength="100"
        show-word-limit
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelOrderVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitCancelOrder">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { selectBottomAction } from '@/utils/mixins.js';
import { getCorporateIdentify } from '@/utils/util';
import store from '@/store';
import { mapState } from 'vuex';
import MakingChest from '../../makingChest/index.vue';
import AddCustomer from '../../addCustomer/index.vue';
import AddContacts from '../../addContacts/index.vue';
import OperatingRecord from '../../operatingRecord/index.vue';
import {
  addBusinessOrder,
  updateBusinessOrder,
  updateState,
  delBusinessOrder
} from '@/api/oms/businessOrder';
import MotorcadeCostDetails from '@/views/cost/motorcadeCostDetails/index.vue';
import { validatenull } from '@/utils/ruoyi';
import { getEmployee } from '@/api/system/user';

export default {
  name: 'OrderDetail',
  mixins: [selectBottomAction],
  components: {
    'making-chest': MakingChest,
    'add-customer': AddCustomer,
    'add-contacts': AddContacts,
    'operating-record': OperatingRecord,
    'motorcade-cost-details': MotorcadeCostDetails
  },
  props: {
    temp: {
      type: Object,
      default: null
    },
    type: {
      type: Number,
      default: null
    }
  },
  beforeCreate() {
    document.getElementsByTagName('body')[0].className = 'bg';
  },
  beforeDestroy() {
    document.body.removeAttribute('class', 'bg');
  },

  data() {
    return {
      loading: false,
      // 表单参数
      form: {},
      rules: {
        customerName: [
          { required: true, message: '客户名称不能为空', trigger: 'blur' }
        ],
        operator: [
          { required: true, message: '操作员不能为空', trigger: 'blur' }
        ],
        salesman: [
          { required: true, message: '业务员不能为空', trigger: 'blur' }
        ]
      },
      // 客户
      customerOptions: [],
      customerId: '',
      // 添加客户弹出层
      addCustomerVisible: false,
      // 联系人
      contactsOptions: [],
      // 添加联系人弹出层
      addContactsVisible: false,
      // 船名
      shipsNameOptions: [],
      shipsNameList: [],
      shipsNameLoading: false,
      shipsName: '',
      voyage: '',
      // 船公司
      shippingCompanyOptions: [],
      // 码头
      dockOptions: [],
      // 添加供应商
      addSupplierVisible: false,
      // 提单号数组
      blNoArray: [
        {
          blNo: ''
        }
      ],
      // 操作记录弹出层
      recordVisible: false,
      // 门点
      doorsList: [],
      //寄单地址
      receipList: [],
      showCostType: 0,
      childForm: null,
      // 提单号是否判断存在过
      blnoIsNull: false,
      // 订单状态
      status: null,
      // 取消对话框
      cancelOrderVisible: false,
      reason: '',
      salemanOptions: [],
      messageBtn: false
    };
  },
  created() {
    this.getEmployee();
    this.customerOptions = store.getters.customer;
    if (this.temp !== null) {
      this.status = this.temp.businessState;
      this.form = JSON.parse(JSON.stringify(this.temp));
      // 赋值联系人
      let obj = {};
      obj = this.customerOptions.find((item) => {
        return item.value === this.form.customerName;
      });
      if (obj) {
        this.contactsOptions = obj.contactWayVoList;
        this.customerId = obj.id;
        // 赋值 门点
        this.doorsList = obj.doorsVoList;
        this.receipList = obj.receipVoList;
      }
      // 赋值 船名航次 过滤
      var last = this.form.vesselAndVoyage.lastIndexOf('/');
      this.shipsName = this.form.vesselAndVoyage.substring(0, last);
      this.voyage = this.form.vesselAndVoyage.substring(
        last + 1,
        this.form.vesselAndVoyage.length
      );
      // 赋值提单号
      if (!validatenull(this.form.blNos)) {
        this.blNoArray = [];
        let array = this.form.blNos.split(',');
        for (var i = 0; i < array.length; i++) {
          this.blNoArray.push({
            blNo: array[i]
          });
        }
      }
    } else {
      this.reset();
    }
  },

  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo
    }),
    voyage1: {
      get: function () {
        return this.voyage;
      },
      set: function (val) {
        this.voyage = val.toUpperCase();
      }
    },
    getApplyId() {
      return this.$store.getters.order_diable;
    }
  },
  watch: {
    getApplyId(newValue, oldValue) {
      if (this.userInfo.id === newValue.userId) {
        this.messageBtn = newValue.isDisable;
      }
      this.$forceUpdate();
    }
  },
  mounted() {
    this.shippingCompanyOptions = store.getters.ship_company;
  },
  methods: {
    getEmployee() {
      var corporateIdentify = getCorporateIdentify();
      getEmployee(corporateIdentify).then((response) => {
        if (response.status === 200) {
          this.salemanOptions = response.data;
          // var administructor = {
          //   id: this.userInfo.id,
          //   name: this.userInfo.name,
          //   value: this.userInfo.name
          // };
          // this.salemanOptions.push(administructor);
        }
      });
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        belongCompaniesId: getCorporateIdentify(),
        customerName: undefined,
        customerNum: undefined,
        contacts: undefined,
        contactNumber: undefined,
        orderNumber: undefined,
        orderType: 1,
        blNos: undefined,
        vesselAndVoyage: undefined,
        plannedDocking: undefined,
        actualBerthing: undefined,
        shippingDay: undefined,
        shippingCompany: undefined,
        openingDate: undefined,
        cutOffDate: undefined,
        dueDate: undefined,
        dock: undefined,
        portOfLoading: undefined,
        portOfDischarge: undefined,
        placeOfDelivery: undefined,
        putTheBoxCompany: undefined,
        putTheBoxTime: undefined,
        boxQuantity: undefined,
        exceptionRecord: undefined,
        operator: this.userInfo.name,
        salesman: undefined,
        orderTime: new Date(),
        businessState: 1
      };
      this.resetForm('form');
    },
    // 客户名称下拉框值变更事件
    customerChange(val) {
      let obj = {};
      obj = this.customerOptions.find((item) => {
        return item.value === val;
      });
      this.form.contacts = '';
      this.form.contactNumber = '';
      this.contactsOptions = obj.contactWayVoList;
      this.doorsList = obj.doorsVoList;
      this.receipList = obj.receipVoList;
      this.customerId = obj.id;
      this.form.partner = obj.partner;
      this.form.salesman = obj.salesman;
    },
    // 添加客户
    addCustomerClick() {
      this.addCustomerVisible = true;
    },
    // 添加客户 成功回调
    onCustomerSuccess() {
      var that = this;
      setTimeout(function () {
        that.customerOptions = store.getters.customer;
      }, 1000);
    },
    // 联系人下拉框值变更事件
    contactsChange(val) {
      let obj = {};
      obj = this.contactsOptions.find((item) => {
        return item.value === val;
      });
      if (!validatenull(obj.machineNumber)) {
        this.form.contactNumber = obj.phone + '/' + obj.machineNumber;
      } else {
        this.form.contactNumber = obj.phone;
      }
    },
    // 添加联系人
    addContactsClick() {
      if (this.form.customerName !== undefined) {
        this.addContactsVisible = true;
      } else {
        this.$message({
          message: '请选择客户名称',
          type: 'warning'
        });
      }
    },
    // 添加联系人 成功回调
    onContactsSuccess(res) {
      let arry = {
        id: res.id,
        value: res.contacts,
        label: res.contacts,
        phone: res.phone,
        customerId: res.customerId
      };
      this.contactsOptions.push(arry);
    },
    // 显示下拉面板
    focusEvent() {
      if (this.shipsNameList.length === 0) {
        this.shipsNameList = store.getters.ships_name.map((item) => {
          return { value: `${item}`, label: `${item}` };
        });
      }
      this.$refs.xDown.showPanel();
    },
    // 搜索事件
    keyupEvent() {
      let query = this.shipsName;
      this.shipsNameOptions = this.shipsNameList.filter((item) => {
        return (
          item.label
            .toLowerCase()
            .replace(/\s*/g, '')
            .indexOf(query.toLowerCase().replace(/\s*/g, '')) > -1
        );
      });
    },
    // 选择事件
    selectEvent(item) {
      this.shipsName = item.label;
      this.$refs.xDown.hidePanel().then(() => {
        this.shipsNameOptions = this.shipsNameList;
      });
    },
    // 码头鼠标移入事件
    dockFocus(e) {
      this.dockOptions = store.getters.dock;
    },
    // 添加供应商
    addSupplierClick() {
      this.addSupplierVisible = true;
    },
    // 添加提单号
    addBlNo() {
      let array = this.blNoArray.slice(-1); // 获取数组最后一个元素
      if (array[0].blNo !== '') {
        this.blNoArray.push({
          blNo: ''
        });
      } else {
        if (this.blnoIsNull == false) {
          this.$message({
            message: '请填写完整后，再添加下一行。',
            type: 'warning'
          });
        }
        this.blnoIsNull = false;
      }
    },
    // 删除提单号
    removeBlNo(index) {
      this.blNoArray.splice(index, 1);
    },
    // 提单号改变事件
    blNoChange(value, index) {
      let caseBlNo = value.toUpperCase();
      this.blNoArray[index].blNo = caseBlNo;
      var newArr = this.blNoArray.filter(function (obj) {
        return obj.blNo == caseBlNo;
      });
      if (newArr.length > 1) {
        this.$message({
          message: "提单号：'" + caseBlNo + "' 已存在",
          type: 'warning'
        });
        this.blNoArray[index].blNo = '';
        this.blnoIsNull = true;
      }
    },
    // 赋值箱型箱量
    onChangeboxPile(obj) {
      var props = '';
      for (var p in obj) {
        if (typeof obj[p] == 'function') {
          obj[p]();
        } else {
          props += p + ' * ' + obj[p] + ' + ';
        }
      }
      this.form.boxQuantity = props.substring(0, props.length - 2);
    },
    // 表单提交
    submitForm: function () {
      this.$refs['form1'].validate((valid1) => {
        if (valid1) {
          if (this.form.customerNum != undefined) {
            this.form.customerNum = this.form.customerNum.toUpperCase();
          }
          if (this.form.portOfLoading != undefined) {
            this.form.portOfLoading = this.form.portOfLoading.toUpperCase();
          }
          if (this.form.portOfDischarge != undefined) {
            this.form.portOfDischarge = this.form.portOfDischarge.toUpperCase();
          }
          if (this.form.placeOfDelivery != undefined) {
            this.form.placeOfDelivery = this.form.placeOfDelivery.toUpperCase();
          }
          this.form.vesselAndVoyage = this.shipsName + '/' + this.voyage;
          if (this.blNoArray[0].blNo) {
            this.form.blNos = this.getStrByArr(this.blNoArray);
          }
          this.form.customerId = this.customerId;
          this.$refs['form3'].validate((valid2) => {
            if (valid2) {
              this.loading = true;
              if (this.form.id != undefined) {
                this.form.businessState = null; // 修改时不更改状态
                this.form.userId = this.userInfo.id;
                updateBusinessOrder(this.form).then((response) => {
                  if (response.data.code === 200) {
                    this.loading = false;
                    this.msgSuccess('修改成功');
                    this.$emit('typeChanged', this.form);
                  } else {
                    this.msgError(response.data.msg);
                  }
                });
              } else {
                addBusinessOrder(this.form).then((response) => {
                  if (response.data.code === 200) {
                    this.loading = false;
                    // 赋值id，方便判断是否可添加做箱
                    this.form.id = response.data.data;
                    this.msgSuccess('新增成功');
                    this.$emit('typeChanged', this.form);
                  } else {
                    this.msgError(response.data.msg);
                  }
                });
              }
            } else {
              setTimeout(() => {
                var isError = document.getElementsByClassName('is-error');
                isError[0].querySelector('input').focus();
              }, 100);
              return false;
            }
          });
        }
      });
    },
    // 数组转字符串拼接
    getStrByArr(arr) {
      var str = '';
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].blNo !== '') {
          str += arr[i].blNo + ',';
        } else {
          this.blNoArray.splice(i, 1);
        }
      }
      if (str.length > 0) {
        str = str.substr(0, str.length - 1);
      }
      return str;
    },
    // 操作记录
    record() {
      this.numorder = this.form.orderNumber;
      this.recordVisible = true;
    },
    /** 删除按钮操作 */
    delObject() {
      let that = this;
      this.$confirm('是否确认删除此票订单?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          let data = {
            id: that.form.id,
            orderNumber: that.form.orderNumber
          };
          return delBusinessOrder(data);
        })
        .then(() => {
          this.msgSuccess('删除成功');
          this.$emit('typeChanged', 'del');
        })
        .catch(function () {});
    },
    // 取消订单
    cancelObject() {
      this.cancelOrderVisible = true;
    },
    cancel() {
      this.cancelOrderVisible = false;
    },
    //提交取消
    submitCancelOrder() {
      if (this.reason == '') {
        this.$message({
          message: '请填写取消原因',
          type: 'warning'
        });
      } else {
        var params = {
          id: this.form.id,
          businessState: 0,
          reason: '客服取消原因：' + this.reason
        };
        updateState(params).then((response) => {
          if (response.data.code === 200) {
            if (response.data.data == 1) {
              this.status = 0;
              this.$refs.makingChestChild.getMcList();
              this.msgSuccess('取消成功');
            } else {
              this.$message({
                message: response.data.msg,
                type: 'warning'
              });
            }
            this.reason = '';
            this.cancelOrderVisible = false;
          } else {
            this.msgError(response.data.msg);
          }
        });
      }
    },
    // 完成派单
    complete(val) {
      let that = this;
      const loading = that.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      var params = {
        id: that.form.id,
        businessState: val,
        reason: null
      };
      if (val == 1) {
        // 未完结状态
        updateState(params).then((response) => {
          if (response.data.code === 200) {
            that.msgSuccess('操作成功');
          } else {
            that.msgError(response.data.msg);
          }
          setTimeout(() => {
            loading.close();
          }, 500);
        });
      } else if (val == 2) {
        // 已完结状态
        that
          .$confirm('订单是否已完结?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            updateState(params).then((response) => {
              if (response.data.code === 200) {
                that.msgSuccess('操作成功');
              } else {
                that.msgError(response.data.msg);
              }
              setTimeout(() => {
                loading.close();
              }, 500);
            });
          })
          .catch(function () {
            that.status = 1;
            loading.close();
          });
      }
    },
    // 费用录入
    changeChildForm(obj) {
      this.childForm = obj;
      this.showCostType = 1;
      this.$emit('showChanged', false); // 隐藏订单详情页的“返回”
    },
    // 返回事件
    reverseBack() {
      var temp = this.$refs.motorcadeCost.findReceive();
      if (!temp) {
        this.showCostType = 0;
        window.scrollTo(0, 350);
        this.$emit('showChanged', true);
      } else {
        this.$confirm('费用信息尚未保存, 确定要离开吗?', '注意', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.showCostType = 0;
            window.scrollTo(0, 350);
            this.$emit('showChanged', true);
          })
          .catch(() => {});
      }
    },
    // 上下箱 事件
    upDownEvents(param, callback) {
      var temp = this.$refs.motorcadeCost.findReceive();
      if (!temp) {
        var row = this.$refs.makingChestChild.getRowByIndex(param);
        callback(row);
      } else {
        this.$confirm('费用信息尚未保存, 确定要离开吗?', '注意', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            var row = this.$refs.makingChestChild.getRowByIndex(param);
            callback(row);
          })
          .catch(() => {});
      }
    },
    // 刷新做箱列表
    refreshList() {
      this.$refs.makingChestChild.getMcList();
    }
  }
};
</script>
<style>
.bg {
  overflow: auto;
  min-width: 850px;
}
.divider {
  height: 56px;
  padding: 0;
  align-items: center;
  display: flex;
}
.el-divider--vertical {
  border-left: 3px solid #408eff;
}
.search-keyword {
  text-align: center;
  padding: 3px 0;
  color: #ccc;
  font-size: 13px;
}
.MytoUpper .el-input__inner {
  text-transform: uppercase;
}
.my-dropdown {
  border-radius: 4px;
  background-color: #fff;
  border: 1px solid #dcdfe6;
}
.list-item:hover {
  background-color: #f5f7fa;
}
</style>
<style scoped>
.container {
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(50%, -50%);
  z-index: 1;
}
</style>
