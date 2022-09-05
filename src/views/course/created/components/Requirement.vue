<template>
  <TagBox name="学习要求">
    <a-space direction="vertical" :size="10" style="width: 100%">
      <template v-if="contentType === 0">
        <a-button
          :type="pointSwitch ? 'warning' : 'primary'"
          block
          :disabled="isOtherTeacher"
          @click="changeImport"
        >
          {{ pointSwitch ? `取消重点` : `添加为重点` }}
        </a-button>
        <a-button
          :type="!textTalkingSwitch ? 'primary' : 'warning'"
          block
          :disabled="isOtherTeacher"
          @click="changeDiscussionArea"
        >
          {{ !textTalkingSwitch ? "添加讨论区" : "取消讨论区" }}
        </a-button>
      </template>
      <template v-if="contentType === 1">
        <a-button
          block
          :type="mustHandleSwitch ? 'warning' : 'primary'"
          :disabled="isOtherTeacher"
          @click="changeImport"
        >
          {{ mustHandleSwitch ? `取消必办` : `添加为必办` }}
        </a-button>
        <a-button
          block
          :type="attachmentTalkingSwitch ? 'warning' : 'primary'"
          :disabled="isOtherTeacher"
          @click="changeDiscussionArea"
        >
          {{ attachmentTalkingSwitch ? "取消讨论区" : "添加讨论区" }}
        </a-button>
      </template>
      <template v-if="contentType === 2">
        <a-button
          :type="mustDoSwitch ? 'warning' : 'primary'"
          block
          :disabled="isOtherTeacher"
          @click="changeImport"
        >
          {{ mustDoSwitch ? `取消必做` : `添加为必做` }}
        </a-button>
        <a-button
          block
          :type="selfReadOverSwitch ? 'warning' : 'primary'"
          :disabled="isOtherTeacher"
          @click="changeReview"
          v-if="questionType"
        >
          {{ selfReadOverSwitch ? "取消自阅" : "添加为自阅" }}
        </a-button>
        <a-button
          :type="questionTalkingSwitch ? 'warning' : 'primary'"
          block
          :disabled="isOtherTeacher"
          @click="changeDiscussionArea"
        >
          {{ questionTalkingSwitch ? "取消讨论区" : "添加讨论区" }}
        </a-button>
      </template>
    </a-space>
  </TagBox>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from "vuex";
import {
  setTextPoint,
  setTextTalking,
  setFileMustHandle,
  setAttachmentTalkingSwitch,
  addMustDoSwitch,
  setSelfReadOverSwitch,
  addQuestionTalkingSwitch,
} from "@/request/course/created/course";

export default {
  name: "FileTag",
  computed: {
    ...mapState({
      role: (state) => state.role,
      isOtherTeacher: (state) => state.c.isOtherTeacher,
      courseId: (state) => state.c.courseId,
      courseContentId: (state) => state.c.courseContentId,
      contentData: (state) => state.c.contentData,
    }),
    ...mapGetters("c", ["courseSelectedItemData"]),
    // 课程内容类型
    contentType() {
      return this.courseSelectedItemData.contentType;
    },
    // 文字添加为重点
    pointSwitch() {
      return this.courseSelectedItemData.content.pointSwitch === 1;
    },
    // 文字添加为讨论区
    textTalkingSwitch() {
      return this.courseSelectedItemData.content.textTalkingSwitch === 1;
    },
    // 文件添加为必办
    mustHandleSwitch() {
      return this.courseSelectedItemData.content.mustHandleSwitch === 1;
    },
    // 文件添加为讨论区
    attachmentTalkingSwitch() {
      return this.courseSelectedItemData.content.attachmentTalkingSwitch === 1;
    },
    // 试题可以自阅
    questionType() {
      return [2, 3].includes(this.courseSelectedItemData.content.questionType);
    },
    // 试题添加为必做
    mustDoSwitch() {
      return this.courseSelectedItemData.content.mustDoSwitch === 1;
    },
    // 试题开启自阅
    selfReadOverSwitch() {
      return this.courseSelectedItemData.content.selfReadOverSwitch === 1;
    },
    // 试题添加讨论区
    questionTalkingSwitch() {
      return this.courseSelectedItemData.content.questionTalkingSwitch === 1;
    },
  },
  methods: {
    ...mapMutations("c", ["replaceContent"]),
    ...mapActions("c", ["getCourseTagAttrData"]),
    // 获取选中内容某个字段数据
    contentAttribute(name) {
      return this.courseSelectedItemData.content[name];
    },
    // 添加取消(重点、必办、必做）
    changeImport() {
      if (this.contentType === 0) {
        const { id, pointSwitch } = this.courseSelectedItemData.content;
        setTextPoint({
          id: id,
          courseId: this.courseId,
          pointSwitch: pointSwitch === 0 ? 1 : 0,
        }).then(() => {
          let index = this.contentData.findIndex((o) => o.content.id === id);
          this.contentData[index].content.pointSwitch =
            pointSwitch === 0 ? 1 : 0;
          this.replaceContent(this.contentData);
          this.getCourseTagAttrData(this.courseId);
        });
      } else if (this.contentType === 1) {
        const { id, mustHandleSwitch } = this.courseSelectedItemData.content;
        setFileMustHandle(
          {
            id: id,
            mustHandleSwitch: mustHandleSwitch === 0 ? 1 : 0,
          },
          this.courseId
        ).then(() => {
          let index = this.contentData.findIndex((o) => o.content.id === id);
          this.contentData[index].content.mustHandleSwitch =
            mustHandleSwitch === 0 ? 1 : 0;
          this.replaceContent(this.contentData);
          this.getCourseTagAttrData(this.courseId);
        });
      } else if (this.contentType === 2) {
        const { id, mustDoSwitch } = this.courseSelectedItemData.content;
        addMustDoSwitch({
          id: id,
          courseId: this.courseId,
          mustDoSwitch: mustDoSwitch === 0 ? 1 : 0,
        }).then(() => {
          let index = this.contentData.findIndex((o) => o.content.id === id);
          this.contentData[index].content.mustDoSwitch =
            mustDoSwitch === 0 ? 1 : 0;
          this.replaceContent(this.contentData);
          this.getCourseTagAttrData(this.courseId);
        });
      }
    },
    // 添加取消自阅
    changeReview() {
      const { id, selfReadOverSwitch } = this.courseSelectedItemData.content;
      setSelfReadOverSwitch({
        id: id,
        selfReadOverSwitch: selfReadOverSwitch === 0 ? 1 : 0,
      }).then(() => {
        let index = this.contentData.findIndex((o) => o.content.id === id);
        this.contentData[index].content.selfReadOverSwitch =
          selfReadOverSwitch === 0 ? 1 : 0;
        this.replaceContent(this.contentData);
        this.getCourseTagAttrData(this.courseId);
      });
    },
    // 添加取消讨论区
    changeDiscussionArea() {
      if (this.contentType === 0) {
        const { id, textTalkingSwitch } = this.courseSelectedItemData.content;
        setTextTalking({
          id: id,
          textTalkingSwitch: textTalkingSwitch === 0 ? 1 : 0,
        }).then(() => {
          let index = this.contentData.findIndex((o) => o.content.id === id);
          this.contentData[index].content.textTalkingSwitch =
            textTalkingSwitch === 0 ? 1 : 0;
          this.replaceContent(this.contentData);
          this.getCourseTagAttrData(this.courseId);
        });
      } else if (this.contentType === 1) {
        const { id, attachmentTalkingSwitch } =
          this.courseSelectedItemData.content;
        setAttachmentTalkingSwitch({
          id: id,
          attachmentTalkingSwitch: attachmentTalkingSwitch === 0 ? 1 : 0,
        }).then(() => {
          let index = this.contentData.findIndex((o) => o.content.id === id);
          this.contentData[index].content.attachmentTalkingSwitch =
            attachmentTalkingSwitch === 0 ? 1 : 0;
          this.replaceContent(this.contentData);
          this.getCourseTagAttrData(this.courseId);
        });
      } else if (this.contentType === 2) {
        const { id, questionTalkingSwitch } =
          this.courseSelectedItemData.content;
        addQuestionTalkingSwitch({
          id: id,
          questionTalkingSwitch: questionTalkingSwitch === 0 ? 1 : 0,
        }).then(() => {
          let index = this.contentData.findIndex((o) => o.content.id === id);
          this.contentData[index].content.questionTalkingSwitch =
            questionTalkingSwitch === 0 ? 1 : 0;
          this.replaceContent(this.contentData);
          this.getCourseTagAttrData(this.courseId);
        });
      }
    },
  },
};
</script>

<style scoped lang="less"></style>
