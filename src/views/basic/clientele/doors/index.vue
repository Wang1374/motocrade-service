<template>
  <el-row :gutter="10" style="margin-left: 36px;">
    <el-col
      :span="8"
      v-for="(item, index) in doorswayList"
      :key="index"
      style="padding-bottom: 5px"
    >
      <el-card :body-style="{ padding: '0px 10px 0px 0px', height: '185px' }" shadow="never">
        <el-button
          :disabled="belongCompaniesId=='0'"
          @click="updateDate(item)"
          type="text"
          class="button"
          style="float: right;"
        >修改</el-button>
        <div style="padding: 1px 0 0 10px;">
          <div>
            客户名:
            <span class="span_sty">{{ item.customerName }}</span>
          </div>
          <div>
            门点简称：
            <span class="span_sty">{{ item.doorAs }}</span>
          </div>
          <div>
            门点全称:
            <span class="span_sty">{{ item.doorFullName }}</span>
          </div>
          <div>
            地址：
            <span class="span_sty">{{item.province}}{{item.city}}{{item.area}} {{item.address}}</span>
          </div>
          <div>
            联系人：
            <span class="span_sty">{{ item.contacts }}</span>
          </div>
          <div>
            联系电话：
            <span class="span_sty">{{ item.contactNumber }}</span>
          </div>
          <div>
            备注：
            <span class="span_sty">{{ item.remark }}</span>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :span="8" style="padding-bottom: 5px">
      <el-card
        :body-style="{ padding: '0px 10px 0px 0px', height: '150px', background: 'aliceblue' }"
        shadow="never"
      >
        <div style="text-align: center;">
          <el-link
            @click="handleAdd"
            style="font-size: 100px; padding-top: 10px;"
            icon="el-icon-circle-plus-outline"
            :underline="false"
          ></el-link>
          <div style="color: #409EFF">添加门点信息</div>
        </div>
      </el-card>
    </el-col>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="450px"
      v-if="open"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="客户名" prop="customerName">
              <el-input v-model="form.customerName" :disabled="isDisabled" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="门点简称" prop="doorAs">
              <el-input v-model.trim="form.doorAs" placeholder="请输入门点简称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="门点全称" prop="doorFullName">
              <el-input v-model.trim="form.doorFullName" placeholder="请输入门点全称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="地址" prop="address">
              <v-distpicker
                @selected="onSelected"
                :province="form.province"
                :city="form.city"
                :area="form.area"
                style="display: inline-block;"
              ></v-distpicker>
              <el-input style="padding-top: 5px;" v-model="form.address" placeholder="详细地址" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="联系人" prop="contacts">
              <el-input v-model.trim="form.contacts" placeholder="请输入联系人" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label.trim="联系电话" prop="contactNumber">
              <el-input v-model="form.contactNumber" placeholder="请输入联系电话" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loadingBtn" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>
<script>
import { listDoorsway, addDoors, updateDoors } from '@/api/basic/doors';
import { removeSessionStorage } from '@/utils/sessionStorage';
import { getCorporateIdentify } from '@/utils/util';
import { validatenull } from '@/utils/validate';
import store from '@/store';
export default {
  name: 'Doors',
  data() {
    return {
      //form
      open: false,
      title: '门点信息',
      form: {},
      isDisabled: true,
      //门点信息数据
      doorswayList: [],
      //客户数据
      optionsCustomer: [],
      // 表单校验
      rules: {
        doorAs: [
          { required: true, message: '请输入门点简称', trigger: 'blur' }
        ],
        address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
        doorFullName: [
          { required: true, message: '请输入门点全称', trigger: 'blur' }
        ]
      },
      loadingBtn: false
    };
  },
  props: {
    customerId: {
      type: String,
      default: ''
    },
    customerName: {
      type: String,
      default: ''
    },
    belongCompaniesId: {
      type: String
    }
  },
  created() {
    this.getList(this.customerId);
  },
  methods: {
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        belongCompaniesId: getCorporateIdentify(),
        customerId: undefined,
        customerName: this.customerName,
        doorAs: undefined,
        doorFullName: undefined,
        contacts: undefined,
        contactNumber: undefined,
        province: undefined,
        city: undefined,
        area: undefined,
        address: undefined,
        remark: undefined
      };
      this.resetForm('form');
    },
    /** 根据 customerId 查询门点列表 */
    getList() {
      listDoorsway(this.customerId).then((response) => {
        this.doorswayList = response.data;
      });
    },
    cancel() {
      this.open = false;
    },
    handleAdd() {
      this.reset();
      this.open = true;
      this.optionsCustomer = store.getters.customer;
    },
    updateDate(data) {
      this.optionsCustomer = store.getters.customer;
      this.form = JSON.parse(JSON.stringify(data));
      this.open = true;
    },
    change(val) {
      let obj = {};
      obj = this.optionsCustomer.find((item) => {
        return item.id === val;
      });
      this.form.customerName = obj.label;
    },
    onSelected(data) {
      this.form.province = data.province.value;
      this.form.city = data.city.value;
      this.form.area = data.area.value;
    },
    submitForm: function () {
      this.$refs['form'].validate((valid) => {
        this.form.customerId = this.customerId;
        if (valid) {
          this.loadingBtn = true;
          if (!validatenull(this.form.id)) {
            updateDoors(this.form).then((response) => {
              if (response.data.code === 200) {
                if (response.data.data === 1) {
                  this.msgSuccess(response.data.msg);
                  this.open = false;
                  this.getList(this.customerId);
                  // 添加成功 删除缓存，重新拉取并存入缓存
                  removeSessionStorage({ name: 'customer' });
                  const corporateIdentify = getCorporateIdentify();
                  let obj = {
                    corporateIdentify: corporateIdentify,
                    state: 1
                  };
                  store.dispatch('GetConstant', obj).then(() => {});
                } else if (response.data.data === 0) {
                  this.$message({
                    message: response.data.msg + '：' + this.form.doorAs,
                    type: 'warning'
                  });
                } else if (response.data.data === -1) {
                  this.$message({
                    message: response.data.msg,
                    type: 'warning'
                  });
                }
              } else {
                this.msgError(response.data.msg);
              }
              this.loadingBtn = false;
            });
          } else {
            addDoors(this.form).then((response) => {
              if (response.data.code === 200) {
                if (response.data.data === 1) {
                  this.msgSuccess(response.data.msg);
                  this.open = false;
                  this.getList(this.customerId);
                  // 添加成功 删除缓存，重新拉取并存入缓存
                  removeSessionStorage({ name: 'customer' });
                  const corporateIdentify = getCorporateIdentify();
                  let obj = {
                    corporateIdentify: corporateIdentify,
                    state: 1
                  };
                  store.dispatch('GetConstant', obj).then(() => {});
                } else if (response.data.data === 0) {
                  this.$message({
                    message: response.data.msg + '：' + this.form.doorAs,
                    type: 'warning'
                  });
                } else if (response.data.data === -1) {
                  this.$message({
                    message: response.data.msg,
                    type: 'warning'
                  });
                }
              } else {
                this.msgError(response.data.msg);
              }
              this.loadingBtn = false;
            });
          }
        }
      });
    }
  }
};
</script>