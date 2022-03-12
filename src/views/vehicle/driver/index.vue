<template>
  <div class="app-container">
    <!--输入搜索框-->
    <el-form :inline="true" :model="queryParams" class="demo-form-inline" @submit.native.prevent>
      <el-form-item prop="driverBelongState">
        <el-select
          v-model="queryParams.driverBelongState"
          @change="driverBelongQuery"
          size="small"
          clearable
          placeholder="请选择司机归属"
        >
          <el-option
            v-for="item in driverBelongOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="inState">
        <el-select
          v-model="queryParams.inState"
          @change="inStateQuery"
          size="small"
          clearable
          placeholder="请选择在职状态"
        >
          <el-option label="在职" value="1"></el-option>
          <el-option label="离职" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="driverName">
        <el-input
          v-model.trim="queryParams.searchParam"
          size="small"
          placeholder="司机姓名/司机手机号"
          @keyup.enter.native="searchDriver"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="searchDriver">搜索</el-button>
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
          v-hasPermi="['vehicle:driver:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5" class="el-delete">
        <el-button
          type="danger"
          @click="deleteAll"
          style="margin-bottom: 10px"
          size="mini"
          icon="el-icon-delete"
          :disabled="disabled"
          v-hasPermi="['vehicle:driver:del']"
        >删除</el-button>
      </el-col>
    </el-row>

    <!-- 弹出添加框-->
    <el-dialog
      title="司机详情"
      :visible.sync="open"
      width="900px"
      :close-on-click-modal="false"
      :before-close="handleDialogClose"
      append-to-body
      class="driverCss"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="30">
          <div style="padding: 0 50px 0 30px">
            <el-row :gutter="30">
              <el-col :span="23" class="divider">
                <el-divider direction="vertical" />
                <h4>司机信息</h4>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="8">
                <el-form-item label="司机姓名" prop="driverName">
                  <el-input v-model.trim="form.driverName" placeholder="司机姓名"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="司机电话" prop="driverPhone">
                  <el-input v-model.trim="form.driverPhone" placeholder="司机电话"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="司机归属" prop="driverBelongState">
                  <el-select v-model="form.driverBelongState">
                    <el-option label="公司司机" value="1"></el-option>
                    <el-option label="外部司机" value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="年龄" prop="age">
                  <el-input v-model.trim="form.age" placeholder="年龄"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="籍贯" prop="nativePlace">
                  <el-input v-model.trim="form.nativePlace" placeholder="籍贯"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="身份证号码" prop="idNumber">
                  <el-input v-model.trim="form.idNumber" placeholder="身份证号码"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :span="24">
              <el-col :span="8">
                <el-form-item label="在职状态" prop="inState">
                  <el-select v-model="form.inState" placeholder="请选择">
                    <el-option label="在职" value="1"></el-option>
                    <el-option label="离职" value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <!--选择日期-->
                <el-form-item label="入职日期" prop="entryDate">
                  <el-col :span="8">
                    <el-date-picker
                      type="date"
                      placeholder="选择日期"
                      v-model="form.entryDate"
                      style="width: 169px"
                    ></el-date-picker>
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="车牌号" class="MytoUpper" prop="vehicles">
                  <el-select
                    ref="vehicle"
                    filterable
                    allow-create
                    style="width: 100%"
                    v-model="allocationForm.vehicles"
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
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="地址" prop="address">
                  <el-row>
                    <el-col :span="16">
                      <v-distpicker
                        @selected="onSelected"
                        :province="form.province"
                        :city="form.city"
                        :area="form.area"
                        style="display: inline-block"
                      ></v-distpicker>
                      <el-input class="detail-address" v-model="form.address" placeholder="详细地址" />
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="紧急联系人" prop="emergentPerson">
                  <el-input v-model.trim="form.emergentPerson" placeholder="紧急联系人"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="紧急电话" prop="emergentPhone">
                  <el-input v-model.trim="form.emergentPhone" placeholder="联系电话"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-row>
        <!--用户上传图片-->
        <el-row :gutter="30">
          <div style="padding: 0 50px 0 30px" class="upload">
            <el-row :gutter="30">
              <el-col :span="23" class="divider">
                <el-divider direction="vertical" />
                <h4>附加信息</h4>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8" style="margin-left: 20px">
                <el-form-item label="身份证正面" prop="frontUrl">
                  <el-upload
                    list-type="picture-card"
                    action="#"
                    :class="{ hide: frontHide }"
                    :limit="imgLimit"
                    :file-list="frontUrlArray"
                    :on-preview="handlePictureCardPreview"
                    :on-success="uploadIdFSuccess"
                    :before-upload="beforeAvatarUpload"
                    :on-error="uploadError"
                    :on-change="frontChange"
                    :before-remove="frontRemove"
                    :http-request="UploadImageFront"
                  >
                    <div style="height: 25px">
                      <i class="el-icon-plus" />
                    </div>
                    <div>上传照片</div>
                  </el-upload>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="身份证反面" prop="reverseUrl">
                  <el-upload
                    list-type="picture-card"
                    action="#"
                    :class="{ hide: reverseHide }"
                    :headers="headers"
                    :multiple="isMultiple"
                    :limit="imgLimit"
                    :file-list="reverseUrlArray"
                    :on-preview="handlePictureCardPreview"
                    :on-success="uploadIdRSuccess"
                    :before-upload="beforeAvatarUpload"
                    :on-error="uploadError"
                    :on-change="reverseChange"
                    :before-remove="reverseRemove"
                    :http-request="UploadImagereverse"
                  >
                    <div style="height: 25px">
                      <i class="el-icon-plus" />
                    </div>
                    <div>上传照片</div>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8" style="margin-left: 20px">
                <el-form-item label="驾驶证" prop="drivingLicenceUrl">
                  <el-upload
                    list-type="picture-card"
                    action="#"
                    :class="{ hide: drivingLicenceHide }"
                    :headers="headers"
                    :multiple="isMultiple"
                    :limit="imgLimit"
                    :file-list="drivingLicenceUrlArray"
                    :on-preview="handlePictureCardPreview"
                    :on-success="uploadDriverSuccess"
                    :before-upload="beforeAvatarUpload"
                    :on-error="uploadError"
                    :on-change="drivingLicenceChange"
                    :before-remove="drivingLicenceRemove"
                    :http-request="UploadImagedrivingLicence"
                  >
                    <div style="height: 25px">
                      <i class="el-icon-plus" />
                    </div>
                    <div>上传照片</div>
                  </el-upload>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="从业资格证" prop="qcUrl">
                  <el-upload
                    list-type="picture-card"
                    action="#"
                    :class="{ hide: qcHide }"
                    :headers="headers"
                    :multiple="isMultiple"
                    :limit="imgLimit"
                    :file-list="qcUrlArray"
                    :on-preview="handlePictureCardPreview"
                    :on-success="uploadqcSuccess"
                    :before-upload="beforeAvatarUpload"
                    :on-error="uploadError"
                    :on-change="qcChange"
                    :before-remove="qcRemove"
                    :http-request="UploadImageqc"
                  >
                    <div style="height: 25px">
                      <i class="el-icon-plus" />
                    </div>
                    <div>上传照片</div>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item align="center">
              <div class="btn">
                <el-button type="primary" @click="onSubmitForm">保存</el-button>
                <el-button @click="close">取消</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="[url]" />
    </el-dialog>

    <!-- 显示司机列表 :data="tableData"-->
    <template>
      <el-table
        v-loading="loading"
        ref="multipleTable"
        :data="driverList"
        @selection-change="handleSelectionChange"
        tooltip-effect="dark"
        style="width: 100%"
        @row-dblclick="handleEdit"
        highlight-current-row
        height="450px"
      >
        <!--多选框-->
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="司机姓名" align="center" prop="driverName"></el-table-column>
        <el-table-column
          label="司机归属"
          align="center"
          :formatter="clfFiters"
          prop="driverBelongState"
        ></el-table-column>
        <el-table-column prop="age" align="center" label="年龄" width="50"></el-table-column>
        <!-- <el-table-column
          prop="emergentPerson"
          align="center"
          label="紧急联系人"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="emergentPhone"
          align="center"
          label="紧急电话"
          show-overflow-tooltip
        ></el-table-column>-->
        <el-table-column prop="nativePlace" label="籍贯" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="driverPhone" label="手机号" align="center"></el-table-column>
        <el-table-column prop="idNumber" label="身份证号码" align="center" width="165px"></el-table-column>
        <el-table-column prop="inState" label="状态" align="center" :formatter="clfFiter"></el-table-column>
        <el-table-column prop="vehicles" label="车牌号" align="center"></el-table-column>
        <el-table-column label="操作" style="text-align: center" align="center" width="250px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-truck"
              @click="allocation(scope.row)"
            >分配车辆</el-button>
            <el-button
              icon="el-icon-edit"
              type="text"
              size="mini"
              @click="handleEdit(scope.row)"
              v-hasPermi="['vehicle:driver:edit']"
            >修改</el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              size="mini"
              @click="handleDelete(scope.row)"
              v-hasPermi="['vehicle:driver:del']"
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
    </template>

    <el-dialog
      title="分配车辆"
      :visible.sync="openAllocation"
      width="400px"
      :close-on-click-modal="false"
      append-to-body
      center
    >
      <el-form ref="allocationForm" :model="allocationForm" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="车牌号" class="MytoUpper" prop="vehicles">
              <el-select
                ref="driverSelect"
                filterable
                style="width: 100%"
                v-model="allocationForm.vehicles"
                no-data-text="无匹配数据"
                placeholder="请选择"
                @visible-change="(v) => visibleChange(v, 'driverSelect',  0, addDriverClick, '添加车辆')"
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
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAllocationForm">确 定</el-button>
        <el-button @click="cancelVehicles">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加车辆 -->
    <add-vehicle
      ref="addVehicle"
      v-if="visible"
      :visible.sync="visible"
      @contacts-success="onContactsSuccess"
    ></add-vehicle>
  </div>
</template>

<script>
import VDistpicker from 'v-distpicker';
import { getToken } from '@/utils/auth';
import {
  addDriver,
  listDriver,
  delDriver,
  deleteAllByIds,
  updateDriver
} from '@/api/basic/driver';
import { getCorporateIdentify, randomLenNum } from '@/utils/util';
import ElImageViewer from 'element-ui/packages/image/src/image-viewer';
import { validatenull } from '@/utils/ruoyi';
import { mapState } from 'vuex';
import { selectBottomAction } from '@/utils/mixins.js';
import { removeSessionStorage } from '@/utils/sessionStorage';
import AddVehicle from '../driver/addVehicle/index.vue';
import store from '@/store';
import { uploadPicture } from '@/api/picture/attentch.js';
export default {
  name: 'Driver',
  mixins: [selectBottomAction],
  components: {
    VDistpicker,
    ElImageViewer,
    'add-vehicle': AddVehicle
  },
  data() {
    var checkIdNumber = (rule, value, callback) => {
      callback(this.cardid(value)[1]);
    };
    return {
      visible: false,
      //照片属性
      frontHide: false,
      reverseHide: false,
      drivingLicenceHide: false,
      qcHide: false,
      //显示查看器
      showViewer: false,
      url: '',
      //是否支持多选文件
      isMultiple: false,
      imgLimit: 1,
      //图片数组
      frontUrlArray: [],
      reverseUrlArray: [],
      drivingLicenceUrlArray: [],
      qcUrlArray: [],
      //获取token
      headers: {
        Authorization: 'Bearer ' + getToken()
      },

      loading: true,
      //表单参数
      form: {},

      rules: {
        driverName: [
          { required: true, message: '司机名不能为空', trigger: 'blur' }
        ],
        driverPhone: [
          { required: true, message: '司机手机号不能为空', trigger: 'blur' }
        ]
        //idNumber: [{ validator: checkIdNumber, trigger: "blur" }]
      },
      //是否显示弹出层
      open: false,
      //司机信息表格数据
      driverList: [],
      //选中的表格数据
      tableDataAmount: [],
      //总条数
      total: 0,
      //查询参数
      queryParams: {
        pageName: 1,
        pageSize: 10,
        searchParam: '',
        corporateIdentify: '',
        sort: 'create_date',
        order: 'desc'
      },
      disabled: true,
      //司机归属
      driverBelongOptions: [
        {
          value: 0,
          label: '全部司机'
        },
        {
          value: 1,
          label: '公司司机'
        },
        {
          value: 2,
          label: '外部司机'
        }
      ],
      rawDriverName: '',
      rawDriverPhone: '',
      openAllocation: false,
      //车辆数组
      vehicleOptions: [],
      allocationForm: {
        vehicles: ''
      },
      checked: false,
      selectedArray: [],
      driverId: ''
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
      company: (state) => state.constant.company
    })
  },
  created() {
    this.getList();
    this.vehicleOptions = store.getters.vehicle;
  },
  methods: {
    // 上传身份证正面
    async UploadImageFront(param) {
      const formData = new FormData();
      formData.append('file', param.file);
      await uploadPicture(formData).then((response) => {
        this.form.frontUrl = response.data.data.previewUrl;
      });
    },
    // 上传身份证反面
    async UploadImagereverse(param) {
      const formData = new FormData();
      formData.append('file', param.file);
      await uploadPicture(formData).then((response) => {
        this.form.reverseUrl = response.data.data.previewUrl;
      });
    },

    // 上传驾驶证
    async UploadImagedrivingLicence(param) {
      const formData = new FormData();
      formData.append('file', param.file);
      await uploadPicture(formData).then((response) => {
        this.form.drivingLicenceUrl = response.data.data.previewUrl;
      });
    },

    // 上传营运资格证
    async UploadImageqc(param) {
      const formData = new FormData();
      formData.append('file', param.file);
      await uploadPicture(formData).then((response) => {
        this.form.qcUrl = response.data.data.previewUrl;
      });
    },

    // 添加司机
    addDriverClick() {
      this.visible = true;
    },
    submitAllocationForm() {
      var vehicles = this.allocationForm.vehicles;
      var data = {
        id: this.driverId,
        belongCompaniesId: getCorporateIdentify(),
        vehicles: vehicles
      };
      updateDriver(data).then((res) => {
        if (res.data.data == 1) {
          this.msgSuccess('修改成功');
          // 删除缓存，并重新拉取缓存
          //删除缓存并重新拉取缓存
          // 删除缓存，重新拉取并存入缓存
          removeSessionStorage({ name: 'driver' });
          let obj = {
            state: 0,
            corporateIdentify: getCorporateIdentify()
          };
          store.dispatch('GetConstant', obj).then(() => {});
          this.openAllocation = false;
        } else if (response.data.data === 0) {
          this.$message({
            message: response.data.msg + '：' + this.form.driverName,
            type: 'warning'
          });
        } else if (response.data.data === -1) {
          this.$message({
            message: response.data.msg,
            type: 'warning'
          });
        }
      });
    },
    cancelVehicles() {
      if (this.allocationForm.vehicles) {
        this.allocationForm.vehicles = this.allocationForm.vehicles;
      }
      this.openAllocation = false;
    },
    //添加车辆成功回调
    onContactsSuccess(res) {
      console.log(res);
      let arry = {
        id: randomLenNum(6, true),
        value: res.licensePlateNumber,
        label: res.licensePlateNumber
      };
      this.vehicleOptions.unshift(arry);
    },
    allocation(row) {
      this.driverId = row.id;
      this.allocationForm = row;
      this.openAllocation = true;
      this.vehicleOptions = store.getters.vehicle;
    },
    inStateQuery(res) {
      console.log(res);
      this.queryParams = {
        pageNum: 1,
        pageSize: 20,
        sort: 'create_date',
        order: 'desc',
        belongCompaniesId: getCorporateIdentify(),
        driverBelongState: this.queryParams.driverBelongState,
        inState: res
      };
      this.getList();
    },

    driverBelongQuery(res) {
      this.queryParams = {
        pageNum: 1,
        pageSize: 20,
        sort: 'create_date',
        order: 'desc',
        belongCompaniesId: getCorporateIdentify(),
        driverBelongState: res,
        inState: this.queryParams.inState
      };
      this.getList();
    },
    //预览图片时调用
    handlePictureCardPreview(file) {
      this.url = file.url;
      this.showViewer = true;
    },
    //关闭图片预览
    closeViewer() {
      this.showViewer = false;
    },
    //身份证正面隐藏添加框
    frontChange(file, fileList) {
      this.frontHide = fileList.length >= this.imgLimit;
    },
    //身份证反面隐藏添加框
    reverseChange(file, fileList) {
      this.reverseHide = fileList.length >= this.imgLimit;
    },
    drivingLicenceChange(file, fileList) {
      this.drivingLicenceHide = fileList.length >= this.imgLimit;
    },
    qcChange(file, fileList) {
      this.qcHide = fileList.length >= this.imgLimit;
    },
    //移除
    frontRemove(file, fileList) {
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
            this.form.frontUrl = '';
            this.frontHide = false;
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除!'
            });
            reject(false);
          });
      }
      // this.frontHide = false;
      // this.form.frontUrl = "";
    },
    reverseRemove(file, FileList) {
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
            this.reverseHide = false;
            this.form.reverseUrl = '';
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
    drivingLicenceRemove(file, fileList) {
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
            this.drivingLicenceHide = false;
            this.form.drivingLicenceUrl = '';
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
    qcRemove(file, fileList) {
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
            this.qcHide = false;
            this.form.qcUrl = '';
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
    handleDialogClose() {
      this.getList();
      this.open = false;
    },
    //弹出省市区数据
    onSelected(data) {
      this.form.province = data.province.value;
      this.form.city = data.city.value;
      this.form.area = data.area.value;
    },
    //上传图片前
    beforeAvatarUpload(file) {
      var fileType = file.name.substring(file.name.lastIndexOf('.') + 1);
      var arr = ['jpg', 'jpeg', 'png'];
      const extension = arr.indexOf(fileType) > -1;
      if (!extension) {
        this.$message({
          message: '上传文件只能是 jpg、jpeg、png、格式!',
          type: 'warning'
        });
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        this.$message.error('上传图片大小不能超过 10MB!');
      }

      return extension && isLt10M;
    },
    //处理图片上传,上传图片成功
    //上传身份证正面
    uploadIdFSuccess(res, file) {
      // this.form.frontUrl = res.data.previewUrl;
    },
    //上传身份证反面
    uploadIdRSuccess(res, file) {
      // this.form.reverseUrl = res.data.previewUrl;
    },
    //上传驾驶证
    uploadDriverSuccess(res, file) {
      // this.form.drivingLicenceUrl = res.data.previewUrl;
    },
    //上传从业资格证
    uploadqcSuccess(res, file) {
      // this.form.qcUrl = res.data.previewUrl;
    },
    //上传图片失败
    uploadError(res, err) {
      this.$message.error('上传图片失败');
    },
    //表单重置
    reset() {
      this.form = {
        id: undefined,
        belongCompaniesId: getCorporateIdentify(),
        driverName: undefined,
        driverPhone: undefined,
        age: undefined,
        emergentPerson: undefined,
        nativePlace: undefined,
        idNumber: undefined,
        city: undefined,
        province: undefined,
        area: undefined,
        address: undefined,
        entryDate: undefined,
        inState: undefined,
        frontUrl: undefined,
        reverseUrl: undefined,
        drivingLicenceUrl: undefined,
        qcUrl: undefined,
        driverBelongState: '2'
      };
      this.resetForm('form');
    },
    //新增按钮操作
    handleAdd() {
      this.reset();
      this.open = true;
      (this.frontHide = false),
        (this.reverseHide = false),
        (this.drivingLicenceHide = false),
        (this.qcHide = false),
        this.clearPictureArray();
    },
    //搜索司机
    searchDriver() {
      //this.queryParams.page = 1;
      this.getList();
    },
    //取消按钮操作
    close() {
      this.open = false;
      this.reset();
      this.clearPictureArray();
    },
    clearPictureArray() {
      (this.frontUrlArray = []),
        (this.reverseUrlArray = []),
        (this.drivingLicenceUrlArray = []),
        (this.qcUrlArray = []);
    },
    //新增司机提交事件
    onSubmitForm: function () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            //执行司机信息的编辑
            this.form.companyName = this.company.companyName;
            this.form.belongCompaniesId = getCorporateIdentify();
            this.form.rawDriverName = this.rawDriverName;
            this.form.rawDriverPhone = this.rawDriverPhone;
            updateDriver(this.form).then((response) => {
              if (response.data.data === 1) {
                this.msgSuccess('修改成功');
                // 删除customer缓存，重新拉取并存入缓存
                removeSessionStorage({ name: 'customer' });
                const corporateIdentify = getCorporateIdentify();
                let objCustomer = {
                  corporateIdentify: corporateIdentify,
                  state: 1
                };
                store.dispatch('GetConstant', objCustomer).then(() => {});
                // 删除driver缓存，重新拉取并存入缓存
                removeSessionStorage({ name: 'driver' });
                let objDriver = {
                  corporateIdentify: getCorporateIdentify(),
                  state: 0
                };
                store.dispatch('GetConstant', objDriver).then(() => {});
                this.open = false;
                this.getList();
                //清空图片数组
                this.clearPictureArray();
              } else if (response.data.data === 0) {
                this.$message({
                  message: response.data.msg + '：' + this.form.driverName,
                  type: 'warning'
                });
              } else if (response.data.data === -1) {
                this.$message({
                  message: response.data.msg,
                  type: 'warning'
                });
              }
            });
          } else {
            this.form.companyName = this.company.companyName;
            this.form.belongCompaniesId = getCorporateIdentify();
            addDriver(this.form).then((response) => {
              if (response.data.data === 1) {
                this.msgSuccess('新增成功');
                // 删除customer缓存，重新拉取并存入缓存
                removeSessionStorage({ name: 'customer' });
                const corporateIdentify = getCorporateIdentify();
                let objCustomer = {
                  corporateIdentify: corporateIdentify,
                  state: 1
                };
                store.dispatch('GetConstant', objCustomer).then(() => {});

                // 删除driver缓存，重新拉取并存入缓存
                removeSessionStorage({ name: 'driver' });
                let objDriver = {
                  corporateIdentify: getCorporateIdentify(),
                  state: 0
                };
                store.dispatch('GetConstant', objDriver).then(() => {});

                this.open = false;
                this.getList();
                this.reset();
              } else if (response.data.data === 0) {
                this.$message({
                  message: response.data.msg + '：' + this.form.driverName,
                  type: 'warning'
                });
              } else if (response.data.data === 3) {
                this.msgSuccess('新增司机成功');
                this.open = false;
                this.getList();
                this.reset();
                setTimeout(() => {
                  this.$message.error(response.data.msg);
                }, 500);
              } else if (response.data.data === -1) {
                this.$message({
                  message: response.data.msg,
                  type: 'warning'
                });
              }
            });
          }
        }
      });
    },
    //查询司机列表
    getList() {
      this.loading = true;
      this.queryParams.corporateIdentify = getCorporateIdentify();
      listDriver(this.queryParams).then((response) => {
        this.total = response.data.total;
        this.driverList = response.data.list;
        this.loading = false;
      });
    },
    //表格中在职状态的校验
    clfFiter(row, column) {
      return row.inState == 1 ? '在职' : row.inState == 2 ? '离职' : '';
    },
    clfFiters(row, column) {
      return row.driverBelongState == 1
        ? '公司司机'
        : row.driverBelongState == 2
        ? '外部司机'
        : '';
    },
    //删除选中的司机
    handleDelete(row) {
      this.$confirm('是否删除司机为:' + row.driverName + ' 的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          return delDriver(row.id);
        })
        .then(() => {
          this.getList(), this.msgSuccess('删除成功');
          // 删除driver缓存，重新拉取并存入缓存
          removeSessionStorage({ name: 'driver' });
          let objDriver = {
            corporateIdentify: getCorporateIdentify(),
            state: 0
          };
          store.dispatch('GetConstant', objDriver).then(() => {});
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    //选中的数据
    handleSelectionChange(data) {
      this.tableDataAmount = data;
      this.disabled = this.tableDataAmount.length === 0;
    },
    //批量删除选中的司机
    deleteAll() {
      //得到选中的数据
      var val = this.tableDataAmount;
      //获取选中的id值，返回一个新的数组ids[]
      const ids = val.map((item) => item.id);

      const drivers = val.map((item) => item.driverName);
      //执行删除
      this.$confirm('是否要删除选中的:"' + drivers + '"', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function () {
          return deleteAllByIds({ ids: ids });
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
    //编辑按钮操作
    handleEdit(row) {
      this.rawDriverName = row.driverName;
      this.rawDriverPhone = row.driverPhone;
      this.clearPictureArray();
      this.open = true;
      this.form = row;

      //赋值图片
      (this.frontHide = false),
        (this.reverseHide = false),
        (this.drivingLicenceHide = false),
        (this.qcHide = false);

      if (!validatenull(row.frontUrl)) {
        let frontUrl = { url: row.frontUrl };
        this.frontUrlArray.push(frontUrl);
        this.form.frontUrl = row.frontUrl;
        this.frontChange('', this.frontUrlArray);
      }
      if (!validatenull(row.reverseUrl)) {
        let reverseUrl = { url: row.reverseUrl };
        this.reverseUrlArray.push(reverseUrl);
        this.form.reverseUrl = row.reverseUrl;
        this.reverseChange('', this.reverseUrlArray);
      }
      if (!validatenull(row.drivingLicenceUrl)) {
        let drivingLicenceUrl = { url: row.drivingLicenceUrl };
        this.drivingLicenceUrlArray.push(drivingLicenceUrl);
        this.form.drivingLicenceUrl = row.drivingLicenceUrl;
        this.drivingLicenceChange('', this.drivingLicenceUrlArray);
      }
      if (!validatenull(row.qcUrl)) {
        let qcUrl = { url: row.qcUrl };
        this.qcUrlArray.push(qcUrl);
        this.form.qcUrl = row.qcUrl;
        this.qcChange('', this.qcUrlArray);
      }
    }
  }
};
</script>
<style scoped>
.hide >>> .el-upload--picture-card {
  display: none;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 3;
  text-align: center;
}
.avatar {
  width: 80px;
  height: 80px;
  display: block;
}

.upload .el-form-item__label {
  margin-top: 30px;
}
.driverCss .el-dialog__body {
  padding-top: 5px;
  padding-bottom: 0px;
}
.upload .el-form-item .el-form-item--medium {
  margin-left: 40px;
}
.btn {
  margin-right: 70px;
}
.el-delete {
  margin-left: 10px;
}
.detail-address {
  margin-top: 10px;
}
.divider {
  height: 56px;
  padding: 0 15px;
  align-items: center;
  display: flex;
}
.el-divider--vertical {
  border-left: 3px solid #408eff;
}
.el-page-header__left .el-icon-back {
  color: #409eff;
}
.el-page-header__title {
  color: #409eff;
}
.el-checkbox {
  text-align: right;
  width: 100%;
  padding-right: 10px;
}
</style>