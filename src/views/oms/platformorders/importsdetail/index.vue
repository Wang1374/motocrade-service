<template>
  <div>
    <div
      v-show="showCostType === 0"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
    >
      <!-- 客户信息 -->
      <el-row :gutter="20">
        <el-col :span="23" class="divider">
          <el-divider direction="vertical" />
          <h4>客户信息</h4>
        </el-col>
        <el-row>
          <el-col :span="23" style="padding-left: 46px; padding-bottom: 15px">
            <el-col :span="6">
              <span style="font-weight: bold">客户名称：</span>
              {{ temp.salesman }}
            </el-col>
            <el-col :span="6">
              <span style="font-weight: bold">客户编号：</span>
              {{ temp.placeOrderNumber }}
            </el-col>
            <el-col :span="6">
              <span style="font-weight: bold">联系人：</span>
              {{ temp.operator }}
            </el-col>
            <el-col :span="6">
              <span style="font-weight: bold">联系电话：</span>
              {{ temp.phone }}
            </el-col>
          </el-col>
        </el-row>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="23" class="divider">
          <el-divider direction="vertical" />
          <h4>业务信息</h4>
        </el-col>
        <el-row>
          <el-col :span="23" style="padding-left: 46px; padding-bottom: 15px">
            <el-col :span="6">
              <span style="font-weight: bold">订单编号：</span>
              {{ temp.orderNumber }}
            </el-col>
            <el-col :span="6">
              <span style="font-weight: bold">船名：</span>
              {{ shipsName }}
            </el-col>
            <el-col :span="6">
              <span style="font-weight: bold">航次：</span>
              {{ voyage }}
            </el-col>
            <el-col :span="6">
              <span style="font-weight: bold">船公司：</span>
              {{ temp.shippingCompany }}
            </el-col>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="23" style="padding-left: 46px; padding-bottom: 15px">
            <el-col :span="6">
              <span style="font-weight: bold">开港日期：</span>
              {{ formatDate(temp.openingDate, "yyyy-MM-dd hh:mm") }}
            </el-col>
            <el-col :span="6">
              <span style="font-weight: bold">截港日期：</span>
              {{ formatDate(temp.cutOffDate, "yyyy-MM-dd hh:mm") }}
            </el-col>
            <el-col :span="6">
              <span style="font-weight: bold">截单日期：</span>
              {{ formatDate(temp.dueDate, "yyyy-MM-dd hh:mm") }}
            </el-col>
            <el-col :span="6">
              <span style="font-weight: bold">停靠码头：</span>
              {{ temp.dock }}
            </el-col>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="23" style="padding-left: 46px; padding-bottom: 15px">
            <el-col :span="6">
              <span style="font-weight: bold">计划靠泊：</span>
              {{ formatDate(temp.plannedDocking, "yyyy-MM-dd hh:mm") }}
            </el-col>
            <el-col :span="6">
              <span style="font-weight: bold">实际靠泊：</span>
              {{ formatDate(temp.actualBerthing, "yyyy-MM-dd hh:mm") }}
            </el-col>
            <el-col :span="6">
              <span style="font-weight: bold">开船日期：</span>
              {{ formatDate(temp.shippingDay, "yyyy-MM-dd hh:mm") }}
            </el-col>
            <el-col :span="6">
              <span style="font-weight: bold">放箱公司：</span>
              {{ temp.putTheBoxCompany }}
            </el-col>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="23" style="padding-left: 46px; padding-bottom: 15px">
            <el-col :span="6">
              <span style="font-weight: bold">起运港：</span>
              {{ temp.portOfLoading }}
            </el-col>
            <el-col :span="6">
              <span style="font-weight: bold">中转港：</span>
              {{ temp.portOfDischarge }}
            </el-col>
            <el-col :span="6">
              <span style="font-weight: bold">目的港：</span>
              {{ temp.placeOfDelivery }}
            </el-col>
            <el-col :span="6">
              <span style="font-weight: bold">放箱时间：</span>
              {{ formatDate(temp.putTheBoxTime, "yyyy-MM-dd hh:mm") }}
            </el-col>
          </el-col>
        </el-row>
        <el-row>
          <div v-if="temp.blNos !== null">
            <el-col :span="23" style="padding-left: 46px; padding-bottom: 15px">
              <el-col :span="6" v-for="(item, index) in temp.blNos.split(',')" :key="index">
                <span style="font-weight: bold">提单号{{ index + 1 }}：</span>
                {{ item }}
              </el-col>
            </el-col>
          </div>
          <div v-else>
            <el-col :span="5">
              <span style="font-weight: bold">提单号1：</span>
            </el-col>
          </div>
        </el-row>
        <!-- <el-row> -->
        <!-- <el-col :span="23" style="padding-left: 46px; padding-bottom: 15px">
            <span style="font-weight: bold">操作记录：</span>
            {{ temp.exceptionRecord }}
        </el-col>-->
        <!-- <el-col :span="24" style="padding-left: 6px; padding-bottom: 15px">
            <span style="font-weight: bold">操作记录：</span>
            <el-input
              v-model="exceptionRecord"
              type="textarea"
              style="width:94%"
              :autosize="{ minRows:5, maxRows: 10}"
        ></el-input>-->
        <!-- <span style="font-weight: bold">操作记录：</span>
            {{ temp.exceptionRecord }}
        -->
        <!-- </el-col> -->
        <!-- <el-col :span="21">
            <el-input
              v-model="exceptionRecord"
              type="textarea"
              style="width:94%"
              :autosize="{ minRows:5, maxRows: 10}"
            ></el-input>
        </el-col>-->
        <!-- </el-row> -->
      </el-row>

      <!-- 做箱信息 -->
      <making-chest
        ref="makingChestChild"
        :blNoList="blNoArray"
        :exceptionRecordCarTemp="exceptionRecordCarTemp"
        :baseForm="form"
        :vesselAndVoyage="shipsName + '/' + voyage"
        @change-childForm="changeChildForm"
        @changeException="changeException"
      ></making-chest>

      <el-row>
        <el-col :span="23" class="divider">
          <el-divider direction="vertical" />
          <h4>内部信息</h4>
        </el-col>
        <el-col :span="23">
          <el-form ref="form3" :model="form" label-width="110px">
            <el-col :span="6">
              <el-form-item label="操作员" prop="operator">
                <el-input v-model="form.operator" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="业务员" prop="salesman">
                <el-input v-model="form.salesman" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="接单日期">
                <el-date-picker
                  type="datetime"
                  format="yyyy-MM-dd HH:mm"
                  v-model="form.orderTime"
                  style="width: 100%;"
                  disabled
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
        @refreshList="refreshList"
        :objForm="childForm"
        @up-down-events="upDownEvents"
      ></motorcade-cost-details>
    </div>
  </div>
</template>
<script>
import store from '@/store';
import MakingChest from '../makingChest/index.vue';
import MotorcadeCostDetails from '@/views/cost/motorcadeCostDetails/index.vue';
import { validatenull } from '@/utils/ruoyi';

export default {
  name: 'OrderDetail',
  components: {
    'making-chest': MakingChest,
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
      exceptionRecordCarTemp: '',
      // 表单参数
      form: {},
      phone: '',
      shipsName: '',
      voyage: '',
      // 船公司
      shippingCompanyOptions: [],
      // 提单号数组
      blNoArray: [
        {
          blNo: ''
        }
      ],
      showCostType: 0,
      childForm: null
    };
  },
  created() {
    if (this.temp !== null) {
      this.form = JSON.parse(JSON.stringify(this.temp));
      if (this.form.creator == 'jxwl') {
        this.phone = '18915075917';
      } else {
        this.phone = this.form.creator;
      }
      // 赋值 船名航次 过滤
      var last = this.form.vesselAndVoyage.lastIndexOf('/');
      this.shipsName = this.form.vesselAndVoyage.substring(0, last);
      this.voyage = this.form.vesselAndVoyage.substring(
        last + 1,
        this.form.vesselAndVoyage.length
      );
      this.exceptionRecordCarTemp = this.form.exceptionRecordCar;
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
    }
  },
  computed: {
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
    //操作记录改变
    changeException(val) {
      this.exceptionRecordCarTemp = val;
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
