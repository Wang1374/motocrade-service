<template>
  <div class="app-container">
    <el-row>
      <el-form :inline="true" :model="queryParams" class="demo-form-inline" @submit.native.prevent>
        <el-form-item prop="vehicle">
          <el-select
            ref="vehicle"
            clearable
            size="small"
            allow-create
            style="width: 100%"
            v-model="queryParams.vehicle"
            no-data-text="无匹配数据"
            placeholder="公司司机"
            filterable
            @change="vehicleNameQuery"
          >
            <el-option
              v-for="item in driverOptions"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <el-calendar v-model="timer">
      <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
      <template slot="dateCell" slot-scope="{ date, data }">
        <div @click.stop="calendarOnClick(date, data)" style="height: 72px; padding: 5px">
          <p
            :class="data.isSelected ? 'is-selected' : ''"
            style="margin: 0 !important"
          >{{ data.day.split("-").slice(1).join("-") }}</p>
          <div v-for="(item, index) in calendarData" :key="index">
            <div v-if="item.months.indexOf(data.day.split('-').slice(1)[0]) != -1">
              <div
                v-if="
                  item.days.indexOf(data.day.split('-').slice(2).join('-')) !=
                  -1
                "
              >
                <div
                  class="is-selected2"
                >{{ item.content==1?'请假':(item.content==2?'出车':(item.content==3?'上班未出车':(item.content=='请假'?'请假':'')))}}</div>
              </div>
              <div v-else></div>
            </div>
            <div v-else></div>
          </div>
        </div>
      </template>
    </el-calendar>
    <!-- 输入框 -->
    <el-dialog
      title="备注"
      :visible.sync="chosediag"
      width="30%"
      :modal="false"
      center
      :close-on-click-modal="false"
    >
      <el-form :inline="true" :model="attendanceForm" class="demo-form-inline"></el-form>

      <el-row>
        <el-col :span="12" :offset="6">
          <el-select v-model="info" style="align:center">
            <el-option label="请假" value="1"></el-option>
            <el-option label="出车" value="2"></el-option>
            <el-option label="上班未出车" value="3"></el-option>
          </el-select>
        </el-col>
      </el-row>

      <!-- <el-input ref="clickPosition" type="text" placeholder="输入信息" v-model="info"></el-input> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="chosediag = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import store from '@/store';
import { getCorporateIdentify } from '@/utils/util';
import { addAttendance, getDataByDriverId } from '@/api/basic/attendance.js';
import { validatenull } from '@/utils/validate';
export default {
  name: 'Calendartest',
  data() {
    return {
      choseday: '',
      calendarData: [],
      timer: '',
      chosediag: false,
      info: '',
      //车辆数组
      vehicleOptions: [],
      queryParams: {},
      // 司机信息
      driverOptions: [],
      //司机id
      driverId: '',
      form: {},
      checked: false,
      //弹框表单
      attendanceForm: {}
    };
  },
  created() {
    this.vehicleOptions = store.getters.vehicle.filter((item) => {
      return item.vehicleBelongState == 1;
    });
    this.driverOptions = store.getters.driver.filter((res) => {
      return res.driverBelongState == '1' && res.inState == '1';
    });
  },
  mounted() {
    this.$nextTick(() => {
      // 点击前一个月
      let prevBtn = document.querySelector(
        '.el-calendar__button-group .el-button-group>button:nth-child(1)'
      );
      prevBtn.addEventListener('click', (e) => {
        let d = new Date(this.timeValue);
        let resDate = d.getFullYear() + '-' + this.handleTime(d.getMonth() + 1); //2020-08
      });
      //点击下一个月
      let nextBtn = document.querySelector(
        '.el-calendar__button-group .el-button-group>button:nth-child(3)'
      );
      nextBtn.addEventListener('click', (e) => {
        let d = new Date(this.timeValue);
        let resDate = d.getFullYear() + '-' + this.handleTime(d.getMonth() + 1); //2020-10
      });
      //点击今天
      let todayBtn = document.querySelector(
        '.el-calendar__button-group .el-button-group>button:nth-child(2)'
      );
      todayBtn.addEventListener('click', (e) => {
        let d = new Date(this.timeValue);
        let resDate = d.getFullYear() + '-' + this.handleTime(d.getMonth() + 1); //2020-09
      });
    });
  },
  methods: {
    vehicleNameQuery(e) {
      this.driverOptions.filter((res) => {
        if (res.id == e) {
          this.attendanceForm.vehicle = res.value;
        }
      });
      // 司机id
      this.driverId = e;
      // 根据司机id查询数据
      var param = {
        driverId: this.driverId,
        belongCompaniesId: getCorporateIdentify()
      };
      getDataByDriverId(param).then((res) => {
        this.calendarData = res.data;
      });
    },
    //处理时间
    handleTime(s) {
      return s < 10 ? '0' + s : s;
    },
    //点击天数
    changeTime(date, data) {},
    calendarOnClick(idx, idx1) {
      if (validatenull(this.driverId)) {
        this.$message({
          message: '请先选择司机',
          type: 'warning'
        });
      } else {
        this.choseday = idx1.day;
        var obj = this.calendarData.filter((item) => {
          if (
            item.years + '-' + item.months + '-' + item.days ==
            this.choseday
          ) {
            return item;
          }
        });
        if (!validatenull(obj)) {
          this.info = obj[0].content;
        } else {
          this.info = '';
        }
        this.chosediag = true;
        // this.$nextTick(() => {
        //   this.$refs.clickPosition.focus();
        // });
      }
    },
    //确定
    submit() {
      this.calendarData.forEach((item, index) => {
        if (item.years + '-' + item.months + '-' + item.days == this.choseday) {
          this.calendarData.splice(index, 1);
        }
      });

      this.calendarData.push({
        years: this.choseday.split('-')[0],
        months: this.choseday.split('-')[1],
        days: this.choseday.split('-')[2],
        content: this.info
      });
      this.chosediag = false;

      this.calendarData.forEach((res) => {
        res.driverId = this.driverId;
        res.belongCompaniesId = getCorporateIdentify();
      });

      //筛选当前
      var obj = {};
      this.calendarData.forEach((item) => {
        if (item.years + '-' + item.months + '-' + item.days == this.choseday) {
          obj = item;
        }
      });
      addAttendance(obj).then((res) => {
        this.msgSuccess('修改成功');
      });
    }
  }
};
</script>
<style>
.is-selected {
  color: blue;
}
.div-Calendar {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.calendar-day {
  text-align: center;
  color: #202535;
  line-height: 30px;
  font-size: 12px;
}

.is-selected2 {
  color: red;
  font-size: 14px;
  margin-top: 5px;
}

#calendar
  .el-button-group
  > .el-button:not(:first-child):not(:last-child):after {
  content: '当月';
}
.el-calendar-day {
  padding: 0 !important;
}
</style>