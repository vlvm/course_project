<template>
  <div>
    <TagBox name="使用数据">
      <div>正答率（得分率）：{{ score || 0 }}%</div>
    </TagBox>
    <TagBox name="修改权限">
      <div>修改权限：{{ teacherName }}</div>
    </TagBox>
  </div>
</template>

<script>
import {
  getQuestionPeople,
  getQuestionScoreRate,
} from "@/request/course/created/course";
import { mapGetters } from "vuex";
export default {
  name: "QuestionTag",
  data() {
    return {
      teacherName: "",
      score: "",
    };
  },
  computed: {
    ...mapGetters("c", ["courseSelectedItemData"]),
  },
  mounted() {
    let { id, courseId } = this.courseSelectedItemData.content;
    getQuestionPeople(id).then((res) => {
      this.teacherName = res.extra;
    });
    getQuestionScoreRate(courseId, id).then((res) => {
      this.score = res.extra.scoringRate;
    });
  },
};
</script>

<style scoped lang="less"></style>
