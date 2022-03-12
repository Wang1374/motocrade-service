<template>
  <div v-loading="loading" style="padding-bottom: 20px;">
    <el-row :gutter="20">
      <!--客户数据-->
      <el-col :span="16" :xs="24">
        <el-card :body-style="{ padding: '0px 10px 0px 0px'}" shadow="never">
          <div slot="header" class="clearfix">
            <span style="color: #fff;">当前订单编号</span>
          </div>
          <div style="margin: 0 0 20px 20px;">
            <div class="divStyle">
              前缀名称：
              <span class="span_sty">{{ orderNumber.prefix }}</span>
            </div>
            <div class="divStyle">
              业务编号：
              <span
                class="span_sty"
              >海运出口(SE)&#12288;海运进口(SI)&#12288;空运出口(AE)&#12288;空运进口(AI)&#12288;陆运(TR)</span>
            </div>
            <div class="divStyle">
              序列号：
              <span class="span_sty">{{ orderNumber.seriesNumber }}</span>
            </div>
            <div class="divStyle">
              展示样式：
              <span
                class="span_sty"
              >{{ orderNumber.prefix + 'SE' }}{{ orderNumber.seriesNumber | seriesNumberFilte }}</span>
              <el-button @click="updateDate(orderNumber)" type="text" class="button">编辑</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="400px"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form ref="form" label-position="top" :model="form" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="前缀名称：" prop="prefix" class="form-item">
              <el-input v-model="valueComputed" placeholder="请输入前缀名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="序列号：" prop="seriesNumber" class="form-item">
              <el-select v-model="form.seriesNumber" placeholder="请选择" style="width: 100%;">
                <el-option
                  v-for="item in seriesNumberOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="序列号叠加规则：" prop="businessRule" class="form-item">
              <el-row :gutter="4">
                <el-col :span="12">
                  <el-select v-model="form.businessRule" placeholder="请选择" style="width: 100%;">
                    <el-option
                      v-for="item in businessRuleOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-col>
                <el-col :span="12">
                  <el-select v-model="form.dateRule" placeholder="请选择" style="width: 100%;">
                    <el-option
                      v-for="item in dateRuleOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="展示样式：" prop="seriesNumber" class="form-item">
              <span>{{ form.prefix + 'SE' }}{{ form.seriesNumber | seriesNumberFilte }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getCorporateIdentify, getNowFormatDate } from "@/utils/util";
import { getOrderNumber, updateOrderNumber } from "@/api/basic/orderNumber";
export default {
  name: "OrderNumberSet",
  filters: {
    seriesNumberFilte(value) {
      if (value === 3) {
        return getNowFormatDate() + "001";
      } else if (value === 4) {
        return getNowFormatDate() + "0001";
      } else if (value === 5) {
        return getNowFormatDate() + "00001";
      }
    }
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 订单号设置数据
      orderNumber: {
        id: "",
        belongCompaniesId: "",
        prefix: "",
        seriesNumber: "",
        businessRule: "",
        dateRule: ""
      },
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {},
      seriesNumberOptions: [
        {
          value: 3,
          label: "3位"
        },
        {
          value: 4,
          label: "4位"
        },
        {
          value: 5,
          label: "5位"
        }
      ],
      businessRuleOptions: [
        {
          value: "1",
          label: "分业务类型叠加"
        },
        {
          value: "2",
          label: "全部叠加"
        }
      ],
      dateRuleOptions: [
        {
          value: "1",
          label: "按日叠加"
        },
        {
          value: "2",
          label: "按月叠加"
        }
      ]
    };
  },
  computed: {
    valueComputed: {
      get: function() {
        return this.form.prefix;
      },
      set: function(val) {
        this.form.prefix = val.toUpperCase();
      }
    }
  },
  created() {
    this.getNumber();
  },
  methods: {
    /** 查询订单编号信息 */
    getNumber() {
      if (getCorporateIdentify()) {
        this.loading = true;
        getOrderNumber(getCorporateIdentify()).then(response => {
          this.orderNumber = response.data;
          this.loading = false;
        });
      }
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        belongCompaniesId: getCorporateIdentify(),
        prefix: undefined,
        seriesNumber: undefined,
        businessRule: undefined,
        dateRule: undefined
      };
      this.resetForm("form");
    },
    /** 修改按钮操作 */
    updateDate(row) {
      this.form = row;
      this.open = true;
      this.title = "订单号编辑";
    },
    submitForm: function() {
      updateOrderNumber(this.form).then(response => {
        if (response.data.code === 200) {
          this.msgSuccess("修改成功");
          this.open = false;
          this.getNumber();
        } else {
          this.msgError(response.data.msg);
        }
      });
    }
  }
};
</script>
<style>
.el-card__header {
  background-color: #42b983;
}
.span_sty {
  font-weight: bold;
}
.divStyle {
  padding-top: 15px;
}
.button {
  padding: 0;
  float: right;
}
</style>
<style scoped>
.form-item {
  margin-bottom: 0px;
}
</style>
