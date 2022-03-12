<template>
  <div class="door">
    <el-carousel
      arrow="never"
      indicator-position="none"
      :autoplay="false"
      trigger="click"
      ref="cardDoorShow"
      style="height: 500px; text-align: center"
    >
      <el-carousel-item v-for="(item, index) in doorImgList" :key="index" class="imageFlex">
        <div style="position: absolute;background-image: url(#); ">
          <el-image fit="fit" class="pic" :src="item" :style="'width:'+(myWidth )+'px'">
            <div slot="placeholder" class="image-slot" style="margin-top:250px">
              加载中
              <span class="dot" style="text-align:center">
                <i class="el-icon-loading btnloading"></i>
              </span>
            </div>
          </el-image>
        </div>
      </el-carousel-item>
    </el-carousel>

    <div style="border-top: 1px solid #ccc; height: 36px" class="bottomItem">
      <div class="items">
        <el-tooltip
          class="item"
          effect="dark"
          content="点击下载"
          :hide-after="1000"
          placement="top-start"
        >
          <i
            class="el-icon-download"
            style="color: blue; font-size: 20px;font-weight:1000"
            @click="downloadDoorPicture()"
          ></i>
        </el-tooltip>
      </div>
      <div class="items" v-show="this.doorImgList.length > 0">
        <i class="el-icon-arrow-left demo" @click="doorPre()" v-show="this.doorImgList.length > 1"></i>
        <i class="el-icon-plus demo" @click="addDoorPicture()"></i>
        <i class="el-icon-minus demo" @click="subDoorPicture()"></i>
        <i class="el-icon-refresh-right demo" @click="revolveDoorPicture()"></i>
        <i
          class="el-icon-arrow-right demo"
          @click="doorNext()"
          v-show="this.doorImgList.length > 1"
        ></i>
        <span style="font-size: 16px; padding: 7px 0 13px 10px">
          {{
          this.index + 1
          }}
        </span>
        <span style="font-size: 16px; padding: 7px 0 13px 0">/</span>
        <span style="font-size: 16px; padding: 7px 5px 13px 0">
          {{
          this.doorImgList.length
          }}
        </span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'DoorImage',
  props: {
    doorImgList: {
      type: Array
    }
  },
  created() {
    // 图片地址
    var img_url = this.doorImgList[0];
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
  },
  data() {
    return {
      //当前值
      index: 0,
      //图片默认角度 宽度  高度
      current: 0,
      widths: 300,
      heights: 500,
      myWidth: 0
    };
  },
  methods: {
    // 取消按钮
    cancel() {
      this.$emit('update:visible', false);
    },

    //切换tab标签
    handleClick(tab, event) {
      this.$refs.cardDoorShow.activeIndex = 0;
      var image = document.getElementsByClassName('pic')[
        this.$refs.cardDoorShow.activeIndex
      ];
      image.style.height = this.heights + 'px';
      image.style.width = this.widths + 'px';
      image.style.transform = 'rotate(' + 0 + 'deg)';
    },
    //箱门上一张
    doorPre() {
      //如果不是第一张
      if (this.$refs.cardDoorShow.activeIndex > 0) {
        //箱门照片
        var image = document.getElementsByClassName('pic')[
          this.$refs.cardDoorShow.activeIndex
        ];
        image.style.height = this.heights + 'px';
        image.style.width = this.widths + 'px';
        image.style.transform = 'rotate(' + 0 + 'deg)';
        this.$refs.cardDoorShow.prev();
      }
      this.index = this.$refs.cardDoorShow.activeIndex;
    },
    //箱门下一张
    doorNext() {
      //如果不是最后一张
      if (this.$refs.cardDoorShow.activeIndex < this.doorImgList.length - 1) {
        var image = document.getElementsByClassName('pic')[
          this.$refs.cardDoorShow.activeIndex
        ];
        image.style.height = this.heights + 'px';
        image.style.width = this.widths + 'px';
        image.style.transform = 'rotate(' + 0 + 'deg)';
        this.$refs.cardDoorShow.next();
      }
      this.index = this.$refs.cardDoorShow.activeIndex;
    },
    //箱门图片放大
    addDoorPicture() {
      var image = document.getElementsByClassName('pic')[
        this.$refs.cardDoorShow.activeIndex
      ];
      image.style.height = image.scrollHeight * 1.1 + 'px';
      image.style.width = image.scrollWidth * 1.1 + 'px';
    },
    //箱门图片缩小
    subDoorPicture() {
      var image = document.getElementsByClassName('pic')[
        this.$refs.cardDoorShow.activeIndex
      ];
      image.style.height = image.scrollHeight / 1.1 + 'px';
      image.style.width = image.scrollWidth / 1.1 + 'px';
    },
    //箱门旋转
    revolveDoorPicture() {
      var image = document.getElementsByClassName('pic')[
        this.$refs.cardDoorShow.activeIndex
      ];
      this.current = (this.current + 90) % 360;
      image.style.transform = 'rotate(' + this.current + 'deg)';
    },
    //下载图片
    downloadDoorPicture() {
      var index = this.$refs.cardDoorShow.activeIndex;
      var url = this.doorImgList[index];

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
.pic {
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
</style>