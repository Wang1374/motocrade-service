<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24" :xs="24">
        <el-col :span="24" :xs="24" style="padding-bottom: 20px">
          <el-col :span="2.5" :xs="24">
            <!-- :offset="1"  -->
            <img v-bind:src="options.img" class="img-circle" style="width: 100px; height: 100px" />
          </el-col>
          <el-col :span="8" :xs="24">
            <el-row>
              <p>{{ userInfo.identifier }}</p>
            </el-row>
            <!-- <el-row>
              <p>账户使用：3/5</p>
            </el-row>-->
          </el-col>
        </el-col>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="addStaff">添加员工</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="addStaffRole">添加角色</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" icon="el-icon-edit" size="mini" @click="updateStaffRole">编辑角色</el-button>
          </el-col>
        </el-row>

        <el-table v-loading="loading" :data="authorityList" height="400px">
          <el-table-column label="公司员工" align="center" prop="name" :show-overflow-tooltip="true" />
          <el-table-column
            label="登录账户"
            align="center"
            prop="identifier"
            :show-overflow-tooltip="true"
            width="120"
          />
          <el-table-column
            label="邮箱"
            align="center"
            prop="email"
            width="180"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="角色"
            align="center"
            prop="staffRoleList"
            width="140"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span
                v-for="(item, index) in scope.row.staffRoleList"
                :key="index"
              >{{ item.roleName + " " }}</span>
            </template>
          </el-table-column>
          <el-table-column label="性别" align="center" prop="sex" :formatter="formatter" />
          <el-table-column label="创建时间" align="center" prop="createDate" width="160">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createDate) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="250"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="updateDate(scope.row)"
              >修改</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-truck"
                @click="allocation(scope.row)"
                v-if="company.accountType != 2"
              >分配车辆</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-key"
                @click="handleResetPwd(scope.row)"
              >重置</el-button>
              <el-button
                v-if="scope.row.userId !== 1"
                size="mini"
                type="text"
                icon="el-icon-delete"
                :disabled="scope.row.identifier === 'admin'"
                @click="handleDelete(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="600px"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="登录账户" prop="identifier">
              <el-input
                v-model="form.identifier"
                placeholder="登录账户"
                :disabled="form.id !== undefined"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户昵称" prop="name">
              <el-input v-model="form.name" placeholder="请输入用户名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出生年月" prop="born">
              <el-date-picker
                v-model="form.born"
                type="date"
                style="width: 200px"
                placeholder="请选择出生年月"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户性别">
              <el-select v-model="form.sex" placeholder="请选择">
                <el-option
                  v-for="item in sexOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色" prop="staffRole">
              <el-select
                v-model="form.staffRole"
                multiple
                placeholder="请选择"
                @change="$forceUpdate()"
              >
                <el-option
                  v-for="item in roleOptions"
                  :key="item.id"
                  :label="item.roleName"
                  :value="item.id"
                  :disabled="item.status == 1"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="openMenu"
      width="500px"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form ref="menuform" :model="menuform" :rules="menuRules" label-width="80px">
        <el-form-item label="选择角色" v-if="menuform.id !== undefined">
          <el-select v-model="menuform.id" placeholder="请选择" @change="selectChanged">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="menuform.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="权限范围">
          <el-select v-model="menuform.dataScope">
            <el-option
              v-for="item in dataScopeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-tree
            :data="menuOptions"
            show-checkbox
            ref="menu"
            node-key="id"
            empty-text="加载中，请稍后"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitMenuForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog
      title="分配车辆"
      :visible.sync="openAllocation"
      width="400px"
      :close-on-click-modal="false"
      append-to-body
    >
      <el-form ref="allocationForm" :model="allocationForm" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="车牌号" class="MytoUpper" prop="vehicles">
              <el-select
                ref="vehicle"
                filterable
                multiple
                allow-create
                @change="changeSelect"
                style="width: 100%"
                v-model="allocationForm.vehicles"
                no-data-text="无匹配数据"
                placeholder="请选择"
              >
                <el-checkbox v-model="checked" @change="selectAll">全选</el-checkbox>
                <el-option
                  v-for="item in vehicleOptions"
                  :key="item.id"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAllocationForm">确 定</el-button>
        <el-button @click="cancelVehicles">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listStaff } from '@/api/basic/authority';
import { resetUserPwd } from '@/api/system/user';
import {
  allRoles,
  treeselect as menuTreeselect,
  addRole,
  getStaffRole,
  roleMenuTreeselect,
  updateRole
} from '@/api/basic/roleOrMenu';
import { addUser, updateUser, delUser } from '@/api/system/user';
import store from '@/store';
import { mapState } from 'vuex';
import { validatenull } from '@/utils/ruoyi';
export default {
  name: 'Setting',
  data() {
    return {
      options: {
        img: store.getters.avatar //裁剪图片的地址
      },
      // 遮罩层
      loading: false,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 用户表格数据
      authorityList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      openMenu: false,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 数据范围选项
      dataScopeOptions: [
        {
          value: '1',
          label: '全部数据权限'
        },
        {
          value: '2',
          label: '仅本人数据权限'
        }
      ],
      // 菜单列表
      menuOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        corporateIdentify: '',
        sort: 'create_date',
        order: 'desc'
      },
      // 表单参数
      form: {},
      // 角色权限表单
      menuform: {
        id: undefined,
        roleName: undefined,
        roleCode: undefined,
        dataScope: '1',
        corporateIdentify: undefined,
        menuIds: []
      },
      // 性别状态
      sexOptions: [
        {
          value: 0,
          label: '男'
        },
        {
          value: 1,
          label: '女'
        }
      ],
      // 角色选项
      roleOptions: [],
      // 全部角色
      roleList: [],
      // 表单校验
      rules: {
        identifier: [
          { required: true, message: '用户账户不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '用户昵称不能为空', trigger: 'blur' }
        ],
        staffRole: [
          { required: true, message: '角色不能为空', trigger: 'blur' }
        ]
      },
      // 表单校验
      menuRules: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      },
      openAllocation: false,
      allocationForm: {
        vehicles: ''
      },
      //车辆数组
      vehicleOptions: [],
      checked: false,
      selectedArray: []
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
      company: (state) => state.constant.company
    })
  },
  created() {
    this.getList();
    this.vehicleOptions = store.getters.vehicle.filter((item) => {
      return item.vehicleBelongState == 1;
    });
  },

  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      this.queryParams.corporateIdentify = this.userInfo.corporateIdentify;
      listStaff(this.queryParams).then((response) => {
        this.authorityList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    formatter: function (row, column) {
      return row.sex == 0 ? '男' : row.sex == 1 ? '女' : '未知';
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.openMenu = false;
      this.$nextTick(() => {
        if (this.$refs['form'] !== undefined) {
          this.resetForm('form');
        }
        if (this.$refs['menuform'] !== undefined) {
          this.resetForm('menuform');
        }
      });
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        identifier: undefined,
        name: undefined,
        phone: undefined,
        email: undefined,
        sex: undefined,
        status: 0,
        corporateIdentify: undefined,
        employeeId: undefined,
        staffRole: []
      };
      // this.resetForm("form");
      this.$nextTick(() => {
        this.resetForm('form');
      });
    },
    // 表单重置
    menuReset() {
      this.menuform = {
        id: undefined,
        roleName: undefined,
        roleCode: undefined,
        dataScope: '1',
        corporateIdentify: undefined,
        menuIds: []
      };
      this.$nextTick(() => {
        this.resetForm('menuform');
        this.$refs.menu.setCheckedKeys([]);
      });
    },
    /** 新增按钮操作 */
    addStaff() {
      this.reset();
      allRoles({ corporateIdentify: this.userInfo.corporateIdentify }).then(
        (response) => {
          this.roleOptions = response.data.data;
        }
      );
      this.open = true;
      this.title = '添加员工';
    },
    // 新增角色
    addStaffRole() {
      this.menuReset();
      this.getMenuTreeselect();
      this.openMenu = true;
      this.title = '添加角色';
    },
    /** 查询查出当前 企业角色的菜单树结构 */
    getMenuTreeselect() {
      menuTreeselect(this.userInfo.roles[0]).then((response) => {
        this.menuOptions = response.data.menus;
        this.removeZero(this.menuOptions);
      });
    },
    // 递归删除 ‘权限设置’
    removeZero(showlist) {
      if (typeof showlist == 'object') {
        for (let i = 0; i < showlist.length; i++) {
          let element = showlist[i];
          if (element.id === '717396764101054464') {
            showlist.splice(i, 1);
            // 注意删除了一项后，索引-1
            i--;
          } else {
            // 遍历其子节点
            this.removeZero(element.children);
          }
        }
      } else {
        // 子节点不存在则结束
        return;
      }
    },
    // 编辑角色
    updateStaffRole() {
      // 根据企业标识id，查出所有员工角色
      getStaffRole(this.userInfo.corporateIdentify).then((response) => {
        this.roleList = response.data;
        this.menuform.id = response.data[0].id;
        this.selectChanged(response.data[0].id);
      });
      this.openMenu = true;
      this.title = '修改角色';
    },
    selectChanged(value) {
      var obj = this.roleList.find(function (obj) {
        return obj.id === value;
      });
      this.menuform.roleName = obj.roleName;
      this.menuform.roleCode = obj.roleCode;
      this.menuform.dataScope = obj.dataScope;
      this.menuform.corporateIdentify = obj.corporateIdentify;
      this.$nextTick(() => {
        this.getRoleMenuTreeselect(value);
      });
    },
    /** 根据员工角色ID查询菜单树结构 */
    getRoleMenuTreeselect(id) {
      roleMenuTreeselect({ roleCode: this.userInfo.roles[0], roleId: id }).then(
        (response) => {
          this.menuOptions = response.data.menus;
          this.removeZero(this.menuOptions);
          this.$refs.menu.setCheckedKeys(response.data.checkedKeys);
        }
      );
    },
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      let checkedKeys = this.$refs.menu.getHalfCheckedKeys();
      // 半选中的菜单节点
      let halfCheckedKeys = this.$refs.menu.getCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    },
    /** 修改按钮操作 */
    updateDate(row) {
      allRoles({ corporateIdentify: this.userInfo.corporateIdentify }).then(
        (response) => {
          this.roleOptions = response.data.data;
        }
      );
      this.form = row;
      const arr = [];
      row.staffRoleList.forEach(function (item) {
        arr.push(item.id);
      });
      this.form.staffRole = arr;
      this.open = true;
      this.title = '修改员工';
    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      this.$prompt('请输入"' + row.identifier + '"的新密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(({ value }) => {
          row.credential = value;
          resetUserPwd(row).then((response) => {
            if (response.data.code === 200) {
              this.msgSuccess('修改成功，新密码是：' + value);
            } else {
              this.msgError(response.data.msg);
            }
          });
        })
        .catch(() => {});
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            updateUser(this.form).then((response) => {
              if (response.data.code === 200) {
                this.msgSuccess('修改成功');
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.data.msg);
              }
            });
          } else {
            this.form.corporateIdentify = '';
            this.form.employeeId = this.userInfo.corporateIdentify;
            addUser(this.form).then((response) => {
              if (response.data.code === 200) {
                this.msgSuccess('新增成功');
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.data.msg);
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm(
        '是否确认删除员工登陆账号为"' + row.identifier + '"的数据项?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(function () {
          return delUser(row.id);
        })
        .then(() => {
          this.getList();
          this.msgSuccess('删除成功');
        })
        .catch(function () {});
    },
    submitMenuForm() {
      this.$refs['menuform'].validate((valid) => {
        if (valid) {
          if (this.menuform.id != undefined) {
            this.menuform.menuIds = this.getMenuAllCheckedKeys();
            updateRole(this.menuform).then((response) => {
              if (response.data.data === false) {
                this.msgError(response.data.msg);
              } else {
                if (response.data.code === 200) {
                  this.msgSuccess('修改成功');
                  this.openMenu = false;
                } else {
                  this.msgError(response.data.msg);
                }
              }
            });
          } else {
            this.menuform.menuIds = this.getMenuAllCheckedKeys();
            this.menuform.corporateIdentify = this.userInfo.corporateIdentify;
            addRole(this.menuform).then((response) => {
              if (response.data.data === false) {
                this.msgError(response.data.msg);
              } else {
                if (response.data.code === 200) {
                  this.msgSuccess('新增成功');
                  this.openMenu = false;
                } else {
                  this.msgError(response.data.msg);
                }
              }
            });
          }
        }
      });
    },
    changeSelect(val) {
      if (val.length === this.vehicleOptions.length) {
        this.checked = true;
      } else {
        this.checked = false;
      }
    },
    selectAll() {
      this.selectedArray = [];
      if (this.checked) {
        this.vehicleOptions.map((item) => {
          this.selectedArray.push(item.value);
        });
        this.allocationForm.vehicles = this.selectedArray;
      } else {
        this.selectedArray = [];
        this.allocationForm.vehicles = this.selectedArray;
      }
    },
    // 分配车辆
    allocation(row) {
      if (!validatenull(row.vehicles)) {
        if (row.vehicles.split(',').length == this.vehicleOptions.length) {
          this.checked = true;
        }
      }
      this.allocationForm = row;
      const arr = [];
      row.staffRoleList.forEach(function (item) {
        arr.push(item.id);
      });
      this.allocationForm.staffRole = arr;
      if (this.allocationForm.vehicles) {
        this.allocationForm.vehicles = this.allocationForm.vehicles.split(',');
      }
      this.openAllocation = true;
    },
    // 提交
    submitAllocationForm() {
      if (this.allocationForm.vehicles) {
        this.allocationForm.vehicles = this.allocationForm.vehicles.join(',');
      }
      updateUser(this.allocationForm).then((response) => {
        if (response.data.code === 200) {
          this.msgSuccess('修改成功');
          this.openAllocation = false;
          this.getList();
        } else {
          this.msgError(response.data.msg);
        }
      });
    },
    // 取消
    cancelVehicles() {
      if (this.allocationForm.vehicles) {
        this.allocationForm.vehicles = this.allocationForm.vehicles.join(',');
      }
      this.openAllocation = false;
    }
  }
};
</script>
<style scoped>
.el-checkbox {
  text-align: right;
  width: 100%;
  padding-right: 10px;
}
</style>