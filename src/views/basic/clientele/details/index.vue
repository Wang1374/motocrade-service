<template>
  <el-row :gutter="10">
    <el-row style="padding: 15px 0 0 20px;" v-if="form.belongCompaniesId != '0'">
      <el-button
        type="primary"
        size="mini"
        :loading="loadingBtn"
        @click="submitForm"
        style="width: 90px;"
      >保存</el-button>
      <!-- <el-button
        v-if="form.id !== '' && form.id !== undefined && form.nature !== 3"
        type="primary"
        size="mini"
        style="width: 90px;"
        plain
        :loading="loadingBtnTo"
        @click="convertTo(form.id, form.companyName, form.nature)"
      >{{ form.nature == 1 ? '转为供应商' : '转为客户' }}</el-button>

      <el-checkbox :true-label="2" :false-label="1" style="margin-left: 30px;">客户/供应商</el-checkbox>-->
    </el-row>
    <el-row>
      <el-col :span="23" class="divider">
        <el-divider direction="vertical" />
        <h4>基础信息</h4>
      </el-col>
      <el-col :span="23">
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          :disabled="form.belongCompaniesId == '0'"
          label-width="auto"
        >
          <el-row>
            <el-col :span="6">
              <el-form-item label="公司抬头" prop="companyName">
                <el-input v-model.trim="form.companyName" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="公司代码" prop="companyCode">
                <el-input v-model.trim="form.companyCode" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="统一社会信用代码" prop="uscc">
                <el-input v-model.trim="form.uscc" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="付款人" prop="payer">
                <el-input v-model.trim="form.payer" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="性质" prop="nature">
                <el-select v-model="form.nature" placeholder="请选择" style="width: 100%;">
                  <el-option
                    v-for="item in natureOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="类型" prop="type">
                <el-select v-model="form.type" placeholder="请选择" style="width: 100%;">
                  <el-option
                    v-for="item in typeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="合作伙伴" prop="partner">
                <el-select v-model="form.partner" placeholder="请选择" style="width: 100%;">
                  <el-option
                    v-for="item in partnerOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="form.belongCompaniesId == '0'">
              <el-form-item label="业务人员" prop="salesman">
                <el-input v-model="sslm"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-else-if="form.nature == 1 || form.nature==4">
              <el-form-item label="业务人员" prop="salesman">
                <el-select v-model="form.salesman" placeholder="请选择" style="width:100%">
                  <el-option
                    v-for="item in corporateAccountOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="form.nature == 2">
              <el-form-item label="EIR" prop="eir">
                <el-input v-model="form.eir" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="对账方式" prop="howToAccount">
                <el-select v-model="form.howToAccount" placeholder="请选择" style="width:100%">
                  <el-option
                    v-for="item in howToAccountOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="结算方式" prop="clearingForm">
                <el-select v-model="form.clearingForm" placeholder="请选择" style="width: 100%;">
                  <el-option
                    v-for="item in clearingFormOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="结算周期" prop="settlementInterval">
                <el-select v-model="form.settlementInterval" placeholder="请选择" style="width: 100%;">
                  <el-option
                    v-for="item in sifOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="账期" prop="paymentDays">
                <el-input v-model="form.paymentDays">
                  <span slot="append">天</span>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="中文地址" prop="chineseAddress">
                <v-distpicker
                  @selected="onSelected"
                  :province="form.province"
                  :city="form.city"
                  :area="form.area"
                  style="display: inline-block;"
                ></v-distpicker>
                <el-input
                  style="padding-top: 5px;"
                  v-model="form.chineseAddress"
                  placeholder="详细地址"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="英文名称" prop="englishName">
                <el-input v-model="form.englishName" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="英文地址" prop="englishAddress">
                <el-input v-model="form.englishAddress" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input v-model="form.remark" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
    <el-row v-if="(form.id !== '' && form.id !== undefined)">
      <el-col :span="23" style="padding: 0 0px 0 15px;">
        <el-collapse v-model="activeNames">
          <el-collapse-item name="1">
            <template slot="title">
              <el-divider direction="vertical" />
              <h3>账户信息</h3>
            </template>
            <!-- 账户信息 -->
            <bs-account
              v-bind="$attrs"
              :customerId="form.id"
              :companyName="form.companyName"
              :temp="form"
              :uscc="form.uscc"
              :belongCompaniesId="temp.belongCompaniesId"
            ></bs-account>
          </el-collapse-item>
          <el-collapse-item name="2">
            <template slot="title">
              <el-divider direction="vertical" />
              <h3>联系方式</h3>
            </template>
            <!-- 联系方式 -->
            <contact-way :customerId="form.id" :belongCompaniesId="temp.belongCompaniesId"></contact-way>
          </el-collapse-item>
          <el-collapse-item name="3">
            <template slot="title">
              <el-divider direction="vertical" />
              <h3>门点信息</h3>
            </template>
            <!-- 门点信息 -->
            <doors-way
              :customerId="form.id"
              :customerName="form.companyName"
              :belongCompaniesId="temp.belongCompaniesId"
            ></doors-way>
          </el-collapse-item>
          <el-collapse-item name="4">
            <template slot="title">
              <el-divider direction="vertical" />
              <h3>寄单地址</h3>
            </template>
            <!-- 寄单地址 -->
            <send-receip :customerId="form.id" :belongCompaniesId="temp.belongCompaniesId" />
          </el-collapse-item>
        </el-collapse>
      </el-col>
    </el-row>
  </el-row>
</template>
<script>
import VDistpicker from 'v-distpicker';
import { addClientele, updateClientele } from '@/api/basic/clientele';
import Account from '../account/index.vue';
import Contactway from '../contactway/index.vue';
import SendReceip from '../sendReceip/index.vue';
import Doors from '../doors/index.vue';
import { removeSessionStorage } from '@/utils/sessionStorage';
import { getCorporateIdentify } from '@/utils/util';
import store from '@/store';
import { validatenull } from '@/utils/validate';
export default {
  name: 'Details',
  components: {
    VDistpicker,
    'bs-account': Account,
    'contact-way': Contactway,
    'doors-way': Doors,
    'send-receip': SendReceip
  },
  props: {
    temp: {
      type: Object,
      default: null
    },
    natureType: {
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
      // 表单参数
      form: {},
      rules: {
        companyName: [
          { required: true, message: '公司抬头不能为空', trigger: 'blur' }
        ],
        salesman: [
          { required: true, message: '业务人员不能为空', trigger: 'blur' }
        ],
        partner: [
          { required: true, message: '合作伙伴不能为空', trigger: 'blur' }
        ]
      },
      // 合作伙伴
      partnerOptions: [
        {
          value: 0,
          label: ''
        },
        {
          value: 1,
          label: '固定'
        },
        {
          value: 2,
          label: '非固定'
        }
      ],
      // 性质状态
      natureOptions: [
        {
          value: 1,
          label: '客户'
        },
        {
          value: 2,
          label: '供应商'
        },
        {
          value: 4,
          label: '客户/供应商'
        }
      ],
      // 类型状态
      typeOptions: [
        {
          value: 1,
          label: '公司'
        },
        {
          value: 2,
          label: '个人'
        }
      ],
      // 企业所有账户
      corporateAccountOptions: [],
      howToAccountOptions: [
        {
          value: 1,
          label: '单票'
        },
        {
          value: 2,
          label: '多票'
        }
      ],
      clearingFormOptions: [
        {
          value: 1,
          label: '票结'
        },
        {
          value: 2,
          label: '月结'
        }
      ],
      sifOptions: [
        {
          value: 1,
          label: '1号'
        },
        {
          value: 2,
          label: '2号'
        },
        {
          value: 3,
          label: '3号'
        },
        {
          value: 4,
          label: '4号'
        },
        {
          value: 5,
          label: '5号'
        },
        {
          value: 6,
          label: '6号'
        },
        {
          value: 7,
          label: '7号'
        },
        {
          value: 8,
          label: '8号'
        },
        {
          value: 9,
          label: '9号'
        },
        {
          value: 10,
          label: '10号'
        },
        {
          value: 11,
          label: '11号'
        },
        {
          value: 12,
          label: '12号'
        },
        {
          value: 13,
          label: '13号'
        },
        {
          value: 14,
          label: '14号'
        },
        {
          value: 15,
          label: '15号'
        },
        {
          value: 16,
          label: '16号'
        },
        {
          value: 17,
          label: '17号'
        },
        {
          value: 18,
          label: '18号'
        },
        {
          value: 19,
          label: '19号'
        },
        {
          value: 20,
          label: '20号'
        },
        {
          value: 21,
          label: '21号'
        },
        {
          value: 22,
          label: '22号'
        },
        {
          value: 23,
          label: '23号'
        },
        {
          value: 24,
          label: '24号'
        },
        {
          value: 25,
          label: '25号'
        },
        {
          value: 26,
          label: '26号'
        },
        {
          value: 27,
          label: '27号'
        },
        {
          value: 28,
          label: '28号'
        }
      ],
      activeNames: [],
      loadingBtn: false,
      loadingBtnTo: false,
      //保存成功显示
      alreadySave: false,
      //
      saveForm: {},
      sslm: store.getters.company.companyName
    };
  },
  created() {
    if (this.temp !== null) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      this.form = Object.assign({}, this.temp);
      if (store.getters.company.accountType == 1) {
        if (this.form.belongCompaniesId == 0) {
          this.form.nature = 2;
        }
      }
      setTimeout(() => {
        loading.close();
      }, 1000);
    } else {
      this.reset();
    }
  },
  mounted() {
    this.corporateAccountOptions = store.getters.corporate_account;
  },
  methods: {
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        belongCompaniesId: getCorporateIdentify(),
        companyName: undefined,
        companyCode: undefined,
        uscc: undefined,
        partner: 2,
        nature: this.natureType,
        type: 1,
        salesman: store.getters.company.companyName,
        howToAccount: 1,
        clearingForm: 1,
        settlementInterval: 1,
        paymentDays: 30,
        eir: undefined,
        province: undefined,
        city: undefined,
        area: undefined,
        chineseAddress: undefined,
        englishName: undefined,
        englishAddress: undefined,
        remark: undefined
      };
      this.resetForm('form');
    },
    onSelected(data) {
      this.form.province = data.province.value;
      this.form.city = data.city.value;
      this.form.area = data.area.value;
    },
    submitForm: function () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loadingBtn = true;
          if (!validatenull(this.form.id)) {
            updateClientele(this.form).then((response) => {
              if (response.data.code === 200) {
                if (response.data.data === 1) {
                  this.msgSuccess(response.data.msg);
                  // 更新成功 删除缓存，重新拉取并存入缓存
                  removeSessionStorage({ name: 'customer' });
                  const corporateIdentify = getCorporateIdentify();
                  let obj = {
                    corporateIdentify: corporateIdentify,
                    state: 1
                  };
                  store.dispatch('GetConstant', obj).then(() => {});
                  this.$emit('typeChanged', this.form);
                } else if (response.data.data === 0) {
                  this.$message({
                    message: response.data.msg + '：' + this.form.companyName,
                    type: 'warning'
                  });
                }
              } else {
                this.msgError(response.data.msg);
              }
              this.loadingBtn = false;
            });
          } else {
            addClientele(this.form).then((response) => {
              if (response.data.code === 200) {
                if (response.data.data === 1) {
                  // if (!validatenull(this.form.province)) {
                  // }
                  this.msgSuccess(response.data.msg);
                  this.alreadySave = true;
                  this.saveForm.id = response.data.idStr;
                  this.form.id = response.data.idStr;
                  this.saveForm.companyName = this.form.companyName;
                  this.saveForm.uscc = this.form.uscc;
                  // 添加成功 删除缓存，重新拉取并存入缓存
                  removeSessionStorage({ name: 'customer' });
                  const corporateIdentify = getCorporateIdentify();
                  let obj = {
                    corporateIdentify: corporateIdentify,
                    state: 1
                  };
                  store.dispatch('GetConstant', obj).then(() => {});
                  this.$emit('typeChanged', this.form);
                } else if (response.data.data === 0) {
                  this.$message({
                    message: response.data.msg + '：' + this.form.companyName,
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
    },
    // 转换性质
    convertTo(formId, name, state) {
      let params = {
        id: formId,
        companyName: name,
        nature: 0
      };
      if (state == 1) {
        params.nature = 2;
      } else {
        params.nature = 1;
      }
      // 传入id 与 性质 进行修改
      this.loadingBtnTo = true;
      updateClientele(params).then((response) => {
        if (response.data.code === 200) {
          if (response.data.data === 1) {
            this.msgSuccess('修改成功');
            removeSessionStorage({ name: 'customer' });
            const corporateIdentify = getCorporateIdentify();
            let obj = {
              corporateIdentify: corporateIdentify,
              state: 1
            };
            store.dispatch('GetConstant', obj).then(() => {});
          } else if (response.data.data === 0) {
            this.$message({
              message: '转换失败，已经存在公司抬头',
              type: 'warning'
            });
          }
        } else {
          this.msgError(response.data.msg);
        }
        this.loadingBtnTo = false;
      });
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
  padding: 0 15px;
  align-items: center;
  display: flex;
}
</style>
