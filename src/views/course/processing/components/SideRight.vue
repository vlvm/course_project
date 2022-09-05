<template>
  <div class="right">
    <div
      style="
        height: calc(100vh - 20px);
        background: #e1e5f2;
        border-radius: 8px;
      "
      v-if="courseList.length === 0"
    ></div>
    <template v-else>
      <!--课程修改-->
      <CourseChangeTag
        :courseId="courseId"
        :stuId="stuId"
        :courseData="courseSelectedData"
        @getData="$emit('getCourseContentData')"
      ></CourseChangeTag>
      <template v-if="stuId === 0">
        <div class="rightBox">
          <!--过程数据-->
          <CourseTimeUse
            :courseId="courseId"
            v-if="courseContentId === ''"
          ></CourseTimeUse>
          <!--课程标签-->
          <CourseContentTag
            :courseId="courseId"
            :contentType="contentType"
            :courseContentId="courseContentId"
            :courseSelectedItemData="courseSelectedItemData"
          ></CourseContentTag>
          <CourseDiscussionArea v-if="courseContentId === ''">
          </CourseDiscussionArea>
          <template v-else>
            <TextTag
              v-if="contentType === 0"
              :courseSelectedItemData="courseSelectedItemData"
              :contentData="contentData"
              :courseContentId="courseContentId"
            ></TextTag>
            <FileTag
              :courseId="courseId"
              :courseContentId="courseContentId"
              v-if="contentType === 1"
            ></FileTag>
            <QuestionTag
              :courseId="courseId"
              :courseContentId="courseContentId"
              v-if="contentType === 2"
            >
            </QuestionTag>
            <!--学习要求-->
            <TagBox name="学习要求">
              <a-space direction="vertical" :size="10" style="width: 100%">
                <template v-if="contentType === 0">
                  <a-button
                    :type="pointSwitch ? 'danger' : 'primary'"
                    block
                    disabled
                    @click="changeImport"
                  >
                    {{ pointSwitch ? `取消重点` : `添加为重点` }}
                  </a-button>
                  <a-button
                    :type="!textTalkingSwitch ? 'primary' : 'danger'"
                    block
                    disabled
                    @click="changeDiscussionArea"
                  >
                    {{ !textTalkingSwitch ? "添加讨论区" : "取消讨论区" }}
                  </a-button>
                </template>
                <template v-if="contentType === 1">
                  <a-button
                    block
                    :type="mustHandleSwitch ? 'danger' : 'primary'"
                    disabled
                    @click="changeImport"
                  >
                    {{ mustHandleSwitch ? `取消必办` : `添加为必办` }}
                  </a-button>
                  <a-button
                    block
                    :type="attachmentTalkingSwitch ? 'danger' : 'primary'"
                    disabled
                    @click="changeDiscussionArea"
                  >
                    {{ attachmentTalkingSwitch ? "取消讨论区" : "添加讨论区" }}
                  </a-button>
                </template>
                <template v-if="contentType === 2">
                  <a-button
                    :type="mustDoSwitch ? 'danger' : 'primary'"
                    block
                    disabled
                    @click="changeImport"
                  >
                    {{ mustDoSwitch ? `取消必做` : `添加为必做` }}
                  </a-button>
                  <a-button
                    block
                    :type="selfReadOverSwitch ? 'danger' : 'primary'"
                    disabled
                    @click="changeReview"
                    v-if="questionType"
                  >
                    {{ selfReadOverSwitch ? "取消自阅" : "添加为自阅" }}
                  </a-button>
                  <a-button
                    :type="questionTalkingSwitch ? 'danger' : 'primary'"
                    block
                    disabled
                    @click="changeDiscussionArea"
                  >
                    {{ questionTalkingSwitch ? "取消讨论区" : "添加讨论区" }}
                  </a-button>
                </template>
              </a-space>
            </TagBox>
            <!--<TagBox name="学习要求">
              <a-space direction="vertical" :size="10" style="width: 100%">
                <template v-if="contentType === 0">
                  <a-button
                    :type="pointSwitch ? 'danger' : 'primary'"
                    block
                    :disabled="isOtherTeacher"
                    @click="changeImport"
                  >
                    {{ pointSwitch ? `取消重点` : `添加为重点` }}
                  </a-button>
                  <a-button
                    :type="!textTalkingSwitch ? 'primary' : 'danger'"
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
                    :type="mustHandleSwitch ? 'danger' : 'primary'"
                    :disabled="isOtherTeacher"
                    @click="changeImport"
                  >
                    {{ mustHandleSwitch ? `取消必办` : `添加为必办` }}
                  </a-button>
                  <a-button
                    block
                    :type="attachmentTalkingSwitch ? 'danger' : 'primary'"
                    :disabled="isOtherTeacher"
                    @click="changeDiscussionArea"
                  >
                    {{ attachmentTalkingSwitch ? "取消讨论区" : "添加讨论区" }}
                  </a-button>
                </template>
                <template v-if="contentType === 2">
                  <a-button
                    :type="mustDoSwitch ? 'danger' : 'primary'"
                    block
                    :disabled="isOtherTeacher"
                    @click="changeImport"
                  >
                    {{ mustDoSwitch ? `取消必做` : `添加为必做` }}
                  </a-button>
                  <a-button
                    block
                    :type="selfReadOverSwitch ? 'danger' : 'primary'"
                    :disabled="isOtherTeacher"
                    @click="changeReview"
                    v-if="questionType"
                  >
                    {{ selfReadOverSwitch ? "取消自阅" : "添加为自阅" }}
                  </a-button>
                  <a-button
                    :type="questionTalkingSwitch ? 'danger' : 'primary'"
                    block
                    :disabled="isOtherTeacher"
                    @click="changeDiscussionArea"
                  >
                    {{ questionTalkingSwitch ? "取消讨论区" : "添加讨论区" }}
                  </a-button>
                </template>
              </a-space>
            </TagBox>-->
          </template>
        </div>
      </template>
      <CourseTimeStuUse
        v-else
        :courseId="courseId"
        :stuId="stuId"
      ></CourseTimeStuUse>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "SideRight",
  props: [
    "courseId",
    "courseList",
    "stuId",
    "courseSelectedData",
    "courseContentId",
    "contentData",
    "courseSelectedItemData",
  ],
  components: {
    CourseChangeTag: () => import("./CourseChangeTag"),
    CourseTimeUse: () => import("./CourseTimeUse"),
    CourseTimeStuUse: () => import("./CourseTimeStuUse"),
    TextTag: () => import("./TextTag"),
    FileTag: () => import("./FileTag"),
    QuestionTag: () => import("./QuestionTag"),
    CourseContentTag: () => import("./CourseContentTag"),
    CourseDiscussionArea: () => import("../../components/CourseDiscussionArea"),
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      isOtherTeacher: (state) => state.c.isOtherTeacher,
    }),
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
    // 添加取消重点
    changeImport() {},
    // 添加取消自阅
    changeReview() {},
    // 添加取消讨论区
    changeDiscussionArea() {},
  },
};
</script>

<style scoped lang="less">
.right {
  width: 240px;
  height: calc(100vh - 20px);
  min-height: 500px;
}
.rightBox {
  height: calc(100vh - 198px);
  overflow-y: auto;
  border-radius: 8px;
}
.rightBox::-webkit-scrollbar {
  width: 0;
}
</style>
