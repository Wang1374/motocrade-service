<template>
  <el-dialog
    title="装箱单信息"
    width="1200px"
    ref="zxdDlg"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :before-close="cancel"
    id="unitContent"
  >
    <div id="printPackingList" ref="imageDom">
      <el-row style="font-size: 12px; ">
        <el-col :span="6">
          <el-row style="height: 740.2px; border: 1px solid #09F;">
            <el-row style="height: 53px; padding-top: 3px;color: #09F;">
              <el-col>&nbsp;Reefer Temperature Required. 冷藏温度</el-col>
              <el-col>
                <el-row style="padding-top: 10px;">
                  <el-col :offset="15" :span="1">℃.</el-col>
                  <el-col :offset="4" :span="1">℉.</el-col>
                </el-row>
              </el-col>
            </el-row>
            <el-row>
              <div class="hori-line"></div>
            </el-row>
            <el-row style="height: 55px;color: #09F;">
              <el-row>
                <el-col :span="3">
                  &nbsp;Class
                  <br />&nbsp;等级
                </el-col>
                <el-col :span="1">
                  <div class="vertical-line"></div>
                </el-col>
                <el-col :span="6">
                  &nbsp;IMDG Page
                  <br />&nbsp;危规页码
                </el-col>
                <el-col :span="1">
                  <div class="vertical-line"></div>
                </el-col>
                <el-col :span="6">
                  &nbsp;UN No
                  <br />&nbsp;联合国编号
                </el-col>
                <el-col :span="1">
                  <div class="vertical-line"></div>
                </el-col>
                <el-col :span="6">
                  &nbsp;Flashpoint
                  <br />&nbsp;闪点
                </el-col>
              </el-row>
            </el-row>
            <el-row>
              <div class="hori-line"></div>
            </el-row>
            <el-row style="height: 65px; padding-top: 3px;">
              <el-col>
                <span style="color: #09F;">&nbsp;Ship's Name/Voy No. 船名/航次</span>
                <br />
                <br />
                <div class="fontSize">{{ packingList.vesselAndVoyage }}</div>
              </el-col>
            </el-row>
            <el-row>
              <div class="hori-line"></div>
            </el-row>
            <el-row style="height: 65px; padding-top: 3px;">
              <el-col>
                <span style="color: #09F;">&nbsp;Container No. 箱号</span>
                <span style="color: #09F;">&nbsp; 船公司 :</span>
                <span class="fontSize">{{ packingList.shippingCompany }}</span>
                <br />
                <br />
                <div class="fontSize">{{ packingList.caseNumber }}</div>
              </el-col>
            </el-row>
            <el-row>
              <div class="hori-line"></div>
            </el-row>
            <el-row style="height: 65px; padding-top: 3px;">
              <el-col>
                <span style="color: #09F;">&nbsp;Seal No. 封号</span>
                <br />
                <br />
                <div class="fontSize">{{ packingList.sealNumber }}</div>
              </el-col>
            </el-row>
            <el-row>
              <div class="hori-line"></div>
            </el-row>
            <el-row style="height: 90px;color: #09F;">
              <el-row>
                <el-col :span="8">
                  <span>&nbsp;Cont.Size 箱型</span>
                  <br />
                  <span>&nbsp;20' 40' 45'</span>
                </el-col>
                <el-col :span="1">
                  <div class="vertical-line-cont"></div>
                </el-col>
                <el-col :span="15">
                  &nbsp;Cont.Type. 箱类
                  <br />&nbsp;GP=普通箱 TK=油罐箱
                  <br />&nbsp;RF=冷藏箱 PF=平板箱
                  <br />&nbsp;OT=开顶箱 HC=高箱
                  <br />&nbsp;FR=框架箱 HT=挂衣箱
                </el-col>
              </el-row>
            </el-row>
            <el-row>
              <div class="hori-line"></div>
            </el-row>
            <el-row style="height: 70px; padding-top: 3px;">
              <el-col>
                <span style="color: #09F;">&nbsp;ISO Code For Container Size/Type.</span>
                <br />
                <span style="color: #09F;">&nbsp;箱型/箱类ISO标准代码</span>
                <br />
                <div class="fontSize">{{ packingList.boxPile }}</div>
              </el-col>
            </el-row>
            <el-row>
              <div class="hori-line"></div>
            </el-row>
            <el-row style="height: 125px; padding-top: 3px;">
              <el-row>
                <el-col>
                  <span style="color: #09F;">&nbsp;Packer's Name/Address</span>
                  <br />
                  <span style="color: #09F;">&nbsp;装箱人名称/地址</span>
                </el-col>
                <el-col>
                  <div
                    class="fontSize"
                    v-if="packingList.lclList.length > 0"
                  >{{ packingList.lclList[0].door }}</div>
                  <!-- {{doorRemark}} -->
                </el-col>
                <el-col>
                  <div
                    class="fontSize"
                    style="display: block ruby;"
                    v-if="packingList.lclList.length > 0"
                  >{{ packingList.lclList[0].address }}</div>
                </el-col>
              </el-row>
              <el-row style="padding-top: 10px;">
                <el-col>
                  <span style="color: #09F;">&nbsp;TEL NO.</span>
                  <br />
                  <span style="color: #09F;">&nbsp;电话号码&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  <span
                    class="fontSize"
                    v-if="packingList.lclList.length > 0"
                  >{{ packingList.lclList[0].contacts }}&nbsp;&nbsp;&nbsp;&nbsp;{{ packingList.lclList[0].contactNumber }}</span>
                </el-col>
              </el-row>
            </el-row>
            <el-row>
              <div class="hori-line"></div>
            </el-row>
            <el-row style="height: 70px; padding-top: 3px;">
              <el-col>
                <span style="color: #09F;">&nbsp;Packing Date. 装箱日期</span>
                <br />
                <br />
                <div
                  style="text-align: center;font-weight: 900;"
                >{{ formatDate(packingList.packingTime, 'yyyy-MM-dd hh:mm') }}</div>
              </el-col>
            </el-row>
            <el-row>
              <div class="hori-line"></div>
            </el-row>
            <el-row style="height: 70px; padding-top: 3px;color: #09F;">
              <el-col>&nbsp;Packed BY. 装箱人签名</el-col>
            </el-row>
          </el-row>
        </el-col>
        <el-col :span="18">
          <el-row style="height: 740px;">
            <el-row style="height: 110px;; padding-top: 3px;color: #09F;">
              <el-col :span="12" style="font-size: 23px;">
                &nbsp;&nbsp;C&thinsp;O&thinsp;N&thinsp;T&thinsp;A&thinsp;I&thinsp;N&thinsp;E&thinsp;R&emsp;L&thinsp;O&thinsp;A&thinsp;D&emsp;P&thinsp;L&thinsp;A&thinsp;N
                <br />
                <br />
                <div
                  style="text-align: center;font-weight: 900;"
                >装&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;箱&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;单</div>
              </el-col>
              <el-col :span="1">
                <el-tooltip class="item" effect="dark" content="银行卡信息" placement="top-start">
                  <el-button
                    type="text"
                    @click="bankVisible"
                    :class=" visibleShow==true?'el-icon-minus':'el-icon-plus'"
                  ></el-button>
                </el-tooltip>
              </el-col>
              <el-col
                v-show="businessState==2 && visibleShow==true"
                :span="11"
                style="text-align: center;"
              >
                <span style="font-size:18px;color:red">结算银行卡信息</span>
                <el-input
                  class="te"
                  style="text-align: center;font-weight: 900;border: 1px solid #09F;font-size:16px"
                  type="textarea"
                  :rows="2"
                  v-model="company.bankCard"
                  placeholder="结算银行卡信息"
                ></el-input>
              </el-col>
            </el-row>
            <!-- Packer's Copy -->
            <div
              style="position: absolute; border-left: 1px solid #09F; margin-left: 20.715%; z-index: 1;width: 1px; height: 75.2%;"
            ></div>
            <div
              style="position: absolute; border-left: 1px solid #09F; margin-left: 33.2%; z-index: 1;width: 1px; height: 85.1%;"
            ></div>
            <div
              style="position: absolute; border-left: 1px solid #09F; margin-left: 45.7%; z-index: 1;width: 1px; height: 85.1%;"
            ></div>

            <el-row style="height: 630.2px; border: 1px solid #09F; border-left: 0;">
              <el-row style="height: 65px;">
                <el-col :span="5" style="height: 100%;">
                  <div style="padding-top: 3px;">
                    <span style="color: #09F;">&nbsp;Port of Loading</span>
                    <br />
                    <span style="color: #09F;">&nbsp;装港</span>
                    <br />
                    <div class="fontSize">{{ packingList.portOfLoading }}</div>
                  </div>
                </el-col>
                <el-col :span="3" style="height: 100%;">
                  <div style="padding-top: 3px;">
                    <span style="color: #09F;">&nbsp;Port of Discharge</span>
                    <br />
                    <span style="color: #09F;">&nbsp;卸港</span>
                    <br />
                    <div class="fontSize">{{ packingList.portOfDischarge }}</div>
                  </div>
                </el-col>
                <el-col :span="3" style="height: 100%;">
                  <div style="padding-top: 3px;">
                    <span style="color: #09F;">&nbsp;Place of Delivery</span>
                    <br />
                    <span style="color: #09F;">&nbsp;交货地</span>
                    <br />
                    <div class="fontSize">{{ packingList.placeOfDelivery }}</div>
                  </div>
                </el-col>
                <el-col :span="13" style="padding-top: 8px;color: #09F;">
                  <span>
                    &nbsp;SHIPPER'S/PACKER'S DECLARATIONS:We hereby declare that the container
                    <br />&nbsp;has been thoroughly cleaned without any evidence of cargoes of previous
                    <br />&nbsp;shipment prior vanning and cargoes has been properly stuffed and secured.
                  </span>
                </el-col>
              </el-row>
              <el-row>
                <div class="hori-line"></div>
              </el-row>

              <div
                style="position: absolute; border-left: 1px solid #09F; margin-left: 58.25%; z-index: 1;width: 1px; height: 89.5%;"
              ></div>
              <div
                style="position: absolute; border-left: 1px solid #09F; margin-left: 83.25%; z-index: 1;width: 1px; height: 66.5%;"
              ></div>

              <el-row style="height: 45px;text-align: center;">
                <el-col :span="5" style="height: 100%;">
                  <div style="padding-top: 3px;">
                    <div>
                      <span style="color: #09F;">Bill of Lading No.</span>
                      <br />
                      <span style="color: #09F;">提单号</span>
                    </div>
                  </div>
                </el-col>
                <el-col :span="3" style="height: 100%;">
                  <div style="padding-top: 3px;">
                    <div>
                      <span style="color: #09F;">Packages Packing</span>
                      <br />
                      <span style="color: #09F;">件数与包装</span>
                    </div>
                  </div>
                </el-col>
                <el-col :span="3" style="height: 100%;">
                  <div style="padding-top: 3px;">
                    <div>
                      <span style="color: #09F;">Gross Weight</span>
                      <br />
                      <span style="color: #09F;">毛&nbsp;&nbsp;&nbsp;&nbsp;重</span>
                    </div>
                  </div>
                </el-col>
                <el-col :span="3" style="height: 100%;">
                  <div style="padding-top: 3px;">
                    <div>
                      <span style="color: #09F;">Measurements</span>
                      <br />
                      <span style="color: #09F;">尺&nbsp;&nbsp;&nbsp;&nbsp;码</span>
                    </div>
                  </div>
                </el-col>
                <el-col :span="6" style="height: 100%;">
                  <div style="padding-top: 3px;">
                    <div>
                      <span style="color: #09F;">Description of Goods</span>
                      <br />
                      <span style="color: #09F;">货&nbsp;&nbsp;&nbsp;&nbsp;名</span>
                    </div>
                  </div>
                </el-col>
                <el-col :span="4" style="height: 100%;">
                  <div style="padding-top: 3px;">
                    <div>
                      <span style="color: #09F;">Marks&amp;Numbers</span>
                      <br />
                      <span style="color: #09F;">唛&nbsp;&nbsp;&nbsp;&nbsp;头</span>
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-row>
                <div class="hori-line"></div>
              </el-row>

              <el-row style="height: 373px;position: relative;">
                <el-col :span="14">
                  <el-row v-for="(item1, index1) in packingList.lclList" :key="index1">
                    <el-row v-for="(item, index) in item1.hairBodyList" :key="index">
                      <el-col :span="9" style="height: 100%;">
                        <br />
                        <div class="fontSize">{{ item.blNo }}</div>
                      </el-col>
                      <el-col :span="5" style="height: 100%;">
                        <br />
                        <div class="fontSize">{{ item.total }}</div>
                      </el-col>
                      <el-col :span="5" style="height: 100%;">
                        <br />
                        <div class="fontSize">{{ item.grossWeight }}</div>
                      </el-col>
                      <el-col :span="5" style="height: 100%;">
                        <br />
                        <div class="fontSize">{{ item.cbm }}</div>
                      </el-col>

                      <!-- <el-col :span="10" style="height: 100%;">
                        <br />
                        <div>{{ item.productName}}</div>
                      </el-col>-->
                      <!-- <el-col :span="4" style="height: 100%;">
                        <br />
                        <div>{{ }}</div>
                      </el-col>-->
                    </el-row>
                  </el-row>
                </el-col>
                <el-col :span="10">
                  <el-row v-for="(item1, index1) in packingList.lclList" :key="index1">
                    <el-row v-for="(item, index) in item1.hairBodyList" :key="index">
                      <el-col :span="5" style="height: 100%;">
                        <br />
                        <div class="fontSize">{{ item.productName }}</div>
                      </el-col>

                      <!-- <el-row style="margin-top: 50px;">
                        <el-col>
                          <span
                            style="white-space:pre-wrap;font-weight: 900;"
                          >{{ item.productName }}</span>
                        </el-col>
                      </el-row>-->
                    </el-row>
                  </el-row>
                  <el-row>
                    <el-col style="height:50px;padding-top: 10px;">
                      <br />
                      <br />
                      <span style="white-space:pre-wrap;font-weight: 1000;">做箱备注：</span>
                      <br />
                      <span
                        style="white-space:pre-wrap;font-weight: 900;"
                      >{{ packingList.bmRemarks }}</span>
                    </el-col>
                  </el-row>

                  <el-row style="padding-top:70px">
                    <el-col style="height:50px;padding-top: 10px;">
                      <br />
                      <br />
                      <span style="white-space:pre-wrap;font-weight: 1000;">门点备注:</span>
                      <br />
                      <span style="white-space:pre-wrap;font-weight: 900;">{{ doorRemark }}</span>
                    </el-col>
                  </el-row>
                </el-col>

                <el-row class="fontSize" style="width: 100%;position: absolute;bottom: 0;">
                  <el-col :span="6">{{ packingList.dock }}</el-col>
                  <el-col :span="9">{{ packingList.openingDate }}</el-col>
                  <el-col :span="9">{{ packingList.cutOffDate }}</el-col>
                </el-row>
              </el-row>

              <el-row>
                <div class="hori-line"></div>
              </el-row>

              <el-row style="height: 144px;">
                <el-col :span="14" style="height: 100%;">
                  <el-row style="height: 70px; padding-top: 3px; text-align: center;">
                    <el-col style="width: 35.715%;">
                      <span style="color: #09F;">Received By Drayman</span>
                      <br />
                      <span style="color: #09F;">驾驶员签收及车号</span>
                      <div class="fontSize" style="font-size: 10px;">
                        {{ packingList.driver }}&nbsp;&nbsp;{{ packingList.phone }}
                        <br />
                        {{ packingList.vehicle }}
                      </div>
                    </el-col>
                    <el-col style="width: 21.429%; height: 100%;">
                      <div>
                        <span style="color: #09F;">Total Packages</span>
                        <br />
                        <span style="color: #09F;">总件数</span>
                      </div>
                      <div class="fontSize">{{ packingList.total }}</div>
                    </el-col>
                    <el-col style="width: 21.429%;height: 100%;">
                      <div>
                        <span style="color: #09F;">Total Cargo Wt</span>
                        <br />
                        <span style="color: #09F;">总货重</span>
                      </div>
                      <div class="fontSize">{{ packingList.grossWeight }}</div>
                    </el-col>
                    <el-col style="width: 21.429%;height: 100%;">
                      <div>
                        <span style="color: #09F;">Total Meas</span>
                        <br />
                        <span style="color: #09F;">总尺码</span>
                      </div>
                      <div class="fontSize">{{ packingList.cbm }}</div>
                    </el-col>
                  </el-row>
                  <el-row>
                    <div class="hori-line"></div>
                  </el-row>
                  <el-row style="height: 70px; padding-top: 3px; text-align: center;">
                    <el-col style="width: 57.143%;">
                      <span style="color: #09F;">&nbsp;Received By Terminals/Date Of Receipt</span>
                      <br />
                      <span style="color: #09F;">&nbsp;码头收箱签收和收箱日期</span>
                      <div style="text-align: center;font-weight: 900;"></div>
                    </el-col>
                    <el-col style="width: 21.429%;height: 100%;">
                      <span style="color: #09F;">&nbsp;Cont.Tare Wt</span>
                      <br />
                      <span style="color: #09F;">&nbsp;集装箱皮重</span>
                      <div class="fontSize">{{ packingList.tareWeight }}</div>
                    </el-col>
                    <el-col style="width: 21.429%;height: 100%;">
                      <span style="color: #09F;">Cgo/Cont&nbsp;Total&nbsp;Wt</span>
                      <br />
                      <span style="color: #09F;">货/箱总重量</span>
                      <div class="fontSize">{{ packingList.contTotalWt }}</div>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="10" style="height: 100%;">
                  <div style="padding-top: 3px;">
                    <span style="color: #09F;">&nbsp;Remarks:备注</span>
                    <div>
                      <span
                        v-if="!isMarks"
                        @click="remarkClick"
                        style="white-space:pre;font-weight: 900;"
                      >{{ remarks }}</span>
                      <el-input
                        v-else
                        ref="remark"
                        type="textarea"
                        :rows="4"
                        resize="none"
                        placeholder="请输入备注"
                        @blur="showType"
                        v-model="remarks"
                      ></el-input>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </el-row>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">关 闭</el-button>
      <el-button type="primary" v-print="'#printPackingList'">打 印</el-button>
      <el-button type="primary" @click="toImage()">导出图片</el-button>
      <el-button type="info" @click="savePdf()">导出PDF</el-button>
    </div>
  </el-dialog>
</template>

<script>
import htmlToPdf from '@/components/utils/htmlToPdf';
import html2Canvas from 'html2canvas';
import { mapState } from 'vuex';
export default {
  name: 'PackingList',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    packingList: {
      type: Object,
      default: null
    },
    businessState: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      remarks: '',
      isMarks: false,
      imgUrl: '',
      doorRemark: '',
      accountNumber: '',
      visibleShow: true
    };
  },
  computed: {
    ...mapState({
      company: (state) => state.constant.company
    })
  },
  created() {
    if (this.packingList.lclList.length > 0) {
      this.doorRemark = this.packingList.lclList[0].remark;
    }
    if (this.packingList.lclList.length > 1) {
      this.remarks = '注意有多个门点，请仔细核对。' + '\n';
      for (var i = 1, len = this.packingList.lclList.length; i < len; i++) {
        this.remarks =
          this.remarks +
          '门点：' +
          this.packingList.lclList[i].door +
          '\t' +
          this.packingList.lclList[i].address +
          '。' +
          '\n';
        if (this.packingList.lclList[i].contacts !== null) {
          this.remarks =
            this.remarks +
            '电话：' +
            this.packingList.lclList[i].contacts +
            '\t' +
            this.packingList.lclList[i].contactNumber +
            '。' +
            '\n';
          this.doorRemark =
            this.doorRemark + this.packingList.lclList[i].remark + '\n';
        }
      }
    }
  },
  methods: {
    bankVisible() {
      this.visibleShow = !this.visibleShow;
    },
    // 取消按钮
    cancel() {
      this.$emit('update:visible', false);
    },
    // 生成PDF
    savePdf() {
      // 导出之前先将滚动条置顶,不然会出现数据不全的现象
      this.getPdf(
        this.packingList.lclList[0].hairBodyList[0].blNo +
          '-' +
          this.packingList.caseNumber
      );
    },
    //点击生成图片
    toImage() {
      // 设置外部滚动条置顶
      window.pageYOffset = 0;
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      // 设置dialog距离头部155
      document.getElementById('unitContent').scrollTop = 155;
      const loading = this.$loading({
        lock: true,
        text: '导出中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      // 生成图片
      html2Canvas(this.$refs.imageDom, {
        background: '#fff'
      }).then((canvas) => {
        //获取图片base64地址,如果想要展示图片即可直接展示
        // let dataURL = canvas.toDataURL("image/png");
        // this.imgUrl = dataURL;
        //创建一个a标签，直接下载生成的图片
        let link = document.createElement('a');
        link.href = canvas.toDataURL();
        link.setAttribute(
          'download',
          this.packingList.lclList[0].hairBodyList[0].blNo +
            '-' +
            this.packingList.caseNumber +
            '.png'
        );
        link.style.display = 'none';
        loading.close();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    },
    // 备注点击事件
    remarkClick() {
      this.isMarks = true;
      this.$nextTick(() => {
        this.$refs.remark.focus();
      });
    },
    showType() {
      this.isMarks = false;
    }
  }
};
</script>
<style scoped>
.fontSize {
  text-align: center;
  font-weight: 900;
  font-family: 'Microsoft YaHei', 微软雅黑, 'MicrosoftJhengHei', 华文细黑,
    STHeiti, MingLiu;
}
@page {
  margin: 20px;
  size: landscape;
}
@media print {
  .noprint {
    display: none;
  }
}
</style>
<style lang="less">
#printPackingList {
  /*水平横线*/
  .hori-line {
    height: 1px;
    border-top: solid #09f 1px;
  }
  /*垂直竖线*/
  .vertical-line-cont {
    height: 90px;
    border-right: solid #09f 1px;
  }
  .vertical-line {
    height: 55px;
    border-right: solid #09f 1px;
  }
}
.el-textarea__inner {
  color: red !important;
}
</style>
