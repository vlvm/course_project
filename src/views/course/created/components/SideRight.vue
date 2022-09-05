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
      <!--发布课程-->
      <PublishCourses
        v-if="role === 1 && courseSelectedData.courseShareTag !== 1"
      >
      </PublishCourses>
      <div class="rightBox">
        <!--<ShareDetails
          :role="role"
          :courseId="courseId"
          :courseSelectedData="courseSelectedData"
          v-if="role === 2 && courseSelectedData.courseShareTag === 1"
        ></ShareDetails>
        <DownloadDetails
          v-if="role === 2 && courseSelectedData.courseDownloadTime !== null"
        ></DownloadDetails>-->
        <!--课程标签-->
        <CourseQuesTag v-if="courseId !== ''"></CourseQuesTag>
        <template v-if="courseContentId === ''">
          <!--课程内容-->
          <CreatedCourseContent></CreatedCourseContent>
          <!--课程学习要求-->
          <CourseLearningNeeds></CourseLearningNeeds>
          <!--课程讨论区与批量设为自阅-->
          <CourseDiscussionArea></CourseDiscussionArea>
        </template>
        <template v-else>
          <TextTag v-if="courseSelectedItemData.contentType === 0"></TextTag>
          <FileTag v-if="courseSelectedItemData.contentType === 1"></FileTag>
          <QuestionTag
            v-if="courseSelectedItemData.contentType === 2"
          ></QuestionTag>
          <Requirement style="margin-bottom: 0"></Requirement>
        </template>
      </div>
    </template>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from "vuex";
export default {
  name: "SideRight",
  components: {
    PublishCourses: () => import("./PublishCourses"),
    // DownloadDetails: () => import("./DownloadDetails"),
    // ShareDetails: () => import("./ShareDetails"),
    CourseQuesTag: () => import("../../components/CourseQuesTag"),
    TextTag: () => import("../../components/TextTag"),
    FileTag: () => import("./FileTag"),
    QuestionTag: () => import("./QuestionTag"),
    CreatedCourseContent: () => import("./CreatedCourseContent"),
    CourseLearningNeeds: () => import("./CourseLearningNeeds"),
    CourseDiscussionArea: () => import("../../components/CourseDiscussionArea"),
    Requirement: () => import("./Requirement"),
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      role: (state) => state.role,
      isOtherTeacher: (state) => state.c.isOtherTeacher,
      courseList: (state) => state.c.courseList,
      courseId: (state) => state.c.courseId,
      courseContentId: (state) => state.c.courseContentId,
      contentData: (state) => state.c.contentData,
    }),
    ...mapGetters("c", ["courseSelectedItemData", "courseSelectedData"]),
  },
  methods: {
    ...mapMutations("c", ["replaceContent"]),
  },
};
</script>

<style scoped lang="less">
.right {
  width: 240px;
  height: calc(100vh - 20px);
  min-height: 500px;

  .rightBox {
    height: calc(100vh - 120px);
    overflow-y: auto;
    border-radius: 8px;
  }

  .rightBox::-webkit-scrollbar {
    width: 0;
  }
}
</style>
