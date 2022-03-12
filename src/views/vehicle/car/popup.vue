<template>
  <el-dialog
    title="车辆详情"
    :visible.sync="show"
    :before-close="handleDialogClose"
    width="800px"
    :show="show"
    :close-on-click-modal="false"
    append-to-body
    class="carCss"
    v-if="show"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-row :gutter="30">
        <div style="padding: 0 30px 0 10px">
          <el-row :gutter="30" class="carPadding">
            <el-col :span="23" class="divider">
              <el-divider direction="vertical" />
              <h3>车辆信息</h3>
            </el-col>
          </el-row>
          <el-row style="margin-left: 10px">
            <el-col :span="8">
              <el-form-item label="车辆状态" prop="vehicleState">
                <el-select v-model="form.vehicleState">
                  <el-option label="使用中" value="1"></el-option>
                  <el-option label="未使用" value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="车牌号" prop="licensePlateNumber" class="MytoUpper">
                <el-input v-model.trim="form.licensePlateNumber" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="挂板号" prop="listingNumber">
                <el-input v-model.trim="form.listingNumber" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="margin-left: 10px">
            <el-col :span="8">
              <el-form-item label="车辆归属" prop="vehicleBelongState">
                <el-select v-model="form.vehicleBelongState" @change="vehicleChange">
                  <el-option label="公司车辆" value="1"></el-option>
                  <el-option label="外部车辆" value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="车架号" prop="frameNumber">
                <el-input v-model.trim="form.frameNumber" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="发动机号" prop="engineNumber">
                <el-input v-model.trim="form.engineNumber" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="margin-left: 10px">
            <!--选择日期-->
            <el-col :span="8">
              <el-form-item label="行驶证有效期" prop="drivingLicenseDate">
                <el-date-picker
                  type="date"
                  placeholder="选择日期"
                  style="width: 100%"
                  v-model="form.drivingLicenseDate"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="受益人" prop="userProfit">
                <el-select
                  v-model="form.name"
                  multiple
                  clearable
                  placeholder="请选择受益人"
                  style="width:100%"
                >
                  <el-option
                    v-for="item in corporateAccountOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-row>

      <!-- <el-row :gutter="30">
        <div style="padding: 0 30px 0 10px">
          <el-row :gutter="30" class="carPadding">
            <el-col :span="23" class="divider">
              <el-divider direction="vertical" />
              <h3>司机信息</h3>
            </el-col>
          </el-row>
          <el-row style="margin-left: 10px">
            <el-col :span="8">
              <el-form-item label="默认司机" prop="driverName">
                <el-select
                  ref="contacts"
                  style="width: 100%"
                  @change="driverChange"
                  v-model="form.driverName"
                  filterable
                  no-data-text="无匹配数据"
                  placeholder="请选择"
                  @visible-change="
                    (v) =>
                      visibleChange(
                        v,
                        'contacts',
                        0,
                        addContactsClick,
                        '添加司机'
                      )
                  "
                >
                  <el-option
                    v-for="item in contactsOptions"
                    :key="item.id"
                    :label="item.label"
                    :value="item"
                  >
                    <span style="float:left">{{item.value}}</span>
                    <span style="float:right;color:#8492a6;font-size:9px">{{item.phone}}</span>
                  </el-option>
                </el-select>
                <add-drivers
                  ref="addContacts"
                  v-if="addContactsVisible"
                  :visible.sync="addContactsVisible"
                  @contacts-success="onContactsSuccess"
                ></add-drivers>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="司机电话" prop="driverPhone">
                <el-input v-model.trim="form.driverPhone" placeholder="请输入"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-row>-->

      <!--用户上传图片-->
      <el-row :gutter="30">
        <div style="padding: 0 50px 0 10px">
          <el-row :gutter="30">
            <el-col :span="23" class="divider">
              <el-divider direction="vertical" />
              <h3>附加信息</h3>
            </el-col>
          </el-row>
          <el-row style="margin-left: 10px">
            <el-col :span="8">
              <el-form-item
                label="营运许可证照片"
                prop="operationPermitUrl"
                class="labelItem"
                label-width="120px"
              >
                <el-upload
                  action="/api/user/v1/attachment/upload"
                  list-type="picture-card"
                  :class="{ hide: operateHide }"
                  :headers="headers"
                  :multiple="isMultiple"
                  :limit="imgLimit"
                  :file-list="operationUrlArray"
                  :on-preview="handlePictureCardPreview"
                  :on-success="uploadIdFSuccess"
                  :before-upload="beforeAvatarUpload"
                  :on-error="uploadError"
                  :on-change="operationChange"
                  :before-remove="beforeRemove"
                >
                  <!--:on-remove="operationRemove"  -->
                  <div style="height: 25px">
                    <i class="el-icon-plus" />
                  </div>
                  <div>上传照片</div>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="行驶证照片"
                prop="drivingLicenseUrl"
                class="labelItem"
                label-width="120px"
              >
                <el-upload
                  action="/api/user/v1/attachment/upload"
                  list-type="picture-card"
                  :class="{ hide: driveHide }"
                  :headers="headers"
                  :multiple="isMultiple"
                  :limit="imgLimit"
                  :file-list="driveUrlArray"
                  :on-preview="handlePictureCardPreview"
                  :on-success="uploadIdRSuccess"
                  :before-upload="beforeAvatarUpload"
                  :on-error="uploadError"
                  :on-change="drivingChange"
                  :before-remove="beforedrivingRemove"
                >
                  <!--  -->
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
      <el-row v-hasPermi="['vehicle:car:edit']">
        <el-col :span="24">
          <el-form-item style="margin-left: 192px">
            <el-button type="primary" @click="submitForm">保存</el-button>
            <el-button @click="close">取消</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="[url]" />
  </el-dialog>
</template>

<script>
import { getToken } from '@/utils/auth';
import AddDrivers from './addDriver/index';
import { selectBottomAction } from '@/utils/mixins.js';
import { addVehicle, updateCar } from '@/api/basic/vehicle';
import { getCorporateIdentify, randomLenNum } from '@/utils/util';
import ElImageViewer from 'element-ui/packages/image/src/image-viewer';
import { validatenull } from '@/utils/ruoyi';
import { removeSessionStorage } from '@/utils/sessionStorage';
import store from '@/store';
export default {
  name: 'popup',
  mixins: [selectBottomAction],
  //接收父组件传过来的值
  props: {
    show: {
      type: Boolean,
      default: false
    },
    forms: {
      type: Object
    }
  },
  components: {
    'add-drivers': AddDrivers,
    ElImageViewer
  },

  data() {
    var validDriver = (rule, value, callback) => {
      if (
        this.form.vehicleBelongState == 1 &&
        this.form.driverName == undefined
      ) {
        callback(new Error('请选择司机'));
      }
      callback();
    };
    return {
      //显示查看器
      showViewer: false,
      url: '',
      //获取token
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      //照片属性
      operateHide: false,
      driveHide: false,
      //是否支持多选文件
      isMultiple: false,
      imgLimit: 1,
      form: {
        vehicleState: '1',
        vehicleBelongState: '2'
      },
      operationUrlArray: [],
      driveUrlArray: [],
      //查询参数
      corporateIdentify: '',
      //添加司机弹出层
      addContactsVisible: false,
      customerId: '',
      contactsOptions: [],
      //表单参数
      rules: {
        licensePlateNumber: [
          { required: true, message: '车牌号不能为空', trigger: 'blur' }
        ],
        driverName: [{ validator: validDriver, trigger: 'blur' }]
      },
      //受益人
      corporateAccountOptions: []
    };
  },
  created() {
    this.corporateAccountOptions = store.getters.corporate_account;
    if (!validatenull(this.forms.id)) {
      this.form = JSON.parse(JSON.stringify(this.forms));
      //赋值图片
      if (!validatenull(this.form.operationPermitUrl)) {
        let operationPermitUrl = {
          url: this.form.operationPermitUrl,
          status: 'success'
        };
        this.operationUrlArray.push(operationPermitUrl);
        this.operationChange('', this.operationUrlArray);
      }
      if (!validatenull(this.form.drivingLicenseUrl)) {
        let drivingLicenseUrl = {
          url: this.form.drivingLicenseUrl,
          status: 'success'
        };
        this.driveUrlArray.push(drivingLicenseUrl);
        this.drivingChange('', this.driveUrlArray);
      }
      //赋值受益人
      if (!validatenull(this.form.profitUserIds)) {
        var str = this.form.profitUserIds.split(',');
        this.form.name = str;
      }
    }
    this.getDriverList(this.form.vehicleBelongState);
  },

  methods: {
    vehicleChange(val) {
      this.getDriverList(val);
    },
    //查询所有司机的列表
    getDriverList(val) {
      this.contactsOptions = store.getters.driver.filter((res) => {
        if (res.driverBelongState == val) {
          return res;
        }
      });
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
    //营运资格证隐藏添加框
    operationChange(file, fileList) {
      this.operateHide = fileList[0].status === 'success';
    },
    //行驶证隐藏添加框
    drivingChange(file, fileList) {
      this.driveHide = fileList[0].status === 'success';
    },
    //移除行驶证照片
    beforedrivingRemove(file, fileList) {
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
            this.form.drivingLicenseUrl = '';
            this.driveHide = false;
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
    beforeRemove(file, fileList) {
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
            this.form.operationPermitUrl = '';
            this.operateHide = false;
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
    //表单重置
    reset() {
      this.form = {
        id: undefined,
        name: undefined,
        belongCompaniesId: undefined,
        licensePlateNumber: undefined,
        listingNumber: undefined,
        vehicleState: '1',
        driverName: undefined,
        driverPhone: undefined,
        drivingLicenseDate: undefined,
        vehicleBelongState: '1',
        frameNumber: undefined,
        engineNumber: undefined,
        operationPermitUrl: undefined,
        drivingLicenseUrl: undefined
      };
      //清除校验
      this.resetForm('form');
    },
    //表单提交
    submitForm: function () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.form.licensePlateNumber =
            this.form.licensePlateNumber.toUpperCase();
          this.form.profitUserIds = this.form.name.join(',');
          delete this.form.name;
          if (this.form.id != undefined) {
            this.form.belongCompaniesId = getCorporateIdentify();
            updateCar(this.form).then((response) => {
              if (response.data.data === 1) {
                this.msgSuccess('修改成功');
                //添加成功，删除缓存，重新拉取，并存入缓存
                removeSessionStorage({ name: 'vehicle' });
                const corporateIdentify = getCorporateIdentify();
                let obj = {
                  corporateIdentify: corporateIdentify,
                  //vehicleBelongState: 1,
                  state: 4
                };
                store.dispatch('GetConstant', obj).then(() => {});
                this.$parent.getCarList();
                this.operationUrlArray = [];
                this.driveUrlArray = [];
                this.$emit('update:show', false);
              } else if (response.data.data === 0) {
                this.$message({
                  message:
                    response.data.msg + '：' + this.form.licensePlateNumber,
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
            this.form.belongCompaniesId = getCorporateIdentify();
            addVehicle(this.form).then((response) => {
              if (response.data.data === 1) {
                this.msgSuccess('新增成功');
                //添加成功，删除缓存，重新拉取，并存入缓存
                removeSessionStorage({ name: 'vehicle' });
                const corporateIdentify = getCorporateIdentify();
                let obj = {
                  corporateIdentify: corporateIdentify,
                  //vehicleBelongState: 1,
                  state: 4
                };
                store.dispatch('GetConstant', obj).then(() => {});
                this.reset();
                this.$emit('update:show', false);
                this.$parent.getCarList();
                (this.operationUrlArray = []), (this.driveUrlArray = []);
              } else if (response.data.data === 0) {
                this.$message({
                  message:
                    response.data.msg + '：' + this.form.licensePlateNumber,
                  type: 'warning'
                });
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
    //添加司机的点击事件
    addContactsClick() {
      //设置添加司机的弹出框为true
      this.addContactsVisible = true;
    },
    //添加司机成功回调
    onContactsSuccess(res) {
      let arry = {
        id: randomLenNum(6, true),
        value: res.driverName,
        phone: res.driverPhone
      };
      this.contactsOptions.push(arry);
    },
    //下拉框改变时触发的事件
    driverChange(val) {
      console.log(val);
      // let arr = {};
      // //find为js数组实例方法,find,map,filter,forEach
      // arr = this.contactsOptions.find((item) => {
      //   return item.value === val;
      // });
      // this.form.driverPhone = arr.phone;
      this.form.driverId = val.id;
      this.form.driverName = val.value;
      this.form.driverPhone = val.phone;
    },
    //弹出框右上角x号
    handleDialogClose() {
      this.$emit('update:show', false);
      this.$parent.getCarList();
      this.reset();
    },
    //关闭
    close() {
      this.$emit('update:show', false);
      this.$parent.getCarList();
      this.operationUrlArray = [];
      this.driveUrlArray = [];
      this.reset();
    },
    //上传图片前
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
      this.form.operationPermitUrl = res.data.previewUrl;
    },
    //上传行驶证反面
    uploadIdRSuccess(res, file) {
      this.form.drivingLicenseUrl = res.data.previewUrl;
    },
    //上传图片失败
    uploadError(res, err) {
      this.$message.error('上传图片失败');
    }
  }
};
</script>
<style scoped >
.carCss >>> .el-dialog__body {
  padding-bottom: 0px;
  padding-top: 3px;
  height: 550px;
  padding-left: 25px;
}
.hide >>> .el-upload--picture-card {
  display: none;
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
.divider {
  height: 56px;
  padding: 0 15px;
  align-items: center;
  display: flex;
}
.divider .el-col .el-col-23 {
  padding-left: 0px;
}

.avatar-uploader >>> .el-upload {
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
.labelItem >>> .el-form-item__label {
  margin-top: 25px;
}
.MytoUpper >>> .el-input__inner {
  text-transform: uppercase;
}
.btn >>> .el-form-item__content {
  margin-left: 0;
}
</style>