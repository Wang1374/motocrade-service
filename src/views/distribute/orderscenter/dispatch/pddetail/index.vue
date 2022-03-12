<template>
  <div>
    <div
      v-show="showCostType === 0"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
    >
      <el-row style="padding-top: 15px">
        <el-col :span="23">
          <el-button
            type="primary"
            size="mini"
            :loading="loadingBtn"
            @click="submitForm"
            style="width: 90px"
          >保存</el-button>
          <el-button type="primary" size="mini" @click="record" style="width: 90px" plain>更改记录</el-button>
          <el-button
            type="danger"
            size="mini"
            @click="cancelOrderChange"
            style="width: 90px"
            plain
          >取消订单</el-button>

          <div style="float: right">
            <span style="font-weight: 900">{{ form.boxQuantity }}</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="23">
          <div v-if="status == 0" style="text-align: center;color: #F56C6C;">
            <span>订单已取消</span>
          </div>
          <el-steps v-else :active="status - 1" finish-status="success" style="margin-top: 15px;">
            <el-step title="已接单" @click.native="checkedChange(2)"></el-step>
            <el-step title="已派单" @click.native="checkedChange(3)"></el-step>
            <el-step title="已完结" @click.native="checkedChange(4)"></el-step>
          </el-steps>
        </el-col>
      </el-row>

      <!-- 操作记录 -->
      <operating-record
        ref="operatingRecord"
        v-if="recordVisible"
        :orderNumber="form.orderNumber"
        :visible.sync="recordVisible"
      ></operating-record>

      <!-- 客户信息 -->
      <el-row>
        <el-col :span="23" class="divider">
          <el-divider direction="vertical" />
          <h4>客户信息</h4>
        </el-col>
        <el-col :span="23">
          <el-form ref="form1" :model="form" :rules="rules" label-width="110px">
            <el-col :span="6">
              <el-form-item label="客户名称" prop="companyName">
                <el-select
                  ref="customer"
                  style="width: 100%"
                  v-model="form.companyName"
                  filterable
                  disabled
                  no-data-text="无匹配数据"
                  placeholder="请选择"
                >
                  <template v-for="item in customerOptions">
                    <el-option
                      v-if="item.type == 1"
                      :key="item.id"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </template>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="客户编号" class="MytoUpper">
                <el-input v-model.trim="form.customerNum" placeholder="请输入客户编号" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="联系人">
                <el-input v-model.trim="form.singleUser" placeholder="请输入联系人" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="联系电话">
                <el-input v-model.trim="form.singlePhone" placeholder="请输入联系电话" />
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
                  <el-select
                    v-model="shipsName"
                    ref="searchSelect"
                    style="width: 100%"
                    filterable
                    remote
                    :remote-method="remoteMethod"
                    @focus="shipsNameFocus"
                    :loading="shipsNameLoading"
                    no-data-text="无匹配数据"
                    placeholder="请输入关键字"
                  >
                    <el-option
                      v-for="item in shipsNameOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                    <div v-if="shipsNameOptions.length > 49" class="search-keyword">
                      <span>只显示前50条结果，请完善搜索关键字</span>
                    </div>
                  </el-select>
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
                    style="width: 100%"
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
                    style="width: 100%"
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
                    style="width: 100%"
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
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="停靠码头">
                  <el-select
                    ref="dock"
                    style="width: 100%"
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
                    style="width: 100%"
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
                    style="width: 100%"
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
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="放箱公司">
                  <el-select
                    ref="putTheBoxCompany"
                    style="width: 100%"
                    clearable
                    filterable
                    v-model="form.putTheBoxCompany"
                    placeholder="请选择"
                    @visible-change="
                      (v) =>
                        visibleChange(
                          v,
                          'putTheBoxCompany',
                          0,
                          addSupplierClick,
                          '添加供应商'
                        )
                    "
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
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6" v-for="(item, index) in blNoArray" :key="index">
                <el-form-item :label="'提单号' + (index + 1)" class="MytoUpper">
                  <el-input
                    v-model.trim="blNoArray[index].blNo"
                    @change="
                      (val) => {
                        blNoChange(val, index);
                      }
                    "
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
                style="padding: 8px 0px 8px 50px; loat: left"
                @click="addBlNo"
              >新增</el-link>
            </el-row>
            <el-row>
              <el-form-item label="操作记录">
                <el-input
                  type="textarea"
                  :rows="6"
                  resize="none"
                  placeholder="请输入操作记录"
                  v-model="form.exceptionRecord"
                ></el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="下单备注">
                <el-input
                  type="textarea"
                  :rows="4"
                  resize="none"
                  :disabled="true"
                  v-model="form.remark"
                ></el-input>
              </el-form-item>
            </el-row>

            <!-- 附件 -->
            <el-row>
              <el-form-item label="附件">
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
              </el-form-item>
            </el-row>
          </el-form>
        </el-col>
      </el-row>
      <!-- 图片查看 -->
      <el-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="[url]" />
      <!-- 做箱信息 -->
      <making-chest
        ref="makingChestChild"
        :doorsList="doorsList"
        :blNoList="blNoArray"
        :customerId="customerId"
        :orderId="orderId"
        :placeOrderNumber="placeOrderNumber"
        :baseForm="form"
        :status.sync="status"
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
                <el-input v-model="form.salesman" disabled placeholder="请选择业务员" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="接单日期">
                <el-date-picker
                  type="datetime"
                  format="yyyy-MM-dd HH:mm"
                  placeholder="选择日期"
                  v-model="form.orderTime"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-form>
        </el-col>
      </el-row>
    </div>

    <div v-if="showCostType === 1">
      <el-page-header @back="reverseBack" content="费用录入"></el-page-header>
      <platform-cost-details
        @refreshList="refreshList"
        :objForm="childForm"
        @up-down-events="upDownEvents"
      ></platform-cost-details>
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
import ElImageViewer from 'element-ui/packages/image/src/image-viewer';
import { selectBottomAction } from '@/utils/mixins.js';
import store from '@/store';
import { mapState } from 'vuex';
import MakingChest from '../makingchest/index';
import AddCustomer from '@/views/oms/addCustomer/index.vue';
import OperatingRecord from '@/views/oms/operatingRecord/index.vue';
import { updateBusinessOrder } from '@/api/oms/businessOrder';
import { validatenull } from '@/utils/ruoyi';
import {
  cancelDisparcherOrder,
  dispatchOrder
} from '@/api/distribute/businessCenter';
import PlatformCostDetails from '@/views/cost/platformCostDetails/index.vue';

export default {
  name: 'Dispatch',
  mixins: [selectBottomAction],
  components: {
    'making-chest': MakingChest,
    'add-customer': AddCustomer,
    'operating-record': OperatingRecord,
    'platform-cost-details': PlatformCostDetails,
    ElImageViewer
  },
  props: {
    temp: {
      type: Object,
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
      loadingBtn: false,
      // 文件显示数组
      appendixArray: [],
      //显示图片查看器
      showViewer: false,
      url: '',
      // 表单参数
      form: {},
      rules: {
        companyName: [
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
      showCostType: 0,
      childForm: null,
      // 提单号是否判断存在过
      blnoIsNull: false,
      checked: 4,
      // 订单id
      orderId: '',
      // 下单编号
      placeOrderNumber: '',
      // 订单状态
      status: null,
      // 取消对话框
      cancelOrderVisible: false,
      reason: '',
      //箱型箱量
      boxData: ''
    };
  },
  created() {
    const loading = this.$loading({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    });
    //赋值附件
    if (this.temp.appendixUrl != null) {
      this.appendixArray.push({
        name: this.temp.appendixName,
        url: this.temp.appendixUrl
      });
    }
    // 赋值客户
    this.customerOptions = store.getters.customer;
    //赋值订单id
    this.orderId = this.temp.id;
    this.placeOrderNumber = this.temp.placeOrderNumber;
    this.status = this.temp.orderStatus;
    // 赋值表单
    this.form = JSON.parse(JSON.stringify(this.temp));
    let obj = {};
    obj = this.customerOptions.find((item) => {
      return item.value === this.form.companyName;
    });
    if (obj) {
      // 赋值业务员
      this.form.salesman = obj.salesman;
      // 赋值客户id
      this.customerId = obj.id;
      // 赋值门点
      this.doorsList = obj.doorsVoList;
    }
    // 赋值 船名航次 过滤
    if (!validatenull(this.form.vesselAndVoyage)) {
      var last = this.form.vesselAndVoyage.lastIndexOf('/');
      this.shipsName = this.form.vesselAndVoyage.substring(0, last);
      this.voyage = this.form.vesselAndVoyage.substring(
        last + 1,
        this.form.vesselAndVoyage.length
      );
    }

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
    // 获取当前操作人员
    if (this.form.modifier == null) {
      this.form.operator = this.userInfo.name;
    }
    setTimeout(() => {
      loading.close();
    }, 1000);
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
      company: (state) => state.constant.company
    }),
    voyage1: {
      get: function () {
        return this.voyage;
      },
      set: function (val) {
        this.voyage = val.toUpperCase();
      }
    }
  },
  mounted() {
    this.shippingCompanyOptions = store.getters.ship_company;
  },
  methods: {
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
    },
    // 添加客户供应商/ 成功回调
    onCustomerSuccess() {
      var that = this;
      setTimeout(function () {
        that.customerOptions = store.getters.customer;
      }, 1000);
    },
    // 船名下拉框搜索事件
    remoteMethod(query) {
      this.shipsName = query;
      if (query !== '') {
        this.shipsNameLoading = true;
        setTimeout(() => {
          this.shipsNameLoading = false;
          this.shipsNameOptions = this.shipsNameList
            .filter((item) => {
              return (
                item.label
                  .toLowerCase()
                  .replace(/\s*/g, '')
                  .indexOf(query.toLowerCase().replace(/\s*/g, '')) > -1
              );
            })
            .slice(0, 50);
        });
      } else {
        this.shipsNameOptions = this.shipsNameList.slice(0, 50);
      }
    },
    // 船名鼠标移入事件
    shipsNameFocus(e) {
      if (this.shipsNameList.length === 0) {
        this.shipsNameList = store.getters.ships_name.map((item) => {
          return { value: `${item}`, label: `${item}` };
        });
      }
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
    submitForm() {
      var val = this.$refs.makingChestChild.selectBoxPile;

      if (this.$refs.makingChestChild.isChangeBox) {
        this.form.boxQuantity = val;
      }

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
          this.form.blNos = this.getStrByArr(this.blNoArray);
          if (this.status == 0) {
            this.form.orderStatus = this.status;
            this.form.businessState = 0;
          }
          if (this.blNoArray.length === 0) {
            this.blNoArray = [
              {
                blNo: ''
              }
            ];
          }
          this.$refs['form3'].validate((valid2) => {
            if (valid2) {
              this.loadingBtn = true;
              if (this.form.id != undefined) {
                if (this.status == 4) {
                  this.form.businessState = 2;
                }
                updateBusinessOrder(this.form).then((response) => {
                  if (response.data.code === 200) {
                    this.$refs.makingChestChild.submitTable().then((res) => {
                      if (res === 200) {
                        this.loadingBtn = false;
                        this.msgSuccess('保存成功');
                        this.$emit('typeChanged', this.form);
                      }
                    });
                  } else {
                    this.loadingBtn = false;
                    this.msgError(response.data.msg);
                  }
                });
              } else {
                this.msgSuccess('错误！！！！！！！！！！！！！');
              }
            } else {
              setTimeout(() => {
                var isError = document.getElementsByClassName('is-error');
                isError[0].querySelector('input').focus();
              }, 100);
              return false;
            }
          });
        } else {
          setTimeout(() => {
            var isError = document.getElementsByClassName('is-error');
            isError[0].querySelector('input').focus();
          }, 100);
          return false;
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
    // 取消订单
    cancelOrderChange() {
      this.blNosAndBox =
        '提单号：' + this.form.blNos + ';箱型箱量' + this.form.boxQuantity;
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
        var companyIdArray = new Set(
          this.$refs.makingChestChild.makingChestList.map((res) => {
            return res.companyId;
          })
        );
        var companyIds = Array.from(companyIdArray).join(',');
        var params = {
          id: this.form.id,
          placeId: this.form.placeId,
          reason: '客服取消原因：' + this.reason,
          companyIds: companyIds,
          orderNumber: this.form.orderNumber,
          companyName: this.company.companyName,
          blNosAndBox: this.blNosAndBox
        };
        cancelDisparcherOrder(params).then((response) => {
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
    // 更改状态
    checkedChange(val) {
      let that = this;
      const loading = that.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      var params = {
        id: this.orderId,
        placeOrderNumber: that.form.placeOrderNumber,
        orderStatus: val
      };
      if (val == 2) {
        // 已接单状态
        if (that.status != 2) {
          dispatchOrder(params).then((response) => {
            if (response.data.code === 200) {
              that.status = 2;
              that.msgSuccess('操作成功');
            } else {
              that.msgError(response.data.msg);
            }
            setTimeout(() => {
              loading.close();
            }, 500);
          });
        } else {
          loading.close();
        }
      } else if (val == 3) {
        // 已派单状态
        if (that.status != 3) {
          that
            .$confirm('订单是否全部派单完成?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
            .then(() => {
              dispatchOrder(params).then((response) => {
                if (response.data.code === 200) {
                  that.status = 3;
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
              loading.close();
            });
        } else {
          loading.close();
        }
      } else {
        // 已完结状态
        if (that.status != 4) {
          that
            .$confirm('是否确认完结订单?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
            .then(() => {
              dispatchOrder(params).then((response) => {
                if (response.data.code === 200) {
                  that.status = 4;
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
              loading.close();
            });
        } else {
          loading.close();
        }
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
      this.showCostType = 0;
      window.scrollTo(0, 350);
      this.$emit('showChanged', true); // 显示订单详情页的“返回”
    },
    // 上下箱 事件
    upDownEvents(param, callback) {
      var row = this.$refs.makingChestChild.getRowByIndex(param);
      callback(row);
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
