<template>
  <div class="app-container">
    <div v-if="ctype == 1 || ctype == 0">
      <!-- 车队门点管理 -->
      <motorcade-doors></motorcade-doors>
    </div>
    <div v-if="ctype == 2">
      <!-- 客户端门点管理 -->
      <client-doors></client-doors>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import MotorcadeDoors from './motorcadedoors/index';
import ClientDoors from './clientdoors/index';
export default {
  name: 'Doors',
  components: {
    'motorcade-doors': MotorcadeDoors,
    'client-doors': ClientDoors
  },
  data() {
    return {
      //公司类型
      ctype: 0
    };
  },
  computed: {
    ...mapState({
      company: (state) => state.constant.company
    })
  },
  created() {
    this.ctype = this.company.accountType;
  },
  methods: {}
};
</script>