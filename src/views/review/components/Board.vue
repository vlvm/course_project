<template>
  <div class="board">
    <ul class="tools">
      <li @click="brush">
        <span class="iconfont lx-huabi">笔</span>
      </li>
      <li @click="canvasMoveClick">
        <span class="iconfont"><a-icon type="drag" />移动</span>
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
      <li @click="save">
        <span class="iconfont lx-save">保存</span>
      </li>
    </ul>
    <div class="canvasBox">
      <canvas
        class="cursor"
        ref="canvasRef"
        @mousedown="mousedown($event)"
        @mousemove="mousemove($event)"
        @mouseleave="painting = false"
        @mouseup="painting = false"
        @touchstart="mousedown($event)"
        @touchmove="mousemove($event)"
        @touchend="painting = false"
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
      // 画板旋转角度
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
  mounted() {},
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
          // 可向父组件返回笔迹状态
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
      // 可向父组件返回笔迹状态
      this.$emit("setHandwriting", false);
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    // 保存 fun 回调函数
    save(fun) {
      let _this = this;
      html2canvas(_this.$refs.canvasRef, {
        // backgroundColor: null, // 背景颜色 null 为透明
        // allowTaint: false, // 是否允许跨原始图像污染画布
        useCORS: true, // 是否允许从服务器加载图片
        width: _this.width,
        scale: 1, // 缩放比例
        // y: 35,
      }).then((canvas) => {
        let url = canvas.toDataURL("image/jpeg");
        console.log(url);
        if (typeof fun === "function") {
          canvas.toBlob(function (blob) {
            fun(_this.blobToFile(blob, new Date().getTime() + ".jpg"));
          });
        }
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
    position: relative;
    z-index: 100;
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 35px;
    background: #394163;
    margin-bottom: 0;
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
    position: relative;
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: calc(100vh - 35px);
    background: #262b40;
    overflow: hidden;
    canvas {
      position: absolute;
      border: 1px solid #dbdbdb;
      border-radius: 4px;
      transform-origin: center center;
    }
  }
}

.cursor {
  cursor: url("../../../assets/ico/huabi.ico") 2 32, auto;
  background-size: 100%;
}
.xiangpica {
  cursor: url("../../../assets/ico/xiangpi.ico") 8 35, auto;
}
.moveCanvas {
  cursor: move;
}
</style>
