<template>
  <div class="app-container">
    <el-form :inline="true" :model="queryParams" class="demo-form-inline" @submit.native.prevent>
      <el-form-item prop="vehicle">
        <el-select
          ref="vehicle"
          clearable
          allow-create
          style="width: 100%"
          v-model="params.vehicle"
          no-data-text="无匹配数据"
          placeholder="全部车辆"
          filterable
          @change="vehicleNameQuery"
        >
          <el-option
            v-for="item in vehicleOptions"
            :key="item.id"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="guaranteeTime">
        <el-date-picker
          v-model="params.guaranteeTime"
          style="width: 100%"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="searchExtraCost">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-row>
      <el-col :span="1.5">
        <el-button
          type="primary"
          @click="handleAdd"
          style="margin-bottom: 10px"
          size="mini"
          icon="el-icon-plus"
        >新增</el-button>
      </el-col>
    </el-row>

    <el-table
      border
      :summary-method="getSummaries"
      :show-summary="true"
      :data="carGuaranteeList"
      style="width: 100%"
    >
      <!-- <el-table-column type="selection" width="55"></el-table-column> -->
      <el-table-column label="车牌号" align="center" prop="vehicle" class="MytoUpper"></el-table-column>
      <el-table-column
        width="180"
        label="保单号"
        align="center"
        prop="policyNum"
        class="MytoUpper"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="保险种类"
        width="180"
        align="center"
        prop="guaranteeType"
        class="MytoUpper"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="guaranteePrice" label="保险金额" align="center" show-overflow-tooltip></el-table-column>
      <!-- <el-table-column
        prop="remark"
        label="上传保单"
        align="center"
        show-overflow-tooltip
      ></el-table-column>-->
      <el-table-column prop="startPolicyDate" label="保险开始日期" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>
            {{
            formatDate(scope.row.startPolicyDate, "yyyy-MM-dd hh:mm")
            }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="endPolicyDate" label="保险截止始日期" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>
            {{
            formatDate(scope.row.endPolicyDate, "yyyy-MM-dd hh:mm")
            }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="操作" style="text-align: center" align="center">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit" type="text" size="mini" @click="handleEdit(scope.row)">修改</el-button>
          <el-button
            type="text"
            icon="el-icon-delete"
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
      title="保险费用记录"
      :visible.sync="dialogVisible"
      width="600px"
      :dialogVisible="dialogVisible"
      :before-close="handleClose"
      :close-on-click-modal="false"
      append-to-body
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
            <el-form-item label="保单号" prop="policyNum">
              <el-input v-model="form.policyNum"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="保险种类" prop="guaranteeType">
              <el-input v-model="form.guaranteeType"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="保险金额" prop="guaranteePrice">
              <el-input-number controls-position="right" v-model.number="form.guaranteePrice"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="保险日期" prop="policyYear">
              <el-date-picker
                v-model="form.policyYear"
                type="datetimerange"
                format="yyyy-MM-dd HH:mm"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="上传保单" prop="policyUrl">
          <el-upload
            action="/api/user/v1/attachment/upload"
            accept=".doc, .docx, .xls, .xlsx, .ppt, .pptx, .pdf, .zip, .rar, .jpg, .png"
            :limit="imgLimit"
            :headers="headers"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :file-list="invoiceUrlArray"
            :on-change="policyChange"
            :before-upload="beforeAvatarUpload"
            :on-success="handleInvoiceSuccess"
            :on-exceed="exceedLimit"
          >
            <!-- <div style="height: 25px">
              <i class="el-icon-plus" />
            </div>
            <div>上传照片</div>-->
            <el-button slot="trigger" type="text" icon="el-icon-circle-plus">选取文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancle">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
      <el-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="[url]" />
    </el-dialog>
  </div>
</template>
<script>
import store from '@/store';
import { getCorporateIdentify } from '@/utils/util';
import { validatenull } from '@/utils/ruoyi';
import {
  addCarGuarantee,
  getCarGuarantee,
  editCarGuarantee,
  deleteCarGuarantee
} from '@/api/basic/carGuarantee';
import { delAttachment } from '@/api/system/attachment';
import { getToken } from '@/utils/auth';
import { isImage } from '@/utils/util';
import ElImageViewer from 'element-ui/packages/image/src/image-viewer';
import { mapState } from 'vuex';
export default {
  components: {
    ElImageViewer
  },
  data() {
    return {
      corporateIdentify: '',
      //车辆数组
      vehicleOptions: [],
      //显示图片查看器
      showViewer: false,
      url: '',
      imgLimit: 1,
      invoiceUrlArray: [],
      imgUrlArray: [],
      //照片属性
      policyHide: false,
      form: {},
      invoiceIndex: 0,
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      carGuaranteeList: [],
      queryParams: {
        pageName: 1,
        pageSize: 10,
        belongCompaniesId: getCorporateIdentify(),
        sort: 'create_date',
        order: 'desc'
      },
      total: 0,
      dialogVisible: false,
      rules: {
        vehicle: [
          { required: true, message: '车牌号不能为空', trigger: 'blur' }
        ],
        policyYear: [
          { required: true, message: '保险年度不能为空', trigger: 'blur' }
        ],
        guaranteePrice: [
          { required: true, message: '保险金额不能为空', trigger: 'blur' }
        ]
      },
      form: {},
      //车牌号数组
      vehicleOptions: [],
      params: {}
    };
  },
  created() {
    this.getList();
    this.vehicleOptions = store.getters.vehicle.filter((item) => {
      return item.vehicleBelongState == 1;
    });
    var array = [];
    array = this.vehicleOptions;
    var array1 = [];
    if (validatenull(this.userInfo.corporateIdentify)) {
      //不是管理员账号进行筛选
      if (this.userInfo.vehicles === '-1') {
        if (!validatenull(this.userInfo.vehicles)) {
          var carArray = this.userInfo.vehicles.split(',');
          for (var i = 0; i < carArray.length; i++) {
            array1.push(array.filter((item) => item.value == carArray[i])[0]);
          }
          this.vehicleOptions = array1;
        } else {
          this.vehicleOptions = [];
        }
      }
    }
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo
    })
  },
  methods: {
    //文件上传限制
    exceedLimit(file, fileList) {
      if (fileList.length >= 1) {
        this.$message({
          type: 'warning',
          message: '只允许上传一个附件'
        });
      }
    },
    //车牌号搜索框
    vehicleNameQuery() {
      this.getList();
    },

    //图片上传成功
    handleInvoiceSuccess(res, file) {
      if (res.status == 200) {
        this.form.policyUrl = res.data.previewUrl;
        if (this.form.policyUrl != '') {
          this.form.policyName = res.data.attachName;
        }
      } else {
        this.$message.error('上传失败，请重新上传！');
      }
    },
    //隐藏添加框
    policyChange(file, fileList) {
      this.policyHide = fileList.length >= this.imgLimit;
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
    },
    //移除照片
    handleRemove(file, fileList) {
      this.policyHide = false;
      if (file.uid != undefined) {
        delAttachment(file.uid).then((response) => {
          this.form.policyUrl = '';
        });
      }
    },
    // 文件上传之前调用做一些拦截限制
    beforeAvatarUpload(file) {
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
    reset() {
      this.form = {
        belongCompaniesId: getCorporateIdentify(),
        vehicle: undefined,
        policyYear: undefined,
        guaranteePrice: undefined,
        remark: undefined
      };
      //清除校验
      this.resetForm('form');
    },
    //dialog关闭
    handleClose() {
      this.dialogVisible = false;
      this.reset();
    },
    //取消
    cancle() {
      this.dialogVisible = false;
      this.reset();
      this.invoiceUrlArray = [];
    },
    //修改
    handleEdit(row) {
      this.form = JSON.parse(JSON.stringify(row));
      var timeArray = [];
      let startTime = new Date(row.startPolicyDate);
      let endTime = new Date(row.endPolicyDate);
      timeArray.push(startTime);
      timeArray.push(endTime);
      this.$set(this.form, 'policyYear', timeArray);
      //赋值照片
      this.invoiceUrlArray = [];
      this.policyHide = false;
      // if (!validatenull(row.policyUrl)) {
      //   let policyUrl = { url: row.policyUrl };
      //   this.invoiceUrlArray.push(policyUrl);
      //   this.form.policyUrl = row.policyUrl;
      //   this.policyChange('', this.invoiceUrlArray);
      // }
      if (!validatenull(row.policyUrl)) {
        this.invoiceUrlArray.push({
          name: row.policyName,
          url: row.policyUrl
        });
      }
      this.dialogVisible = true;
    },
    //表单提交
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          for (var i = 0; i < this.form.policyYear.length; i++) {
            this.form.startPolicyDate = this.form.policyYear[0];
            this.form.endPolicyDate = this.form.policyYear[1];
          }
          if (this.form.id != undefined) {
            //修改
            if (this.form.vehicle != undefined) {
              this.form.vehicle = this.form.vehicle.toUpperCase();
            }
            editCarGuarantee(this.form).then((response) => {
              if (response.data.code === 200) {
                this.msgSuccess('修改成功');
                this.dialogVisible = false;
                this.getList();
                this.reset();
                this.invoiceUrlArray = [];
              }
            });
          } else {
            //新增
            if (this.form.vehicle != undefined) {
              this.form.vehicle = this.form.vehicle.toUpperCase();
            }
            this.form.belongCompaniesId = getCorporateIdentify();
            addCarGuarantee(this.form).then((response) => {
              if (response.data.code === 200) {
                this.msgSuccess('新增成功');
                this.dialogVisible = false;
                this.getList();
                this.reset();
                this.invoiceUrlArray = [];
              }
            });
          }
        }
      });
    },

    //查询保险费用记录
    getList() {
      this.queryParams.corporateIdentify = getCorporateIdentify();
      if (!validatenull(this.params.guaranteeTime)) {
        this.queryParams.beginTime = this.params.guaranteeTime[0];
        this.queryParams.endTime = this.params.guaranteeTime[1];
      } else {
        this.queryParams.beginTime = undefined;
        this.queryParams.endTime = undefined;
      }
      this.queryParams.vehicle = this.params.vehicle;
      getCarGuarantee(this.queryParams).then((response) => {
        this.total = response.data.total;
        this.carGuaranteeList = response.data.list;
      });
    },
    //搜索
    searchExtraCost() {
      this.getList();
    },
    //新增
    handleAdd() {
      this.dialogVisible = true;
      this.reset();
      this.policyHide = false;
      this.invoiceUrlArray = [];
    },
    //删除
    handleDelete(row) {
      this.$confirm('是否要删除数据', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          return deleteCarGuarantee(row.id);
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
    //日期格式化
    formatTiem(value, format) {
      return this.$utils.toDateString(value, format);
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (column.property == 'guaranteePrice') {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return (Number(prev) + Number(curr)).toFixed(2);
            } else {
              return prev;
            }
          }, 0);
          // sums[index] += " 元";
        }
      });
      return sums;
    }
  }
};
</script>
<style scoped>
.MytoUpper >>> .el-input__inner {
  text-transform: uppercase;
}
.dialog-footer {
  text-align: center;
}
.hide >>> .el-upload--picture-card {
  display: none;
}
.el-input-number--medium {
  width: 180px;
}
</style>