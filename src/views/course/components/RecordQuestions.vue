<template>
  <a-modal
    :width="1340"
    :maskClosable="false"
    v-model="showModal"
    :closable="false"
    centered
  >
    <tab
      :tabIndex="tabIndex"
      :tab-data="isEditing ? tabData.filter((o) => o.id === tabIndex) : tabData"
      @changeIndex="changeIndex"
      style="background: #f6f5fa"
    >
    </tab>
    <div class="recordBox">
      <div class="left">
        <h3>
          <span>录入题干:</span>
          <a-tag
            :closable="!data || data.creator === userId"
            v-if="attachmentMappingList.attachmentId !== null"
            @close="delQuestionFile"
          >
            <a-icon type="file" /> {{ attachmentMappingList.attachmentName }}
          </a-tag>
          <input
            v-show="attachmentMappingList.attachmentId === null"
            type="file"
            ref="quesAttachment"
            accept=".mp3"
            :disabled="data && data.creator !== userId"
            @change="upload($event)"
          />
        </h3>

        <Editor
          :height="410"
          :show-toolbar="false"
          ref="question"
          :is-read-only="data && data.creator !== userId"
        ></Editor>
        <h3>
          <span>答案:</span>
          <a-button
            size="small"
            @click="addAnswerItem"
            v-if="
              (tabIndex === 0 || tabIndex === 1) &&
              (!data || data.creator === userId)
            "
          >
            添加选项区
          </a-button>
        </h3>
        <div
          class="answerBox"
          v-if="[0, 1].includes(tabIndex) && data && data.creator !== userId"
        >
          {{ rightAnswer.toString() }}
        </div>
        <div
          class="answerBox"
          v-if="[0, 1].includes(tabIndex) && (!data || data.creator === userId)"
        >
          <div class="answer" v-for="(o, index) in answerData" :key="o.id">
            <span>{{ index + 1 }}</span>
            <ul>
              <li v-for="(item, i) in o.items" :key="i">
                <a-icon
                  type="close-circle"
                  class="delete"
                  v-if="i > 1 && i === o.items.length - 1"
                  @click="deleteAnswerItem(index, i)"
                />
                <a-button
                  style="width: 60px"
                  :type="o.answerArr.includes(item) ? 'primary' : null"
                  @click="itemClicked(index, item)"
                >
                  {{ item }}
                </a-button>
              </li>
              <li>
                <a-button
                  type="dashed"
                  @click="changeItemNumber(itemNumber + 1)"
                  v-if="itemNumber < 10"
                >
                  +
                </a-button>
              </li>
              <li>
                <a-button
                  type="danger"
                  v-if="index > 0 && index === answerData.length - 1"
                  @click="deleteItem(index)"
                >
                  删除
                </a-button>
              </li>
            </ul>
          </div>
        </div>
        <Editor
          v-show="[2, 3].includes(tabIndex)"
          :height="255"
          :show-toolbar="false"
          :is-read-only="data && data.creator !== userId"
          ref="answer"
        >
        </Editor>
      </div>
      <div class="right">
        <!--<h3>
          <span>解析:</span>
        </h3>
        <Editor :height="540" :show-toolbar="false" ref="analysis"></Editor>-->
        <a-tabs default-active-key="1" :animated="false" size="small">
          <a-tab-pane key="1" tab="解析" :forceRender="true">
            <Editor
              :height="540"
              :show-toolbar="false"
              :is-read-only="data && data.creator !== userId"
              ref="analysis"
            ></Editor>
          </a-tab-pane>
          <a-tab-pane key="2" tab="追加解析" :forceRender="true">
            <Editor :height="540" :show-toolbar="false" ref="otherAnalysis">
            </Editor>
          </a-tab-pane>
        </a-tabs>
        <h3><span>附件</span></h3>
        <a-upload
          action="/exam/api/atta/upload"
          method="post"
          accept=".docx,.doc,.dotx,.pptx,.ppt,.potx,.pdf,.mp4,.mp3"
          name="uploadFile"
          :file-list="fileList"
          :remove="removeFile"
          @change="handleChange"
        >
          <a-button>
            <a-icon type="upload" />
            上传附件
          </a-button>
        </a-upload>
      </div>
    </div>
    <template slot="footer">
      <span v-if="!confirmExit" style="color: red">
        <a-icon type="loading" />
        &nbsp;&nbsp;当前有文件处于上传中，请稍后....&nbsp;&nbsp;</span
      >
      <a-button @click="handleCancel"> 取消 </a-button>
      <template v-if="!isEditing">
        <a-button @click="addCourseQuestion(0)" :disabled="!confirmExit">
          确定并退出
        </a-button>
        <a-button
          type="primary"
          @click="addCourseQuestion(1)"
          :disabled="!confirmExit"
        >
          确定并继续
        </a-button>
      </template>
      <a-button
        v-else
        type="primary"
        @click="changeCourseQuestion"
        :disabled="!confirmExit"
      >
        修改试题
      </a-button>
    </template>
  </a-modal>
</template>

<script>
import {
  addCourseQuestion,
  upload,
  changeCourseQuestion,
} from "@/request/course/created/course";
import { mapActions, mapGetters, mapMutations, mapState } from "vuex";

export default {
  name: "RecordQuestions",
  props: {
    data: {
      type: Object,
    },
    isEditing: {
      type: Boolean,
      default: () => false,
    },
  },
  components: {
    Tab: () => import("../../../components/Tab"),
    Editor: () => import("@/components/MyEditor"),
  },
  data() {
    let _this = this;
    return {
      userId: JSON.parse(sessionStorage.getItem("course_userInfo")).userId,
      tabData: [
        { id: 0, name: "单选" },
        { id: 1, name: "不定项" },
        { id: 2, name: "填空" },
        { id: 3, name: "简答" },
      ],
      showModal: false,
      // 选项卡状态
      tabIndex: 0,
      // 单选多选选项数量
      itemNumber: 4,
      // 选项数据
      answerData: [
        {
          id: "0",
          items: ["A", "B", "C", "D"],
          answerArr: [],
        },
      ],
      // 附件数据
      attachmentMappingList: {
        // 附件id
        attachmentId: null,
        // 附件类型 0-课程介绍；1-题干附件；2-解析附件；3-追加附件
        attachmentType: 1,
        questionId: _this.courseContentId,
        attachmentName: "",
        creator: "",
      },
      // 已经上传的文件列表
      fileList: [
        /* {
          uid: "-1",
          name: "xxx.png",
          status: "done",
          url: "http://www.baidu.com/xxx.png",
        },*/
      ],
      questionNumber: 1,
      // 上题功能按钮状态
      confirmExit: true,
    };
  },
  computed: {
    // 生成附件的参数
    fileData() {
      return this.fileList.map((o) => {
        return {
          attachmentId: o.response.extra.id,
          questionId: o.questionId,
          creator: o.response.extra.creator
            ? o.response.extra.creator
            : this.userId,
          attachmentType: o.attachmentType
            ? o.attachmentType
            : o.creator === this.userId
            ? 2
            : 3,
        };
      });
    },
    ...mapState({
      courseId: (state) => state.c.courseId,
      courseContentId: (state) => state.c.courseContentId,
      contentData: (state) => state.c.contentData,
    }),
    ...mapGetters("c", ["courseSelectedItemData"]),
    // 计算选项
    answerItems() {
      return Array.from(new Array(this.itemNumber), (ele, index) => {
        return String.fromCharCode(65 + index);
      });
    },
    // 正确答案返回
    rightAnswer() {
      return this.answerData.map((item) => {
        return this.tabIndex === 0
          ? item.answerArr.toString()
          : item.answerArr.sort().join("");
      });
    },
  },
  mounted() {},
  methods: {
    ...mapMutations("c", ["replaceContent"]),
    ...mapActions("c", ["getCourseTagAttrData"]),
    // 切换试题类型
    changeIndex(index) {
      this.tabIndex = index;
      if (this.tabIndex === 0 || this.tabIndex === 1) {
        this.itemNumber = 4;
        this.answerData = [
          {
            id: "0",
            items: ["A", "B", "C", "D"],
            answerArr: [],
          },
        ];
      } else {
        this.$refs.answer.clear();
      }
      this.$refs.question.clear();
      this.$refs.analysis.clear();
      this.$refs.otherAnalysis.clear();
      this.fileList = [];
      this.$refs.quesAttachment.value = "";
      this.attachmentMappingList.attachmentId = null;
    },
    // 删除题干附件
    delQuestionFile() {
      this.attachmentMappingList = {
        attachmentId: null,
        attachmentType: 1,
        questionId: this.data.id,
        creator: "",
        attachmentName: "",
      };
    },
    // 上传文件操作
    upload(e) {
      let file = e.target.files[0];
      if (!(file.name.indexOf(".mp3") === file.name.length - 4)) {
        this.$error({
          title: "文件类型错误！",
          content: "只能上传MP3类型文件,请重新上传！",
        });
        this.$refs.quesAttachment.value = "";
      } else {
        this.confirmExit = false;
        upload({ uploadFile: file }).then((res) => {
          this.confirmExit = true;
          this.attachmentMappingList = {
            attachmentId: res.extra.id,
            attachmentType: 1,
            questionId: this.data ? this.data.id : "",
            creator: res.extra.creator,
            attachmentName: res.extra.attachmentName,
          };
          /*this.attachmentMappingList.attachmentId = res.extra.id;
          this.attachmentMappingList.attachmentName = res.extra.attachmentName;
          this.attachmentMappingList.creator = res.extra.creator;
          this.attachmentMappingList.attachmentType = 1;
          this.attachmentMappingList.questionId = this.data ? this.data.id : "";*/
        });
      }
    },
    // 取消添加或者修改试题
    handleCancel() {
      if (this.tabIndex === 0 || this.tabIndex === 1) {
        this.itemNumber = 4;
        this.answerData = [
          {
            id: "0",
            items: ["A", "B", "C", "D"],
            answerArr: [],
          },
        ];
      } else {
        this.$refs.answer.clear();
      }
      this.$refs.question.clear();
      this.$refs.analysis.clear();
      if (this.$refs.otherAnalysis) {
        this.$refs.otherAnalysis.clear();
      }
      this.questionNumber = 1;
      this.$refs.quesAttachment.value = "";
      this.fileList = [];
      this.showModal = false;
    },
    // 添加试题
    addCourseQuestion(type) {
      const itemChoseAreaClear = () => {
        this.itemNumber = 4;
        this.answerData = [
          {
            id: "0",
            items: ["A", "B", "C", "D"],
            answerArr: [],
          },
        ];
        this.attachmentMappingList.attachmentId = null;
      };
      if (this.$refs.question.editor.isEmpty()) {
        this.$message.warn("题干不能为空！");
        return;
      }
      if ([0, 1].includes(this.tabIndex) && this.rightAnswer.includes("")) {
        this.$message.warn("请选择答案！");
        return;
      }
      let params = {
        entity: {
          // 课程id
          courseId: parseInt(this.courseId),
          // 试题类型
          questionType: this.tabIndex,
          // 题干
          questionStem: `${this.$refs.question.html}`,
          // 客观题答题卡
          answerCard: [0, 1].includes(this.tabIndex)
            ? this.answerItems.toString()
            : null,
          // 选项区个数
          chooseZoneCounts: this.answerData.length,
          // 答案
          answer: [0, 1].includes(this.tabIndex)
            ? this.rightAnswer.toString()
            : this.$refs.answer.html,
          answerList: this.answerList,
          // 解析
          questionAnalysis: `${this.$refs.analysis.html}`,
          // 追加解析
          addToQuestionAnalysis: `${this.$refs.otherAnalysis.html}`,
          // 分数
          questionScore: 1,
          // 题号
          questionNumber: this.questionNumber,
        },
      };
      if (this.tabIndex === 1) {
        if (this.answerData.length > 1) {
          params.entity.answerList = this.rightAnswer;
        } else {
          params.entity.answerList = this.rightAnswer
            .toString()
            .split("")
            .filter((o) => o !== ",");
        }
      }
      if (this.attachmentMappingList.attachmentId !== null) {
        params.attachmentMappingList = [
          this.attachmentMappingList,
          ...this.fileData,
        ];
      } else {
        params.attachmentMappingList = [...this.fileData];
      }
      if (this.courseContentId === "") {
        addCourseQuestion(params).then((res) => {
          this.replaceContent([...this.contentData, res.extra]);
          this.fileList = [];
          this.$refs.quesAttachment.value = "";
          this.$refs.question.clear();
          if ([2, 3].includes(this.tabIndex)) {
            this.$refs.answer.clear();
          }
          this.$refs.analysis.clear();
          this.$refs.otherAnalysis.clear();
          if (type === 0) {
            this.showModal = false;
            this.questionNumber = 1;
          } else {
            this.questionNumber += 1;
            this.$message.success("添加成功！");
          }
          itemChoseAreaClear();
        });
      } else {
        let index = this.contentData.findIndex(
          (o) => o.content.id === this.courseContentId
        );
        if (this.contentData[index].contentType === 2) {
          let mappingIdList = this.contentData[index].content.mappingIdList;
          if (mappingIdList.length > 0) {
            let i = this.contentData.findIndex(
              (o) => o.content.id === mappingIdList[mappingIdList.length - 1]
            );
            addCourseQuestion(params).then((res) => {
              this.contentData.splice(i + 1, 0, res.extra);
              this.replaceContent(this.contentData);
              this.fileList = [];
              this.$refs.quesAttachment.value = "";
              this.$refs.question.clear();
              if ([2, 3].includes(this.tabIndex)) this.$refs.answer.clear();
              this.$refs.analysis.clear();
              this.$refs.otherAnalysis.clear();
              if (type === 0) {
                this.questionNumber = 1;
                this.showModal = false;
              } else {
                this.questionNumber += 1;
                this.$message.success("添加成功！");
              }
              itemChoseAreaClear();
              this.getCourseTagAttrData(this.courseId);
            });
            return;
          }
        }
        addCourseQuestion(params).then((res) => {
          this.contentData.splice(index + this.questionNumber, 0, res.extra);
          this.replaceContent(this.contentData);
          this.fileList = [];
          this.$refs.quesAttachment.value = "";
          this.$refs.question.clear();
          if ([2, 3].includes(this.tabIndex)) this.$refs.answer.clear();
          this.$refs.analysis.clear();
          this.$refs.otherAnalysis.clear();
          if (type === 0) {
            this.questionNumber = 1;
            this.showModal = false;
          } else {
            this.questionNumber += 1;
            this.$message.success("添加成功！");
          }
          itemChoseAreaClear();
          this.getCourseTagAttrData(this.courseId);
        });
      }
    },
    // 修改试题
    changeCourseQuestion() {
      if (this.$refs.question.editor.isEmpty()) {
        this.$message.warn("题干不能为空！");
        return;
      }
      if ([0, 1].includes(this.tabIndex) && this.rightAnswer.includes("")) {
        this.$message.warn("请选择答案！");
        return;
      }
      let params = {
        entity: {
          // 答案
          answer: [0, 1].includes(this.tabIndex)
            ? this.rightAnswer.toString()
            : this.$refs.answer.html,
          // 答题卡
          answerCard: [0, 1].includes(this.tabIndex)
            ? this.answerItems.toString()
            : null,
          // 课程id
          courseId: parseInt(this.courseId),
          // 试题id
          id: this.data.id,
          // 解析
          questionAnalysis: `${this.$refs.analysis.html}`,
          // 追加解析
          addToQuestionAnalysis: `${this.$refs.otherAnalysis.html}`,
          // 题在课程的排序编号
          questionNumber: this.data.questionNumber,
          // 分数
          questionScore: this.data.questionScore,
          // 题干
          questionStem: `${this.$refs.question.html}`,
          // 选项区个数
          chooseZoneCounts: this.answerData.length,
          // 试题类型
          questionType: this.tabIndex,
        },
      };
      if (this.tabIndex === 1) {
        if (this.answerData.length > 1) {
          params.entity.answerList = this.rightAnswer;
        } else {
          params.entity.answerList = this.rightAnswer
            .toString()
            .split("")
            .filter((o) => o !== ",");
        }
      }
      if (this.attachmentMappingList.attachmentId !== null) {
        params.attachmentMappingList = [
          this.attachmentMappingList,
          ...this.fileData,
        ];
      } else {
        params.attachmentMappingList = [...this.fileData];
      }
      changeCourseQuestion(params).then((res) => {
        let index = this.contentData.findIndex(
          (o) => o.content.id === this.courseContentId
        );
        this.contentData[index] = res.extra;
        this.replaceContent(this.contentData);
        this.fileList = [];
        this.$refs.quesAttachment.value = "";
        this.showModal = false;
      });
    },
    // 添加选项个数
    changeItemNumber(num) {
      if (num > 10) return;
      this.itemNumber = num;
      this.answerData.forEach((item) => {
        item.items = this.answerItems;
      });
    },
    // 添加新选区
    addAnswerItem() {
      this.answerData.push({
        id: new Date().getTime(),
        items: this.answerItems,
        answerArr: [],
      });
    },
    // 删除选择选项区
    deleteItem(index) {
      this.answerData.splice(index, 1);
    },
    // 删除选项
    deleteAnswerItem(index, i) {
      this.itemNumber -= 1;
      this.answerData[index].items.splice(i, 1);
      // this.answerData.map((o) => o.items.splice(i, 1));
    },
    // 选项点击
    itemClicked(i, item) {
      if (this.tabIndex === 0) {
        if (this.answerData[i].answerArr.includes(item)) {
          this.answerData[i].answerArr = [];
        } else {
          this.answerData[i].answerArr = [];
          this.answerData[i].answerArr.push(item);
        }
      } else if (this.tabIndex === 1) {
        if (this.answerData[i].answerArr.includes(item)) {
          this.answerData[i].answerArr = this.answerData[i].answerArr.filter(
            (o) => o !== item
          );
        } else {
          this.answerData[i].answerArr.push(item);
        }
      }
    },
    // 删除附件
    async removeFile(e) {
      // if (this.data) {
      //   alert(this.data.creator);
      // }
      console.log(e);
      let { creator, attachmentType } = e.response.extra;
      if (this.userId !== creator && attachmentType !== 3) {
        this.$warning({
          maskClosable: false,
          title: "操作提示",
          content: "您无权删除此文件！",
        });
        return false;
      }
      let s = new Promise((resolve) => {
        this.$confirm({
          title: "操作确认",
          content: "是否确认删除当前文件？",
          okText: "确定",
          cancelText: "取消",
          // 点击蒙层是否允许关闭
          maskClosable: false,
          onOk() {
            console.log(e);
            resolve(true);
          },
          onCancel() {
            resolve(false);
          },
        });
      });
      return await s;
    },
    // 文件上传
    handleChange(info) {
      if (info.fileList.length > 5) {
        this.$message.warning("最多上传五个文件！");
        return;
      }
      this.confirmExit = false;
      let fileList = [...info.fileList];
      fileList = fileList.map((file) => {
        if (file.response) {
          file.url = file.response.url;
        }
        return file;
      });
      this.fileList = fileList;
      let done = fileList.map((o) => o.status).every((j) => j === "done");
      if (done) {
        this.confirmExit = true;
      }
    },
    // 设置题干
    setQuestionStem(html) {
      this.$nextTick(() => {
        this.$refs.question.setHtml(html);
      });
    },
    // 设置答案
    setQuestionAnswer(html) {
      this.$nextTick(() => {
        this.$refs.answer.setHtml(html);
      });
    },
    // 设置解析
    setQuestionAnalysis(html) {
      this.$nextTick(() => {
        this.$refs.analysis.setHtml(html);
      });
    },
    // 追加解析
    setQuestionOtherAnalysis(html) {
      this.$nextTick(() => {
        if (this.$refs.otherAnalysis) {
          this.$refs.otherAnalysis.setHtml(html);
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
::v-deep .ant-modal-body {
  padding: 0;
}

::v-deep .ant-upload-list {
  height: 98px;
  overflow-y: auto;
}
::v-deep .ant-tabs-bar {
  margin: 5px 0 0 0;
  background: #e1e5f2;
}
::v-deep .ant-tabs-nav .ant-tabs-tab {
  margin: 0;
  padding: 5px 16px;
  font-size: 14px;
}
.recordBox {
  display: flex;
  justify-content: space-between;
  padding: 5px 10px;

  h3 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 5px 0;
    padding: 0 10px;
    line-height: 30px;
    color: #1e3779;
    font-size: 16px;
    background: #e1e5f2;

    input {
      display: inline-block;
      height: 25px;
      line-height: 25px;
      font-size: 14px;
    }
  }

  .left {
    width: 655px;

    .answerBox {
      max-height: 300px;
      overflow-y: auto;

      .answer {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        span {
          margin-right: 10px;
        }
      }
    }

    ul {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding-top: 10px;

      li {
        margin-right: 10px;
        position: relative;

        .delete {
          display: block;
          position: absolute;
          top: -5px;
          right: -5px;
          z-index: 100;
          color: red;
          cursor: pointer;
        }
      }

      li:after {
        content: "";
        display: block;
        clear: both;
      }
    }
  }

  .right {
    width: 655px;
  }
}
</style>
