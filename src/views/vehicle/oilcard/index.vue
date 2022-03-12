<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="系统加油记录" name="first">
        <oil-xttab></oil-xttab>
      </el-tab-pane>
      <el-tab-pane label="找油网加油记录" name="second">
        <oil-zytab></oil-zytab>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import Oilzyward from '../oilzytab/index';
import Oilxtward from '../oilxtward/index';

export default {
  name: 'Oilcard',
  components: {
    'oil-zytab': Oilzyward,
    'oil-xttab': Oilxtward
  },
  data() {
    return {
      activeName: 'first'
    };
  },
  methods: {
    handleClick(tab, event) {}
  }
};
</script>