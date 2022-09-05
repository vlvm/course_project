<template>
  <div class="dis-box">
    <div class="bg-box dis-box"></div>
    <div :class="['con', isfullscreen ? 'con2' : 'con1']">
      <div :class="['title', 'w100', isfullscreen ? 'title-0' : 'title-10']">
        <div class="left f-l">提问区：</div>
        <div class="right f-r">
          <a-icon
              type="share-alt"
              style="margin-right: 10px"
              @click="isShare = !isShare"
          />
          <a-icon
              type="fullscreen"
              style="margin-right: 10px"
              v-if="!isfullscreen"
              @click="FullScreen()"
          />
          <a-icon
              type="fullscreen-exit"
              style="margin-right: 10px"
              v-else
              @click="FullScreen()"
          />
          <a-icon type="close-circle" @click="close" />
        </div>
      </div>
      <div
          class="content-box"
          :style="{ height: contentHight + 'px' }"
          ref="content"
          id="data-list-content"
      >
        <!-- <div class="left-box message-box">
          <div
            class="mp3 br-5 f-l"
          >
            <span class="mp3-fr" >
              <span
                ><img
                  :src="imgsrc2"
                  style="width: 14px"
                /> </span
              >2"
            </span>
           </div>
         </div> -->

        <div
            :class="[
            item.replayId == User.userId ? 'right-box' : 'left-box',
            'message-box',
          ]"
            v-for="(item, index) in content"
            :key="item.id"
        >
          <a-checkbox
              :class="[item.replayId == User.userId ? 'f-r' : 'f-l']"
              lable=""
              :value="item.id"
              @change="checkContent($event)"
              v-if="isShare"
          >
          </a-checkbox>
          <div
              :class="[
              'name-box',
              item.replayId == User.userId ? 'f-r txt-r' : 'f-l',
            ]"
          >
            {{ formatTime(item.createTime) }}<br />{{
              formatName(item.replayName)
            }}
          </div>
          <div
              :class="[
              'message',
              'br-5',
              'p-8',
              item.replayId == User.userId ? 'f-r' : 'f-l',
            ]"
              v-if="item.contentType == '0'"
              @contextmenu.prevent="rigthChick(item)"
          >
            <span>{{ item.content }}</span>
            <div
                class="cancel-box"
                v-if="item.cancel"
                @click.stop="CancelMessage(index, item)"
            >
              <span class="text">撤销</span>
              <span
                  class="icon"
                  style="position: absolute; bottom: -13px; left: 10px"
              ><a-icon type="caret-down"
              /></span>
            </div>
          </div>
          <div
              :class="[
              'img',
              'br-5',
              'p-5',
              item.replayId == User.userId ? 'f-r' : 'f-l',
            ]"
              v-else-if="item.contentType == '1'"
              @contextmenu.prevent="rigthChick(item)"
              v-viewer
          >
            <img
                :src="
                item.content.indexOf('data:image') >= 0
                  ? item.content
                  : '/exam' + item.content
              "
            />

            <div
                class="cancel-box"
                v-if="item.cancel"
                @click.stop="CancelMessage(index, item)"
            >
              <span class="text">撤销</span>
              <span
                  class="icon"
                  style="position: absolute; bottom: -13px; left: 10px"
              ><a-icon type="caret-down"
              /></span>
            </div>
          </div>
          <div v-else-if="item.contentType == '2'">
            <div
                :class="[
                'mp3',
                'br-5',
                item.replayId == User.userId ? 'f-r' : 'f-l',
              ]"
                @click="playSounds(item)"
                @contextmenu.prevent="rigthChick(item)"
            >
              <span
                  class="mp3-fr f-l"
                  v-if="item.replayId == User.userId"
                  :style="{ width: mp3width(item.duration) + 'px' }"
              >
                {{ item.duration }}"
                <span
                ><img
                    :src="item.shareSwitch == 0 ? imgsrc1 : imgsrc2"
                    style="transform: rotate(180deg); width: 14px"
                /> </span
                ><!--<a-icon type="wifi" style="transform: rotate(-90deg)" />-->
              </span>
              <span
                  class="mp3-fr f-r"
                  v-else
                  :style="{ width: mp3width(item.duration) + 'px' }"
              >
                <span
                ><img
                    :src="item.shareSwitch == 0 ? imgsrc1 : imgsrc2"
                    style="width: 14px"
                />
                </span>
                {{ item.duration }}"
              </span>

              <div
                  class="cancel-box"
                  v-if="item.cancel"
                  @click.stop="CancelMessage(index, item)"
              >
                <span class="text">撤销</span>
                <span
                    class="icon"
                    style="position: absolute; bottom: -13px; left: 10px"
                ><a-icon type="caret-down"
                /></span>
              </div>
            </div>
          </div>
          <div
              class="mp3-1 f-r"
              v-else-if="item.contentType == '10'"
              style="height: 41px"
          >
            <span
                style="
                width: 40px;
                height: 41px;
                display: block;
                line-height: 41px;
                text-align: center;
                float: left;
              "
            >{{ times }}"</span
            >
            <canvas id="canvas" class="canvasbox"></canvas>
          </div>
        </div>
      </div>
      <div class="option-box" :style="{ justifyContent: isShare ? 'end' : '' }">
        <template v-if="!isShare">
          <div class="left-box f-l">
            <a-icon type="picture" class="icon1" @click="ChoiceImg" />
            <a-icon
                type="audio"
                class="icon2"
                :style="{ color: isStartRecorder ? '#F00' : '#7887AF' }"
                @click="Recording"
            />
          </div>
          <div class="center-box f-l">
            <a-input
                placeholder="请输入提问内容"
                class="content-input"
                v-model="askcontent"
                @focus="inputFocus"
            />
          </div>
          <div class="right-box f-l">
            <a-button type="primary" class="btn" @click="AskSendBtn"
            >发送</a-button
            >
          </div>
          <input
              type="file"
              ref="fileUpload"
              style="display: none"
              accept="image/*"
              capture="camera"
              @change="uploadImg($event)"
          />
        </template>
        <template v-else>
          <a-space :size="10" style="margin-right: 10px">
            <a-button @click="(isShare = false), (shareIds = [])"
            >取消</a-button
            >
            <a-button type="primary" @click="shareStuAsk">分享</a-button>
          </a-space>
        </template>
      </div>
    </div>
    <!--提问得到焦点后全屏输入文字-->
    <FullScreenMsg v-show="isFull" ref="full"> </FullScreenMsg>
    <!--用来播放语音文件-->
    <audio :src="audio.src" style="display: none" id="audio" autoplay>
      您的浏览器不支持 audio 标签。
    </audio>
  </div>
</template>
<script>
import Recorder from "js-audio-recorder";
let recorder_config = {
  sampleBits: 16, // 采样位数，支持 8 或 16，默认是16
  sampleRate: 16000, // 采样率，支持 11025、16000、22050、24000、44100、48000，根据浏览器默认值，我的chrome是48000
  numChannels: 1, // 声道，支持 1 或 2
};
let recorder = new Recorder(recorder_config);
import lamejs from "lamejs";
import {
  upload,
  Ask,
  AskList,
  AskCancel,
  AskShare,
} from "@/request/course/processing";
// 图片压缩
import Compressor from "compressorjs";
import { formatTime, formatName, mp3width, formatTimeNow } from "@/factory/lib";

export default {
  components: {
    FullScreenMsg: () => import("@/components/FullScreenMsg"),
  },
  props: ["AskCourseId", "AskQuestionId", "contentType", "discussStuId"],
  data() {
    return {
      imgsrc1: require("../assets/ico/icon-1.png"),
      imgsrc2: require("../assets/ico/icon-2.gif"),
      User: {},
      isfullscreen: false, //是否全屏显示
      contentHight: 400, //默认高度
      isStartRecorder: false, //是否开始录音
      times: 0, //录音时长
      content: [
        /*{
            "id":132,
            "sourceFirstType":0,
            "sourceFirstId":1115,
            "sourceSecondType":2,
            "sourceSecondId":4989,
            "studentId":8,
            "content":"哈哈哈哈",
            "contentType":0,
            "replayId":8,
            "shareSwitch":0,
            "askStatus":1,
            "duration":"0",
            "creator":8,
            "createTime":"2022-07-10 23:06:52",
            "updateTime":"2022-07-10 23:06:52",
            "attachmentEntityList":[

            ],
            "cancel":false,
            "replayName":"武平",
            "studentName":null,
            "replayStatus":null
        },
        {
            "id":141,
            "sourceFirstType":0,
            "sourceFirstId":1115,
            "sourceSecondType":2,
            "sourceSecondId":4989,
            "studentId":8,
            "content":"急急急",
            "contentType":0,
            "replayId":9,
            "shareSwitch":0,
            "askStatus":1,
            "duration":"0",
            "creator":8,
            "createTime":"2022-07-11 17:52:01",
            "updateTime":"2022-07-11 17:52:00",
            "attachmentEntityList":[

            ],
            "cancel":false,
            "replayName":"武平",
            "studentName":null,
            "replayStatus":null
        },
        {
            "id":145,
            "sourceFirstType":0,
            "sourceFirstId":1115,
            "sourceSecondType":2,
            "sourceSecondId":4989,
            "studentId":8,
            "content":"/jyhr/uploadFile/3e012e536f544cfc97d3232b091794ec.mp3",
            "contentType":2,
            "replayId":9,
            "shareSwitch":0,
            "askStatus":1,
            "duration":"5",
            "creator":8,
            "createTime":"2022-07-11 18:26:03",
            "updateTime":"2022-07-11 18:26:02",
            "attachmentEntityList":[

            ],
            "cancel":false,
            "replayName":"武平",
            "studentName":null,
            "replayStatus":null
        },
        {
            "id":150,
            "sourceFirstType":0,
            "sourceFirstId":1115,
            "sourceSecondType":2,
            "sourceSecondId":4989,
            "studentId":8,
            "content":"/jyhr/uploadFile/68e646472f9745458fd2b0c140233b2c.mp3",
            "contentType":2,
            "replayId":8,
            "shareSwitch":0,
            "askStatus":1,
            "duration":"7",
            "creator":8,
            "createTime":"2022-07-11 21:13:38",
            "updateTime":"2022-07-11 21:13:38",
            "attachmentEntityList":[

            ],
            "cancel":false,
            "replayName":"武平",
            "studentName":null,
            "replayStatus":null
        },
        {
            "id":151,
            "sourceFirstType":0,
            "sourceFirstId":1115,
            "sourceSecondType":2,
            "sourceSecondId":4989,
            "studentId":8,
            "content":"/jyhr/uploadFile/5c99245964b545ef82960d3a5907ddb7.mp3",
            "contentType":2,
            "replayId":8,
            "shareSwitch":0,
            "askStatus":1,
            "duration":"3",
            "creator":8,
            "createTime":"2022-07-11 21:17:06",
            "updateTime":"2022-07-11 21:17:05",
            "attachmentEntityList":[

            ],
            "cancel":false,
            "replayName":"武平",
            "studentName":null,
            "replayStatus":null
        },
        {
            "id":152,
            "sourceFirstType":0,
            "sourceFirstId":1115,
            "sourceSecondType":2,
            "sourceSecondId":4989,
            "studentId":8,
            "content":"/jyhr/uploadFile/38243f133def426e819c5a3688445048.jpg",
            "contentType":1,
            "replayId":8,
            "shareSwitch":0,
            "askStatus":0,
            "duration":"0",
            "creator":8,
            "createTime":"2022-07-12 11:09:03",
            "updateTime":"2022-07-12 11:09:02",
            "attachmentEntityList":[

            ],
            "cancel":false,
            "replayName":"武平",
            "studentName":null,
            "replayStatus":null
        }*/
      ],
      //波浪图-录音
      drawRecordId: null,
      oCanvas: null,
      ctx: null,
      askcontent: "", //提问的内容
      askURL: "", //提问的图片或者是语音
      isUploadRecorder: false, //录音文件是否上传成功
      timeOutEvent: 0, // 长按事件定时器
      currAudioItem: {},
      audio: {
        src: "", // 要播放的语音地址
        play: false, // 是否播放
      },
      isFull: false, //是否全屏输入
      isShare: false,
      shareIds: [],
    };
  },
  mounted() {
    this.User = JSON.parse(sessionStorage.getItem("course_userInfo"));
  },
  methods: {
    /**
     * 格式化时间
     */
    formatTime(t) {
      return formatTime(t);
    },
    /**
     * 格式化当前时间
     */
    formatTimeNow() {
      return formatTimeNow();
    },
    formatName(n) {
      return formatName(n);
    },
    mp3width(times) {
      return mp3width(times);
    },
    close() {
      this.isShare = false;
      this.shareIds = [];
      this.content = [];
      this.audio.src = "";
      this.$parent.closeDisussArea();
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
    GetAskList() {
      let _this = this;
      setTimeout(() => {
        let data = {
          sourceFirstType: 0,
          sourceFirstId: _this.AskCourseId,
          sourceSecondType: _this.contentType,
          sourceSecondId: _this.AskQuestionId,
          studentId: _this.discussStuId,
        };

        AskList(data).then((res) => {
          _this.content = res.extra;
          _this.scrollToBottom();
        });
      }, 200);
    },
    //全屏或者退出全屏显示
    FullScreen() {
      let _this = this;
      _this.isfullscreen = !_this.isfullscreen;
      let h = document.documentElement.clientHeight;
      _this.contentHight = _this.isfullscreen ? h - 100 : 400;
    },
    /**
     * 选择图片
     */
    ChoiceImg() {
      this.$refs.fileUpload.click();
    },
    /**
     * 上传图片
     */
    uploadImg(e) {
      let _this = this;
      let file = e.target.files[0];
      if (!file) {
        _this.$message.warning("请选择正确的图片");
        return;
      }
      new Compressor(file, {
        quality: 0.9,
        maxWidth: 1800,
        success(result) {
          let a = _this.blobToFile(result, file.name + ".jpg");
          upload({ uploadFile: a }).then((res) => {
            //console.log(res);
            if (res.code != 0) {
              _this.$message.error("图片发送失败");
              return;
            }
            _this.askURL = res.extra.attachmentLinkAddress;
            _this.AskSubmit(1);
          });

          let reader = new FileReader();
          reader.readAsDataURL(result);
          reader.onload = function (e) {
            _this.pushContentData({
              content: e.target.result,
              duration: "0",
              contentType: "1",
            });
          };
        },
        error(err) {
          console.log(err.message);
        },
      });
    },
    //开始或结束录音
    Recording() {
      let _this = this;
      if (_this.isUploadRecorder) {
        _this.$message.error("录音文件处理中..");
        return;
      }
      Recorder.getPermission().then(
          () => {
            _this.isStartRecorder = !_this.isStartRecorder;
            //_this.
            if (_this.isStartRecorder) {
              //显示录音
              _this.pushContentData({
                content: "",
                duration: "0",
                contentType: "10",
              });
              setTimeout(() => {
                _this.oCanvas = document.getElementById("canvas");
                _this.ctx = _this.oCanvas.getContext("2d");
                _this.StartRecorder();
              }, 500);
            } else _this.EndRecorder();
          },
          () => {
            _this.$message.error("没有获取麦克风权限");
          }
      );
    },
    //开始录音
    StartRecorder() {
      let _this = this;
      _this.times = 0;
      recorder.start().then(
          () => {
            _this.drawRecord(); //开始绘制图片
            recorder.onprogress = function (params) {
              // console.log('--------------START---------------')
              _this.times = Math.floor(params.duration); //录音时长(秒)

              //最长录制59秒，59秒后自动结束
              if (_this.times >= 59) {
                _this.$message.warning("录音时间最长为1分钟，信息正在发送中");
                _this.Recording();
              }
              // console.log('录音大小(字节)', params.fileSize);
              // console.log('录音音量百分比(%)', params.vol);
              // console.log('当前录音的总数据([DataView, DataView...])', params.data);

              // console.log('--------------END---------------')
            };
          },
          (error) => {
            // 出错了
            _this.$message.error(error.message);
          }
      );
    },
    //结束录音
    EndRecorder() {
      let _this = this;
      //停止
      recorder.stop();

      //小于1s 的录音文件不发送
      if (_this.times <= 1) {
        recorder.destroy().then(function () {
          recorder = new Recorder(recorder_config);
        });

        //删除最后一个数据元素
        _this.content.length = _this.content.length - 1;
        _this.$message.warning("录制时间太短");
        return;
      }

      let a = _this.blobToFile(
          _this.convertToMp3(recorder.getWAV()),
          new Date().getTime() + ".mp3"
      );
      _this.isUploadRecorder = true;
      upload({ uploadFile: a })
          .then((res) => {
            //console.log(res);
            //销毁录音
            if (res.code != 0) {
              _this.$message.error("语音文件发送失败");
              return;
            }
            _this.askURL = res.extra.attachmentLinkAddress;
            _this.AskSubmit(2);
          })
          .catch(() => {
            _this.isUploadRecorder = false;
            _this.$message.warning("文件发送失败");
          });
      recorder.destroy().then(function () {
        recorder = new Recorder(recorder_config);
      });
    },
    /**
     *  发送按钮事件
     */
    AskSendBtn() {
      if (this.askcontent == "") {
        this.$message.warning("请输入要提问的问题内容");
        return;
      }
      this.pushContentData({
        content: this.askcontent,
        duration: "0",
        contentType: "0",
      });
      this.AskSubmit(0);
    },
    /**
     *  提交提问数据
     */
    AskSubmit(type) {
      let _this = this;
      let data = {
        sourceFirstType: 0,
        sourceFirstId: _this.AskCourseId,
        sourceSecondType: _this.contentType,
        sourceSecondId: _this.AskQuestionId,
        studentId: _this.discussStuId,
        content: type == 0 ? _this.askcontent : _this.askURL,
        replayId: _this.User.userId,
        contentType: type,
        duration: _this.times,
      };
      _this.askURL = "";
      _this.askcontent = "";

      Ask(data).then((res) => {
        _this.isUploadRecorder = false;
        if (res.code == 0) {
          let extra = res.extra;
          let i = _this.content.length - 1;
          _this.content[i].id = extra.id;
          _this.content[i].content = extra.content;
          _this.content[i].contentType = type;
          _this.content[i].duration = extra.duration;
          _this.content[i].createTime = extra.createTime;
          _this.content[i].cancel = false;
          _this.content[i].shareSwitch = 0;
        }
      });
    },

    /**
     * 提问输入框获取焦点事件
     */
    inputFocus() {
      let _this = this;
      let source = sessionStorage.getItem("source");
      if (source == "pad") {
        _this.isFull = true;
      }
    },
    /**
     * 退出全屏输入
     */
    outFullInput(data) {
      this.isFull = false;
      this.askcontent = data;
    },
    FullInputSendMsg(data) {
      this.outFullInput(data);
      this.AskSendBtn();
      this.$refs.full.cheanMsg();
    },
    /**
     * 播放语音
     * @param {Object} item
     */
    playSounds(item) {
      console.log(item);
      let _this = this;

      var audio = document.querySelector("#audio");
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
    /**
     * 将最新的数据追加都list的结尾
     * @param {Object} data
     */
    pushContentData(data) {
      this.content.push({
        id: 0,
        content: data.content,
        createTime: this.formatTimeNow(),
        replayId: this.User.userId,
        duration: data.duration,
        contentType: data.contentType,
        studentId: this.discussStuId,
        replayName: this.User.userName,
        cancel: false,
        shareSwitch: 0,
      });
      this.scrollToBottom();
    },

    /**
     * 撤销信息
     */
    CancelMessage(index, item) {
      let _this = this;
      AskCancel([item.id]).then(() => {
        _this.content.splice(index, 1);
      });
    },

    /****************长按 start*******************/

    rigthChick(item) {
      console.log(item);
      let _this = this;
      let currTime = new Date(); //当前时间
      let msgTime = new Date(item.createTime); //信息发送时间
      let date3 = parseInt(Math.abs(currTime - msgTime) / 1000 / 60); //计算两个时间相差的分钟
      if (date3 <= 2 && item.replayId == _this.User.userId) {
        item.cancel = true;
      }
    },

    TouchStart(item) {
      console.log(item);
      let _this = this;
      _this.timeOutEvent = setTimeout(() => {
        //显示撤销按钮
        let currTime = new Date(); //当前时间
        let msgTime = new Date(item.createTime); //信息发送时间
        let date3 = parseInt(Math.abs(currTime - msgTime) / 1000 / 60); //计算两个时间相差的分钟
        console.log(date3 <= 2 && item.replayId == _this.User.userId);
        if (date3 <= 2 && item.replayId == _this.User.userId) {
          item.cancel = true;
        }

        _this.TouchMove();
      }, 1000);
    },
    TouchMove() {
      clearTimeout(this.timeOutEvent); //清除定时器
      this.timeOutEvent = 0;
    },
    TouchEnd(item) {
      clearTimeout(this.timeOutEvent); //清除定时器
      if (this.timeOutEvent != 0) {
        //item.cancel = !item.cancel;
        //这里写要执行的内容（如onclick事件）
        if (item.contentType == "2") {
          this.playSounds(item); //播放音频文件
        }
      }
      return false;
    },
    /****************长按 end*******************/

    convertToMp3(wavDataView) {
      // 获取wav头信息
      const wav = lamejs.WavHeader.readHeader(wavDataView); // 此处其实可以不用去读wav头信息，毕竟有对应的config配置
      const { channels, sampleRate } = wav;
      const mp3enc = new lamejs.Mp3Encoder(channels, sampleRate, 128);
      // 获取左右通道数据
      const result = recorder.getChannelData();
      const buffer = [];

      const leftData =
          result.left &&
          new Int16Array(result.left.buffer, 0, result.left.byteLength / 2);
      const rightData =
          result.right &&
          new Int16Array(result.right.buffer, 0, result.right.byteLength / 2);
      const remaining = leftData.length + (rightData ? rightData.length : 0);

      const maxSamples = 1152;
      for (let i = 0; i < remaining; i += maxSamples) {
        const left = leftData.subarray(i, i + maxSamples);
        let right = null;
        let mp3buf = null;

        if (channels === 2) {
          right = rightData.subarray(i, i + maxSamples);
          mp3buf = mp3enc.encodeBuffer(left, right);
        } else {
          mp3buf = mp3enc.encodeBuffer(left);
        }

        if (mp3buf.length > 0) {
          buffer.push(mp3buf);
        }
      }

      const enc = mp3enc.flush();

      if (enc.length > 0) {
        buffer.push(enc);
      }

      let blob = new Blob(buffer, {
        type: "audio/mp3",
      });
      return blob;
    },
    blobToFile(theBlob, fileName) {
      return new File([theBlob], fileName, {
        type: "audio/mp3",
        lastModified: Date.now(),
      });
    },
    /**
     * 绘制波浪图-录音
     * */
    drawRecord() {
      try {
        // 用requestAnimationFrame稳定60fps绘制
        this.drawRecordId = requestAnimationFrame(this.drawRecord);

        // 实时获取音频大小数据
        let dataArray = recorder.getRecordAnalyseData(),
            bufferLength = dataArray.length;

        // 填充背景色
        this.ctx.fillStyle = "rgb(16, 249, 183)";
        this.ctx.fillRect(0, 0, this.oCanvas.width, this.oCanvas.height);

        // 设定波形绘制颜色
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = "rgb(0, 0, 0)";

        this.ctx.beginPath();

        var sliceWidth = (this.oCanvas.width * 1.0) / bufferLength, // 一个点占多少位置，共有bufferLength个点要绘制
            x = 0; // 绘制点的x轴位置

        for (var i = 0; i < bufferLength; i++) {
          var v = dataArray[i] / 128.0;
          var y = (v * this.oCanvas.height) / 2;

          if (i === 0) {
            // 第一个点
            this.ctx.moveTo(x, y);
          } else {
            // 剩余的点
            this.ctx.lineTo(x, y);
          }
          // 依次平移，绘制所有点
          x += sliceWidth;
        }

        this.ctx.lineTo(this.oCanvas.width, this.oCanvas.height / 2);
        this.ctx.stroke();
      } catch (e) {
        //console.log(e)
      }
    },
    // 选择分享内容id
    checkContent(e) {
      if (e.target.checked) {
        this.shareIds = [...this.shareIds, e.target.value];
      } else {
        this.shareIds = this.shareIds.filter((o) => o !== e.target.value);
      }
    },
    // 分享
    shareStuAsk() {
      if (this.shareIds.length === 0) {
        this.$message.warning("请选择想要分享学生提问！");
        return;
      }
      AskShare(this.shareIds).then((o) => {
        if (o.extra) {
          this.$message.success("分享成功");
          this.isShare = false;
          this.shareIds = [];
          this.$parent.closeDisussArea();
          this.$emit("setAskShareDTOList", o.extra);
        }
      });
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
.p-8 {
  padding: 8px 15px;
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

.title-10 {
  border-radius: 10px 10px 0 0;
}
.title-0 {
  border-radius: 0;
}

.dis-box {
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
.con2 {
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  border-radius: 0px;
}
.con {
  position: absolute;
  background: #fff;
  z-index: 1;
  .title {
    height: 40px;
    background: #636f9f;

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
    padding-bottom: 20px;
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
        max-width: calc(100% - 150px);
        min-width: 50px;
        font-size: 16px;
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
        margin-left: 10px;
        max-width: 300px;
        min-width: 100px;
        height: 32px;
        .mp3-fr {
          width: 50px;
          height: 32px;
          display: block;
          line-height: 32px;
          text-align: left;
          padding-left: 10px;
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
        max-width: calc(100% - 150px);
        position: relative;
        min-width: 50px;
        font-size: 16px;
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
        min-width: 100px;
        height: 32px;
        position: relative;
        .mp3-fr {
          width: 50px;
          height: 32px;
          display: block;
          line-height: 32px;
          text-align: right;
          padding-right: 10px;
        }
      }
      .mp3-1 {
        background: #10f9b7;
        display: inline;
        margin-right: 10px;
        max-width: 300px;
        min-width: 215px;
        height: 32px;
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
.canvasbox {
  height: 40px;
  width: 155px;
  float: left;
}
.cancel-box {
  position: absolute;
  top: -28px;
  span.text {
    color: #fff;
    padding: 5px 7px;
    width: 40px;
    text-align: center;
    font-size: 12px;
    text-decoration: none;
    word-wrap: break-word;
    background-color: rgba(0, 0, 0, 0.75);
    border-radius: 4px;
    box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
  }
}
::v-deep .ant-checkbox-wrapper {
  padding-left: 10px;
  padding-right: 10px;
  margin-top: 10px;
}
</style>
