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
} from "@/request/exam/examCreated";
export default {
  name: "QuestionTag",
  props: ["contentSelector"],
  data() {
    return {
      teacherName: "",
      score: "",
    };
  },
  mounted() {
    let { id, paperId } = this.contentSelector.content;
    getQuestionPeople(id).then((res) => {
      this.teacherName = res.extra;
    });
    getQuestionScoreRate(paperId, id).then((res) => {
      this.score = res.extra.scoringRate;
    });
  },
};
</script>

<style scoped lang="less"></style>
