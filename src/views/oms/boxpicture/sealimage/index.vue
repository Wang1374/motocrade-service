<template>
  <div class="seal">
    <div v-if="showType ==0">
      <el-carousel
        arrow="never"
        indicator-position="none"
        :autoplay="false"
        trigger="click"
        ref="cardSealShow"
        style="height: 500px; text-align: center"
      >
        <el-carousel-item v-for="(item, index) in sealImgList" :key="index" class="imageFlex">
          <el-image
            fit="fit"
            class="sealpic"
            :src="item"
            :style="'width:'+(myWidth)+'px'"
            :preview-src-list="sealImgList"
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
              @click="downloadSealPicture()"
            ></i>
          </el-tooltip>
        </div>
        <div class="items" v-show="sealImgList.length > 0">
          <i class="el-icon-arrow-left demo" @click="sealPre()" v-show="sealImgList.length > 1"></i>
          <i class="el-icon-plus demo" @click="addSealPicture()"></i>
          <i class="el-icon-minus demo" @click="subSealPicture()"></i>
          <i class="el-icon-refresh-right demo" @click="revolveSealPicture()"></i>
          <i class="el-icon-arrow-right demo" @click="sealNext()" v-show="sealImgList.length > 1"></i>
          <span style="font-size: 16px; padding: 7px 5px 13px 10px">
            {{
            this.index + 1
            }}
          </span>
          <span style="font-size: 16px; padding: 7px 5px 13px 10px">/</span>
          <span style="font-size: 16px; padding: 7px 5px 13px 10px">
            {{
            sealImgList.length
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
        ref="cardSealShow"
        style="height: 500px; text-align: center"
      >
        <el-carousel-item class="imageFlex">
          <el-form ref="form" :model="form">
            <el-form-item>
              <el-upload
                action="/api/user/v1/attachment/upload"
                :class="{ hide: sealHide }"
                list-type="picture-card"
                :headers="headers"
                :file-list="sealUrlArray"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :before-upload="beforeAvatarUpload"
                :on-success="handleSealSuccess"
                :on-error="imgUploadError"
                :on-change="sealChange"
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
          <i class="el-icon-arrow-left demo" v-show="this.sealUrlArray.length > 1"></i>
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
  name: 'SealImage',
  components: {
    ElImageViewer
  },
  props: {
    sealImgList: {
      type: Array
    }
  },
  watch: {
    sealImgList(newList, oldList) {
      this.sealImgList = newList;
      if (this.sealImgList.length == 0) {
        this.showType = 1;
      } else {
        this.showType = 0;
      }
      // 图片地址
      var img_url = this.sealImgList[0];
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
    // if (this.sealImgList.length == 0) {
    //   this.showType = 1;
    // } else {
    //   this.showType = 0;
    // }
    // // 图片地址
    // var img_url = this.sealImgList[0];
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
      sealHide: false,
      headers: {
        Authorization: 'Bearer ' + getToken()
      },
      sealUrlArray: [],
      url: '',
      showViewer: false,
      //箱门url
      sealUrl: '',
      imgLimit: 1,
      //是否上传成功
      isSuccess: true,
      showType: 1,
      //隐藏添加框
      sealHide: false,
      myWidth: 0
    };
  },
  methods: {
    // 取消按钮
    cancel() {
      this.$emit('update:visible', false);
    },
    // 箱门隐藏添加框
    sealChange(file, fileList) {
      this.sealHide = fileList.length >= this.imgLimit;
    },
    // 签收照片上传成功调用
    handleSealSuccess(res, file) {
      this.showType = 0;
      this.sealImgList[0] = res.data.previewUrl;

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
            this.sealHide = fileList.length >= this.imgLimit;
          }
        });
      } else {
        this.sealHide = fileList.length >= this.imgLimit;
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
      this.sealHide = false;
      var arr = [];
      this.$emit('sealImgChange', arr);
    },
    ///////////////////////////////////////////////////
    // 取消按钮
    cancel() {
      this.$emit('update:visible', false);
    },

    //切换tab标签
    handleClick(tab, event) {
      this.$refs.cardSealShow.activeIndex = 0;
      var image =
        document.getElementsByClassName('sealpic')[
          this.$refs.cardSealShow.activeIndex
        ];
      image.style.height = this.heights + 'px';
      image.style.width = this.widths + 'px';
      image.style.transform = 'rotate(' + 0 + 'deg)';
    },
    //箱门上一张
    sealPre() {
      //如果不是第一张
      if (this.$refs.cardSealShow.activeIndex > 0) {
        //箱门照片
        var image =
          document.getElementsByClassName('sealpic')[
            this.$refs.cardSealShow.activeIndex
          ];
        image.style.height = this.heights + 'px';
        image.style.width = this.widths + 'px';
        image.style.transform = 'rotate(' + 0 + 'deg)';
        this.$refs.cardSealShow.prev();
      }
      this.index = this.$refs.cardSealShow.activeIndex;
    },
    //箱门下一张
    sealNext() {
      //如果不是最后一张
      if (this.$refs.cardSealShow.activeIndex < this.sealImgList.length - 1) {
        var image =
          document.getElementsByClassName('sealpic')[
            this.$refs.cardSealShow.activeIndex
          ];
        image.style.height = this.heights + 'px';
        image.style.width = this.widths + 'px';
        image.style.transform = 'rotate(' + 0 + 'deg)';
        this.$refs.cardSealShow.next();
      }
      this.index = this.$refs.cardSealShow.activeIndex;
    },
    //箱门图片放大
    addSealPicture() {
      var image =
        document.getElementsByClassName('sealpic')[
          this.$refs.cardSealShow.activeIndex
        ];
      image.style.height = image.scrollHeight * 1.1 + 'px';
      image.style.width = image.scrollWidth * 1.1 + 'px';
    },
    //箱门图片缩小
    subSealPicture() {
      var image =
        document.getElementsByClassName('sealpic')[
          this.$refs.cardSealShow.activeIndex
        ];
      image.style.height = image.scrollHeight / 1.1 + 'px';
      image.style.width = image.scrollWidth / 1.1 + 'px';
    },
    //箱门旋转
    revolveSealPicture() {
      var image =
        document.getElementsByClassName('sealpic')[
          this.$refs.cardSealShow.activeIndex
        ];
      this.current = (this.current + 90) % 360;
      image.style.transform = 'rotate(' + this.current + 'deg)';
    },
    //下载图片
    downloadSealPicture() {
      var index = this.$refs.cardSealShow.activeIndex;
      var url = this.sealImgList[index];

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
.sealpic {
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