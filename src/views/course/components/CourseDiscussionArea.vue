<template>
  <TagBox name="功能区" style="margin-bottom: 0">
    <a-space direction="vertical" :size="10" style="width: 100%">
      <a-button
        :type="
          courseSelectedData.courseTalkingSwitch !== 0 ? 'warning' : 'primary'
        "
        :disabled="$route.name === 'processing' || isOtherTeacher"
        block
        @click="
          changeCourseTalkingSwitch(courseSelectedData.courseTalkingSwitch)
        "
      >
        {{
          courseSelectedData.courseTalkingSwitch === 0
            ? "添加讨论区"
            : "取消讨论区"
        }}
      </a-button>
      <a-button
        :type="reviewSwitch ? 'warning' : 'primary'"
        :disabled="
          $route.name === 'processing' ||
          isOtherTeacher ||
          reviewQuesLength === 0
        "
        @click="setReview"
        block
      >
        {{ reviewSwitch ? "主观题全部取消自阅" : "主观题全部设为自阅" }}
      </a-button>
      <!--<a-button
          :type="
          courseSelectedData.courseTalkingSwitch === 0 ? 'primary' : 'warning'
        "
          block
          :disabled="isOtherTeacher"
          @click="
          changeCourseTalkingSwitch(courseSelectedData.courseTalkingSwitch)
        "
      >
        {{
          courseSelectedData.courseTalkingSwitch === 0
              ? "添加讨论区"
              : "取消讨论区"
        }}
      </a-button>-->
    </a-space>
  </TagBox>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import {
  setCourseTalkingSwitch,
  setQuesOverSwitch,
} from "@/request/course/created/course";

export default {
  name: "CourseDiscussionArea",
  computed: {
    ...mapState({
      isOtherTeacher: (state) => state.c.isOtherTeacher,
      courseId: (state) => state.c.courseId,
      courseList: (state) => state.c.courseList,
      contentData: (state) => state.c.contentData,
    }),
    ...mapGetters("c", ["courseSelectedData"]),
    reviewQuesLength() {
      return this.contentData.filter((o) =>
        [2, 3].includes(o.content.questionType)
      ).length;
    },
    reviewSwitch() {
      let len1 = this.contentData.filter((o) =>
        [2, 3].includes(o.content.questionType)
      ).length;
      let len2 = this.contentData.filter(
        (o) =>
          [2, 3].includes(o.content.questionType) &&
          o.content.selfReadOverSwitch === 1
      ).length;
      return len1 === len2 && len2 !== 0;
    },
  },
  methods: {
    ...mapMutations("c", ["replaceContentNoFilter"]),
    changeCourseTalkingSwitch() {
      const courseTalkingSwitch = this.courseSelectedData.courseTalkingSwitch;
      setCourseTalkingSwitch({
        id: this.courseId,
        courseTalkingSwitch: courseTalkingSwitch === 0 ? 1 : 0,
      }).then(() => {
        let index = this.courseList.findIndex((o) => o.id === this.courseId);
        this.courseList[index].courseTalkingSwitch =
          courseTalkingSwitch === 0 ? 1 : 0;
        this.$store.commit("c/setCourseList", this.courseList);
      });
    },
    setReview() {
      let ids = this.contentData
        .filter((o) => [2, 3].includes(o.content.questionType))
        .map((o) => {
          return o.content.id;
        });
      setQuesOverSwitch(ids, this.courseId, this.reviewSwitch ? 0 : 1).then(
        (res) => {
          if (res.extra) {
            if (this.reviewSwitch) {
              this.contentData
                .filter((o) => [2, 3].includes(o.content.questionType))
                .forEach((o) => {
                  o.content.selfReadOverSwitch = 0;
                });
            } else {
              this.contentData
                .filter((o) => [2, 3].includes(o.content.questionType))
                .forEach((o) => {
                  o.content.selfReadOverSwitch = 1;
                });
            }

            this.replaceContentNoFilter(this.contentData);
            this.$message.success(
              this.reviewSwitch
                ? "试题已全部设为自阅！"
                : "试题已全部取消自阅！"
            );
          }
        }
      );
    },
  },
};
</script>

<style scoped lang="less"></style>
