<template>
  <div class="box">
    <div class="bg-box box"></div>
    <div class="con con1">
      <div class="title w100">
        <div class="left f-l">分享提问：</div>
        <div class="right f-r">
          <a-icon type="close-circle" @click="close" />
        </div>
      </div>
      <div class="content-box" ref="content" id="data-list-content">
        <div
            class="left-box message-box"
            v-for="item in content"
            :key="item.id"
        >
          <div class="name-box f-l">
            {{ formatTime(item.createTime) }}<br />{{
              formatName(item.replayName)
            }}
          </div>
          <div class="message br-5 p-5 f-l" v-if="item.contentType == 0">
            {{ item.content }}
          </div>
          <div class="img br-5 f-l" v-else-if="item.contentType == 1" v-viewer>
            <img :src="`/exam${item.content}`" />
          </div>
          <div v-else-if="item.contentType == 2">
            <div
                class="mp3 br-5 f-l"
                :style="{ width: mp3width(item.duration) + 'px' }"
                @click="playSounds(item)"
            >
              <span class="mp3-fr">
                <span
                ><img
                    :src="item.shareSwitch == 0 ? imgsrc1 : imgsrc2"
                    style="width: 14px"
                />
                </span>
                {{ item.duration }}"
              </span>
            </div>
          </div>
        </div>
        <!--<div class="left-box message-box">
                <div class="name-box f-l">22/07/01 11:11<br/>张老师</div>
                <div class="img br-5  f-l">
                <img src="/exam/jyhr/uploadFile/670730a59b5d4e8b95338705bbae8238.jpg"/>
                </div>
            </div>
           <div class="left-box message-box">
                  <div class="name-box f-l ">22/07/01 11:11<br/>学生A</div>
                  <div class="message br-5 p-5 f-l">好的</div>
           </div>

          <div class="left-box message-box">
                  <div class="name-box f-l ">22/07/01 11:11<br/>学生A</div>
                  <div class="mp3 br-5  f-l">
                       <span class="mp3-fr f-r">
                        <span
                            ><img
                            :src="imgsrc1"
                            style="width: 20px"
                            /> </span
                        > 2"
                        </span>
                  </div>
           </div> -->
      </div>
    </div>

    <!--用来播放语音文件-->
    <audio :src="audio.src" style="display: none" id="shareaudio" autoplay>
      您的浏览器不支持 audio 标签。
    </audio>
  </div>
</template>
<script>
import { getShareinfo } from "@/request/course/processing";
import { formatTime, formatName, mp3width } from "@/factory/lib";
export default {
  props: {
    askShareDTOList: [Array],
  },
  data() {
    return {
      imgsrc1: require("../assets/ico/icon-1.png"),
      imgsrc2: require("../assets/ico/icon-2.gif"),
      audiosrc: "",
      content: [],
      audio: {
        src: "", // 要播放的语音地址
        play: false, // 是否播放
      },
      currAudioItem: {},
    };
  },
  mounted() {
    //console.log(this.askShareDTOList);
  },
  methods: {
    formatTime(t) {
      return formatTime(t);
    },
    formatName(n) {
      return formatName(n);
    },
    close() {
      this.$parent.choseShareWin();
    },
    //保持滚动条到最低端
    scrollToBottom() {
      let _this = this;
      setTimeout(() => {
        let h =
            _this.$refs.content.clientHeight + _this.$refs.content.scrollHeight;
        var div = document.getElementById("data-list-content");
        div.scrollTop = h;
      }, 200);
    },
    ShareDTOList(data) {
      let _this = this;
      getShareinfo(data.id).then((res) => {
        _this.content = res.extra;
        _this.scrollToBottom();
      });
    },
    /**
     * 计算语音进度条长度
     * @param {Int} times
     */
    mp3width(times) {
      return mp3width(times);
    },
    playSounds(item) {
      console.log(item);
      let _this = this;
      var audio = document.querySelector("#shareaudio");
      //console.log(audio);
      //setTimeout(()=>{
      _this.currAudioItem.shareSwitch = 0;
      if (_this.audio.src == "/exam" + item.content) {
        if (_this.audio.play) {
          audio.pause();
          _this.audio.play = false;
          item.shareSwitch = 0;
        } else {
          audio.play();
          _this.audio.play = true;
          item.shareSwitch = 1;
        }
      } else {
        _this.audio.src = "/exam" + item.content;
        audio.play();
        _this.audio.play = true;
        item.shareSwitch = 1;
      }
      _this.currAudioItem = item;

      //监听播放结束事件
      audio.addEventListener(
          "ended",
          function () {
            _this.audio.src = "";
            item.shareSwitch = 0;
          },
          false
      );
    },
  },
};
</script>
<style scoped lang="less">
.w100 {
  width: 100%;
}
.br-5 {
  border-radius: 5px;
}
.p-5 {
  padding: 5px 15px;
}
.f-l {
  float: left;
}
.f-r {
  float: right;
}
.txt-l {
  text-align: left;
}
.txt-r {
  text-align: right;
}
.box {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
}
.bg-box {
  background: #000;
  opacity: 0.2;
  display: block;
  z-index: 0;
}
.con1 {
  width: 700px;
  height: 500px;
  left: calc((100% - 700px) / 2);
  top: calc((100% - 500px) / 2);
  border-radius: 10px;
}
.con {
  position: absolute;
  background: #fff;
  z-index: 1;
  .title {
    height: 40px;
    background: #636f9f;

    border-radius: 10px 10px 0 0;

    .left {
      color: #fff;
      line-height: 40px;
      margin-left: 20px;
      font-size: 15px;
    }
    .right {
      color: #fff;
      font-size: 18px;
      margin-right: 20px;
      line-height: 40px;
      cursor: pointer;
    }
  }
  .content-box {
    width: 100%;
    background: #f6f5fa;
    overflow-x: hidden;
    overflow-y: auto;
    height: 459px;
    .left-box {
      margin-left: 10px;
      .f-l();
      .name-box {
        width: 100px;
      }
      .message {
        background: #60beef;
        display: inline;
        display: flex;
        max-width: 300px;
        min-width: 50px;
      }
      .img {
        max-width: 295px;
        margin-left: 5px;
        img {
          width: 100%;
          border-radius: 5px;
        }
      }
      .mp3 {
        background: #60beef;
        display: inline;
        max-width: 300px;
        min-width: 100px;
        height: 32px;
        .mp3-fr {
          width: 50px;
          height: 32px;
          display: block;
          line-height: 32px;
          text-align: center;
        }
      }
    }
    .right-box {
      margin-right: 10px;
      .f-r();
      .message {
        background: #88eb56;
        display: inline;
        margin-right: 10px;
        max-width: 300px;
        position: relative;
        min-width: 50px;
      }
      .img {
        max-width: 295px;
        margin-right: 5px;
        position: relative;
        img {
          width: 100%;
          border-radius: 5px;
        }
      }
      .mp3 {
        background: #88eb56;
        display: inline;
        margin-right: 10px;
        max-width: 300px;
        min-width: 200px;
        height: 41px;
        .mp3-fr {
          width: 50px;
          height: 41px;
          display: block;
          line-height: 41px;
          text-align: center;
        }
      }
      .mp3-1 {
        background: #10f9b7;
        display: inline;
        margin-right: 10px;
        max-width: 300px;
        min-width: 215px;
        height: 41px;
        border-radius: 22px;
      }
    }
  }
  .message-box {
    width: 60%;
    margin-top: 25px;
  }
  .option-box {
    height: 60px;
    width: 100%;
    display: flex;
    .left-box {
      width: 100px;
      line-height: 60px;
      text-align: center;
      .icon1 {
        color: #7887af;
        font-size: 28px;
        position: relative;
        top: 2px;
      }
      .icon2 {
        color: #7887af;
        font-size: 25px;
        margin-left: 15px;
        position: relative;
      }
    }
    .center-box {
      flex: 1;
      .content-input {
        background: #f6f5fa;
        margin-top: 12px;
      }
    }
    .right-box {
      width: 100px;
      text-align: center;
      .btn {
        background: #86ed56;
        color: #000;
        border: 1px #86ed56 solid;
        margin-top: 12px;
      }
    }
  }
}
</style>
