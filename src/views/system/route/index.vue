<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="24" :xs="24">
        <el-form
          :model="queryParams"
          ref="queryForm"
          :inline="true"
          label-width="68px"
          @submit.native.prevent
        >
          <el-form-item label="路由ID" prop="routeId">
            <el-input
              v-model="queryParams.routeId"
              placeholder="请输入路由ID"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          </el-form-item>
        </el-form>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['sys:route:add']"
            >新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDeletes"
              v-hasPermi="['sys:route:del']"
            >删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="info"
              icon="el-icon-refresh"
              size="mini"
              @click="handleRefreshRoute"
              v-hasPermi="['sys:route:refresh']"
            >刷新路由</el-button>
          </el-col>
        </el-row>

        <el-table v-loading="loading" :data="routeList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column
            label="路由ID"
            align="center"
            prop="routeId"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="路由名称"
            align="center"
            prop="routeName"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="URI" align="center" prop="uri" :show-overflow-tooltip="true" />
          <el-table-column label="排序" align="center" prop="sort" :show-overflow-tooltip="true" />
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-value="0"
                inactive-value="1"
                @change="handleStatusChange(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="180"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="updateDate(scope.row)"
                v-hasPermi="['sys:client:edit']"
              >修改</el-button>
              <el-button
                v-if="scope.row.userId !== 1"
                size="mini"
                type="text"
                icon="el-icon-delete"
                :disabled="scope.row.identifier === 'admin'"
                @click="handleDelete(scope.row)"
                v-hasPermi="['sys:client:del']"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />

        <!-- 添加或修改参数配置对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
          <el-form ref="form" :model="form" :rules="rules" label-width="90px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="路由ID" prop="routeId">
                  <el-input v-model="form.routeId" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="路由名称" prop="routeName">
                  <el-input v-model="form.routeName" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="URI" prop="uri">
                  <el-input v-model="form.uri" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="排序" prop="sort">
                  <el-input v-model="form.sort" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="状态">
                  <el-radio-group v-model="form.status">
                    <el-radio :label="0">启用</el-radio>
                    <el-radio :label="1">禁用</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="断言" prop="predicates">
                  <JsonEditor ref="predicatesJsonEditor" v-model="form.tempPredicates" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="过滤器" prop="filters">
                  <json-editor ref="filtersJsonEditor" v-model="form.tempFilters" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  listRoute,
  updateRoute,
  addRoute,
  delRoute,
  delAllRoute,
  refresh
} from "@/api/system/route";
import JsonEditor from "@/components/JsonEditor";
export default {
  name: "Route",
  components: {
    JsonEditor
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      multipleSelection: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 用户表格数据
      routeList: null,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        routeId: "",
        sort: "create_date",
        order: "desc"
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        routeId: [
          { required: true, message: "请输入路由ID", trigger: "change" }
        ],
        routeName: [
          { required: true, message: "请输入路由名称", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 查询路由列表
    getList() {
      this.loading = true;
      listRoute(this.queryParams).then(response => {
        this.routeList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
    },
    // 表单重置
    reset() {
      this.form = {
        id: "",
        routeId: "",
        routeName: "",
        predicates: "",
        filters: "",
        tempPredicates: {},
        tempFilters: {},
        uri: "",
        sort: "",
        status: 0
      };
      this.resetForm("form");
    },
    // 搜索按钮操作
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.multipleSelection = selection;
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 新增按钮操作
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加路由";
    },
    // 删除
    handleDelete(row) {
      this.$confirm(
        '是否确认删除路由ID为"' + row.routeId + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delRoute(row.id);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    },
    // 批量删除
    handleDeletes() {
      const multRows = this.multipleSelection;
      let ids = "";
      for (let i = 0; i < this.multipleSelection.length; i++) {
        ids += this.multipleSelection[i].id + ",";
      }
      this.$confirm(
        '是否确认删除"' + multRows.length + '"条的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delAllRoute({ idString: ids });
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    },
    handleRefreshRoute() {
      this.$confirm("确定要刷新路由吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          refresh()
            .then(() => {
              this.msgSuccess("刷新成功");
            })
            .catch(() => {
              this.msgError("刷新失败");
            });
        })
        .catch(() => {});
    },
    // 路由状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$confirm(
        '确认要"' + text + '""' + row.routeName + '"用户吗?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return updateRoute(row);
        })
        .then(() => {
          this.msgSuccess(text + "成功");
        })
        .catch(function() {
          row.status = row.status === "0" ? "1" : "0";
        });
    },
    // 修改按钮操作
    updateDate(row) {
      this.form = Object.assign({}, row);
      this.form.tempPredicates = JSON.parse(this.form.predicates);
      this.form.tempFilters = JSON.parse(this.form.filters);
      this.form.status = parseInt(this.form.status);
      this.open = true;
      this.title = "修改路由";
    },
    // 提交按钮
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.predicates = this.$refs.predicatesJsonEditor.getValue();
          this.form.filters = this.$refs.filtersJsonEditor.getValue();
          if (this.form.id !== "") {
            updateRoute(this.form).then(response => {
              if (response.data.code === 200) {
                this.open = false;
                this.getList();
                this.msgSuccess("修改成功");
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addRoute(this.form).then(response => {
              if (response.data.code === 200) {
                this.open = false;
                this.getList();
                this.msgSuccess("新增成功");
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    }
  }
};
</script>
