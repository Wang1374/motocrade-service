<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryParams" class="demo-form-inline" @submit.native.prevent>
      <el-form-item prop="vehicle">
        <el-select
          ref="vehicle"
          clearable
          allow-create
          style="width: 100%"
          v-model="queryParams.vehicle"
          no-data-text="无匹配数据"
          @change="vehicleNameQuery"
          placeholder="全部车辆"
          filterable
        >
          <el-option
            v-for="item in vehicleOptions"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="costDate">
        <el-date-picker
          v-model="params.tyreDate"
          style="width: 100%"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </el-form-item>
      <el-form-item prop="invoiceNum">
        <el-input
          v-model="queryParams.invoiceNum"
          placeholder="请输入发票号"
          clearable
          @keyup.enter.native="getList"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="getList">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-row>
      <el-col :span="1.5">
        <el-button
          type="primary"
          style="margin-bottom: 10px"
          size="mini"
          icon="el-icon-plus"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
    </el-row>

    <el-table
      border
      ref="multipleTable"
      :data="carTyreList"
      style="width: 100%"
      v-loading="loading"
    >
      <!-- <el-table-column type="selection" width="55"></el-table-column> -->
      <el-table-column
        v-if="userInfo.employeeId==-1"
        prop="employeeName"
        label="供应商"
        align="center"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="车牌号" align="center" prop="vehicle"></el-table-column>
      <el-table-column label="日期" align="center" width="100">
        <template v-slot:edit="{ row }">
          <el-date-picker v-model="row.tyreDate" type="date"></el-date-picker>
        </template>
        <template v-slot="{ row }">
          {{
          formatTiem(row.tyreDate, "yyyy/MM/dd")
          }}
        </template>
      </el-table-column>
      <el-table-column prop="mileage" label="公里数" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column
        prop="tyreProject"
        label="费用名称"
        align="center"
        show-overflow-tooltip
        :formatter="projectFilter"
      ></el-table-column>
      <el-table-column prop="tyreNum" label="料号" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="tyrePrice" label="金额(CNY/L)" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="invoiceNum" label="发票号" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="remark" label="备注" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="affirmState" label="确认" align="center" show-overflow-tooltip>
        <template v-slot="{ row }">
          <vxe-switch
            v-model="row.affirmState"
            :disabled="row.expenseStatus == 3"
            on-label="是"
            off-label="否"
            @change="switchAffirm(row)"
          ></vxe-switch>
        </template>
      </el-table-column>
      <el-table-column prop="invoiceState" label="开票" align="center" show-overflow-tooltip>
        <template v-slot="{ row }">
          <vxe-switch
            v-model="row.invoiceState"
            :disabled="row.affirmState == false || row.expenseStatus == 3"
            on-label="是"
            off-label="否"
            @change="switchInvoice(row)"
          ></vxe-switch>
        </template>
      </el-table-column>
      <el-table-column prop="paymentReceivedState" label="已付" align="center" show-overflow-tooltip>
        <template v-slot="{ row }">
          <vxe-switch
            v-model="row.paymentReceivedState"
            :disabled="getDisabled(row.invoiceState, row.expenseStatus)"
            on-label="是"
            off-label="否"
            @change="switchActualPayment(row)"
          ></vxe-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" style="text-align: center" align="center">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-edit"
            type="text"
            :disabled="scope.row.expenseStatus==3"
            size="mini"
            @click="updateTyreCost(scope.row)"
          >修改</el-button>
          <el-button
            type="text"
            icon="el-icon-delete"
            :disabled="scope.row.expenseStatus==3"
            size="mini"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <el-dialog
      title="材料费用"
      :visible.sync="dialogVisible"
      width="600px"
      :dialogVisible="dialogVisible"
      :before-close="handleClose"
      :close-on-click-modal="false"
      append-to-body
      center
    >
      <el-form ref="form" :rules="rules" :model="form" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="车牌号" class="MytoUpper" prop="vehicle">
              <el-select
                ref="vehicle"
                filterable
                allow-create
                style="width: 100%"
                v-model="form.vehicle"
                no-data-text="无匹配数据"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in vehicleOptions"
                  :key="item.id"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发票号" prop="invoiceNum">
              <el-input v-model="form.invoiceNum"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="费用名称" prop="tyreProject">
              <el-select v-model="form.tyreProject">
                <el-option label="换轮胎" value="1"></el-option>
                <el-option label="补胎" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="金额" prop="tyrePrice">
              <el-input-number controls-position="right" v-model.number="form.tyrePrice"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="日期" prop="tyreDate">
              <el-date-picker
                type="date"
                placeholder="选择日期"
                v-model="form.tyreDate"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公里数" prop="mileage">
              <el-input v-model="form.mileage"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="料号" prop="tyreNum">
              <el-input type="text" v-model="form.tyreNum"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="ticketUrl">
              <el-upload
                ref="upload"
                :class="{ hide: ticketHide }"
                :headers="headers"
                action="/api/user/v1/attachment/upload"
                accept=".doc, .docx, .xls, .xlsx, .ppt, .pptx, .pdf, .zip, .rar, .jpg, .png"
                :on-success="handleUploadSuccess"
                :on-remove="handleUploadRemove"
                :on-preview="handlePictureCardPreview"
                :before-upload="handleBeforeUpload"
                :file-list="appendixArray"
                :on-change="appendixChange"
                :limit="imgLimit"
                :on-exceed="exceedLimit"
              >
                <el-button slot="trigger" type="text" icon="el-icon-circle-plus">选取文件</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input  type="textarea" v-model="form.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- <el-row>
          <el-col :span="24">
            <el-form-item prop="ticketUrl">
              <el-upload
                ref="upload"
                :class="{ hide: ticketHide }"
                :headers="headers"
                action="/api/user/v1/attachment/upload"
                accept=".doc, .docx, .xls, .xlsx, .ppt, .pptx, .pdf, .zip, .rar, .jpg, .png"
                :on-success="handleUploadSuccess"
                :on-remove="handleUploadRemove"
                :on-preview="handlePictureCardPreview"
                :before-upload="handleBeforeUpload"
                :file-list="appendixArray"
                :on-change="appendixChange"
                :limit="imgLimit"
                :on-exceed="exceedLimit"
              >
                <el-button slot="trigger" type="text" icon="el-icon-circle-plus">选取文件</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancle">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
      <!-- 图片查看 -->
      <el-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="[url]" />
    </el-dialog>
  </div>
</template>
<script>
import ElImageViewer from 'element-ui/packages/image/src/image-viewer';
import store from '@/store';
import { mapState } from 'vuex';
import { getCorporateIdentify } from '@/utils/util';
import { getToken } from '@/utils/auth';
import { validatenull } from '@/utils/ruoyi';
import { checkPermi } from '@/utils/permission';
import {
  addCarTyre,
  getList,
  updateCarTyre,
  deleteCarTyre
} from '@/api/basic/carTyre.js';
export default {
  name: 'tyreCost',
  components: {
    ElImageViewer
  },
  data() {
    return {
      loading: false,
      total: 0,
      carTyreList: [],
      vehicleOptions: [],
      //查询参数
      queryParams: {
        pageName: 1,
        pageSize: 10,
        corporateIdentify: getCorporateIdentify(),
        sort: 'create_date',
        order: 'desc'
      },
      form: {},
      dialogVisible: false,
      rules: {
        vehicle: [
          { required: true, message: '车牌号不能为空', trigger: 'blur' }
        ],
        tyreDate: [
          { required: true, message: '日期不能为空', trigger: 'blur' }
        ],
        tyrePrice: [
          { required: true, message: '金额不能为空', trigger: 'blur' }
        ],
        tyreProject: [
          { required: true, message: '费用项目不能为null', trigger: 'blur' }
        ]
      },
      costOptions: [
        {
          value: 1,
          lable: '换轮胎'
        },
        {
          value: 2,
          label: '补胎'
        }
      ],
      //文件相关
      //附件上传
      ticketHide: false,
      //获取token
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      //上传限制
      imgLimit: 1,
      //显示图片查看器
      showViewer: false,
      url: '',
      imgUrlArray: [],
      //文件是否上传成功
      appendixIsUpload: false,
      appendixArray: [],
      params: {}
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo
    })
  },
  created() {
    this.getList();
    this.vehicleOptions = store.getters.vehicle.filter((item) => {
      return item.vehicleBelongState == 1;
    });
  },
  methods: {
    // 确认选中事件
    switchAffirm(row) {
      let state = checkPermi(['driver:tyre:confirm']);
      if (state) {
        if (row.affirmState == false) {
          row.invoiceState = false;
          row.paymentReceivedState = false;
          row.expenseStatus = 0;
        } else {
          row.expenseStatus = 1;
        }
        //更新
        updateCarTyre(row).then((res) => {
          if (res.status === 200) {
            this.msgSuccess('修改成功');
          }
        });
      } else {
        row.affirmState = false;
        this.$notify.error({
          title: '当前操作没有权限'
        });
      }
    },
    // 开票选中事件
    switchInvoice(row) {
      let state = checkPermi(['driver:tyre:invoice']);
      if (state) {
        if (!validatenull(row.invoiceNum)) {
          row.expenseStatus = 2;
          //更新
          updateCarTyre(row).then((res) => {
            if (res.status === 200) {
              this.msgSuccess('修改成功');
            }
          });
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
      let state = checkPermi(['driver:tyre:payment']);
      if (state) {
        if (row.paymentReceivedState == true) {
          this.$confirm('实付后无法修改, 是否继续?', '警告', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(function () {
              row.expenseStatus = 3;
              //更新
              updateCarTyre(row).then((res) => {
                if (res.status === 200) {
                  this.msgSuccess('修改成功');
                }
              });
            })
            .catch(function () {
              row.paymentReceivedState = false;
            });
        } else {
          row.expenseStatus = 2;
          //更新
          updateCarTyre(row).then((res) => {
            if (res.status === 200) {
              this.msgSuccess('修改成功');
            }
          });
        }
      } else {
        row.paymentReceivedState = false;
        this.$notify.error({
          title: '当前操作没有权限'
        });
      }
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
    //车牌号搜索框
    vehicleNameQuery() {
      this.getList();
    },
    //删除
    handleDelete(row) {
      this.$confirm('是否要删除数据', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          return deleteCarTyre(row.id);
        })
        .then(() => {
          this.getList();
          this.msgSuccess('删除成功');
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    projectFilter(row, column) {
      return row.tyreProject == 1
        ? '换轮胎'
        : row.tyreProject == 2
        ? '补胎'
        : '';
    },
    //重置表单
    reset() {
      this.form = {
        belongCompaniesId: getCorporateIdentify(),
        vehicle: undefined,
        tyreDate: undefined,
        tyreProject: undefined,
        tyrePrice: undefined,
        invoiceNum: undefined,
        mileage: undefined,
        tyreNum: undefined
      };
      //清除校验
      this.resetForm('form');
    },
    //格式化日期
    formatTiem(value, format) {
      return this.$utils.toDateString(value, format);
    },
    getList() {
      this.loading = true;
      if (this.userInfo.employeeId != -1) {
        this.queryParams.employeeId = this.userInfo.id;
      }

      if (!validatenull(this.params.tyreDate)) {
        this.queryParams.beginTime = this.params.tyreDate[0];
        this.queryParams.endTime = this.params.tyreDate[1];
      } else {
        this.queryParams.beginTime = undefined;
        this.queryParams.endTime = undefined;
      }
      getList(this.queryParams).then((response) => {
        this.carTyreList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // switchInvoice(row) {
    //   //修改
    //   updateCarTyre(row).then((response) => {
    //     if (response.data.code === 200) {
    //       this.msgSuccess('修改成功');
    //       this.getList();
    //     }
    //   });
    // },
    //修改
    updateTyreCost(row) {
      this.form = JSON.parse(JSON.stringify(row));
      this.dialogVisible = true;
      if (!validatenull(this.form.ticketUrl)) {
        this.appendixArray.push({
          name: this.form.ticketName,
          url: this.form.ticketUrl
        });
      }
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
    //文件状态改变
    appendixChange(file, fileList) {
      this.ticketHide = fileList.length >= this.imgLimit;
    },
    //移除
    handleUploadRemove(file, fileList) {
      this.form.ticketUrl = '';
      this.form.ticketName = '';
      this.ticketHide = false;
      this.appendixIsUpload = false;
    },
    //文件上传之前大小，类型限制
    handleBeforeUpload(file) {
      const isLt10M = file.size / 1024 / 1024 < 20;
      if (!isLt10M) {
        this.$message.error('上传文件大小不能超过 20MB!');
      }
      var FileExt = file.name.replace(/.+\./, '');
      var appendixType =
        [
          'doc',
          'docx',
          'xls',
          'xlsx',
          'ppt',
          'pptx',
          'pdf',
          'zip',
          'rar',
          'png',
          'jpg'
        ].indexOf(FileExt.toLowerCase()) === -1;
      if (appendixType) {
        this.$message({
          type: 'warning',
          message:
            '请上传后缀名为[doc,docx,xls,xlsx,ppt,pptx,pdf,zip,rar]的附件！'
        });
      }
      if (!isLt10M || appendixType) {
        return isLt10M && appendixType;
      }
    },
    //文件上传成功
    handleUploadSuccess(response, file) {
      if (response.status == 200) {
        this.appendixIsUpload = true;
        this.form.ticketUrl = response.data.previewUrl;
        if (this.form.ticketUrl != '') {
          this.form.ticketName = response.data.attachName;
        }
      } else {
        this.$message.error('上传失败，请重新上传！');
      }
    },
    //文件上传限制
    exceedLimit(file, fileList) {
      if (fileList.length >= 1) {
        this.$message({
          type: 'warning',
          message: '只允许上传一个附件'
        });
      }
    },
    // 关闭图片浏览
    closeViewer() {
      this.showViewer = false;
    },
    cancle() {
      this.reset();
      this.appendixArray = [];
      this.dialogVisible = false;
    },
    handleClose() {
      this.dialogVisible = false;
      this.appendixArray = [];
    },
    //新增
    handleAdd() {
      this.dialogVisible = true;
    },
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            //修改
            if (this.form.vehicle != undefined) {
              this.form.vehicle = this.form.vehicle.toUpperCase();
            }
            updateCarTyre(this.form).then((response) => {
              if (response.data.code === 200) {
                this.msgSuccess('修改成功');
                this.dialogVisible = false;
                this.getList();
                this.appendixArray = [];
                this.reset();
              }
            });
          } else {
            //新增
            this.form.belongCompaniesId = getCorporateIdentify();
            if (this.userInfo.employeeId != -1) {
              this.form.employeeId = this.userInfo.id;
              this.form.employeeName = this.userInfo.name;
            }
            addCarTyre(this.form).then((response) => {
              if (response.data.code === 200) {
                this.msgSuccess('新增成功');
                this.dialogVisible = false;
                this.appendixArray = [];
                this.getList();
                this.reset();
              }
            });
          }
        }
      });
    }
  }
};
</script>
