<template>
  <div class="receipt">
    <div v-if="showType ==0">
      <el-carousel
        arrow="never"
        indicator-position="none"
        :autoplay="false"
        trigger="click"
        ref="cardReceiptShow"
        style="height: 500px; text-align: center"
      >
        <el-carousel-item v-for="(item, index) in receiptImgList" :key="index" class="imageFlex">
          <el-image
            fit="fit"
            class="receiptPic"
            :src="item"
            :style="'width:'+(myWidth)+'px'"
            :preview-src-list="receiptImgList"
          >
            <div slot="placeholder" class="image-slot" style="margin-top:250px">
              加载中
              <span class="dot" style="text-align:center">
                <i class="el-icon-loading btnloading"></i>
              </span>
            </div>
          </el-image>
        </el-carousel-item>
      </el-carousel>
      <div style="border-top: 1px solid #ccc; height: 36px" class="bottomItem">
        <div class="items">
          <el-tooltip
            class="item"
            effect="dark"
            content="删除 "
            :hide-after="1000"
            placement="top-start"
          >
            <i
              class="el-icon-delete"
              @click="deletePicture()"
              style="color: red; font-size: 20px; font-weight: 1000"
            ></i>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="点击下载"
            :hide-after="1000"
            placement="top-start"
          >
            <i
              class="el-icon-download"
              style="color: blue; font-size: 20px; font-weight: 1000"
              @click="downloadReceiptPicture()"
            ></i>
          </el-tooltip>
        </div>
        <div class="items" v-show="receiptImgList.length > 0">
          <i
            class="el-icon-arrow-left demo"
            @click="receiptPre()"
            v-show="receiptImgList.length > 1"
          ></i>
          <i class="el-icon-plus demo" @click="addReceiptPicture()"></i>
          <i class="el-icon-minus demo" @click="subReceiptPicture()"></i>
          <i class="el-icon-refresh-right demo" @click="revolveReceiptPicture()"></i>
          <i
            class="el-icon-arrow-right demo"
            @click="receiptNext()"
            v-show="receiptImgList.length > 1"
          ></i>
          <span style="font-size: 16px; padding: 7px 5px 13px 10px">
            {{
            this.index + 1
            }}
          </span>
          <span style="font-size: 16px; padding: 7px 5px 13px 10px">/</span>
          <span style="font-size: 16px; padding: 7px 5px 13px 10px">
            {{
            receiptImgList.length
            }}
          </span>
        </div>
      </div>
    </div>
    <div v-if="showType==1">
      <el-carousel
        arrow="never"
        indicator-position="none"
        :autoplay="false"
        trigger="click"
        ref="cardReceiptShow"
        style="height: 500px; text-align: center"
      >
        <el-carousel-item class="imageFlex">
          <el-form ref="form" :model="form">
            <el-form-item>
              <el-upload
                action="/api/user/v1/attachment/upload"
                :class="{ hide: receiptHide }"
                list-type="picture-card"
                :headers="headers"
                :file-list="receiptUrlArray"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :before-upload="beforeAvatarUpload"
                :on-success="handleReceiptSuccess"
                :on-error="imgUploadError"
                :on-change="receiptChange"
              >
                <div style="height: 25px">
                  <i class="el-icon-plus uploadloading" />
                </div>
                <div>上传照片</div>
              </el-upload>
            </el-form-item>
          </el-form>
        </el-carousel-item>
      </el-carousel>
      <div style="border-top: 1px solid #ccc; height: 36px" class="bottomItem">
        <div class="items"></div>
        <div class="items">
          <i class="el-icon-arrow-left demo" v-show="this.receiptUrlArray.length > 1"></i>
          <i class="el-icon-plus demo"></i>
          <i class="el-icon-minus demo"></i>
          <i class="el-icon-refresh-right demo"></i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth';
import { isImage } from '@/utils/util';
import ElImageViewer from 'element-ui/packages/image/src/image-viewer';
import { delAttachment } from '@/api/system/attachment';
export default {
  name: 'ReceiptImage',
  components: {
    ElImageViewer
  },
  props: {
    receiptImgList: {
      type: Array
    }
  },
  watch: {
    receiptImgList(newList, oldList) {
      this.receiptImgList = newList;
      if (this.receiptImgList.length == 0) {
        this.showType = 1;
      } else {
        this.showType = 0;
      }
      // 图片地址
      var img_url = this.receiptImgList[0];
      // 创建对象
      var img = new Image();
      // 改变图片的src
      async function outerFunction() {
        img.src = img_url;
        const geting = () =>
          new Promise((resolve) => {
            img.onload = function () {
              var a = img.width;
              var b = img.height;
              var param = {
                a: img.width,
                b: img.height
              };
              resolve(param);
            };
          });
        let result = await geting();
        return result;
      }
      outerFunction().then((res) => {
        var scalo = res.a / res.b;

        this.myWidth = 500 * scalo;
        if (this.myWidth > 900) {
          this.myWidth = 900;
        }
      });
    }
  },
  created() {
    // if (this.receiptImgList.length == 0) {
    //   this.showType = 1;
    // } else {
    //   this.showType = 0;
    // }
    // // 图片地址
    // var img_url = this.receiptImgList[0];
    // // 创建对象
    // var img = new Image();
    // // 改变图片的src
    // async function outerFunction() {
    //   img.src = img_url;
    //   const geting = () =>
    //     new Promise((resolve) => {
    //       img.onload = function () {
    //         var a = img.width;
    //         var b = img.height;
    //         var param = {
    //           a: img.width,
    //           b: img.height
    //         };
    //         resolve(param);
    //       };
    //     });
    //   let result = await geting();
    //   return result;
    // }
    // outerFunction().then((res) => {
    //   var scalo = res.a / res.b;
    //   this.myWidth = 500 * scalo;
    //   if (this.myWidth > 900) {
    //     this.myWidth = 900;
    //   }
    // });
  },
  data() {
    return {
      //当前值
      index: 0,
      //图片默认角度 宽度  高度
      current: 0,
      widths: 300,
      heights: 500,
      ////////////////
      form: {},
      receiptHide: false,
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      receiptUrlArray: [],
      url: '',
      showViewer: false,
      //箱门url
      receiptUrl: '',
      imgLimit: 1,
      //是否上传成功
      isSuccess: true,
      showType: 1,
      //隐藏添加框
      receiptHide: false,
      myWidth: 0
    };
  },
  methods: {
    // 取消按钮
    cancel() {
      this.$emit('update:visible', false);
    },
    // 箱门隐藏添加框
    receiptChange(file, fileList) {
      this.receiptHide = fileList.length >= this.imgLimit;
    },
    // 签收照片上传成功调用
    handleReceiptSuccess(res, file) {
      this.showType = 0;
      this.receiptImgList[0] = res.data.previewUrl;

      this.myWidth = file.raw.width;
    },
    // 图片上传失败调用
    imgUploadError(err, file, fileList) {
      console.log(err);
      this.$message.error('上传图片失败!');
    },
    // 箱门移除图片
    handleRemove(file, fileList) {
      if (file.response !== undefined) {
        delAttachment(file.response.data.id).then((response) => {
          if (response.data.code == 200) {
            this.receiptHide = fileList.length >= this.imgLimit;
          }
        });
      } else {
        this.receiptHide = fileList.length >= this.imgLimit;
      }
    },
    // 文件上传之前调用做一些拦截限制
    beforeAvatarUpload(file) {
      var reader = new FileReader();
      reader.onload = function (event) {
        var txt = event.target.result;
        var img = document.createElement('img');
        img.src = txt;
        img.onload = function () {
          var percent = img.width / img.height;
          var widthLendth = 500 * percent;
          if (widthLendth > 950) {
            widthLendth = 950;
          }
          file.width = widthLendth;
        };
      };

      reader.readAsDataURL(file);
      const isJPG = isImage(file.name);
      if (!isJPG) {
        this.$message.error('只允许上传图片');
      }
      const isLt10M = file.size / 1024 / 1024 < 20;
      if (!isLt10M) {
        this.$message.error('上传图片大小不能超过 20MB!');
      }
      return isJPG && isLt10M;
    },
    // 预览图片时调用
    handlePictureCardPreview(file) {
      this.url = file.url;
      this.showViewer = true;
    },
    // 关闭图片浏览
    closeViewer() {
      this.showViewer = false;
    },

    //移除图片
    deletePicture() {
      this.showType = 1;
      this.receiptHide = false;
      var arr = [];
      this.$emit('receiptImgChange', arr);
    },
    ///////////////////////////////////////////////////
    // 取消按钮
    cancel() {
      this.$emit('update:visible', false);
    },

    //切换tab标签
    handleClick(tab, event) {
      this.$refs.cardReceiptShow.activeIndex = 0;
      var image =
        document.getElementsByClassName('receiptPic')[
          this.$refs.cardReceiptShow.activeIndex
        ];
      image.style.height = this.heights + 'px';
      image.style.width = this.widths + 'px';
      image.style.transform = 'rotate(' + 0 + 'deg)';
    },
    //箱门上一张
    receiptPre() {
      //如果不是第一张
      if (this.$refs.cardReceiptShow.activeIndex > 0) {
        //箱门照片
        var image =
          document.getElementsByClassName('receiptPic')[
            this.$refs.cardReceiptShow.activeIndex
          ];
        image.style.height = this.heights + 'px';
        image.style.width = this.widths + 'px';
        image.style.transform = 'rotate(' + 0 + 'deg)';
        this.$refs.cardReceiptShow.prev();
      }
      this.index = this.$refs.cardReceiptShow.activeIndex;
    },
    //箱门下一张
    receiptNext() {
      //如果不是最后一张
      if (
        this.$refs.cardReceiptShow.activeIndex <
        this.receiptImgList.length - 1
      ) {
        var image =
          document.getElementsByClassName('receiptPic')[
            this.$refs.cardReceiptShow.activeIndex
          ];
        image.style.height = this.heights + 'px';
        image.style.width = this.widths + 'px';
        image.style.transform = 'rotate(' + 0 + 'deg)';
        this.$refs.cardReceiptShow.next();
      }
      this.index = this.$refs.cardReceiptShow.activeIndex;
    },
    //箱门图片放大
    addReceiptPicture() {
      var image =
        document.getElementsByClassName('receiptPic')[
          this.$refs.cardReceiptShow.activeIndex
        ];
      image.style.height = image.scrollHeight * 1.1 + 'px';
      image.style.width = image.scrollWidth * 1.1 + 'px';
    },
    //箱门图片缩小
    subReceiptPicture() {
      var image =
        document.getElementsByClassName('receiptPic')[
          this.$refs.cardReceiptShow.activeIndex
        ];
      image.style.height = image.scrollHeight / 1.1 + 'px';
      image.style.width = image.scrollWidth / 1.1 + 'px';
    },
    //箱门旋转
    revolveReceiptPicture() {
      var image =
        document.getElementsByClassName('receiptPic')[
          this.$refs.cardReceiptShow.activeIndex
        ];
      this.current = (this.current + 90) % 360;
      image.style.transform = 'rotate(' + this.current + 'deg)';
    },
    //下载图片
    downloadReceiptPicture() {
      var index = this.$refs.cardReceiptShow.activeIndex;
      var url = this.receiptImgList[index];

      let image = new Image();
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
      image.onload = () => {
        let canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        let ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, image.width, image.height);
        canvas.toBlob((blob) => {
          let url = URL.createObjectURL(blob);
          this.download(url, '箱门' + (index + 1));
          // 用完释放URL对象
          URL.revokeObjectURL(url);
        });
      };
    },
    download(url, name) {
      let eleLink = document.createElement('a');
      eleLink.download = name;
      eleLink.href = url;
      eleLink.click();
      eleLink.remove();
    }
  }
};
</script>
<style scoped>
.bottomItem {
  display: flex;
  justify-content: space-between;
  align-content: center;
}
.receiptPic {
  position: absolute;
  height: 500px;
  text-align: center;
  padding: 10px;
}
::v-deep .el-carousel__container {
  height: 500px;
}
i {
  border-right: 1px solid #ccc;
  cursor: pointer;
  font-size: 16px;
  padding: 10px;
}
.uploadloading {
  border-right: 0px solid #ccc;
  cursor: pointer;
  font-size: 16px;
  padding: 10px;
}
.btnloading {
  border-right: 0px solid #ccc;
  color: blue;
  font-size: 50px;
  padding: 10px;
}
.demo:hover {
  background-color: #999999;
}
.imageFlex {
  display: flex;
  align-items: center;
  justify-content: center;
}
.hide .el-upload--picture-card {
  display: none;
}
</style>