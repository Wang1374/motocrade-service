<template>
  <div>
    <el-form ref="form" :model="shipsForm" label-width="80px">
      <el-form-item label="船名" prop="shipsName" class="MytoUpper">
        <el-input v-model="shipsForm.shipsName" placeholder="请输入船名" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import store from '@/store';
import { addShipName } from '@/api/oms/commonality';
import { removeSessionStorage } from '@/utils/sessionStorage';
export default {
  name: 'shipsName',
  data() {
    return {
      shipsForm: {}
    };
  },
  methods: {
    //提交请求
    submit() {
      this.shipsForm.shipsName = this.shipsForm.shipsName.toUpperCase();
      addShipName(this.shipsForm).then((response) => {
        if (response.data.data === 1) {
          this.msgSuccess('保存成功');
          //删除缓存并重新拉取缓存
          // 删除缓存，重新拉取并存入缓存
          removeSessionStorage({ name: 'ships_name' });
          let obj = {
            state: 5
          };
          store.dispatch('GetConstant', obj).then(() => {});

          this.shipsForm = {};
        } else if (response.data.data === 0) {
          this.$message({
            message: '船名已存在',
            type: 'warning'
          });
        }
      });
    }
  }
};
</script>
<style scoped>
::v-deep .MytoUpper .el-input__inner {
  text-transform: uppercase;
}
</style>