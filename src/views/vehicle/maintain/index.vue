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
      <el-form-item prop="mainDate">
        <el-date-picker
          v-model="params.mainDate"
          style="width: 100%"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-input v-model="params.searchParam" placeholder="保养项目/发票号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="searchMaintain">搜索</el-button>
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

    <template>
      <el-table
        border
        :summary-method="getSummaries"
        :show-summary="true"
        ref="multipleTable"
        :data="maintianList"
        style="width: 100%"
        :span-method="spanMethod"
        v-loading="loading"
      >
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <el-table-column label="车牌号" align="center" prop="vehicle"></el-table-column>
        <el-table-column label="日期" align="center" width="100">
          <template v-slot="{ row }">
            {{
            formatTiem(row.mainDate, "yyyy/MM/dd")
            }}
          </template>
        </el-table-column>
        <el-table-column prop="kilometre" label="公里数" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="mainProject" label="保养项目" align="center" show-overflow-tooltip></el-table-column>

        <el-table-column prop="mainPrice" label="保养金额(CNY/L)" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="invoiceNum" label="发票号" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="remark" label="备注" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="payStatus" label="付款状态" align="center" show-overflow-tooltip>
          <template v-slot="{ row }">
            <vxe-switch
              v-model="row.payStatus"
              @change="switchInvoice(row)"
              on-label="是"
              off-label="否"
            ></vxe-switch>
          </template>
        </el-table-column>
        <el-table-column prop="payStatement" label="付款说明" align="center" show-overflow-tooltip></el-table-column>
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
        title="保养记录"
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
              <el-form-item label="公里数" prop="kilometre">
                <el-input v-model="form.kilometre"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="保养项目" prop="mainProject">
                <el-input v-model="form.mainProject"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="保养金额" prop="mainPrice">
                <el-input-number controls-position="right" v-model.number="form.mainPrice"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="发票号" prop="invoiceNum">
                <el-input v-model="form.invoiceNum"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="日期" prop="mainDate">
                <el-date-picker
                  type="date"
                  placeholder="选择日期"
                  v-model="form.mainDate"
                  style="width: 100%"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="付款状态" prop="payStatus">
                <template>
                  <vxe-switch v-model="form.payStatus" on-label="是" off-label="否"></vxe-switch>
                </template>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="付款说明" prop="invoiceNum">
                <el-input v-model="form.payStatement"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input type="textarea" resize="none" v-model="form.remark"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
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
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancle">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
        <el-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="[url]" />
      </el-dialog>
    </template>
  </div>
</template>

<script>
import ElImageViewer from 'element-ui/packages/image/src/image-viewer';

import store from '@/store';
import {
  saveMaintain,
  getMaintain,
  editMainTain,
  deleteCarMain
} from '@/api/basic/carMaintain';
import { getCorporateIdentify } from '@/utils/util';
import { mapState } from 'vuex';
import { validatenull } from '@/utils/ruoyi';
import { getToken } from '@/utils/auth';
export default {
  name: 'Maintain',
  components: {
    ElImageViewer
  },
  data() {
    return {
      corporateIdentify: '',
      //车辆数组
      vehicleOptions: [],
      addPoint: [{}],
      //保养数据
      maintianList: [],
      queryParams: {
        pageName: 1,
        pageSize: 10,
        corporateIdentify: '',
        sort: 'create_date',
        order: 'desc',
        searchParam: ''
      },
      total: 0,
      dialogVisible: false,
      form: {},
      rules: {
        vehicle: [
          { required: true, message: '车牌号不能为空', trigger: 'blur' }
        ],
        mainDate: [
          { required: true, message: '保养日期不能为空', trigger: 'blur' }
        ],
        mainPrice: [
          { required: true, message: '保养金额不能为空', trigger: 'blur' }
        ]
      },
      rowSpanArr: [],
      position: 0,
      loading: false,
      //车牌号数组
      vehicleOptions: [],
      params: {},
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
      appendixArray: []
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
    //车牌号搜索框
    vehicleNameQuery() {
      this.getList();
    },

    getRowSpan() {
      this.rowSpanArr = [];
      this.maintianList.forEach((item, index) => {
        if (index == 0) {
          this.rowSpanArr.push(1);
          this.position = 0;
        } else {
          if (
            this.maintianList[index].vehicle ==
            this.maintianList[index - 1].vehicle
          ) {
            this.rowSpanArr[this.position] += 1; //项目名称相同，合并到同一个数组中
            this.rowSpanArr.push(0);
            this.maintianList[index].vehicle =
              this.maintianList[index - 1].vehicle;
          } else {
            this.rowSpanArr.push(1);
            this.position = index;
          }
        }
      });
    },
    spanMethod({ row, column, rowIndex, columnIndex }) {
      // 只合并区域位置
      if (columnIndex === 0) {
        const _row = this.rowSpanArr[rowIndex];
        return {
          rowspan: _row, //行
          colspan: 1 //列
        };
      }
    },
    //删除
    handleDelete(row) {
      this.$confirm('是否要删除数据', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          return deleteCarMain(row.id);
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
    switchInvoice(row) {
      //修改
      editMainTain(row).then((response) => {
        if (response.data.code === 200) {
          this.msgSuccess('修改成功');
          this.getList();
        }
      });
    },
    //重置表单
    reset() {
      this.form = {
        belongCompaniesId: getCorporateIdentify(),
        vehicle: undefined,
        mainDate: undefined,
        kilometre: undefined,
        mainProject: undefined,
        mainPrice: undefined,
        invoiceNum: undefined,
        remark: undefined
      };
      //清除校验
      this.resetForm('form');
    },
    //查询保养列表
    getList() {
      this.loading = true;
      this.queryParams.corporateIdentify = getCorporateIdentify();
      if (!validatenull(this.params.mainDate)) {
        this.queryParams.beginTime = this.params.mainDate[0];
        this.queryParams.endTime = this.params.mainDate[1];
      } else {
        this.queryParams.beginTime = undefined;
        this.queryParams.endTime = undefined;
      }
      this.queryParams.vehicle = this.params.vehicle;
      this.queryParams.searchParam = this.params.searchParam;
      getMaintain(this.queryParams).then((response) => {
        this.total = response.data.total;
        this.maintianList = response.data.list;
        this.getRowSpan();
        this.loading = false;
      });
    },
    //关闭
    handleClose() {
      this.appendixArray = [];
      this.dialogVisible = false;
      this.reset();
    },
    //取消
    cancle() {
      this.appendixArray = [];
      this.dialogVisible = false;
      this.reset();
    },
    //表单提交
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            //修改
            if (this.form.vehicle != undefined) {
              this.form.vehicle = this.form.vehicle.toUpperCase();
            }
            editMainTain(this.form).then((response) => {
              if (response.data.code === 200) {
                this.msgSuccess('修改成功');
                this.appendixArray = [];
                this.dialogVisible = false;
                this.getList();
                this.reset();
              }
            });
          } else {
            //新增
            this.form.belongCompaniesId = getCorporateIdentify();
            if (this.form.vehicle != undefined) {
              this.form.vehicle = this.form.vehicle.toUpperCase();
            }
            saveMaintain(this.form).then((response) => {
              if (response.data.code === 200) {
                this.msgSuccess('新增成功');
                this.appendixArray = [];
                this.dialogVisible = false;
                this.getList();
                this.reset();
              }
            });
          }
        }
      });
    },
    //格式化日期
    formatTiem(value, format) {
      return this.$utils.toDateString(value, format);
    },
    //搜索
    searchMaintain() {
      this.getList();
    },
    //新增
    handleAdd() {
      this.reset();
      this.dialogVisible = true;
    },
    //修改
    handleEdit(row) {
      this.dialogVisible = true;
      this.form = row;
      if (!validatenull(this.form.ticketUrl)) {
        this.appendixArray.push({
          name: this.form.ticketName,
          url: this.form.ticketUrl
        });
      }
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
        if (column.property == 'mainPrice') {
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
<style lang="scss" scoped>
/deep/ .el-delete {
  margin-left: 10px;
}
/deep/ .dialog-footer {
  text-align: center;
}
.MytoUpper >>> .el-input__inner {
  text-transform: uppercase;
}
.el-input-number--medium {
  width: 180px;
}
</style>