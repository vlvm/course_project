<template>
  <TagBox :name="title">
    <div class="pubCourse">
      <a-progress
        type="circle"
        :width="200"
        :percent="scoringRateAverage"
        strokeColor="#33CC99"
      >
        <template #format="percent">
          <div class="number">{{ percent }}%</div>
          <div class="tips">{{ name }}</div>
        </template>
      </a-progress>
    </div>
  </TagBox>
</template>

<script>
import { getCourseStatistics } from "@/request/course/courseResult";
export default {
  name: "AvgScoreRite",
  props: ["title", "name", "courseId"],
  data() {
    return {
      scoringRateAverage: 0,
    };
  },
  mounted() {
    getCourseStatistics(this.courseId).then((res) => {
      if (res.extra) {
        this.scoringRateAverage = parseInt(res.extra.scoringRateAverage);
      }
    });
  },
  watch: {
    courseId(id) {
      getCourseStatistics(id).then((res) => {
        if (res.extra) {
          this.scoringRateAverage = parseInt(res.extra.scoringRateAverage);
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.pubCourse {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 40px 0;
}

.number {
  font-size: 50px;
}
.tips {
  margin-top: 10px;
  font-size: 16px;
}
</style>
