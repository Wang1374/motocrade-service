<template>
  <el-dialog
    title="表头排序"
    style="text-align:center"
    :visible.sync="isShow"
    width="830px"
    :close-on-click-modal="false"
    :before-close="handleDialogClose"
  >
    <div class="row1">
      <div class="flex-square" v-for="item in tableHead" :key="item.id">
        <div class="flex-demo">{{item.sortNum}}</div>
        <div class="flex-demo">{{item.filedName}}</div>
        <div class="flex-demo">{{item.isCheck}}</div>
      </div>
    </div>
    <draggable class="list-group" :list="tableHeaderList" group="people" v-bind="{animation:500}">
      <transition-group tag="div" name="list-complete" :class="{'row':isRow,'row2':isRow2,'row3':isRow3}">
        <el-tooltip
          class="flex-square"
          v-for="(item,index) in tableHeaderList"
          :key="item.id"
          effect="light"
          content="拖动排序"
          placement="bottom"
          :open-delay="1000"
        >
          <div class="demo">
            <div class="flex-demo1">{{index}}</div>
            <div class="flex-demo1">{{item.rowName}}</div>
            <div class="flex-demo1">
              <el-checkbox v-model="item.show1" @change="changeChecked(item.show1)"></el-checkbox>
              <!-- -->
            </div>
          </div>
        </el-tooltip>
      </transition-group>
    </draggable>
    <el-row style="text-align:center;margin-top:30px;padding-bottom:11px">
      <el-button @click="cancle">取消</el-button>
      <el-button type="primary" @click="updateTableHeader">确定</el-button>
    </el-row>
  </el-dialog>
</template>
<script>
// 导入组件
import draggable from 'vuedraggable';
import { saveTableHeader, insertTableHeader } from '@/api/oms/tableHeader';
import { validatenull } from '@/utils/ruoyi';

export default {
  name: 'Operation',
  display: 'Two Lists',
  order: 1,
  components: {
    draggable
  },
  props: {
    isShow: {
      type: Boolean
    },
    sort: {
      type: Boolean
    },
    isRow2: {
      type: Boolean
    },
    isRow3: {
      type: Boolean
    },
    isRow: {
      type: Boolean
    },
    headerList: {
      type: Array
    },
    userId: {
      type: String
    },
    getTableHeaderLoading: {
      type: Function
    },
    getTableHeader: {
      type: Function
    }
  },
  created() {
    this.tableHeaderList = JSON.parse(JSON.stringify(this.headerList));
  },
  mounted() {
    document.body.ondrop = function (event) {
      event.preventDefault();
      event.stopPropagation();
    };
  },
  data() {
    return {
      tableHeaderList: [],
      tableHead: [
        { sortNum: '排序', filedName: '字段名', isCheck: '显示', id: 1 },
        { sortNum: '排序', filedName: '字段名', isCheck: '显示', id: 2 },
        { sortNum: '排序', filedName: '字段名', isCheck: '显示', id: 3 }
      ],
      checked1: true
    };
  },
  methods: {
    handleDialogClose() {
      this.$emit('update:isShow', false);
    },
    updateTableHeader() {
      //判断数组中有没有userId这个字段
      if (!validatenull(this.tableHeaderList[0].userId)) {
        //执行修改
        saveTableHeader(this.tableHeaderList).then((response) => {
          if (response.data.code === 200) {
            this.$emit('update:isShow', false);
            this.$emit('getTableHeaderLoading');
            //this.$parent.$parent.$parent.getTableHeaderLoading();
            this.msgSuccess('修改成功');
          } else {
            this.$message({
              message: '失败',
              type: 'warning'
            });
          }
        });
      } else {
        for (var i = 0; i < this.tableHeaderList.length; i++) {
          this.tableHeaderList[i].userId = this.userId;
        }
        //执行新增
        insertTableHeader(this.tableHeaderList).then((response) => {
          if (response.data.code === 200) {
            this.$emit('update:isShow', false);
            this.$emit('getTableHeader');
            this.msgSuccess('修改成功');
          }
        });
      }
    },
    changeChecked(evt) {},
    cancle() {
      this.$emit('update:isShow', false);
    }
  }
};
</script>
<style scoped>
.isCheck >>> .el-checkbox__inner {
  background-color: #cccccc;
}
.row1 {
  display: grid;
  grid-template-columns: 250px 250px 250px;
  grid-column-gap: 30px;
  justify-content: space-around;
  grid-auto-flow: column;
}
.flex-square {
  display: flex;
  justify-content: space-between;
  height: 36px;
  cursor: grabbing;
}
.flex-demo {
  display: flex;
  color: white;
  background-color: #6e769d;
  justify-content: center;
  align-items: center;
  border: 1px solid #93acc4;
}
.flex-demo1 {
  display: flex;
  color: black;
  justify-content: center;
  align-items: center;
  border: 1px solid #93acc4;
}
.flex-demo:nth-of-type(1) {
  flex: 1;
}
.flex-demo:nth-of-type(2) {
  flex: 3;
}
.flex-demo:nth-of-type(3) {
  flex: 1;
}

.flex-demo1:nth-of-type(1) {
  flex: 1;
}
.flex-demo1:nth-of-type(2) {
  flex: 3;
}
.flex-demo1:nth-of-type(3) {
  flex: 1;
}
.row {
  display: grid;
  grid-template-columns: 250px 250px 250px;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-column-gap: 30px;
  justify-content: space-around;
  grid-auto-flow: column;
  text-align: center;
}
.row2 {
  display: grid;
  grid-template-columns: 250px 250px 250px;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-column-gap: 30px;
  justify-content: space-around;
  grid-auto-flow: column;
  text-align: center;
}
.row3 {
  display: grid;
  grid-template-columns: 250px 250px 250px;
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-column-gap: 30px;
  justify-content: space-around;
  grid-auto-flow: column;
  text-align: center;
}
.demo:hover {
  background-color: #e6f4f5;
}
</style>