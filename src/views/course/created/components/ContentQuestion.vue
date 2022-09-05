<template>
  <div
    class="quesContent"
    :class="{
      active: courseContentId === data.id && isNoChecking,
      important: data.pointSwitch === 1 || data.mustHandleSwitch === 1,
    }"
    @click="questionClick"
  >
    <ul v-show="courseContentId === data.id && isNoChecking && !isOtherTeacher">
      <template v-if="contentType === 2">
        <li @click.stop="menuClick(-1)" v-if="data.firstQuestionId !== null">
          取消关联
        </li>
        <li
          @click.stop="menuClick('0')"
          v-if="relationData.length > 1 && data.firstQuestionId === null"
        >
          多题关联
        </li>
        <li @click.stop="menuClick('1')">连续编号</li>
        <li @click.stop="menuClick('2')">连续设分</li>
      </template>
      <li @click.stop="menuClick('3')">多选</li>
      <li @click.stop="menuClick('4')">拷贝</li>
      <li @click.stop="menuClick('5')">粘贴</li>
      <li @click.stop="menuClick('6')">删除</li>
      <li @click.stop="menuClick('7')">编辑</li>
    </ul>
    <div class="item">
      <!--多题关联-->
      <a-checkbox
        lable=""
        :value="data.id"
        :checked="contentCheckedArr.includes(data.id)"
        @click.stop
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
        @click.stop
        @change="numberChange(data.id)"
        v-if="
          contentType === 2 &&
          serialNumberData.includes(data.id) &&
          (editorType === '1' || editorType === '2')
        "
      >
      </a-checkbox>
      <!--多选-->
      <a-checkbox
        lable=""
        :value="data.id"
        :checked="contentCheckedArr.includes(data.id)"
        @click.stop
        @change="checkContent($event)"
        v-if="editorType === '3'"
      >
      </a-checkbox>
      <!--文字-->
      <a-icon
        :type="
          data.titleLevelCaret && data.titleLevelCaret === 1
            ? 'caret-down'
            : 'caret-right'
        "
        v-if="contentType === 0 && data.titleLevel !== 0"
        @click="bb(data.titleLevelCaret)"
      />
      <div class="txt" v-if="contentType === 0" v-html="data.textContent"></div>
      <!--文件-->
      <div class="file" v-if="contentType === 1">
        <a-icon
          v-if="data.attachmentType === 0"
          :type="getFileIcon(data.attachmentType)"
          :style="{ fontSize: '32px', color: '#3E8AF9', marginRight: '10px' }"
        />
        <a-icon
          v-if="data.attachmentType === 1"
          :type="getFileIcon(data.attachmentType)"
          :style="{ fontSize: '32px', color: '#FF6E1A', marginRight: '10px' }"
        />
        <a-icon
          v-if="data.attachmentType === 2"
          :type="getFileIcon(data.attachmentType)"
          :style="{ fontSize: '32px', color: '#FF4444', marginRight: '10px' }"
        />
        <a-icon
          v-if="data.attachmentType === 3"
          :type="getFileIcon(data.attachmentType)"
          :style="{ fontSize: '32px', color: '#00D870', marginRight: '10px' }"
        />
        <a-icon
          v-if="data.attachmentType === 4"
          :type="getFileIcon(data.attachmentType)"
          :style="{ fontSize: '32px', color: '#5068F2', marginRight: '10px' }"
        />
        <!--<a :href="`/exam${data.attachmentLinkAddress}`">
          {{ data.attachmentName }}
        </a>-->
        <span class="fileName" @click="viewFile(0, data)">{{
          data.attachmentName
        }}</span>
      </div>
      <!--题-->
      <template v-if="contentType === 2">
        <div class="itemContent">
          <div
            style="
              display: flex;
              justify-content: flex-start;
              align-items: center;
              margin-bottom: 5px;
            "
          >
            <a-tag color="#636f9f" @click.stop="openShowChangeNumber"
              >题号：{{ data.questionNumber }}</a-tag
            >
            <span>分数：</span>
            <span @click.stop>
              <a-input-number
                style="
                  width: 50px;
                  height: 22px;
                  line-height: 22px;
                  margin-right: 10px;
                "
                size="small"
                :min="1"
                :max="100000"
                :value="data.questionScore"
                :disabled="
                  isOtherTeacher ||
                  (contentType === 2 &&
                    (editorType === '1' || editorType === '2'))
                "
                @change="changeScore"
              />
            </span>
            <a-tag color="#FF9933" v-if="data.mustDoSwitch === 1">必做</a-tag>
            <a-tag color="#FF9933" v-if="data.selfReadOverSwitch === 1">
              自阅
            </a-tag>
            <a-tag color="#FF9933" v-if="data.firstQuestionId !== null">
              <span class="iconfont lx-guanlian" style="color: #fff"></span>
            </a-tag>
            <!--题干附件-->
            <template v-if="data.attachmentEntityList">
              <template
                v-for="o in data.attachmentEntityList.filter(
                  (p) => p.attachmentMappingType === 1
                )"
              >
                <a-icon
                  :key="o.id"
                  @click.stop="viewFile(1, o)"
                  v-if="o.attachmentType === 0"
                  type="file-word"
                  :style="{
                    fontSize: '18px',
                    color: '#3E8AF9',
                  }"
                />
                <a-icon
                  :key="o.id"
                  @click.stop="viewFile(1, o)"
                  v-if="o.attachmentType === 1"
                  type="file-ppt"
                  :style="{
                    fontSize: '18px',
                    color: '#FF6E1A',
                  }"
                />
                <a-icon
                  :key="o.id"
                  @click.stop="viewFile(1, o)"
                  v-if="o.attachmentType === 2"
                  type="file-pdf"
                  :style="{
                    fontSize: '18px',
                    color: '#FF5B5B',
                  }"
                />
                <a-icon
                  :key="o.id"
                  @click.stop="viewFile(1, o)"
                  v-if="o.attachmentType === 3"
                  type="sound"
                  :style="{
                    fontSize: '18px',
                    color: '#00D870',
                  }"
                />
                <a-icon
                  :key="o.id"
                  @click.stop="viewFile(1, o)"
                  v-if="o.attachmentType === 4"
                  type="play-square"
                  :style="{
                    fontSize: '18px',
                    color: '#657AF4',
                  }"
                />
              </template>
            </template>
          </div>
          <template v-if="showAnswerArea !== 2">
            <div class="txt" v-html="data.questionStem"></div>
            <template v-if="courseContentId === data.id && isNoChecking">
              <div class="rightAnswer">
                <div style="color: #24469f">【答案】</div>
                <div class="questionAnswer" v-html="data.answer"></div>
              </div>
              <div class="analysis">
                <div style="color: #24469f">【解析】</div>
                <div
                  class="questionAnalysis"
                  v-html="data.questionAnalysis"
                ></div>
              </div>
              <div
                class="analysis"
                v-show="data.addToQuestionAnalysis !== null"
              >
                <div style="color: #24469f">【追加解析】</div>
                <div
                  class="questionAnalysis"
                  v-html="data.addToQuestionAnalysis"
                ></div>
              </div>
              <div class="annex" v-if="data.attachmentEntityList">
                <div style="color: #24469f">【附件】</div>
                <div class="annexBox">
                  <a-space :size="10" align="start">
                    <div
                      class="fileItem"
                      v-for="o in data.attachmentEntityList.filter(
                        (p) => p.attachmentMappingType !== 1
                      )"
                      :key="o.id"
                      @click.stop="viewFile(1, o)"
                    >
                      <div class="iconBox" v-if="o.attachmentType === 0">
                        <a-icon
                          type="file-word"
                          :style="{
                            fontSize: '32px',
                            color: '#3E8AF9',
                          }"
                        />
                      </div>
                      <div class="iconBox" v-if="o.attachmentType === 1">
                        <a-icon
                          type="file-ppt"
                          :style="{
                            fontSize: '32px',
                            color: '#FF6E1A',
                          }"
                        />
                      </div>
                      <div class="iconBox" v-if="o.attachmentType === 2">
                        <a-icon
                          type="file-pdf"
                          :style="{
                            fontSize: '32px',
                            color: '#FF5B5B',
                          }"
                        />
                      </div>
                      <div class="iconBox" v-if="o.attachmentType === 3">
                        <a-icon
                          type="sound"
                          :style="{
                            fontSize: '32px',
                            color: '#00D870',
                          }"
                        />
                      </div>
                      <div class="iconBox" v-if="o.attachmentType === 4">
                        <a-icon
                          type="play-square"
                          :style="{
                            fontSize: '32px',
                            color: '#657AF4',
                          }"
                        />
                      </div>
                      <div class="annexfileName">
                        {{ o.attachmentName }}
                      </div>
                    </div>
                  </a-space>
                </div>
              </div>
            </template>
          </template>
          <template v-if="[0, 1].includes(data.questionType)">
            <div
              v-for="item in data.chooseZoneCounts"
              :key="item"
              style="display: flex; align-items: center"
            >
              <span
                v-if="
                  data.chooseZoneCounts.length > 1 &&
                  (showAnswerArea === 1 || showAnswerArea === 2)
                "
                >{{ item }}.</span
              >
              <a-space
                style="margin-top: 10px"
                :size="10"
                v-if="showAnswerArea === 1 || showAnswerArea === 2"
                @click.stop
              >
                <a-button
                  style="width: 65px"
                  size="small"
                  disabled
                  v-for="o in data.answerCard.split(',')"
                  :key="o"
                >
                  {{ o }}
                </a-button>
              </a-space>
              <!--<ol
                class="singleChoice"
                v-if="showAnswerArea === 1 || showAnswerArea === 2"
              >
                <li v-for="o in data.answerCard.split(',')" :key="o">
                  {{ o }}
                </li>
              </ol>-->
            </div>
          </template>
          <div v-if="[2, 3].includes(data.questionType)">
            <a-space
              style="margin-top: 10px"
              :size="10"
              v-if="showAnswerArea === 1 || showAnswerArea === 2"
              @click.stop
            >
              <a-button
                size="small"
                icon="camera"
                :type="data.answerWayPhoto === 1 ? 'primary' : ''"
                @click="changeAnswerType(0, data.id)"
              >
                拍照作答
              </a-button>
              <a-button
                size="small"
                icon="edit"
                :type="data.answerWayHandle === 1 ? 'primary' : ''"
                @click="changeAnswerType(1, data.id)"
              >
                手写作答</a-button
              >
            </a-space>
            <!--<ol
              class="singleChoice"
              v-if="showAnswerArea === 1 || showAnswerArea === 2"
              @click.stop
            >
              <li
                :class="{ answerWayActive: data.answerWayPhoto === 1 }"
                @click="changeAnswerType(0, data.id)"
              >
                拍照作答
              </li>
              <li
                :class="{ answerWayActive: data.answerWayHandle === 1 }"
                @click="changeAnswerType(1, data.id)"
              >
                手写作答
              </li>
              <li
                :class="{ answerWayActive: data.answerWayTalking === 1 }"
                @click="changeAnswerType(2, data.id)"
              >
                音频
              </li>
              <li
                :class="{ answerWayActive: data.answerWayVideo === 1 }"
                @click="changeAnswerType(3, data.id)"
              >
                视频
              </li>
            </ol>-->
          </div>
        </div>
      </template>
    </div>
    <a-button
      type="primary"
      ghost
      size="small"
      style="width: 120px; margin-left: 10px"
      v-if="
        data.textTalkingSwitch === 1 ||
        data.attachmentTalkingSwitch === 1 ||
        data.questionTalkingSwitch === 1
      "
    >
      讨论区
    </a-button>
    <a-modal
      :width="870"
      :maskClosable="false"
      v-model="textModal"
      title="内容修改"
      @ok="changeText"
    >
      <Editor
        ref="editor"
        :defaultHtml="data.textContent"
        v-if="courseSelectedItemData.contentType === 0"
      >
      </Editor>
      <a-input
        placeholder="请输入文件名称"
        v-model="fileName"
        v-if="courseSelectedItemData.contentType === 1"
      />
    </a-modal>
    <!--添加试题-->
    <RecordQuestions
      ref="questionsModal"
      isEditing
      :data="data"
      v-if="data.id === courseContentId"
    >
    </RecordQuestions>
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
        v-if="data.attachmentType === 3 || fileData.attachmentType === 3"
        controls="controls"
        controlslist="nodownload"
        loop="loop"
        ref="myAudio"
      ></audio>
      <iframe
        ref="fileFrame"
        v-else-if="
          [0, 1, 2].includes(data.attachmentType) ||
          [0, 1, 2].includes(fileData.attachmentType)
        "
        :src="`/exam/pdf/web/viewer.html?file=/exam${
          viewFileType === 0
            ? data.attachmentLinkAddress
            : fileData.attachmentLinkAddress
        }`"
        width="100%"
        style="height: 700px; overflow-y: auto"
        frameborder="0"
      >
      </iframe>
      <video
        ref="myVideo"
        v-else-if="
          [4].includes(data.attachmentType) ||
          [4].includes(fileData.attachmentType)
        "
        controls="controls"
        controlslist="nodownload"
        loop="loop"
        :src="`/exam${
          viewFileType === 0
            ? data.attachmentLinkAddress
            : fileData.attachmentLinkAddress
        }`"
        width="100%"
        style="height: 700px; overflow-y: auto"
      ></video>
      <iframe
        ref="fileFrame"
        v-else-if="
          [5].includes(data.attachmentType) ||
          [5].includes(fileData.attachmentType)
        "
        :src="`/exam${
          viewFileType === 0
            ? data.attachmentLinkAddress
            : fileData.attachmentLinkAddress
        }`"
        width="100%"
        style="height: 700px; overflow-y: auto"
        frameborder="0"
      >
      </iframe>
      <template v-else>暂时无法预览</template>
    </a-modal>
    <!--修改题号-->
    <a-modal
      :maskClosable="false"
      v-model="showChangeNumber"
      title="修改题号"
      @ok="changeNumber"
    >
      <a-input placeholder="请输入题号" v-model.trim="questionNumber" />
    </a-modal>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";
import {
  addQuestionStore,
  cancelQuestionAssociated,
  changeCourseText,
  copyContent,
  delCourseFile,
  delCourseQuestion,
  deleteCourseText,
  setAnswerWay,
  setCourseFileName,
  setQuestionNumber,
  checkFileStatus,
} from "@/request/course/created/course";

export default {
  name: "ContentQuestion",
  components: {
    Editor: () => import("@/components/MyEditor"),
    RecordQuestions: () => import("../../components/RecordQuestions"),
  },
  props: {
    contentType: {
      type: Number,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      userId: JSON.parse(sessionStorage.getItem("course_userInfo")).userId,
      visible: false,
      textModal: false,
      fileName: "",
      relationArr: [],
      showChangeNumber: false,
      questionNumber: "",
      viewFileType: 0,
      fileData: {
        // 0-word；1-ppt；2-pdf；3-音频；4-视频
        attachmentType: "",
        attachmentLinkAddress: "",
      },
    };
  },
  computed: {
    isNoChecking() {
      return !["0", "1", "2", "3"].includes(this.editorType);
    },
    index() {
      return this.contentData.findIndex((o) => o.content.id === this.data.id);
    },
    ...mapState({
      courseId: (state) => state.c.courseId,
      courseContentId: (state) => state.c.courseContentId,
      isOtherTeacher: (state) => state.c.isOtherTeacher,
      showAnswerArea: (state) => state.c.showAnswerArea,
      contentData: (state) => state.c.contentData,
      editorType: (state) => state.c.selectItem.editorType,
      relationData: (state) => state.c.selectItem.relationData,
      serialNumberData: (state) => state.c.selectItem.serialNumberData,
      contentCheckedArr: (state) => state.c.contentCheckedArr,
      copyData: (state) => state.c.copyData,
    }),
    ...mapGetters("c", ["courseSelectedItemData"]),
  },
  methods: {
    ...mapActions("c", [
      "changeEditorType",
      "changeContentCheckedArr",
      "changeRelationData",
      "getCourseTagAttrData",
    ]),
    ...mapMutations("c", [
      "changeCourseContentId",
      "replaceContent",
      "replaceContentNoFilter",
      "copyCourseData",
      "changeSerialNumberData",
    ]),
    openShowChangeNumber() {
      if (this.isOtherTeacher) return;
      this.showChangeNumber = true;
      this.questionNumber = this.data.questionNumber;
    },
    changeNumber() {
      if (this.questionNumber === "") {
        this.$error({
          content: "题号不能修改为空！",
        });
        return;
      }
      if (this.questionNumber.length > 10) {
        this.$error({
          content: "题号最长为10个字符！",
        });
        return;
      }
      setQuestionNumber([
        { id: this.data.id, questionNumber: this.questionNumber },
      ]).then((res) => {
        if (res.extra) {
          let i = this.contentData.findIndex(
            (item) => item.content.id === this.data.id
          );
          this.contentData[i].content.questionNumber = this.questionNumber;
          this.replaceContentNoFilter(this.contentData);
          this.showChangeNumber = false;
        }
      });
    },
    // 查看上传的文件
    viewFile(type = 0, item) {
      checkFileStatus(item.id).then((res) => {
        if (res.extra.convertStatus === 0) {
          this.$error({
            content: "文件转换中无法查看!",
          });
        } else {
          this.viewFileType = type;
          this.visible = true;
          if (type === 1) {
            this.fileData = item;
            this.$nextTick(() => {
              if (item.attachmentType === 3) {
                this.$refs.myAudio.src = `/exam${item.attachmentLinkAddress}`;
              }
            });
          } else {
            this.$nextTick(() => {
              if (this.data.attachmentType === 3) {
                this.$refs.myAudio.src = `/exam${this.data.attachmentLinkAddress}`;
              }
            });
          }
        }
      });
    },
    // 关闭文件预览 停止播放视频音频
    filePause() {
      if (this.$refs.myAudio) {
        this.$refs.myAudio.pause();
      }
      if (this.$refs.myVideo) {
        this.$refs.myVideo.pause();
      }
      if (this.$refs.fileFrame) {
        let video =
          this.$refs.fileFrame.contentWindow.document.querySelector("video");
        if (video) {
          video.pause();
        }
      }
    },
    // 修改分数
    changeScore(val) {
      addQuestionStore([
        {
          id: this.data.id,
          questionScore: val,
        },
      ]).then((res) => {
        if (res.extra) {
          let i = this.contentData.findIndex(
            (item) => item.content.id === this.data.id
          );
          this.contentData[i].content.questionScore = val;
          this.replaceContentNoFilter(this.contentData);
        }
      });
    },
    // 获取当前可以多提关联的试题
    checkRelation() {
      let i = this.contentData
        .slice(this.index)
        .findIndex((o) => o.contentType !== 2);
      if (i === -1) {
        this.changeRelationData(
          this.contentData.slice(this.index).map((o) => {
            return o.content.id;
          })
        );
      } else {
        this.changeRelationData(
          this.contentData
            .slice(this.index)
            .slice(0, i)
            .map((o) => {
              return o.content.id;
            })
        );
      }
    },
    // 获取连续编号试题
    getSerialNumberData() {
      this.changeSerialNumberData(
        this.contentData
          .slice(this.index)
          .filter((o) => o.contentType === 2)
          .map((o) => {
            return o.content.id;
          })
      );
    },
    // 试题点击
    questionClick() {
      if (this.courseContentId === this.data.id || !this.isNoChecking) {
        this.changeCourseContentId("");
        if (this.contentType === 0 && this.editorType !== "3") {
          this.bb(1);
        }
        return;
      }
      this.getSerialNumberData();
      this.checkRelation();
      this.changeCourseContentId(this.data.id);
      if (this.contentType === 0 && this.editorType !== "3") {
        this.bb(0);
      }
    },
    // 试题编辑菜单点击
    menuClick(type) {
      const _this = this;
      let { id, relation, quesNum } = this.data;
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
        quesNumData = quesNum;
      }
      switch (type) {
        // 取消关联
        case -1:
          this.changeEditorType("");
          // eslint-disable-next-line no-case-declarations
          let index = this.contentData.findIndex(
            (o) => o.content.id === this.courseContentId
          );
          // eslint-disable-next-line no-case-declarations
          let mappingIdList = this.contentData[index].content.mappingIdList;
          cancelQuestionAssociated(
            this.contentData[index].content.firstQuestionId
          ).then(() => {
            this.contentData.map((o) => {
              if (mappingIdList.includes(o.content.id)) {
                o.content.firstQuestionId = null;
                o.content.mappingIdList = [];
              }
            });
            this.replaceContent(this.contentData);
          });
          break;
        // 多题关联
        case "0":
          this.changeEditorType(type);
          break;
        // 连续编号
        case "1":
          this.changeEditorType(type);
          this.getSerialNumberData();
          break;
        // 连续设分
        case "2":
          this.changeEditorType(type);
          break;
        // 多选
        case "3":
          this.changeEditorType(type);
          this.contentData
            .filter((o) => o.contentType === 0 && o.content.titleLevel === 1)
            .forEach((o) => {
              o.content.titleLevelCaret = 1;
            });
          this.$store.commit(
            "c/removeTitleIds",
            this.contentData.map((o) => {
              return o.content.id;
            })
          );
          break;
        // 拷贝
        case "4":
          this.changeEditorType(type);
          this.copyCourseData({
            originCourseId: this.courseId,
            content: [{ id: this.data.id, contentType: this.contentType }],
          });
          this.$message.success("拷贝成功！");
          break;
        // 粘贴
        case "5":
          this.changeEditorType(type);
          if (this.copyData.content.length === 0) {
            this.$message.error("请先复制课程内容！");
            return;
          }
          // eslint-disable-next-line no-case-declarations
          let { content, originCourseId } = this.copyData;
          copyContent(content, this.courseId, originCourseId).then((res) => {
            let i = this.contentData.findIndex(
              (item) => item.content.id === this.data.id
            );
            this.contentData.splice(i + 1, 0, ...res.extra);
            this.replaceContent(this.contentData);
            this.$message.success("粘贴成功！");
          });
          break;
        // 删除
        case "6":
          this.changeEditorType(type);
          this.$confirm({
            title: "是否确定要删除?",
            content:
              this.contentType === 2 && relation && relation.length > 0
                ? `点击删除将会删除题号为 ${quesNumData} 的内容`
                : `点击删除将会删除所选内容`,
            okText: `删除`,
            // 点击蒙层是否允许关闭
            maskClosable: true,
            okType: "danger",
            cancelText: "取消",
            onOk: () => {
              if (_this.contentType === 0) {
                _this.bb(0);
                deleteCourseText([id], _this.courseId).then(() => {
                  _this.replaceContent(
                    _this.contentData.filter((o) => o.content.id !== id)
                  );
                  _this.getCourseTagAttrData(_this.courseId);
                  _this.changeCourseContentId("");
                });
              } else if (_this.contentType === 1) {
                _this.$store.commit("c/removeTitleIds", [id]);
                delCourseFile([id], _this.courseId).then(() => {
                  _this.replaceContent(
                    _this.contentData.filter((o) => o.content.id !== id)
                  );
                  _this.getCourseTagAttrData(_this.courseId);
                  _this.changeCourseContentId("");
                });
              } else if (_this.contentType === 2) {
                let mappingIdList =
                  this.courseSelectedItemData.content.mappingIdList;
                // 判断是否是多题关联
                if (mappingIdList.length > 0) {
                  _this.$store.commit("c/removeTitleIds", mappingIdList);
                  delCourseQuestion(mappingIdList).then(() => {
                    _this.replaceContent(
                      _this.contentData.filter(
                        (o) => !mappingIdList.includes(o.content.id)
                      )
                    );
                    _this.getCourseTagAttrData(_this.courseId);
                    _this.changeCourseContentId("");
                  });
                } else {
                  _this.$store.commit("c/removeTitleIds", [id]);
                  delCourseQuestion([id]).then(() => {
                    _this.replaceContent(
                      _this.contentData.filter((o) => o.content.id !== id)
                    );
                    _this.getCourseTagAttrData(_this.courseId);
                    _this.changeCourseContentId("");
                  });
                }
              }
            },
            onCancel: () => {
              console.log("Cancel");
            },
          });
          break;
        // 编辑
        case "7":
          this.changeEditorType(type);
          if (this.contentType === 0) {
            this.textModal = true;
            this.$refs.editor.editor.setHtml(this.data.textContent);
          }
          if (this.contentType === 1) {
            this.textModal = true;
            this.fileName = this.courseSelectedItemData.content.attachmentName;
          }
          if (this.contentType === 2) {
            this.$refs.questionsModal.showModal = true;
            this.$nextTick(() => {
              const {
                questionType,
                questionStem,
                questionAnalysis,
                addToQuestionAnalysis,
                chooseZoneCounts,
                answerCard,
                answer,
                attachmentEntityList,
              } = this.courseSelectedItemData.content;

              this.$refs.questionsModal.tabIndex = questionType;
              let arr = [];
              for (let i = 0; i < chooseZoneCounts; i++) {
                if (questionType === 0) {
                  arr.push({
                    id: i,
                    items: answerCard.split(","),
                    answerArr: answer.split(",")[i],
                  });
                } else if (questionType === 1) {
                  if (chooseZoneCounts === 1) {
                    arr.push({
                      id: i,
                      items: answerCard.split(","),
                      answerArr: answer.split(","),
                    });
                  } else {
                    arr.push({
                      id: i,
                      items: answerCard.split(","),
                      answerArr: answer.includes(",")
                        ? answer.split(",")[i].split("")
                        : answer.split(""),
                    });
                    console.log(arr);
                  }
                }
              }
              this.$refs.questionsModal.answerData = arr;
              if (this.$refs.questionsModal.tabIndex < 2) {
                this.$refs.questionsModal.itemNumber =
                  answerCard.split(",").length;
              }
              this.$refs.questionsModal.setQuestionStem(questionStem);
              this.$refs.questionsModal.setQuestionAnswer(answer);
              this.$refs.questionsModal.setQuestionAnalysis(questionAnalysis);
              this.$refs.questionsModal.setQuestionOtherAnalysis(
                addToQuestionAnalysis === null ? "" : addToQuestionAnalysis
              );
              if (attachmentEntityList) {
                this.$nextTick(() => {
                  this.$refs.questionsModal.fileList = attachmentEntityList
                    .filter((p) => p.attachmentMappingType !== 1)
                    .map((o) => {
                      return {
                        id: o.id,
                        uid: o.id,
                        name: o.attachmentName,
                        status: "done",
                        url: `/exam${o.attachmentLinkAddress}`,
                        creator: o.creator,
                        attachmentType: o.attachmentMappingType,
                        questionId: this.data.id,
                        response: {
                          extra: o,
                        },
                      };
                    });
                  let arr = attachmentEntityList
                    .filter((p) => p.attachmentMappingType === 1)
                    .map((o) => {
                      return {
                        attachmentId: o.id,
                        attachmentType: o.attachmentMappingType,
                        questionId: this.data.id,
                        creator: o.creator,
                        attachmentName: o.attachmentName,
                      };
                    });
                  this.$refs.questionsModal.attachmentMappingList =
                    arr.length === 0
                      ? {
                          attachmentId: null,
                          attachmentType: 1,
                          questionId: this.data.id,
                          creator: "",
                          attachmentName: "",
                        }
                      : arr[0];
                });
              }
            });
          }
          break;
      }
    },
    // 多题关联选择试题
    relationChange(e, id) {
      let i = this.relationData.findIndex((o) => o === id);
      this.changeContentCheckedArr(this.relationData.slice(0, i + 1));
    },
    // 连续编号选择试题
    numberChange(id) {
      /*let arr = this.contentData
        .map((o, i) => {
          if (o.contentType === 2 && i <= this.index) {
            return o.content.id;
          }
        })
        .filter((o) => o);
      this.changeContentCheckedArr(arr);*/
      let i = this.serialNumberData.findIndex((o) => o === id);
      this.changeContentCheckedArr(this.serialNumberData.slice(0, i + 1));
    },
    // 课程内容多选
    checkContent(e) {
      if (e.target.checked) {
        this.changeContentCheckedArr([...this.contentCheckedArr, this.data.id]);
      } else {
        let obj = this.contentCheckedArr.filter((id) => id !== this.data.id);
        this.changeContentCheckedArr(obj);
      }
    },
    // 修改文字
    changeText() {
      const _this = this;
      const { contentType } = this.courseSelectedItemData;
      if (contentType === 0) {
        if (this.$refs.editor.editor.isEmpty()) {
          this.$message.warn("内容不能为空！");
          return;
        }
        this.$confirm({
          title: "是否确定修改内容?",
          okText: `确定`,
          // 点击蒙层是否允许关闭
          maskClosable: true,
          cancelText: "取消",
          onOk: () => {
            changeCourseText({
              id: _this.data.id,
              textContent: _this.$refs.editor.editor.getHtml(),
            }).then(() => {
              let index = this.contentData.findIndex(
                (o) => o.content.id === this.data.id
              );
              this.contentData[index].content.textContent =
                _this.$refs.editor.editor.getHtml();
              _this.replaceContent([..._this.contentData]);
              _this.textModal = false;
            });
          },
          onCancel: () => {},
        });
      } else if (contentType === 1) {
        if (this.fileName.trim() === "") {
          this.$message.warn("内容不能为空！");
          return;
        }
        this.$confirm({
          title: "是否确定修改内容?",
          okText: `确定`,
          // 点击蒙层是否允许关闭
          maskClosable: true,
          // cancelText: "取消",
          onOk: () => {
            setCourseFileName(
              {
                id: _this.data.id,
                attachmentName: _this.fileName,
              },
              _this.courseId
            ).then(() => {
              let index = this.contentData.findIndex(
                (o) => o.content.id === this.data.id
              );
              this.contentData[index].content.attachmentName = _this.fileName;
              _this.replaceContent(_this.contentData);
              _this.textModal = false;
            });
          },
          onCancel: () => {},
        });
      } else if (contentType === 2) {
        alert("错误！");
      }
    },
    getFileIcon(name) {
      switch (name) {
        case 0:
          return "file-word";
        case 1:
          return "file-ppt";
        case 2:
          return "file-pdf";
        case 3:
          return "sound";
        case 4:
          return "play-square";
        default:
          return "file-unknown";
      }
    },
    // 修改主观题作答方式
    changeAnswerType(type, id) {
      let index = this.contentData.findIndex((o) => o.content.id === id);
      if (type === 0) {
        setAnswerWay({
          id: id,
          answerWayPhoto: this.data.answerWayPhoto === 1 ? 0 : 1,
        }).then(() => {
          this.contentData[index].content.answerWayPhoto =
            this.data.answerWayPhoto === 1 ? 0 : 1;
          this.replaceContent(this.contentData);
        });
      } else if (type === 1) {
        setAnswerWay({
          id: id,
          answerWayHandle: this.data.answerWayHandle === 1 ? 0 : 1,
        }).then(() => {
          this.contentData[index].content.answerWayHandle =
            this.data.answerWayHandle === 1 ? 0 : 1;
          this.replaceContent(this.contentData);
        });
      } else if (type === 2) {
        setAnswerWay({
          id: id,
          answerWayTalking: this.data.answerWayTalking === 1 ? 0 : 1,
        }).then(() => {
          this.contentData[index].content.answerWayTalking =
            this.data.answerWayTalking === 1 ? 0 : 1;
          this.replaceContent(this.contentData);
        });
      } else if (type === 3) {
        setAnswerWay({
          id: id,
          answerWayVideo: this.data.answerWayVideo === 1 ? 0 : 1,
        }).then(() => {
          this.contentData[index].content.answerWayVideo =
            this.data.answerWayVideo === 1 ? 0 : 1;
          this.replaceContent(this.contentData);
        });
      }
    },
    bb(type) {
      if (this.data.titleLevel === 0) {
        return false;
      }
      let i = this.contentData
        .slice(this.index + 1)
        .findIndex((o) => o.content.titleLevel === 1);
      let arr = [];
      console.log("i:", i, "index:", this.index);
      if (i === -1) {
        arr = this.contentData.slice(this.index + 1).map((o) => {
          return o.content.id;
        });
      } else {
        arr = this.contentData
          .slice(this.index + 1)
          .slice(0, i)
          .map((o) => {
            return o.content.id;
          });
      }
      console.log(arr);
      let index = this.contentData.findIndex(
        (o) => o.content.id === this.data.id
      );
      if (type === 1) {
        this.$store.commit("c/addTitleIds", arr);
        this.contentData[index].content.titleLevelCaret = 0;
        this.replaceContentNoFilter(this.contentData);
      } else {
        this.$store.commit("c/removeTitleIds", arr);
        this.contentData[index].content.titleLevelCaret = 1;
        this.replaceContentNoFilter(this.contentData);
      }
    },
  },
};
</script>

<style scoped lang="less">
.quesContent {
  position: relative;
  width: 100%;
  border-radius: 4px;
  border: 2px solid transparent;
  margin: 2px 0 0;
  padding: 5px 0;

  ul {
    position: absolute;
    right: -2px;
    top: -24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;

    li {
      width: 80px;
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
      margin-left: 10px;
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
      margin-right: 5px;
      text-align: center;
      background: #f6f5fa;
      border: 1px solid #d7dfe9;
      border-radius: 4px;
      cursor: pointer;
    }
  }

  .analysis,
  .rightAnswer {
    margin: 10px 0;
    .questionAnswer {
      width: 100%;
      word-break: break-all;
      text-indent: 8px;
      ::v-deep p:last-child {
        margin-bottom: 0;
      }
      ::v-deep img {
        max-width: 97%;
      }
    }

    .questionAnalysis {
      width: 100%;
      word-break: break-all;
      text-indent: 8px;
      ::v-deep p:last-child {
        margin-bottom: 0;
      }
      ::v-deep img {
        max-width: 97%;
      }
    }
  }
  .annex {
    .annexBox {
      margin-top: 10px;
      .fileItem {
        width: 110px;
        margin-bottom: 5px;
        font-size: 12px;
        .iconBox {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 110px;
          height: 60px;
          border: 1px solid #fafafa;
          border-radius: 8px;
          background-color: #f6f5fa;
        }
        .annexfileName {
          margin-top: 5px;
        }
      }
    }
  }
}

.quesContent:hover {
  background-color: #f6f5fa;
  .iconBox {
    background-color: #fff !important;
  }
}

.active {
  border: 2px solid #636f9f !important;
}

.answerWayActive {
  background-color: #636f9f !important;
  color: #fff;
}

.important {
  border-color: red;
}
</style>
