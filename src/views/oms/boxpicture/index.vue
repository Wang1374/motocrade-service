<template>
  <el-dialog
    title="箱货照片"
    width="1000px"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :before-close="cancel"
    v-dialogDrag
    ref="dialog__wrapper"
  >
    <div class="dialog-body">
      <div class="app-container">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="箱门" name="door" style="background-color: #e8e8e8">
            <door-image :doorImgList="doorImgList" @doorImgChange="doorImgChange"></door-image>
          </el-tab-pane>

          <el-tab-pane label="封条" name="seal" style="background-color: #e8e8e8">
            <seal-image :sealImgList="sealImgList" @sealImgChange="sealImgChange"></seal-image>
          </el-tab-pane>
          <el-tab-pane label="设备交接单" name="eir" style="background-color: #e8e8e8">
            <eir-image :eirImgList="eirImgList" @eirImgChange="eirImgChange"></eir-image>
          </el-tab-pane>
          <el-tab-pane label="签收照片" name="signFor" style="background-color: #e8e8e8">
            <signfor-image :signForImgList="signForImgList" @signForImgChange="signForImgChange"></signfor-image>
          </el-tab-pane>
          <el-tab-pane label="回执单" name="receipt" style="background-color: #e8e8e8">
            <receipt-image :receiptImgList="receiptImgList" @receiptImgChange="receiptImgChange"></receipt-image>
          </el-tab-pane>
        </el-tabs>
        <div>
          <el-button
            style="margin-top: 10px"
            type="primary"
            @click="batchDownload"
            :disabled="isBtnTrue"
          >批量打包下载</el-button>
          <el-button style="margin-top: 10px" type="primary" @click="updatePicture">保存修改</el-button>
          <el-progress v-if="isPercentage" :percentage="percentage"></el-progress>
        </div>
      </div>
      <!-- <div class="line" v-dialogDragWidth="$refs.dialog__wrapper"></div> -->
    </div>
  </el-dialog>
</template>
<script>
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import DoorImage from './doorimage/index';
import SealImage from './sealimage/index';
import EirImage from './eirimage/index';
import SignForImage from './signforimage/index';
import ReceiptImage from './receiptimage/index';
import { updateMakingPictureById } from '@/api/oms/makingChest';
import { validatenull } from '@/utils/validate';
import '@/api/basic/drag.js';
export default {
  name: 'BoxPicture',
  components: {
    'door-image': DoorImage,
    'seal-image': SealImage,
    'eir-image': EirImage,
    'signfor-image': SignForImage,
    'receipt-image': ReceiptImage
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    temp: {
      type: Object
    },
    getMcList: {
      type: Function
    }
  },
  watch: {
    temp(newTemp, oldTemp) {
      this.rowInfo = JSON.parse(JSON.stringify(newTemp));
      if (!validatenull(this.rowInfo.doorUrl)) {
        //,号拆分
        var urlList = this.rowInfo.doorUrl.split(',');
        this.doorImgList = urlList;
      }
      if (!validatenull(this.rowInfo.sealUrl)) {
        var urlList = this.rowInfo.sealUrl.split(',');
        this.sealImgList = urlList;
      }
      if (!validatenull(this.rowInfo.doorUrl)) {
        //,号拆分
        var urlList = this.rowInfo.doorUrl.split(',');
        this.doorImgList = urlList;
      }
      if (!validatenull(this.rowInfo.eirUrl)) {
        var urlList = this.rowInfo.eirUrl.split(',');
        this.eirImgList = urlList;
      }
      if (!validatenull(this.rowInfo.signForUrl)) {
        var urlList = this.rowInfo.signForUrl.split(',');
        this.signForImgList = urlList;
      }
      if (!validatenull(this.rowInfo.receiptUrl)) {
        var urlList = this.rowInfo.receiptUrl.split(',');
        this.receiptImgList = urlList;
      }
      if (this.rowInfo.blNoStr != null) {
        this.firstBlNo = this.rowInfo.blNoStr.split(',')[0];
      }
    }
  },
  created() {},
  data() {
    return {
      activeName: 'door',
      index: 0,
      //当前行
      rowInfo: {},
      //箱门
      doorImgList: [],
      //封条
      sealImgList: [],
      //设备交接单
      eirImgList: [],
      //签收照片
      signForImgList: [],
      //回执单
      receiptImgList: [],
      //图片保存form
      form: {},
      ///////////////////
      //第一个提单号
      firstBlNo: '',
      percentage: 0,
      //显示进度条
      isPercentage: false,
      //防止重复点击
      isBtnTrue: false
    };
  },
  methods: {
    // 取消按钮
    cancel() {
      this.$emit('update:visible', false);
    },
    //切换tab标签
    handleClick(tab, event) {
      this.index = tab.index;
    },
    doorImgChange() {
      this.doorImgList = [];
    },
    sealImgChange() {
      this.sealImgList = [];
    },
    eirImgChange() {
      this.eirImgList = [];
    },
    signForImgChange() {
      this.signForImgList = [];
    },
    receiptImgChange() {
      this.receiptImgList = [];
    },
    //保存上传
    updatePicture() {
      //封装数据
      this.form = this.rowInfo;

      //箱门照片
      this.form.doorUrl =
        this.doorImgList.length === 0 ? '' : this.doorImgList[0];
      //设备交接单
      this.form.eirUrl = this.eirImgList.length === 0 ? '' : this.eirImgList[0];
      //签收单照片
      this.form.signForUrl =
        this.signForImgList.length === 0 ? '' : this.signForImgList[0];
      //封条
      this.form.sealUrl =
        this.sealImgList.length === 0 ? '' : this.sealImgList[0];
      this.form.receiptUrl =
        this.receiptImgList.length === 0 ? '' : this.receiptImgList[0];
      updateMakingPictureById(this.form).then((res) => {
        if (res.data.code === 200) {
          this.msgSuccess('保存成功');
          this.$emit('update:visible', false);
          //this.getMcList();
        } else {
          this.msgError(response.data.msg);
        }
      });
    },

    getBase64Image(url) {
      return new Promise(function (resolve, reject) {
        var canvas = document.createElement('canvas'),
          ctx = canvas.getContext('2d'),
          img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function () {
          canvas.height = img.height;
          canvas.width = img.width;
          ctx.drawImage(img, 0, 0);
          var dataURL = canvas.toDataURL('image/png');
          let deleDataHeader = dataURL.split(',')[1];
          resolve(deleDataHeader);
          canvas = null;
        };
        //这个很重要
        img.src = url;
      });
    },
    // 批量下载
    batchDownload() {
      this.isBtnTrue = true;
      this.isPercentage = true;
      // var arrry = this.doorImgList.concat(this.sealImgList).concat(this.eirImgList).concat(this.signForImgList);
      // let filePath = arrry.join()
      // downloadZIP({ filePath: filePath }).then(response => {
      //   let blob = new Blob([response.data], { type: 'application/zip' })
      //   const link = document.createElement('a')
      //   link.href = window.URL.createObjectURL(blob)
      //   // 获取文件名
      //   const disposition = response.headers['content-disposition']
      //   if (disposition !== undefined) {
      //     link.download = decodeURI(disposition.substring(disposition.indexOf('=') + 1, disposition.length - 1))
      //     link.click()
      //     //下载完成进行释放
      //     window.URL.revokeObjectURL(link.href);
      //   }
      // })

      var arrImages = this.doorImgList
        .concat(this.sealImgList)
        .concat(this.eirImgList)
        .concat(this.signForImgList);
      var filename = this.firstBlNo + '.zip';
      let _this = this;
      let zip = new JSZip();
      let cache = {};
      let promises = [];
      for (let url of arrImages) {
        let renameFileName = url.substring(url.lastIndexOf('_') + 1);
        if (url != '') {
          const promise = _this.getImgArrayBuffer(url).then((data) => {
            // 下载文件, 并存成ArrayBuffer对象(blob)

            this.percentage =
              parseInt(100 / arrImages.length) + this.percentage;
            zip.file(renameFileName, data, { binary: true }); // 逐个添加文件
            cache[renameFileName] = data;
          });
          promises.push(promise);
        }
      }
      Promise.all(promises)
        .then(() => {
          zip.generateAsync({ type: 'blob' }).then((content) => {
            //总大小
            // 生成二进制流
            FileSaver.saveAs(content, filename); // 利用file-saver保存文件 自定义文件名
            //此时弹出下载框，进度条
            this.percentage = Number(100);
            this.isBtnTrue = false;
            this.percentage = Number(0);
            this.isPercentage = false;
          });
        })
        .catch((res) => {
          _this.$message.error('文件压缩失败');
        });
    },
    //获取文件blob
    getImgArrayBuffer(url) {
      let _this = this;
      return new Promise((resolve, reject) => {
        //通过请求获取文件blob格式
        let xmlhttp = new XMLHttpRequest();
        xmlhttp.open('GET', url, true);
        xmlhttp.responseType = 'blob';
        xmlhttp.onload = function () {
          if (this.status == 200) {
            resolve(this.response);
          } else {
            reject(this.status);
          }
        };

        xmlhttp.send();
      });
    }
  }
};
</script>
<style scoped>
::v-deep .el-dialog__body {
  padding-top: 0;
}
::v-deep .el-tabs__header {
  margin-bottom: 0px;
}
.app-container {
  padding: 0 0 20px 0;
}
</style>