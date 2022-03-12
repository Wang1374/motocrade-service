<template>
  <div>
    <el-row>
      <el-col :span="23" class="divider">
        <el-divider direction="vertical" />
        <h4>基础信息</h4>
      </el-col>
      <el-col :span="23">
        <el-form ref="form" :model="form" label-width="110px">
          <el-row>
            <el-col :span="6">
              <el-form-item label="订单编号">
                <el-input v-model="form.orderNumber" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="业务类型">
                <el-select v-model="form.orderType" style="width: 100%;" disabled>
                  <el-option
                    v-for="item in orderTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="客户名称">
                <el-input v-model="form.customerName" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="客户编号">
                <el-input v-model="form.customerNum" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="提单号">
                <el-input v-model.trim="form.blNoStr" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="船名航次">
                <el-input v-model="form.vesselAndVoyage" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="停靠码头">
                <el-input v-model="form.dock" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="提/还箱点">
                <el-input v-model="form.prPoint" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="门点地址">
                <el-input v-model.trim="form.address" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="运输方式">
                <el-select v-model="form.typeOfShipping" style="width: 100%;" disabled>
                  <el-option
                    v-for="item in typeOfShippingOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="承运公司">
                <el-input v-model.trim="form.carrierCompany" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="毛重">
                <el-input v-model.trim="form.grossWeight" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="操作记录">
              <el-input
                type="textarea"
                :rows="2"
                resize="none"
                disabled
                v-model="form.exceptionRecord"
              ></el-input>
            </el-form-item>
          </el-row>
        </el-form>
      </el-col>
      <el-col :span="23" style="background-color: powderblue;">
        <el-row>
          <el-col :offset="1" :span="4">
            <span style="font-weight: 550;">箱号：</span>
            <span>{{ form.caseNumber }}</span>
          </el-col>
          <el-col :span="3">
            <span style="font-weight: 550;">箱型：</span>
            <span>{{ form.boxPile }}</span>
          </el-col>
          <el-col :span="6">
            <span style="font-weight: 550;">车辆：</span>
            <span>{{ form.vehicle }}</span>
          </el-col>
          <el-col :span="5">
            <span style="font-weight: 550;">司机：</span>
            <span>{{ form.driver }}</span>
          </el-col>
          <el-col :offset="1" :span="4">
            <span style="font-weight: 550;">箱毛利(CNY)：</span>
            <span style="color:red">{{ profit }}</span>
          </el-col>
        </el-row>
        <el-row v-if="!form.id">
          <el-col :offset="1" :span="4">
            <el-button
              type="text"
              icon="el-icon-caret-left"
              @click="upAndDown(form.index - 1)"
              :style="{color:(form.index == 0 ? '#909399' : '')}"
            >上一箱</el-button>
          </el-col>
          <el-col :offset="16" :span="2">
            <el-button
              type="text"
              icon="el-icon-caret-right"
              @click="upAndDown(form.index + 1)"
              :style="{color:(form.index == form.allIndex ? '#909399' : '')}"
            >下一箱</el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>

    <!-- 应收明细 -->
    <receivables ref="receivablesChild" :costObj="form" @refreshList="refreshListMiddle()"></receivables>

    <!-- 应付明细 -->
    <cope-with ref="copeWithChild" :costObj="form" @refreshList="refreshListMiddle()"></cope-with>
  </div>
</template>
<script>
import Receivables from './receivables/index.vue';
import CopeWith from './copeWith/index.vue';
import store from '@/store';

export default {
  name: 'PlatformCostDetails',
  components: {
    receivables: Receivables,
    'cope-with': CopeWith
  },
  props: {
    objForm: {
      type: Object,
      default: null
    },
    refreshList: {
      type: Function
    }
  },
  data() {
    return {
      form: {},
      // 订单类型
      orderTypeOptions: [
        {
          value: 1,
          label: '海运出口'
        },
        {
          value: 2,
          label: '海运进口'
        }
      ],
      // 运输方式
      typeOfShippingOptions: [
        {
          value: 1,
          label: '自做'
        },
        {
          value: 2,
          label: '外发'
        }
      ]
    };
  },
  computed: {
    profit() {
      let profit = 0;
      if (this.$route.name == 'Analysis') {
        profit = (
          Number(store.getters.ys_total_analysis) -
          Number(store.getters.yf_total_analysis) +
          Number(store.getters.qtys_total_analysis) -
          Number(store.getters.qtyf_total_analysis)
        ).toFixed(2);
      } else {
        profit = (
          Number(store.getters.ys_total_cost) -
          Number(store.getters.yf_total_cost) +
          Number(store.getters.qtys_total_cost) -
          Number(store.getters.qtyf_total_cost)
        ).toFixed(2);
      }
      return profit;
    }
  },
  created() {
    this.form = JSON.parse(JSON.stringify(this.objForm));
  },
  mounted() {
    window.scrollTo(0, 0);
  },
  methods: {
    //为子组件提供调用父组件的方法
    refreshListMiddle() {
      this.$emit('refreshList');
    },
    // 上下箱事件
    upAndDown(index) {
      this.$emit('up-down-events', index, (data) => {
        if (data == null) {
          this.$message({
            message: '没有数据了...',
            type: 'warning'
          });
        } else {
          this.form = JSON.parse(JSON.stringify(data));
        }
      });
    }
  }
};
</script>
<style>
.divider {
  height: 56px;
  padding: 0 15px;
  align-items: center;
  display: flex;
}
.el-divider--vertical {
  border-left: 3px solid #408eff;
}
</style>
