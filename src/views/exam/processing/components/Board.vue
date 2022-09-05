<template>
  <div class="board">
    <!--    <ul class="tools">
      <li @click="brush">
        <span class="iconfont lx-huabi">笔</span>
      </li>
      <li @click="canvasMoveClick">
        <span class="iconfont"><a-icon type="drag" />移动</span>
      </li>
      <li>
        <a-slider v-model="lineWidth" :min="1" :max="10" style="width: 80px" />
      </li>
      <li @click="eraserClick">
        <span class="iconfont lx-xiangpica">笔擦</span>
      </li>
      <li @click="canvasRotate(0)">
        <span class="iconfont"><a-icon type="undo" />左转</span>
      </li>
      <li @click="canvasRotate(1)">
        <span class="iconfont"><a-icon type="redo" />右转</span>
      </li>
      <li @click="clearCanvas">
        <span class="iconfont lx-clear">清屏</span>
      </li>
      &lt;!&ndash; <li @click="handle">
        <span class="iconfont lx-save">保存</span>
      </li> &ndash;&gt;
      &lt;!&ndash;      <li>
        <span class="iconfont lx-iczoomout">放大</span>
      </li>
      <li><span class="iconfont lx-small">缩小</span></li>&ndash;&gt;
      &lt;!&ndash; <li><span class="iconfont lx-yuanshibili">原尺寸</span></li> &ndash;&gt;
      <li @click="$emit('shareCanvas')">
        <span class="iconfont"><a-icon type="share-alt" />分享到班</span>
      </li>
    </ul>-->
    <div class="canvasBox">
      <canvas
        class="cursor1"
        ref="canvasRef"
        @mousedown="mousedown($event)"
        @mousemove="mousemove($event)"
        @mouseleave="painting = false"
        @mouseup="mouseup"
        @touchstart.stop="mousedown($event)"
        @touchmove="mousemove($event)"
        @touchend.stop="mouseup"
      >
      </canvas>
    </div>
  </div>
</template>

<script>
import html2canvas from "html2canvas";
export default {
  name: "DrawingBoard",
  props: ["reviewImg"],
  data() {
    return {
      canvas: null,
      ctx: null,
      // imgUrl: require("../../../../assets/answer.jpeg"),
      startPoint: {
        x: undefined,
        y: undefined,
      },
      // 画板控制开关
      painting: false,
      // 画板移动开关
      canvasMove: false,
      // 橡皮擦控制开关
      EraserEnabled: false,
      // 画笔粗细
      lineWidth: 4,
      // 宽度变量
      width: 0,
      // 旋转角度
      rotate: 0,
    };
  },
  created() {
    this.$nextTick(() => {
      this.canvas = this.$refs.canvasRef;
      this.ctx = this.canvas.getContext("2d");
      let img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = this.reviewImg;
      img.onload = () => {
        this.canvas.width = img.width;
        this.width = img.width;
        this.canvas.height = img.height;
        this.canvas.style.backgroundImage = `url(${this.reviewImg})`;
        // this.ctx.drawImage(img, 0, 0);
      };
    });
  },
  computed: {
    // 判断是否是移动端
    isMobile() {
      return "ontouchstart" in document.documentElement;
    },
  },
  methods: {
    mousedown(e) {
      e.preventDefault();
      let _this = this;
      // if (e.button !== 0) return;
      if (!this.canvasMove) {
        let x =
          e.offsetX ||
          e.touches[0].clientX - this.canvas.getBoundingClientRect().left;
        let y =
          e.offsetY ||
          e.touches[0].clientY - this.canvas.getBoundingClientRect().top;
        this.painting = true;
        if (this.EraserEnabled) {
          this.ctx.clearRect(x - 15, y - 15, 30, 30);
        }
        this.startPoint = { x: x, y: y };
      } else {
        this.painting = false;
        if (!this.isMobile) {
          let disx = e.pageX - _this.canvas.offsetLeft;
          let disy = e.pageY - _this.canvas.offsetTop;
          document.onmousemove = function (e) {
            _this.canvas.style.left = e.pageX - disx + "px";
            _this.canvas.style.top = e.pageY - disy + "px";
          };
          document.onmouseup = function () {
            document.onmousemove = document.onmouseup = null;
          };
        } else {
          let disx = e.touches[0].pageX - _this.canvas.offsetLeft;
          let disy = e.touches[0].pageY - _this.canvas.offsetTop;
          let moveFun = (e) => {
            _this.canvas.style.left = e.touches[0].pageX - disx + "px";
            _this.canvas.style.top = e.touches[0].pageY - disy + "px";
          };
          document.addEventListener("touchmove", moveFun, false);
          document.addEventListener(
            "touchend",
            () => {
              document.removeEventListener("touchmove", moveFun, false);
              document.removeEventListener("touchend", moveFun, false);
            },
            false
          );
        }
      }
    },
    mousemove(e) {
      if (!this.canvasMove) {
        let x =
          e.offsetX ||
          e.touches[0].clientX - this.canvas.getBoundingClientRect().left;
        let y =
          e.offsetY ||
          e.touches[0].clientY - this.canvas.getBoundingClientRect().top;
        let newPoint = { x: x, y: y };

        if (this.painting) {
          this.$emit("setHandwriting", true);
          if (this.EraserEnabled) {
            this.ctx.clearRect(x - 15, y - 15, 30, 30);
          } else {
            this.drawLine(
              this.startPoint.x,
              this.startPoint.y,
              newPoint.x,
              newPoint.y
            );
          }
          this.startPoint = newPoint;
        }
      }
    },
    mouseup() {
      this.painting = false;
    },
    drawLine(xStart, yStart, xEnd, yEnd) {
      let ctx = this.ctx;
      // 画笔颜色
      ctx.strokeStyle = "red";
      // 线宽
      ctx.lineWidth = this.lineWidth;
      ctx.lineJoin = "round";
      // 开始绘制路径
      ctx.beginPath();
      // 起始位置
      ctx.moveTo(xStart, yStart);
      // 停止位置
      ctx.lineTo(xEnd, yEnd);
      // 结束绘制
      ctx.closePath();
      // 描绘线路
      ctx.stroke();
    },
    // 画笔
    brush() {
      this.EraserEnabled = false;
      this.canvasMove = false;
      // brush.classList.add('active');
      // eraser.classList.remove('active');
      this.canvas.classList.remove("xiangpica");
      this.canvas.classList.remove("moveCanvas");
    },
    // 画板移动
    canvasMoveClick() {
      this.canvasMove = true;
      this.painting = false;
      this.canvas.classList.add("moveCanvas");
    },
    // 橡皮擦
    eraserClick() {
      this.EraserEnabled = true;
      this.canvasMove = false;
      // eraser.classList.add("active");
      // brush.classList.remove("active");
      this.canvas.classList.remove("moveCanvas");
      this.canvas.classList.add("xiangpica");
    },
    // 旋转
    canvasRotate(type) {
      if (type === 1) {
        this.rotate += 90;
        //向右旋转90度
        this.canvas.style.transform = "rotate(" + this.rotate + "deg)";
      } else {
        this.rotate -= 90;
        //向右旋转90度
        this.canvas.style.transform = "rotate(" + this.rotate + "deg)";
      }
    },
    // 清屏
    clearCanvas() {
      this.$emit("setHandwriting", false);
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    handle() {
      // this.canvas.toDataURL();
      // console.log(this.canvas.toDataURL());
      html2canvas(this.$refs.canvasRef, {
        // backgroundColor: null,
        allowTaint: true,
      }).then((canvas) => {
        let url = canvas.toDataURL("image/jpeg");
        console.log(url);
      });
    },
    // 保存
    save(fun) {
      let _this = this;
      html2canvas(_this.$refs.canvasRef, {
        // backgroundColor: null,
        // allowTaint: true,
        width: _this.width,
        scale: 1,
        // y: 35,
      }).then((canvas) => {
        canvas.toBlob(function (blob) {
          // _this.$emit("canvasUpload", blob);
          fun(_this.blobToFile(blob, new Date().getTime() + ".jpg"));
        });
      });
    },
    //将blob转换成file
    blobToFile(theBlob, fileName) {
      return new File([theBlob], fileName, {
        type: "image/jpeg",
        lastModified: Date.now(),
      });
    },
  },
};
</script>

<style scoped lang="less">
.board {
  width: 100%;
  height: 100%;

  .tools {
    position: fixed;
    top: 0;
    z-index: 100;
    display: flex;
    justify-content: space-around;
    align-items: center;
    //width: calc(100% - 170px);
    width: 100%;
    height: 35px;
    background: #394163;
    li {
      list-style: none;
      cursor: pointer;
      .iconfont {
        color: #fff;
        padding-left: 5px;
      }
    }
  }
  .canvasBox {
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: calc(100% - 30px);
    //margin: 0 auto;
    position: relative;
    canvas {
      position: absolute;
      //top: 50%;
      //left: 50%;
      //transform: translate(-50%, -50%);
      border: 1px solid #dbdbdb;
      border-radius: 4px;
      transform-origin: center center;
    }
  }
}

.cursor1 {
  cursor: url("../../../../assets/ico/huabi.ico") 2 32, auto;
  background-size: 100%;
}
.xiangpica {
  cursor: url("../../../../assets/ico/xiangpi.ico") 8 35, auto;
}
.moveCanvas {
  cursor: move;
}
</style>
