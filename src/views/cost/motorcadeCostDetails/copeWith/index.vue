<template>
  <el-row>
    <el-col :span="23" class="divider">
      <el-divider direction="vertical" />
      <h4>应付明细</h4>
      <!-- <span>&nbsp;&nbsp;{{ costData.caseNumber }}&nbsp;&nbsp;{{ costData.vehicle }}</span> -->
    </el-col>
    <el-col :span="22" :offset="1">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            size="mini"
            @click="submitTable"
            :loading="loadingBut"
          >{{ loadingText }}</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            :disabled="costData.yfState == 1"
            type="primary"
            size="mini"
            @click="addRow(null)"
            plain
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="primary" size="mini" @click="copeRow()" plain>复制成应收</el-button>
        </el-col>
        <el-col :span="1.5">
          <!-- :disabled="costData.yfState == 1" -->
          <vxe-switch
            v-model="costData.yfState"
            @change="switchYfState()"
            on-label="已全"
            :on-value="1"
            off-label="未全"
            :off-value="0"
          ></vxe-switch>
        </el-col>
      </el-row>

      <vxe-table
        border
        keep-source
        show-overflow
        show-footer
        ref="yfTable"
        align="center"
        :loading="loadingList"
        :data="receivablesList"
        :edit-rules="validRules"
        :footer-method="footerMethod"
        @checkbox-all="selectAllEvent"
        @checkbox-change="selectChangeEvent"
        :edit-config="{ trigger: 'click', mode: 'row' }"
      >
        <vxe-table-column type="checkbox" width="60"></vxe-table-column>
        <vxe-table-column
          field="btype"
          title="往来单位"
          width="160"
          :edit-render="{ name: 'ElSelect' }"
        >
          <template v-slot:edit="scope">
            <el-select
              @change="btypeIdChange(scope.row)"
              ref="btype"
              v-model="scope.row.btype"
              :disabled="scope.row.expenseStatus == 3"
              clearable
              filterable
              no-data-text="无匹配数据"
              placeholder="请选择"
              @visible-change="(v) => visibleChange(v, 'btype', 0, addBtypeClick, '添加往来单位')"
            >
              <el-option
                v-for="item in customerOptions"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </vxe-table-column>
        <vxe-table-column
          field="payItems"
          title="付费项目"
          width="120"
          :edit-render="{ name: 'ElSelect' }"
        >
          <template v-slot:edit="scope">
            <el-select
              ref="payItems"
              v-model="scope.row.payItems"
              :disabled="scope.row.expenseStatus == 3"
              clearable
              filterable
              no-data-text="无匹配数据"
              placeholder="请选择"
              @visible-change="(v) => visibleChange(v, 'payItems', 0, addPyItemsClick, '添加费用名称')"
            >
              <el-option
                v-for="item in chargesOptions"
                :key="item.id"
                :label="item.feeName"
                :value="item.feeName"
              ></el-option>
            </el-select>
          </template>
        </vxe-table-column>
        <vxe-table-column field="unitPrice" title="单价" :edit-render="{ name: 'input' }" width="110">
          <template v-slot:edit="{ row }">
            <vxe-input
              v-model="row.unitPrice"
              type="float"
              step="0.1"
              :disabled="row.expenseStatus == 3"
              clearable
            ></vxe-input>
          </template>
        </vxe-table-column>
        <vxe-table-column field="amount" title="数量" :edit-render="{ name: 'input' }" width="90">
          <template v-slot:edit="{ row }">
            <vxe-input
              v-model="row.amount"
              type="float"
              step="1"
              :disabled="row.expenseStatus == 3"
              clearable
            ></vxe-input>
          </template>
        </vxe-table-column>
        <vxe-table-column field="totalPrice" title="总价" width="100">
          <template v-slot="{ row }">
            <span>{{ countAmount(row) }}</span>
          </template>
        </vxe-table-column>
        <vxe-table-column
          field="invoiceNo"
          title="发票号"
          :edit-render="{ name: 'input' }"
          width="110"
        >
          <template v-slot:edit="{ row }">
            <vxe-input :min="0" v-model.trim="row.invoiceNo" :disabled="row.expenseStatus == 3"></vxe-input>
          </template>
        </vxe-table-column>
        <vxe-table-column field="affirmState" title="确认" width="90">
          <template v-slot="{ row }">
            <vxe-switch
              v-model="row.affirmState"
              :disabled="row.expenseStatus == 3"
              @change="switchAffirm(row)"
              on-label="是"
              off-label="否"
            ></vxe-switch>
          </template>
        </vxe-table-column>
        <vxe-table-column field="invoiceState" title="开票" width="90">
          <template v-slot="{ row }">
            <vxe-switch
              v-model="row.invoiceState"
              :disabled="row.affirmState == false || row.expenseStatus == 3"
              @change="switchInvoice(row)"
              on-label="是"
              off-label="否"
            ></vxe-switch>
          </template>
        </vxe-table-column>
        <vxe-table-column field="paymentReceivedState" title="实付" width="90">
          <template v-slot="{ row }">
            <vxe-switch
              v-model="row.paymentReceivedState"
              :disabled="getDisabled(row.invoiceState, row.expenseStatus)"
              @change="switchActualPayment(row)"
              on-label="是"
              off-label="否"
            ></vxe-switch>
          </template>
        </vxe-table-column>
        <vxe-table-column field="remark" title="备注" :edit-render="{ name: 'input' }" width="15%">
          <template v-slot:edit="{ row }">
            <vxe-input :min="0" v-model="row.remark"></vxe-input>
          </template>
        </vxe-table-column>
        <vxe-table-column title="操作" fixed="right" width="150">
          <template slot-scope="scope">
            <el-badge :value="scope.row.invoiceUrlNum" class="item">
              <el-button
                size="mini"
                v-if="scope.row.id"
                type="text"
                style="color: #1890ff"
                @click="uploadinvoice(scope.row, scope.$rowIndex,scope.row.expenseStatus)"
              >代垫发票</el-button>
            </el-badge>
            <!-- :disabled="scope.row.expenseStatus == 3" -->
            <el-button
              size="mini"
              type="text"
              style="color: #f56c6c;margin-top:13px"
              :disabled="getDisabled2(costData.yfState, scope.row.expenseStatus)"
              @click="deleteRow(scope.row)"
            >删除</el-button>
          </template>
        </vxe-table-column>
      </vxe-table>

      <!-- 添加往来单位 -->
      <add-customer
        ref="addBtype"
        v-if="addBtypeVisible"
        :title="'添加往来单位'"
        :nature="3"
        :visible.sync="addBtypeVisible"
        @customer-success="onBtypeSuccess"
      ></add-customer>

      <!-- 添加费用名称 -->
      <add-payItems
        ref="addPayItems"
        v-if="addPayItemsVisible"
        :title="'添加费用名称'"
        :visible.sync="addPayItemsVisible"
        @costs-success="onPayItemsSuccess"
      ></add-payItems>

      <!-- 代垫发票上传弹框-->
      <el-dialog
        title="代垫发票"
        :visible.sync="invoiceOpenVisible"
        width="400px"
        :close-on-click-modal="false"
        append-to-body
        style="text-align: center"
        :before-close="cancel"
      >
        <el-form ref="form" :model="form">
          <el-form-item>
            <el-upload
              action="/api/user/v1/attachment/upload"
              list-type="picture-card"
              :headers="headers"
              :on-preview="handlePictureCardPreview"
              :before-remove="handleRemove"
              :disabled="mineExpenseStatus===3"
              :file-list="invoiceUrlArray"
              :before-upload="beforeAvatarUpload"
              :on-success="handleInvoiceSuccess"
            >
              <div style="height: 25px">
                <i class="el-icon-plus" />
              </div>
              <div>上传照片</div>
            </el-upload>
          </el-form-item>
        </el-form>
        <div class="dialog-footer" style="text-align: center; padding-bottom: 20px">
          <el-button type="primary" @click="submitPicture" :disabled="mineExpenseStatus===3">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
        <el-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="[url]" />
      </el-dialog>
    </el-col>
  </el-row>
</template>
<script>
import store from '@/store';
import { getCorporateIdentify } from '@/utils/util';
import { getCostList, updateCost, setInvoiceUrlById } from '@/api/cost/costMgt';
import ElImageViewer from 'element-ui/packages/image/src/image-viewer';
import { isImage } from '@/utils/util';
import { getToken } from '@/utils/auth';
import { delAttachment } from '@/api/system/attachment';
import { validatenull } from '@/utils/validate';
import Bus from '@/api/bus';
import { updateMakingChest } from '@/api/oms/makingChest';
import { selectBottomAction } from '@/utils/mixins.js';
import AddCustomer from '@/views/oms/addCustomer/index.vue';
import addPayItems from '../../addPayItems/index.vue';
import { checkPermi } from '@/utils/permission';

export default {
  name: 'CopeWith',
  mixins: [selectBottomAction],
  components: {
    ElImageViewer,
    'add-customer': AddCustomer,
    'add-payItems': addPayItems
  },
  props: {
    costObj: {
      type: Object,
      default: null
    },
    vehicle: {
      type: String,
      default: ''
    }
  },
  watch: {
    costObj: function (newVal, oldVal) {
      this.costData = newVal;
      this.getList();
    }
  },
  data() {
    return {
      costData: null,
      loadingBut: false,
      loadingText: '保存',
      loadingList: false,
      // 表格数据
      receivablesList: [],
      // 选中数组
      multipleSelection: [],
      // 往来单位
      customerOptions: [],
      // 添加往来单位
      addBtypeVisible: false,
      // 收费项目
      chargesOptions: [],
      // 添加费用名称
      addPayItemsVisible: false,
      validRules: {
        btype: [{ required: true, message: '往来单位必须填写' }],
        payItems: [{ required: true, message: '收费项目必须填写' }]
      },
      //是否弹出上传代垫发票弹框
      invoiceOpenVisible: false,
      //显示图片查看器
      showViewer: false,
      url: '',
      invoiceUrlArray: [],
      imgUrlArray: [],
      form: {},
      invoiceIndex: 0,
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      mineExpenseStatus: 0
    };
  },
  created() {
    this.costData = this.costObj;
    this.getList();
  },
  mounted() {
    this.customerOptions = store.getters.customer; // 获取往来单位
    this.chargesOptions = store.getters.costs_set; // 获取费用设置
  },
  methods: {
    //判断应收是否有改变
    isNotChange() {
      //1 长度不同
      var insert = this.$refs.yfTable.getInsertRecords().length;
      var update = this.$refs.yfTable.getUpdateRecords().length;
      var remove = this.$refs.yfTable.getRemoveRecords().length;
      if (insert != 0 || update != 0 || remove != 0) {
        return true;
      } else {
        return false;
      }
    },
    //图片上传成功
    handleInvoiceSuccess(res, file, fileList) {
      this.imgUrlArray = [];
      this.imgUrlArray.push(res.data.previewUrl);
      this.imgUrlArray.push(this.form.invoiceUrl);
      var urlString = this.imgUrlArray.toString();
      //如果最后一位有逗号，删除逗号
      if (urlString.charAt(urlString.length - 1) == ',') {
        this.form.invoiceUrl = urlString.substring(
          0,
          urlString.lastIndexOf(',')
        );
      } else {
        this.form.invoiceUrl = urlString;
      }
    },
    //移除照片
    handleRemove(file, fileList) {
      if (file && file.status === 'success') {
        return this.$confirm('是否删除该文件, 是否继续?', '系统提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        })
          .then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          })
          .then(() => {
            var urlString = this.form.invoiceUrl.split(',');
            //判断删除的图片在当前图片数组中的位置，并删除
            if (file.hasOwnProperty('response')) {
              var indexOf = urlString.indexOf(file.response.data.previewUrl);
            } else {
              var indexOf = urlString.indexOf(file.url);
            }
            if (indexOf > -1) {
              urlString.splice(indexOf, 1);
            }
            this.form.invoiceUrl = urlString.toString();
            //从图片表中根据图片uid删除
            if (file.uid != undefined) {
              delAttachment(file.uid).then((response) => {});
            }
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除!'
            });
            reject(false);
          });
      }
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
      if (!isJPG || !isLt10M) {
        return isJPG && isLt10M;
      }
    },
    //上传代垫发票
    uploadinvoice(row, index, expenseStatus) {
      this.mineExpenseStatus = expenseStatus;
      if (row.invoiceUrl != undefined && row.invoiceUrl != '') {
        var invoiceUrlA = row.invoiceUrl.split(',');
        for (var i = 0; i < invoiceUrlA.length; i++) {
          if (invoiceUrlA[i] != '') {
            let invoiceUrl = { url: invoiceUrlA[i] };
            this.invoiceUrlArray.push(invoiceUrl);
          }
        }
        this.form.invoiceUrl = row.invoiceUrl;
      } else {
        this.form.invoiceUrl = row.invoiceUrl;
      }
      this.invoiceIndex = index;
      this.invoiceOpenVisible = true;
    },
    //点击上传
    submitPicture() {
      let fullData = this.$refs.yfTable.getTableData().fullData;
      //根据id修改代垫发票
      var costId =
        this.$refs.yfTable.getTableData().fullData[this.invoiceIndex].id;
      //修改
      var param = {
        costId: costId,
        imageUrl: this.form.invoiceUrl
      };
      setInvoiceUrlById(param).then((response) => {
        if (response.data.code === 200) {
          this.msgSuccess('上传成功');
        } else {
          this.msgError(response.data.msg);
        }
      });

      fullData[this.invoiceIndex].invoiceUrl = this.form.invoiceUrl;
      this.form = {
        invoiceUrl: undefined
      };
      this.invoiceOpenVisible = false;
      (this.imgUrlArray = []), (this.invoiceUrlArray = []);
    },
    cancel() {
      this.invoiceUrlArray = [];
      this.imgUrlArray = [];
      this.form = {
        invoiceUrl: undefined
      };
      this.invoiceOpenVisible = false;
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
    getList() {
      this.loadingList = true;
      var params = {
        mcId: this.costData.mcId,
        costTypes: 2,
        vehicleCost: this.vehicle
      };
      // 做箱id 费用类型 查询应收
      getCostList(params).then((response) => {
        response.data.forEach((res) => {
          if (!validatenull(res.invoiceUrl)) {
            var num = res.invoiceUrl.split(',').length;
            res.invoiceUrlNum = num;
          }
        });
        this.$refs.yfTable.loadData(response.data);
        this.loadingList = false;
      });
    },
    // 添加行
    addRow(row) {
      let yfTable = this.$refs.yfTable;
      let record = {
        id: undefined,
        belongCompaniesId: getCorporateIdentify(),
        mcId: this.costData.mcId,
        vehicleCost: this.vehicle,
        btypeId: undefined,
        btype: undefined,
        partner: undefined,
        payer: undefined,
        payItems: undefined,
        unitPrice: undefined,
        amount: undefined,
        totalPrice: undefined,
        affirmState: false, // 确认
        invoiceState: false, // 应收开票/实付开票
        paymentReceivedState: false, // 实收/实付
        expenseStatus: 0,
        invoiceNo: undefined,
        remark: undefined,
        costTypes: 2
      };
      yfTable.insertAt(record, row).then(({ row }) => {
        yfTable.setActiveRow(row);
      });
    },
    // 删除行
    deleteRow(row) {
      this.$XModal.confirm('您确定要删除该数据?').then((type) => {
        if (type === 'confirm') {
          this.$refs.yfTable.remove(row);
        }
      });
    },
    // 总价
    countAmount(row) {
      let totalPrice = this.$utils
        .multiply(row.unitPrice, row.amount)
        .toFixed(2);
      row.totalPrice = totalPrice;
      return totalPrice;
    },
    // 表尾合计
    footerMethod({ columns, data }) {
      return [
        columns.map((column, columnIndex) => {
          if (columnIndex === 1) {
            return '合计金额';
          }
          if (['totalPrice'].includes(column.property)) {
            let total = this.$utils.sum(data, column.property).toFixed(2);
            if (this.$route.name == 'Analysis') {
              store.dispatch('setYfTotalAnalysis', total).then(() => {});
            } else {
              store.dispatch('setYfTotalCost', total).then(() => {});
            }
            return total;
          }
          return null;
        })
      ];
    },
    // 添加往来单位
    addBtypeClick() {
      this.addBtypeVisible = true;
    },
    btypeIdChange(row) {
      var newArr = this.customerOptions.filter(function (obj) {
        return obj.value == row.btype;
      });
      if (newArr.length > 0) {
        row.btypeId = newArr[0].id;
        row.partner = newArr[0].partner;
        row.payer = newArr[0].payer;
      }
    },
    // 添加往来单位 成功回调
    onBtypeSuccess() {
      var that = this;
      setTimeout(function () {
        that.customerOptions = store.getters.customer;
      }, 1000);
    },
    // 添加费用名称
    addPyItemsClick() {
      this.addPayItemsVisible = true;
    },
    // 添加费用名称 成功回调
    onPayItemsSuccess() {
      var that = this;
      setTimeout(function () {
        that.chargesOptions = store.getters.costs_set;
      }, 1000);
    },
    // 实付  判断是否禁用
    getDisabled(invoiceState, expenseStatus) {
      let corporateIdentify = store.getters.userInfo.corporateIdentify;
      if (invoiceState == false) {
        return true;
      } else if (corporateIdentify.length > 5) {
        return false;
      } else if (expenseStatus == 3) {
        return true;
      }
    },
    // 删除  判断是否禁用
    getDisabled2(yfState, expenseStatus) {
      let corporateIdentify = store.getters.userInfo.corporateIdentify;
      if (corporateIdentify.length > 5) {
        return false;
      } else if (yfState == 1) {
        return true;
      } else if (expenseStatus == 3) {
        return true;
      }
    },
    // 已全 选中事件
    switchYfState() {
      let completeState = checkPermi(['cost:detailed:complete']);
      let incompleteState = checkPermi(['cost:detailed:incomplete']);
      let insertData = this.$refs.yfTable.getInsertRecords();
      if (insertData.length == 0) {
        let fullData = this.$refs.yfTable.getTableData().fullData;
        if (this.costData.yfState == 1) {
          if (completeState) {
            this.$confirm('‘应付已全’ 将无法新增与删除, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(() => {
                // 存入数据库，刷新做箱列表
                var params = {
                  id: this.costData.mcId,
                  ysState: -1,
                  yfState: this.costData.yfState,
                  ptysState: -1
                };
                updateMakingChest(params).then((response) => {
                  if (response.data.code === 200) {
                    if (!this.costData.id) {
                      this.$emit('refreshList');
                    }
                    this.msgSuccess('操作成功');
                  } else {
                    this.msgError(response.data.msg);
                  }
                });
              })
              .catch(() => {
                this.costData.yfState = 0;
              });
          } else {
            this.costData.yfState = 0;
            this.$notify.error({
              title: '当前操作没有权限'
            });
          }
        } else {
          if (incompleteState) {
            // 存入数据库，刷新做箱列表
            var params = {
              id: this.costData.mcId,
              ysState: -1,
              yfState: this.costData.yfState,
              ptysState: -1
            };
            updateMakingChest(params).then((response) => {
              if (response.data.code === 200) {
                if (!this.costData.id) {
                  this.$emit('refreshList');
                }
                this.msgSuccess('操作成功');
              } else {
                this.msgError(response.data.msg);
              }
            });
          } else {
            this.costData.yfState = 1;
            this.$notify.error({
              title: '当前操作没有权限'
            });
          }
        }
      } else {
        this.costData.yfState = 0;
        this.$message({
          message: '请先保存数据',
          type: 'warning'
        });
      }
    },
    // 确认选中事件
    switchAffirm(row) {
      let state = checkPermi(['cost:detailed:confirm']);
      if (state) {
        if (row.affirmState == false) {
          row.invoiceState = false;
          row.paymentReceivedState = false;
          row.expenseStatus = 0;
        } else {
          row.expenseStatus = 1;
        }
      } else {
        row.affirmState = false;
        this.$notify.error({
          title: '当前操作没有权限'
        });
      }
    },
    // 开票选中事件
    switchInvoice(row) {
      let state = checkPermi(['cost:detailed:invoice']);
      if (state) {
        if (!validatenull(row.invoiceNo)) {
          row.expenseStatus = 2;
        } else {
          row.invoiceState = false;
          this.$message({
            message: '请先输入发票号',
            type: 'warning'
          });
        }
      } else {
        row.invoiceState = false;
        this.$notify.error({
          title: '当前操作没有权限'
        });
      }
    },
    // 实付选中事件
    switchActualPayment(row) {
      let state = checkPermi(['cost:detailed:payment']);
      if (state) {
        if (row.paymentReceivedState == true) {
          this.$confirm('实付后无法修改, 是否继续?', '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(function () {
              row.expenseStatus = 3;
            })
            .catch(function () {
              row.paymentReceivedState = false;
            });
        } else {
          row.expenseStatus = 2;
        }
      } else {
        row.paymentReceivedState = false;
        this.$notify.error({
          title: '当前操作没有权限'
        });
      }
    },
    // 保存应收明细
    async submitTable() {
      this.loadingBut = true;
      this.loadingText = '保存中';
      const errMap = await this.$refs.yfTable
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
        let fullData = this.$refs.yfTable.getTableData().fullData;
        for (var i = 0, len = fullData.length; i < len; i++) {
          fullData[i].vehicleCost = this.vehicle;
        }
        this.loadingList = true;
        if (fullData.length == 0) {
          let arry = [
            {
              mcId: this.costData.mcId,
              costTypes: 2,
              vehicleCost: this.vehicle
            }
          ];
          updateCost(arry).then((response) => {
            if (response.data.code === 200) {
              this.msgSuccess('保存成功');
              this.$emit('updateMakingProfit');
              (this.imgUrlArray = []),
                (this.invoiceUrlArray = []),
                setTimeout(() => {
                  this.loadingList = false;
                  this.loadingBut = false;
                  this.loadingText = '保存';
                }, 1000);
            }
          });
        } else {
          updateCost(fullData).then((response) => {
            if (response.data.code === 200) {
              this.msgSuccess('保存成功');
              this.$emit('updateMakingProfit');
              this.getList();
              (this.imgUrlArray = []),
                (this.invoiceUrlArray = []),
                setTimeout(() => {
                  this.loadingList = false;
                  this.loadingBut = false;
                  this.loadingText = '保存';
                }, 1000);
            }
          });
        }
      }
    },
    // 全选事件
    selectAllEvent({ checked, records }) {
      this.multipleSelection = records;
    },
    // 勾选事件
    selectChangeEvent({ checked, records }) {
      this.multipleSelection = records;
    },
    // 复制
    copeRow() {
      if (this.multipleSelection.length > 0) {
        let array = JSON.parse(JSON.stringify(this.multipleSelection));
        for (var i = 0; i < array.length; i++) {
          array[i].id = undefined;
          array[i].btype = this.costData.customerName;
          array[i].btypeId = this.costData.customerId;
          array[i].affirmState = false;
          array[i].invoiceState = false;
          array[i].paymentReceivedState = false;
          array[i].expenseStatus = 0;
          array[i].costTypes = 1;
          array[i].invoiceNo = undefined;
        }
        Bus.$emit('copeYF', array);
      } else {
        this.$message({
          message: '请勾选需要复制的数据',
          type: 'warning'
        });
      }
    }
  }
};
</script>
<style scoped>
.vxe-switch {
  padding: 0;
}
.item {
  margin-right: 10px;
}
.el-upload-list__item {
  transition: none !important;
}
</style>
