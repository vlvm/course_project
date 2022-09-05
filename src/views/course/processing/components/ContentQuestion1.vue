<template>
  <div
    class="quesContent"
    :class="{
      active: courseContentId === data.id && isNoChecking,
      important: data.pointSwitch === 1 || data.mustHandleSwitch === 1,
    }"
    @click="questionClick"
  >
    <!--<ul v-show="courseContentId === data.id && isNoChecking">
      <template v-if="contentType === 2">
        <li @click="menuClick(-1)" v-if="data.firstQuestionId !== null">
          取消关联
        </li>
        <li
          @click.stop="menuClick('0')"
          v-if="relationData.length > 1 && data.firstQuestionId === null"
        >
          多题关联
        </li>
        <li @click="menuClick('1')">连续编号</li>
        <li @click="menuClick('2')">连续设分</li>
      </template>
      <li @click="menuClick('7')">编辑</li>
    </ul>-->
    <div class="item">
      <!--多题关联-->
      <a-checkbox
        lable=""
        :value="data.id"
        :checked="contentCheckedArr.includes(data.id)"
        @change="relationChange($event, data.id)"
        v-if="
          editorType === '0' &&
          relationData.includes(data.id) &&
          data.firstQuestionId === null
        "
      >
      </a-checkbox>
      <!--连续编号 和 连续设分-->
      <a-checkbox
        lable=""
        :value="data.id"
        :checked="contentCheckedArr.includes(data.id)"
        @change="numberChange"
        v-if="contentType === 2 && (editorType === '1' || editorType === '2')"
      >
      </a-checkbox>
      <!--多选-->
      <a-checkbox
        lable=""
        :value="data.id"
        :checked="contentCheckedArr.includes(data.id)"
        @change="checkContent($event)"
        v-if="editorType === '3'"
      >
      </a-checkbox>
      <!--文字-->
      <a-icon
        type="caret-down"
        v-if="contentType === 0 && data.titleLevel !== 0"
      />
      <div class="txt" v-if="contentType === 0" v-html="data.textContent"></div>
      <!--文件-->
      <div class="file" v-if="contentType === 1">
        <a-icon
          v-if="data.attachmentExtraName === '.mp3'"
          :type="getFileIcon(data.attachmentExtraName)"
          :style="{ fontSize: '32px', color: '#00D870', marginRight: '10px' }"
        />
        <a-icon
          v-if="data.attachmentExtraName === '.pdf'"
          :type="getFileIcon(data.attachmentExtraName)"
          :style="{ fontSize: '32px', color: '#FF4444', marginRight: '10px' }"
        />
        <a-icon
          v-if="data.attachmentExtraName === '.mp4'"
          :type="getFileIcon(data.attachmentExtraName)"
          :style="{ fontSize: '32px', color: '#5068F2', marginRight: '10px' }"
        />
        <!--<a :href="`/exam${data.attachmentLinkAddress}`">
          {{ data.attachmentName }}
        </a>-->
        <span class="fileName" @click="viewFile">{{
          data.attachmentName
        }}</span>
      </div>
      <!--试题-->
      <template v-if="contentType === 2">
        <div class="itemContent">
          <a-tag color="#FF9933" @click.stop v-if="data.resubmitTag === 1">
            题号：{{ data.questionNumber }}
          </a-tag>
          <a-tag v-else color="#636f9f" @click.stop
            >题号：{{ data.questionNumber }}</a-tag
          >
          <a-tag @click.stop>分数：{{ data.questionScore }}</a-tag>
          <a-tag color="#FF9933" v-if="data.mustDoSwitch === 1">必做</a-tag>
          <a-tag color="#FF9933" v-if="data.selfReadOverSwitch === 1">
            自阅
          </a-tag>
          <a-tag color="#FF9933" v-if="data.firstQuestionId !== null">
            <span class="iconfont lx-guanlian" style="color: #fff"></span>
          </a-tag>

          <div class="txt" v-html="data.questionStem"></div>
          <!--作答详情-->
          <template v-if="stuId === 0">
            <div @click.stop>
              <a-collapse :bordered="false" @change="seeStuAnswers">
                <a-collapse-panel key="1">
                  <div slot="header">
                    已提交{{ data.submittedCounts }}人，未提交
                    {{ data.totalCounts - data.submittedCounts }}人
                    <a-progress
                      style="width: 99%"
                      :percent="
                        data.submittedCounts === 0
                          ? 0
                          : parseFloat(
                              (
                                (data.submittedCounts / data.totalCounts) *
                                100
                              ).toFixed(2)
                            )
                      "
                    />
                  </div>
                  <a-card
                    title="作答详情"
                    size="small"
                    :bordered="false"
                    v-if="data.submittedCounts !== 0"
                  >
                    <template v-if="[0, 1].includes(data.questionType)">
                      <div
                        class="ask"
                        v-for="o in stuAnswerData"
                        :key="o.stuId"
                      >
                        <div
                          class="iconBox"
                          :class="{
                            wrong: o.judgeTag === 0,
                            right: o.judgeTag === 1,
                            partially: o.judgeTag === 2,
                          }"
                        >
                          {{ o.answer }}
                        </div>
                        <div>{{ o.stuName }}</div>
                      </div>
                    </template>
                    <template v-if="[2, 3].includes(data.questionType)">
                      <div
                        class="ask"
                        v-for="(o, i) in stuAnswerData"
                        :key="o.stuId"
                      >
                        <template v-if="o.readOverTag !== 0">
                          <div
                            class="imgBox"
                            :class="{
                              wrong: o.judgeTag === 0,
                              right: o.judgeTag === 1,
                              partially: o.judgeTag === 2,
                            }"
                            @click="handleReview(o, 1, i)"
                          >
                            <i
                              class="iconfont lx-wrong"
                              v-if="o.judgeTag === 0"
                            >
                            </i>
                            <i
                              class="iconfont lx-right"
                              v-if="o.judgeTag === 1"
                            >
                            </i>
                            <i
                              class="iconfont lx-partially"
                              v-if="o.judgeTag === 2"
                            >
                            </i>
                            <div class="stuName">{{ o.stuName }}</div>
                          </div>
                        </template>
                        <template v-else>
                          <div class="imgBox" @click="handleReview(o, 1, i)">
                            <div class="noReview">未批阅</div>
                            <div class="stuName">{{ o.stuName }}</div>
                          </div>
                        </template>
                      </div>
                    </template>
                  </a-card>
                  <span v-else>暂无数据</span>
                  <!-- 分享作答 -->
                  <a-card
                    title="分享作答"
                    size="small"
                    :bordered="false"
                    v-if="stuShareAnswerData.length > 0"
                  >
                    <div
                      class="ask"
                      v-for="(o, i) in stuShareAnswerData"
                      :key="o.stuId"
                    >
                      <i
                        class="close iconfont lx-wrong"
                        @click="delStuShareAnswer(o.stuId)"
                      ></i>
                      <template v-if="o.readOverTag !== 0">
                        <div
                          class="imgBox"
                          :class="{
                            wrong: o.judgeTag === 0,
                            right: o.judgeTag === 1,
                            partially: o.judgeTag === 2,
                          }"
                          @click="handleReview(o, 2, i)"
                        >
                          <i class="iconfont lx-wrong" v-if="o.judgeTag === 0">
                          </i>
                          <i class="iconfont lx-right" v-if="o.judgeTag === 1">
                          </i>
                          <i
                            class="iconfont lx-partially"
                            v-if="o.judgeTag === 2"
                          >
                          </i>
                          <div class="stuName">{{ o.stuName }}</div>
                        </div>
                      </template>
                      <template v-else>
                        <div class="imgBox" @click="handleReview(o, 2, i)">
                          <div class="noReview">未批阅</div>
                          <div class="stuName">{{ o.stuName }}</div>
                        </div>
                      </template>
                    </div>
                  </a-card>
                </a-collapse-panel>
              </a-collapse>
            </div>
          </template>
          <template v-else>
            <template v-if="[0, 1].includes(data.questionType)">
              <div class="ask" v-if="data.stuAnswer !== null">
                <div
                  class="iconBox"
                  :class="{
                    wrong: data.judgeTag === 0,
                    right: data.judgeTag === 1,
                    partially: data.judgeTag === 2,
                  }"
                >
                  {{ data.answer }}
                </div>
                <div>{{ data.stuName }}</div>
              </div>
              <span v-else>未作答</span>
            </template>
            <template v-if="[2, 3].includes(data.questionType)">
              <div class="ask">
                <template
                  v-if="data.readOverTag !== 0 && data.readOverTag !== null"
                >
                  <div
                    class="imgBox"
                    :class="{
                      wrong: data.judgeTag === 0,
                      right: data.judgeTag === 1,
                      partially: data.judgeTag === 2,
                    }"
                    @click="handleReview(data, 0, 0)"
                  >
                    <i class="iconfont lx-wrong" v-if="data.judgeTag === 0">
                    </i>
                    <i class="iconfont lx-right" v-if="data.judgeTag === 1">
                    </i>
                    <i class="iconfont lx-partially" v-if="data.judgeTag === 2">
                    </i>
                    <div class="stuName">{{ data.stuName }}</div>
                  </div>
                </template>
                <template v-else>
                  <div class="imgBox" @click="handleReview(data, 0, 0)">
                    <div class="noReview">未批阅</div>
                    <div class="stuName">{{ data.stuName }}</div>
                  </div>
                </template>
              </div>
            </template>
          </template>
        </div>
      </template>
    </div>
    <!--    &lt;!&ndash;提问区&ndash;&gt;
    <a-card
      title="提问区"
      size="small"
      style="margin: 10px 0"
      v-if="askData.stuAsk.length > 0"
    >
      <div class="ask" v-for="o in askData.stuAsk" :key="o.id">
        <div class="iconBox" :class="{ wrong: o.isReply === 0 }">
          <a-icon type="question" />
        </div>
        <div>{{ o.name }}</div>
      </div>
    </a-card>
    &lt;!&ndash;提问分享&ndash;&gt;
    <a-card title="提问分享" size="small" v-if="askData.shareAsk.length > 0">
      <div class="ask" v-for="o in askData.shareAsk" :key="o.id">
        <div class="iconBox" :class="{ wrong: o.isReply === 0 }">
          <a-icon type="question" />
        </div>
        <div>{{ o.name }}</div>
      </div>
    </a-card>-->
    <!--讨论区-->
    <a-button
      type="primary"
      ghost
      size="small"
      style="width: 120px"
      v-if="
        data.textTalkingSwitch === 1 ||
        data.attachmentTalkingSwitch === 1 ||
        data.questionTalkingSwitch === 1
      "
    >
      讨论区
    </a-button>
    <!--文件预览-->
    <a-modal
      :maskClosable="false"
      width="80%"
      v-model="visible"
      title="文件预览"
      :footer="null"
      @cancel="filePause"
    >
      <audio
        v-if="data.attachmentExtraName === '.mp3'"
        controls="controls"
        loop="loop"
        ref="myAudio"
      ></audio>
      <iframe
        ref="fileFrame"
        v-else-if="
          data.attachmentExtraName === '.pdf' ||
          data.attachmentExtraName === '.mp4'
        "
        :src="`/exam${this.data.attachmentLinkAddress}`"
        width="100%"
        style="height: 700px; overflow-y: auto"
        frameborder="0"
      >
      </iframe>
      <template v-else>暂时无法预览</template>
    </a-modal>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import {
  getQuesStuAnswer,
  getQuestionStuAnswer,
  getAnswerShareData,
  delAnswerShareData,
} from "@/request/course/processing";

export default {
  name: "ContentQuestion",
  props: {
    contentType: {
      type: Number,
      required: true,
    },
    courseContentId: [String, Number],
    stuId: [String, Number],
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      visible: false,
      // 学生作答数据
      stuAnswerData: [],
      // 学生分享数据
      stuShareAnswerData: [],
      askData: {
        stuAsk: [
          { id: 0, name: "学生1", isReply: 0 },
          { id: 1, name: "学生2", isReply: 1 },
          { id: 2, name: "学生3", isReply: 1 },
          { id: 3, name: "学生4", isReply: 1 },
          { id: 4, name: "学生5", isReply: 1 },
        ],
        shareAsk: [
          { id: 5, name: "学生6" },
          { id: 6, name: "学生7" },
        ],
      },
      answerData: [
        { id: 0, name: "学生a", state: 0 },
        { id: 1, name: "学生b", state: 1 },
        { id: 2, name: "学生c", state: 2 },
        { id: 3, name: "学生d", state: 0 },
        { id: 4, name: "学生e", state: 1 },
        { id: 5, name: "学生f", state: 2 },
      ],
      shareAnswerData: [
        { id: 0, name: "学生a", state: 0 },
        { id: 1, name: "学生b", state: 1 },
        { id: 2, name: "学生c", state: 2 },
      ],
    };
  },
  computed: {
    isNoChecking() {
      return !["0", "1", "2", "3"].includes(this.editorType);
    },
    index() {
      return this.contentData.findIndex((o) => o.id === this.data.id);
    },
    ...mapState({
      contentData: (state) => state.p.contentData,
      editorType: (state) => state.p.selectItem.editorType,
      selectItemData: (state) => state.p.selectItem.selectItemData,
      relationData: (state) => state.p.selectItem.relationData,
      contentCheckedArr: (state) => state.p.contentCheckedArr,
    }),
  },
  methods: {
    ...mapActions("p", [
      "changeEditorType",
      "getSelectItemData",
      "replaceContent",
      "changeContentCheckedArr",
      "changeRelationData",
    ]),
    // 获取当前可以多提关联的试题
    checkRelation() {
      let i = this.contentData.slice(this.index).findIndex((o) => o.type !== 2);
      this.changeRelationData(
        this.contentData
          .slice(this.index)
          .slice(0, i)
          .map((o) => {
            return o.id;
          })
      );
    },
    // 试题点击
    questionClick() {
      if (this.courseContentId === this.data.id || !this.isNoChecking) {
        this.$emit("selectedCourseContentId", {
          id: "",
          contentType: this.contentType,
        });
        this.getSelectItemData({});
        return;
      }
      this.checkRelation();
      this.$emit("selectedCourseContentId", {
        id: this.data.id,
        contentType: this.contentType,
      });
      this.getSelectItemData(this.data);
    },
    // 查看某道题学生作答
    seeStuAnswers() {
      getQuesStuAnswer(this.data.courseId, this.data.id, this.stuId).then(
        (res) => {
          this.stuAnswerData = res.extra;
        }
      );
      getAnswerShareData(this.data.courseId, this.data.id).then((res) => {
        this.stuShareAnswerData = res.extra;
      });
    },
    // 删除某个学生得分享作答
    delStuShareAnswer(id) {
      delAnswerShareData(this.data.courseId, id, this.data.id).then((res) => {
        this.stuShareAnswerData = res.extra;
      });
    },
    // 点击未批阅作答
    handleReview(item, type, index) {
      console.log(item);
      // console.log(this.data);
      let data = [];
      if (this.contentType === 2) {
        if (type === 0) {
          data = [
            {
              stuId: this.data.stuId,
              stuName: this.data.stuName,
              courseId: this.data.courseId,
              questionId: this.data.id,
            },
          ];
        } else if (type === 1) {
          data = this.stuAnswerData;
        } else if (type === 2) {
          data = this.stuShareAnswerData;
        }
        this.$emit("openReview", {
          index: index,
          reviewStu: data,
          reviewQues: this.data,
        });
        getQuestionStuAnswer({
          stuId: item.stuId,
          questionId: this.data.id,
          courseId: this.data.courseId,
        }).then((res) => {
          this.$emit("getReviewAnswer", res.extra[0]);
        });
      }
    },
    // 试题编辑菜单点击
    menuClick(type) {
      let { id, relation, quesNum } = this.contentData[this.index];
      let quesNumData;
      if (relation && relation.length > 0) {
        quesNumData = this.contentData
          .map((o) => {
            if (relation.includes(o.id)) {
              return o.quesNum;
            }
          })
          .filter((o) => o)
          .toString();
      } else {
        // eslint-disable-next-line no-unused-vars
        quesNumData = quesNum;
      }
      switch (type) {
        // 取消关联
        case -1:
          this.changeEditorType("");
          this.contentData.forEach((o) => {
            if (o.type === 2 && o.relation.includes(id)) {
              o.relation = [];
            }
          });
          break;
        // 多题关联
        case "0":
          this.changeEditorType(type);
          break;
        // 连续编号
        case "1":
          this.changeEditorType(type);
          break;
        // 连续设分
        case "2":
          this.changeEditorType(type);
          break;
        // 编辑
        case "7":
          this.changeEditorType(type);
          break;
      }
    },
    // 多题关联选择试题
    relationChange(e, id) {
      let i = this.relationData.findIndex((o) => o === id);
      this.changeContentCheckedArr(this.relationData.slice(0, i + 1));
    },
    // 连续编号选择试题
    numberChange() {
      let arr = this.contentData
        .map((o, i) => {
          if (o.type === 2 && i <= this.index) {
            return o.id;
          }
        })
        .filter((o) => o);
      this.changeContentCheckedArr(arr);
    },
    // 课程内容多选
    checkContent(e) {
      if (e.target.checked) {
        this.changeContentCheckedArr([...this.contentCheckedArr, this.data.id]);
      } else {
        let index = this.contentCheckedArr.findIndex(
          (itemId) => itemId === this.data.id
        );
        this.changeContentCheckedArr(this.contentCheckedArr.splice(index, 1));
      }
    },
    // 图标展示
    getFileIcon(name) {
      switch (name) {
        case ".mp3":
          return "sound";
        case ".mp4":
          return "play-square";
        case ".pdf":
          return "file-pdf";
        case ".doc":
          return "file-word";
        default:
          return "file-unknown";
      }
    },
    // 查看音频
    viewFile() {
      this.visible = true;
      this.$nextTick(() => {
        if (this.data.attachmentExtraName === ".mp3") {
          this.$refs.myAudio.src = `/exam${this.data.attachmentLinkAddress}`;
        }
      });
    },
    //  查看音频关闭 停止播放视频音频
    filePause() {
      if (this.$refs.myAudio) {
        this.$refs.myAudio.pause();
      }
      if (this.$refs.fileFrame) {
        let video =
          this.$refs.fileFrame.contentWindow.document.querySelector("video");
        if (video) {
          video.pause();
        }
      }
    },
  },
};
</script>

<style scoped lang="less">
::v-deep .ant-card-body {
  padding: 5px;
  background-color: #fafafa;
}
::v-deep
  .ant-collapse
  > .ant-collapse-item
  > .ant-collapse-header
  .ant-collapse-arrow {
  left: 0;
}
::v-deep .ant-collapse > .ant-collapse-item > .ant-collapse-header {
  padding: 8px 0 8px 15px;
}
.quesContent {
  position: relative;
  width: 100%;
  border-radius: 4px;
  border: 2px solid transparent;
  margin: 2px 0 0;
  padding: 5px 10px;

  ul {
    position: absolute;
    right: -2px;
    top: -24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;

    li {
      width: 60px;
      line-height: 24px;
      margin-left: 1px;
      border-radius: 4px;
      color: #fff;
      background-color: #636f9f;
      text-align: center;
      cursor: pointer;
    }

    li:hover {
      background: #007cf1;
    }
  }

  .item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    padding: 5px 0;

    .itemContent {
      width: 100%;
      word-break: break-all;
      //margin-left: 10px;
    }
  }

  .txt {
    width: 100%;
    word-break: break-all;
    ::v-deep p {
      text-indent: 0 !important;
    }
    ::v-deep li {
      text-indent: 0 !important;
    }
    ::v-deep p:last-child {
      margin-bottom: 0;
    }
    ::v-deep img {
      max-width: 100%;
    }
  }

  .file {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-left: 7px;
    .fileName {
      cursor: pointer;
    }
  }

  .singleChoice {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: 5px 0 0;
    font-size: 12px;

    li {
      width: 50px;
      line-height: 24px;
      margin-left: 1px;
      text-align: center;
      cursor: pointer;
      border-top: 1px solid black;
      border-right: 1px solid black;
      border-bottom: 1px solid black;
    }

    li:first-child {
      border-left: 1px solid black;
    }
  }

  .analysis,
  .rightAnswer {
    color: #24469f;
  }
}

.quesContent:hover {
  background-color: #f6f5fa;
}

.active {
  border: 2px solid #636f9f !important;
}

.important {
  border-color: red;
}

.ask {
  display: inline-block;
  //width: 60px;
  margin: 8px 5px;
  text-align: center;
  position: relative;
  cursor: pointer;
  .close {
    position: absolute;
    z-index: 10;
    right: -8px;
    top: -8px;
    cursor: pointer;
  }

  .iconBox {
    display: inline-block;
    //width: 30px;
    //height: 30px;
    line-height: 30px;
    font-size: 16px;
    border-radius: 4px;
    .iconfont {
      font-size: 24px;
    }
  }
  .imgBox {
    position: relative;
    width: 110px;
    height: 80px;
    background-color: #fff;
    border: 1px solid #d1dce7;
    border-radius: 4px;
    .iconfont {
      display: inline-block;
      margin-top: 6px;
      font-size: 30px;
    }
    .noReview {
      padding-top: 20px;
    }
    .stuName {
      position: absolute;
      width: 100%;
      bottom: -1px;
      color: #6377b0;
      background-color: #e1e5f2;
    }
  }
}

.right {
  color: #00d86f;
}

.wrong {
  color: #ff5252;
}

.partially {
  color: #ffb100;
}
::v-deep .ant-checkbox {
  margin-right: 10px;
}
</style>
