<template>
  <div class="board">
    <ul class="tools">
      <li @click="brush">
        <span class="iconfont lx-huabi">笔</span>
      </li>
      <li>
        <a-slider v-model="lineWidth" :min="1" :max="10" style="width: 80px" />
      </li>
      <li @click="eraserClick">
        <span class="iconfont lx-xiangpica">笔擦</span>
      </li>
      <li @click="clearCanvas">
        <span class="iconfont lx-clear">清屏</span>
      </li>
      <li @click="handle">
        <span class="iconfont lx-save">保存</span>
      </li>
      <li>
        <span class="iconfont lx-iczoomout">放大</span>
      </li>
      <li><span class="iconfont lx-small">缩小</span></li>
      <li><span class="iconfont lx-yuanshibili">原尺寸</span></li>
    </ul>
    <div class="canvasBox">
      <canvas
        id="canvas"
        class="cursor1"
        ref="canvasRef"
        @mousedown="mousedown($event)"
        @mousemove="mousemove($event)"
        @mouseup="mouseup"
      >
      </canvas>
    </div>
  </div>
</template>

<script>
import html2canvas from "html2canvas";
export default {
  name: "DrawingBoard",
  data() {
    return {
      canvas: null,
      ctx: null,
      imgUrl: require("../../../assets/answer.jpeg"),
      startPoint: {
        x: undefined,
        y: undefined,
      },
      // 画板控制开关
      painting: false,
      // 橡皮擦控制开关
      EraserEnabled: false,
      // 画笔粗细
      lineWidth: 4,
    };
  },
  mounted() {
    this.canvas = this.$refs.canvasRef;
    this.ctx = this.canvas.getContext("2d");
    let img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = this.imgUrl;
    img.onload = () => {
      this.canvas.width = img.width;
      this.canvas.height = img.height;
      this.canvas.style.backgroundImage = `url(${this.imgUrl})`;
      // this.ctx.drawImage(img, 0, 0);
    };
  },
  methods: {
    mousedown(e) {
      if (e.button !== 0) return;
      let x = e.offsetX;
      let y = e.offsetY;
      this.painting = true;
      if (this.EraserEnabled) {
        this.ctx.clearRect(x - 15, y - 15, 30, 30);
      }
      this.startPoint = { x: x, y: y };
    },
    mousemove(e) {
      let x = e.offsetX;
      let y = e.offsetY;
      let newPoint = { x: x, y: y };
      if (this.painting) {
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
    },
    mouseup() {
      this.painting = false;
    },
    drawLine(xStart, yStart, xEnd, yEnd) {
      let ctx = this.ctx;
      // 画笔颜色
      ctx.strokeStyle = "red";
      // 开始绘制路径
      ctx.beginPath();
      // 线宽
      ctx.lineWidth = this.lineWidth;
      // 起始位置
      ctx.moveTo(xStart, yStart);
      // 停止位置
      ctx.lineTo(xEnd, yEnd);
      // 描绘线路
      ctx.stroke();
      // 结束绘制
      ctx.closePath();
    },
    // 画笔
    brush() {
      this.EraserEnabled = false;
      // brush.classList.add('active');
      // eraser.classList.remove('active');
      this.canvas.classList.remove("xiangpica");
    },
    // 橡皮擦
    eraserClick() {
      this.EraserEnabled = true;
      // eraser.classList.add("active");
      // brush.classList.remove("active");
      this.canvas.classList.add("xiangpica");
    },
    // 清屏
    clearCanvas() {
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
  },
};
</script>

<style scoped lang="less">
.board {
  width: 100%;
  .tools {
    position: fixed;
    top: 10px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: calc(100% - 170px);
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
    display: flex;
    justify-content: center;
    canvas {
      margin: 100px auto;
      border: 1px solid #dbdbdb;
      border-radius: 4px;
    }
  }
}

.cursor1 {
  cursor: url("../../../assets/ico/huabi.ico") 2 32, auto;
}
.xiangpica {
  cursor: url("../../../assets/ico/xiangpi.ico") 8 35, auto;
}
</style>
