<template>
  <div style="margin-right: 40px">
    <el-form ref="form" :model="form" :rules="rules">
      <!-- 基础信息 -->
      <el-row>
        <el-col :span="24" class="divider">
          <el-divider direction="vertical" />
          <h4>客户信息</h4>
        </el-col>

        <el-col :span="24">
          <el-row>
            <el-col :span="6">
              <el-form-item label="船名" prop="shipsName" label-width="100px">
                <el-select
                  v-model="form.shipsName"
                  ref="searchSelect"
                  style="width: 100%"
                  filterable
                  remote
                  :remote-method="remoteMethod"
                  @focus="shipsNameFocus"
                  :loading="shipsNameLoading"
                  no-data-text="无匹配数据"
                  placeholder="请输入关键字"
                >
                  <el-option
                    v-for="item in shipsNameOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                  <div v-if="shipsNameOptions.length > 49" class="search-keyword">
                    <span>只显示前50条结果，请完善搜索关键字</span>
                  </div>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="航次" prop="voyage" label-width="100px" class="MytoUpper">
                <el-input v-model.trim="form.voyage" placeholder="请输入航次" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="起运港" prop="portOfLoading" class="MytoUpper" label-width="100px">
                <el-input v-model="form.portOfLoading" placeholder="请输入起运港" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="中转港" prop="portOfDischarge" label-width="100px">
                <el-input v-model="form.portOfDischarge" placeholder="请输入中转港" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="6">
              <el-form-item
                label="目的港"
                prop="placeOfDelivery"
                class="MytoUpper"
                label-width="100px"
              >
                <el-input v-model="form.placeOfDelivery" placeholder="请输入目的港" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="停靠码头" prop="dock" label-width="100px">
                <el-select
                  ref="dock"
                  style="width: 100%"
                  clearable
                  filterable
                  v-model="form.dock"
                  @focus="dockFocus"
                  no-data-text="无匹配数据"
                  placeholder="请选择"
                >
                  <template v-for="item in dockOptions">
                    <el-option
                      v-if="item.type == 0"
                      :key="item.id"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </template>
                  <!-- <el-option
                      v-for="item in dockOptions"
                      v-if="item.type == 0"
                      :key="item.id"
                      :label="item.label"
                      :value="item.value"
                  />-->
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="业务编号" prop="customerNum" label-width="100px">
                <el-input v-model.trim="form.customerNum" placeholder="请输入业务编号" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6" v-for="(item, index) in blNoArray" :key="index">
              <el-form-item :label="'提单号' + (index + 1)" label-width="100px" class="MytoUpper">
                <el-input
                  v-model.trim="blNoArray[index].blNo"
                  @change="
                    (val) => {
                      blNoChange(val, index);
                    }
                  "
                  placeholder="请输入提单号"
                />

                <el-link v-if="blNoArray.length > 1" :underline="false" class="container">
                  <i class="el-icon-error" @click.prevent="removeBlNo(index)" />
                </el-link>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-link
                type="primary"
                :underline="false"
                icon="el-icon-circle-plus"
                style="padding: 8px 0px 8px 10px; loat: left"
                @click="addBlNo"
              >新增</el-link>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24">
          <el-row>
            <el-col :span="24">
              <el-form-item label="下单备注" prop="remark" label-width="100px">
                <el-input
                  v-model="form.remark"
                  type="textarea"
                  placeholder="请输入下单备注"
                  maxlength="500"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>

      <!-- 做箱计划 -->
      <el-row>
        <el-col :span="23" class="divider">
          <el-divider direction="vertical" />
          <h4>做箱计划</h4>
        </el-col>
        <el-col :span="23" :offset="1">
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button
                type="primary"
                icon="el-icon-circle-plus"
                size="mini"
                @click="addRow(null)"
                plain
              >添加做箱计划</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button type="primary" size="mini" plain @click="lclClick">箱货编辑</el-button>
            </el-col>
          </el-row>

          <vxe-table
            border
            keep-source
            show-overflow
            ref="zxdTable"
            align="center"
            highlight-current-row
            :auto-resize="true"
            :data="makingList"
            :edit-rules="validRules"
            :edit-config="{
              trigger: 'click',
              mode: 'row',
              showStatus: true,
              icon: 'fa fa-pencil-square-o',
            }"
          >
            <vxe-table-column type="seq" width="60">
              <template v-slot:header>
                <span>序号</span>
              </template>
            </vxe-table-column>
            <vxe-table-column
              field="boxPile"
              title="箱型"
              width="150"
              :edit-render="{ name: 'ElSelect' }"
            >
              <template v-slot:edit="scope">
                <el-select
                  v-model="scope.row.boxPile"
                  clearable
                  filterable
                  @focus="boxPileFocus"
                  no-data-text="无匹配数据"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in boxQuantityOptions"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </template>
            </vxe-table-column>
            <vxe-table-column
              field="caseNumber"
              title="箱号"
              :edit-render="{ name: 'input' }"
              width="150"
            >
              <template v-slot:edit="{ row }">
                <vxe-input v-model.trim="row.caseNumber" @blur="toUpper(row)"></vxe-input>
              </template>
            </vxe-table-column>
            <!-- <vxe-table-column
              field="caseNumber"
              type="seq"
              title="箱号"
              :edit-render="{ name: 'input' }"
              width="150"
            >
            </vxe-table-column>-->
            <vxe-table-column
              field="blNoStr"
              title="提单号"
              width="180"
              :edit-render="{ name: 'ElSelect' }"
            >
              <template v-slot:edit="{ row }">
                <vxe-input v-model="row.blNoStr" disabled></vxe-input>
              </template>
            </vxe-table-column>
            <vxe-table-column field="planPackingTime" title="预计做箱时间" width="200" :edit-render="{}">
              <template v-slot:edit="{ row }">
                <el-date-picker
                  v-model="row.planPackingTime"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm"
                ></el-date-picker>
              </template>
              <template v-slot="{ row }">{{ formatDate(row.planPackingTime, "yyyy-MM-dd hh:mm") }}</template>
            </vxe-table-column>
            <vxe-table-column
              field="total"
              title="总件数"
              :edit-render="{ name: 'input' }"
              width="150"
            >
              <template v-slot:edit="{ row }">
                <vxe-input v-model="row.total" disabled></vxe-input>
              </template>
            </vxe-table-column>
            <vxe-table-column
              field="grossWeight"
              title="总毛重"
              :edit-render="{ name: 'input' }"
              width="150"
            >
              <template v-slot:edit="{ row }">
                <vxe-input v-model="row.grossWeight" disabled></vxe-input>
              </template>
            </vxe-table-column>
            <vxe-table-column field="cbm" title="总体积" :edit-render="{ name: 'input' }" width="130">
              <template v-slot:edit="{ row }">
                <vxe-input v-model="row.cbm" disabled></vxe-input>
              </template>
            </vxe-table-column>
            <vxe-table-column
              field="door"
              title="门点简称"
              :edit-render="{ name: 'input' }"
              width="150"
            >
              <template v-slot:edit="{ row }">
                <vxe-input v-model="row.door" disabled></vxe-input>
              </template>
            </vxe-table-column>
            <vxe-table-column
              field="address"
              title="门点地址"
              :edit-render="{ name: 'input' }"
              width="120"
            >
              <template v-slot:edit="{ row }">
                <vxe-input v-model="row.address" disabled></vxe-input>
              </template>
            </vxe-table-column>
            <vxe-table-column
              field="bmRemarks"
              title="做箱要求"
              :edit-render="{ name: 'input' }"
              aria-disabled
              width="137"
            >
              <template v-slot:edit="{ row }">
                <vxe-input v-model="row.bmRemarks" disabled></vxe-input>
              </template>
            </vxe-table-column>

            <vxe-table-column title="操作" fixed="right" width="180">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  style="color: #f56c6c"
                  @click="deleteRow(scope.row)"
                >删除</el-button>
              </template>
            </vxe-table-column>
          </vxe-table>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="23" class="divider">
          <el-divider direction="vertical" />
          <h4>附件上传</h4>
        </el-col>
        <el-col :span="23" :offset="1">
          <el-form-item prop="appendixUrl">
            <el-upload
              ref="upload"
              :class="{ hide: appendixHide }"
              :headers="headers"
              action="/api/user/v1/attachment/upload"
              accept=".doc, .docx, .xls, .xlsx, .ppt, .pptx, .pdf, .zip, .rar, .jpg, .png"
              :on-success="handleUploadSuccess"
              :on-remove="handleUploadRemove"
              :on-preview="handlePictureCardPreview"
              :before-upload="handleBeforeUpload"
              :file-list="appendixArray"
              :on-change="appendixChange"
              :limit="imgLimit"
              :on-exceed="exceedLimit"
            >
              <el-button slot="trigger" type="text" icon="el-icon-circle-plus">选取文件</el-button>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row style="margin-top: 10px" class="bt">
        <el-button type="primary" @click="submitOrder" :disabled="btOrderabled">提 交 订 单</el-button>
      </el-row>

      <!-- 图片查看 -->
      <el-image-viewer v-if="showViewer" :on-close="closeViewer" :url-list="[url]" />
      <!-- 箱货编辑 -->
      <lcl-edit
        ref="lclEdit"
        v-if="lclEditVisible"
        :tabsData="tabsData"
        :childBlNoList="childBlNoList"
        :visible.sync="lclEditVisible"
        v-on:typeChanged="typeChanged"
      ></lcl-edit>
    </el-form>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import store from '@/store';
import ElImageViewer from 'element-ui/packages/image/src/image-viewer';
import { isImage } from '@/utils/util';
import { getToken } from '@/utils/auth';
import { getCorporateIdentify } from '@/utils/util';
import { delAttachment } from '@/api/system/attachment';
import { addMakingCenter } from '@/api/distribute/businessCenter';
import LclEdit from '../lclEdit/index';
export default {
  name: 'ExportOrder',
  components: {
    'lcl-edit': LclEdit,
    ElImageViewer
  },
  data() {
    return {
      //加载
      loading: false,
      //表单参数
      form: {
        portOfLoading: 'SHANGHAI'
      },
      //船名
      shipsNameOptions: [],
      shipsNameList: [],
      shipsNameLoading: false,
      //shipsName: "",
      //做箱数据
      makingList: [],
      //添加做箱计划弹框
      isShow: false,
      //获取token
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      appendixArray: [],
      //上传限制
      imgLimit: 1,
      //隐藏添加框
      appendixHide: false,
      //显示图片查看器
      showViewer: false,
      url: '',
      imgUrlArray: [],
      //文件是否上传成功
      appendixIsUpload: false,
      //提单号数组
      blNoArray: [
        {
          blNo: ''
        }
      ],
      //
      blNos: [],
      // 码头
      dockOptions: [],
      //提单号
      blNoIsNull: false,
      rules: {
        voyage: [{ required: true, message: '航次不能为空', trigger: 'blur' }],
        shipsName: [
          { required: true, message: '船名不能为空', trigger: 'blur' }
        ],
        placeOfDelivery: [
          { required: true, message: '目的港不能为空', trigger: 'blur' }
        ]
      },
      //箱型箱量
      boxQuantity: '',
      //提交订单按钮
      btOrderabled: false,

      //2020 01 05
      // 箱型
      boxQuantityOptions: [],
      //提单号
      blNoOptions: [],
      //默认箱号索引
      index: 1,
      // 箱货编辑 弹出层
      lclEditVisible: false,
      // 标签页数据
      tabsData: [],
      childBlNoList: [],
      childCustomerId: '',
      validRules: {
        boxPile: [
          { required: true, message: '箱型必须填写', trigger: 'change' }
        ]
      }
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.userInfo,
      company: (state) => state.constant.company
    })
  },
  methods: {
    // 转大写
    toUpper(row) {
      if (row.caseNumber != null && typeof row.caseNumber != 'number') {
        row.caseNumber = row.caseNumber.toUpperCase();
      }
    },
    //2020  01  05
    // 添加行
    addRow(row) {
      let zxdTable = this.$refs.zxdTable;
      let record = {
        total: 0,
        grossWeight: 0,
        cbm: 0,
        lclList: [],
        caseNumber: this.index++
      };
      zxdTable.insertAt(record, row).then(({ row }) => {
        zxdTable.setActiveRow(row);
      });
    },
    //箱货编辑
    lclClick() {
      let fullData = this.$refs.zxdTable.getTableData().fullData;
      if (fullData.length == 0) {
        this.$message({
          message: '箱货信息不能为空',
          type: 'warning'
        });
      } else {
        let bl = this.makingIsNull(fullData);
        if (bl) {
          this.tabsData = fullData;
          this.childBlNoList = this.blNoArray;
          this.lclEditVisible = true;
        } else {
          this.$message({
            message: '箱号不能为空',
            type: 'warning'
          });
        }
      }
    },
    // 箱货编辑确认回调事件
    typeChanged(data) {
      let fullData = this.$refs.zxdTable.getTableData().fullData;
      for (var i = 0, len = data.length; i < len; i++) {
        if (fullData[i]._XID == data[i]._XID) {
          fullData[i].door = data[i].door;
          fullData[i].address = data[i].address;
          fullData[i].remark = data[i].remark;
          fullData[i].blNoStr = data[i].blNoStr;
          fullData[i].total = Number(data[i].total);
          fullData[i].grossWeight = Number(data[i].grossWeight);
          fullData[i].cbm = Number(data[i].cbm);
          fullData[i].lclList = data[i].lclList;
          fullData[i].bmRemarks = data[i].bmRemarks;
        }
      }
    },
    // 判断箱号是否为空
    makingIsNull(data) {
      let st = true;
      for (var i = 0, len = data.length; i < len; i++) {
        if (data[i].caseNumber == undefined || data[i].caseNumber == '') {
          st = false;
          break;
        }
      }
      return st;
    },
    // 箱型鼠标移入事件
    boxPileFocus(e) {
      if (this.boxQuantityOptions.length == 0) {
        this.boxQuantityOptions = store.getters.box_pile;
      }
    },

    // 提单号鼠标移入事件
    blNoStrFocus(e) {
      //提单号数组
      this.blNoOptions = this.blNoArray.filter((item) => {
        return item.blNo != '';
      });
    },
    // 删除行
    deleteRow(row) {
      this.$XModal.confirm('您确定要删除该数据?').then((type) => {
        if (type === 'confirm') {
          this.$refs.zxdTable.remove(row);
        }
      });
    },

    //-------------------------------------------------------

    // 码头鼠标移入事件
    dockFocus(e) {
      this.dockOptions = store.getters.dock;
    },
    // 返回数组中箱型相同的个数
    getRepeatNum(data) {
      var obj = {};
      for (var i = 0, l = data.length; i < l; i++) {
        var item = data[i].boxPile;
        obj[item] = obj[item] + 1 || 1;
      }
      return obj;
    },
    //新增订单
    async submitOrder() {
      //做箱数据
      this.makingList = this.$refs.zxdTable.getTableData().fullData;
      const errMap = await this.$refs.zxdTable
        .fullValidate()
        .catch((errMap) => errMap);
      if (errMap) {
        let msgList = [];
        Object.values(errMap).forEach((errList) => {
          errList.forEach((params) => {
            let { rowIndex, column, rules } = params;
            rules.forEach((rule) => {
              msgList.push(`${column.title} 校验错误：${rule.message}`);
            });
          });
        });
        this.$XModal.message({
          status: 'error',
          message: () => {
            return [
              <div class="red" style="max-height: 400px;overflow: auto;">
                {msgList.map((msg) => (
                  <div>{msg}</div>
                ))}
              </div>
            ];
          }
        });
      } else {
        //未上传附件
        if (this.form.appendixUrl == undefined) {
          this.$refs['form'].validate((valid) => {
            if (valid) {
              //this.form.shipsName = this.shipsName;
              //需要填写做箱信息
              if (this.blNoArray[this.blNoArray.length - 1].blNo == '') {
                this.$message({
                  type: 'warning',
                  message: '请输入提单号'
                });
              } else if (this.makingList.length == 0) {
                this.$message({
                  type: 'warning',
                  message: '请填写做箱信息'
                });
              } else {
                var flag = false;
                var number;
                for (var i = 0; i < this.makingList.length - 1; i++) {
                  for (var j = i + 1; j < this.makingList.length; j++) {
                    if (
                      this.makingList[i].caseNumber == null &&
                      this.makingList[j].caseNumber == null
                    ) {
                      continue;
                    }
                    if (
                      this.makingList[i].caseNumber.toString() ===
                      this.makingList[j].caseNumber.toString()
                    ) {
                      number = this.makingList[i].caseNumber;
                      flag = true;
                      break;
                    }
                  }
                }
                if (flag) {
                  this.$message({
                    message: '箱号: ' + number + '已经存在',
                    type: 'warning'
                  });
                } else {
                  //封装数据
                  this.composeNotUrl(this.makingList);
                  //禁用
                  this.btOrderabled = true;
                  //添加做箱;
                  addMakingCenter(this.form).then((response) => {
                    if (response.data.code === 200) {
                      this.msgSuccess('新增成功');
                      this.form = {};
                      (this.makingList = []),
                        (this.blNoArray = [
                          {
                            blNo: ''
                          }
                        ]);
                      this.appendixArray = [];
                      this.btOrderabled = false;
                      this.index = 1;
                    } else {
                      this.msgError(response.data.msg);
                      this.btOrderabled = false;
                    }
                  });
                }
              }
            }
          });
        } else {
          //已经上传附件
          //封装数据
          this.composeIsUrl(this.makingList);
          //禁用
          this.btOrderabled = true;
          //添加做箱
          addMakingCenter(this.form).then((response) => {
            if (response.data.code === 200) {
              this.msgSuccess('新增成功');
              this.form = {};
              (this.makingList = []),
                (this.blNoArray = [
                  {
                    blNo: ''
                  }
                ]);
              this.appendixArray = [];
              this.btOrderabled = false;
              this.index = 1;
              this.resetForm('form');
            } else {
              this.msgError(response.data.msg);
              this.btOrderabled = false;
            }
          });
        }
      }
    },

    //未上传附件提交订单封装数据
    composeNotUrl(makingList) {
      //封装基础表单数据
      this.composeBaseData(makingList);
      //3拼接船名航次
      this.form.vesselAndVoyage =
        this.form.shipsName + '/' + this.form.voyage.toUpperCase();
    },
    //已经上传附件提交订单封装数据
    composeIsUrl(makingList) {
      this.composeBaseData(makingList);
      //3拼接船名航次
      if (this.form.shipsName != undefined && this.form.voyage != undefined) {
        this.form.vesselAndVoyage =
          this.form.shipsName + '/' + this.form.voyage.toUpperCase();
      }
    },
    //封装基础表单数据
    composeBaseData(makingList) {
      //1拼接提单号
      var blNos = '';
      this.blNoArray.forEach((item) => {
        blNos = blNos + item.blNo + ',';
      });
      this.form.blNos = blNos.substring(0, blNos.length - 1);
      this.form.orderStatus = 1;
      //2箱型箱量
      //赋值箱型箱量
      var repeat = this.getRepeatNum(makingList);
      var props = '';
      for (var p in repeat) {
        if (typeof repeat[p] == 'function') {
          repeat[p]();
        } else {
          props += p + ' * ' + repeat[p] + ' + ';
        }
      }
      this.form.boxQuantity = props.substring(0, props.length - 2);

      //4 做箱数据
      this.form.makingChestCenterList = makingList;
      (this.form.belongCompaniesId = getCorporateIdentify()),
        //5订单类型
        (this.form.orderType = 1);
      //6 公司名，下单用户，下单手机号
      (this.form.singleUser = this.userInfo.name),
        (this.form.singlePhone = this.userInfo.phone),
        (this.form.companyName = this.company.companyName);
    },

    // 船名下拉框搜索事件
    remoteMethod(query) {
      this.shipsName = query;
      if (query !== '') {
        this.shipsNameLoading = true;
        setTimeout(() => {
          this.shipsNameLoading = false;
          this.shipsNameOptions = this.shipsNameList
            .filter((item) => {
              // 忽略空格
              return (
                item.label
                  .toLowerCase()
                  .replace(/\s*/g, '')
                  .indexOf(query.toLowerCase().replace(/\s*/g, '')) > -1
              );
              // return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
              // return item.label.indexOf(query) > -1
            })
            .slice(0, 50); // 那么用户搜索的时候, 根据完整的列表来搜, 搜到的结果同样截取前50条, 不足50条忽略即可
        });
        // }, 200);
      } else {
        this.shipsNameOptions = this.shipsNameList.slice(0, 50); // 关键字为空的时候又将完整的列表数据截取前50条渲染回去
      }
    },
    // 船名鼠标移入事件
    shipsNameFocus(e) {
      if (this.shipsNameList.length === 0) {
        this.shipsNameList = store.getters.ships_name.map((item) => {
          return { value: `${item}`, label: `${item}` };
        });
      }
    },
    //文件上传限制
    exceedLimit(file, fileList) {
      if (fileList.length >= 1) {
        this.$message({
          type: 'warning',
          message: '只允许上传一个附件'
        });
      }
    },
    //文件状态改变
    appendixChange(file, fileList) {
      this.appendixHide = fileList.length >= this.imgLimit;
    },
    //移除
    handleUploadRemove(file, fileList) {
      this.form.appendixUrl = '';
      this.form.appendixName = '';
      this.appendixHide = false;
      this.appendixIsUpload = false;
    },
    //文件上传之前大小，类型限制
    handleBeforeUpload(file) {
      const isLt10M = file.size / 1024 / 1024 < 20;
      if (!isLt10M) {
        this.$message.error('上传文件大小不能超过 20MB!');
      }
      var FileExt = file.name.replace(/.+\./, '');
      var appendixType =
        [
          'doc',
          'docx',
          'xls',
          'xlsx',
          'ppt',
          'pptx',
          'pdf',
          'zip',
          'rar',
          'png',
          'jpg'
        ].indexOf(FileExt.toLowerCase()) === -1;
      if (appendixType) {
        this.$message({
          type: 'warning',
          message:
            '请上传后缀名为[doc,docx,xls,xlsx,ppt,pptx,pdf,zip,rar]的附件！'
        });
      }
      if (!isLt10M || appendixType) {
        return isLt10M && appendixType;
      }
    },
    //文件上传成功
    handleUploadSuccess(response, file) {
      if (response.status == 200) {
        this.appendixIsUpload = true;
        this.form.appendixUrl = response.data.previewUrl;
        if (this.form.appendixUrl != '') {
          this.form.appendixName = response.data.attachName;
        }
      } else {
        this.$message.error('上传失败，请重新上传！');
      }
    },
    // 关闭图片浏览
    closeViewer() {
      this.showViewer = false;
    },

    // 提单号改变事件
    blNoChange(value, index) {
      let caseBlNo = value.toUpperCase();
      this.blNoArray[index].blNo = caseBlNo;
      var newArr = this.blNoArray.filter(function (obj) {
        return obj.blNo == caseBlNo;
      });
      if (newArr.length > 1) {
        this.$message({
          message: "提单号：'" + caseBlNo + "' 已存在",
          type: 'warning'
        });
        this.blNoArray[index].blNo = '';
        ////
        this.blNoIsNull = true;
      }
    },
    // 删除提单号
    removeBlNo(val) {
      //根据数组下标删除元素
      //返回其它元素，赋值给提单号数组
      var arr = this.blNoArray.filter((item, index) => {
        if (val != index) {
          return item;
        }
      });
      this.blNoArray = arr;
    },
    //新增提单号
    addBlNo() {
      var lastItem = this.blNoArray.slice(-1);
      if (lastItem[0].blNo != '') {
        this.blNoArray.push({
          blNo: ''
        });
      } else {
        if (this.blNoIsNull == false) {
          this.$message({
            message: '请填写完整后，再添加下一行。',
            type: 'warning'
          });
        }
        this.blNoIsNull = false;
      }
    },

    // 预览图片时调用
    handlePictureCardPreview(file) {
      if (file.hasOwnProperty('url')) {
        //判断后缀名
        var index = file.url.lastIndexOf('.');
        var suffix = file.url.substring(index + 1);
        if (suffix == 'jpg' || suffix == 'png') {
          this.url = file.url;
          this.showViewer = true;
        } else {
          var newBlank = window.open('_blank');
          newBlank.location.href = file.url;
        }
      } else {
        //判断后缀名
        var index = file.response.data.previewUrl.lastIndexOf('.');
        var suffix = file.response.data.previewUrl.substring(index + 1);
        if (suffix == 'jpg' || suffix == 'png') {
          this.url = file.response.data.previewUrl;
          this.showViewer = true;
        } else {
          var newBlank = window.open('_blank');
          newBlank.location.href = file.response.data.previewUrl;
        }
      }
    }
  }
};
</script>
<style scoped>
.divider {
  height: 56px;
  padding: 0;
  align-items: center;
  display: flex;
}
.el-divider--vertical {
  border-left: 3px solid #408eff;
}
::v-deep .vxe-input--inner {
  text-transform: uppercase;
}
.fiveEqual {
  width: 20% !important;
}
.container {
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(50%, -50%);
  z-index: 1;
}
::v-deep .el-icon-circle-close {
  color: red;
}

:v-deep .app-container {
  margin-right: 60px;
}
.bt {
  display: flex;
  justify-content: center;
}
::v-deep .MytoUpper .el-input__inner {
  text-transform: uppercase;
}
</style>