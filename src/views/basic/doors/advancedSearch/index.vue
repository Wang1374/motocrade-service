<template>
  <div>
    <el-form ref="searchForm" :model="searchForm" status-icon label-width="80px">
      <el-row style="padding: 15px 10px 0px 0px;">
        <el-col :span="24">
          <el-form-item label="联系人" prop="contacts" class="MytoUpper">
            <el-input v-model.trim="searchForm.contacts" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="联系电话" prop="contactNumber">
            <el-input v-model.trim="searchForm.contactNumber" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
        <!-- <el-form-item label="地址" prop="contacts">
        <el-input
          v-model.trim="searchForm.engineNumber"
          placeholder="请输入"
        ></el-input>
        </el-form-item>-->
        <el-col :span="24">
          <el-form-item label="地址" prop="address">
            <v-distpicker
              @selected="onSelected"
              @province="onChangeProvince"
              @city="onChangeCity"
              @area="onChangeArea"
            ></v-distpicker>
            <el-input style="padding-top: 5px" v-model="searchForm.address" placeholder="详细地址" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div style="padding: 20px; text-align: center">
      <el-button @click="reset">重置</el-button>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="search">查询</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AdvancedSearch',
  props: {},
  created() {},
  data() {
    return {
      searchForm: {}
    };
  },
  methods: {
    onChangeProvince(res) {
      this.searchForm.province = res.value;
    },
    onChangeCity(res) {
      this.searchForm.city = res.value;
    },
    onChangeArea(res) {
      this.searchForm.area = res.value;
    },
    onSelected(data) {
      this.searchForm.province = data.province.value;
      this.searchForm.city = data.city.value;
      this.searchForm.area = data.area.value;
    },
    // 取消
    cancel() {
      this.searchForm = {
        contacts: undefined,
        contactNumber: undefined,
        province: undefined,
        city: undefined,
        area: undefined,
        address: undefined
      };
      this.$emit('update:searchVisible', false);
    },
    //重置
    reset() {
      this.searchForm = {
        contacts: undefined,
        contactNumber: undefined,
        province: undefined,
        city: undefined,
        area: undefined,
        address: undefined
      };
    },
    // 查询
    search() {
      this.$emit('search-success', this.searchForm);
      this.$emit('update:searchVisible', false);
    }
  }
};
</script>
<style >
.MytoUpper .el-input__inner {
  text-transform: uppercase;
}
</style>
