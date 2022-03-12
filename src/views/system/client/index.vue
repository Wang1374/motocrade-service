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
          <el-form-item label="客户端ID" prop="clientId">
            <el-input
              v-model="queryParams.clientId"
              placeholder="请输入客户端ID"
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
              v-hasPermi="['sys:client:add']"
            >新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDeletes"
              v-hasPermi="['sys:client:del']"
            >删除</el-button>
          </el-col>
        </el-row>

        <el-table v-loading="loading" :data="clientList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column
            label="客户端ID"
            align="center"
            prop="clientId"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="密钥明文"
            align="center"
            prop="clientSecretPlainText"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="token有效期/秒"
            align="center"
            prop="accessTokenValidity"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="refresh_token有效期/秒"
            align="center"
            prop="refreshTokenValidity"
            :show-overflow-tooltip="true"
          />
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
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="客户端ID" prop="clientId">
              <el-input v-model="form.clientId" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="密钥明文" prop="clientSecretPlainText">
              <el-input v-model="form.clientSecretPlainText" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="密钥密文" prop="clientSecret">
              <el-input v-model="form.clientSecret" :readonly="true" placeholder="密钥密文，自动生成" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="授权范围" prop="scope">
              <el-checkbox-group v-model="form.scope">
                <el-checkbox label="read"></el-checkbox>
                <el-checkbox label="write"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="授权类型" prop="authorizedGrantTypes">
              <el-checkbox-group v-model="form.authorizedGrantTypes">
                <el-checkbox label="password"></el-checkbox>
                <el-checkbox label="authorization_code"></el-checkbox>
                <el-checkbox label="refresh_token"></el-checkbox>
                <el-checkbox label="implicit"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="token有效期" prop="accessTokenValidity">
              <el-input v-model="form.accessTokenValidity" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="refresh_token有效期" prop="refreshTokenValidity">
              <el-input v-model="form.refreshTokenValidity" />
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
import {
  listClient,
  updateClient,
  addClient,
  delClient,
  delAllClient
} from "@/api/system/client";
export default {
  name: "Client",
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
      clientList: null,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        clientId: "",
        sort: "create_date",
        order: "desc"
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        clientId: [
          { required: true, message: "请输入客户端ID", trigger: "change" }
        ],
        clientSecretPlainText: [
          { required: true, message: "请输入客户端密钥", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 查询用户列表
    getList() {
      this.loading = true;
      listClient(this.queryParams).then(response => {
        this.clientList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      // this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: "",
        clientId: "",
        resourceIds: "",
        clientSecretPlainText: "",
        clientSecret: "",
        scope: "",
        authorizedGrantTypes: "",
        webServerRedirectUri: "",
        authorities: "",
        accessTokenValidity: "",
        refreshTokenValidity: "",
        additionalInformation: "",
        autoapprove: ""
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
      this.title = "添加用户";
    },
    // 修改按钮操作
    updateDate(row) {
      this.form = Object.assign({}, row);
      if (this.form.scope) {
        this.form.scope = this.form.scope.split(",");
      }
      if (this.form.authorizedGrantTypes) {
        this.form.authorizedGrantTypes = this.form.authorizedGrantTypes.split(
          ","
        );
      }
      this.open = true;
      this.title = "修改客户端";
    },
    // 提交按钮
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id !== "") {
            const tempData = Object.assign({}, this.form);
            if (tempData.scope) {
              tempData.scope = tempData.scope.join(",");
            }
            if (tempData.authorizedGrantTypes) {
              tempData.authorizedGrantTypes = tempData.authorizedGrantTypes.join(
                ","
              );
            }
            updateClient(tempData).then(response => {
              if (response.data.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addClient(this.form).then(response => {
              if (response.data.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm(
        '是否确认删除客户端ID为"' + row.clientId + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delClient(row.id);
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
          return delAllClient({ idString: ids });
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    }
  }
};
</script>