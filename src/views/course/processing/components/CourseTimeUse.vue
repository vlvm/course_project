<template>
  <TagBox name="过程数据">
    <h5>课程平均用时</h5>
    <h3>{{ courseAvgTime }}</h3>
    <ul>
      <li v-for="(o, i) in stuData" :key="i">
        {{ o.userName }}：课程用时：{{ o.stuUseTime }}
      </li>
    </ul>
  </TagBox>
</template>

<script>
import { getStuAnswerTime } from "@/request/course/processing";
export default {
  name: "CourseTimeUse",
  props: ["courseId"],
  data() {
    return {
      courseAvgTime: "暂无数据",
      stuData: [],
    };
  },
  mounted() {
    if (this.courseId) {
      getStuAnswerTime(this.courseId).then((res) => {
        this.stuData = res.extra;
        if (res.extra && res.extra.length > 0) {
          this.courseAvgTime = res.extra[0].courseAvgTime;
        } else {
          this.courseAvgTime = "暂无数据";
        }
      });
    }
  },
  watch: {
    courseId(courseId) {
      getStuAnswerTime(courseId).then((res) => {
        this.stuData = res.extra;
        if (res.extra && res.extra.length > 0) {
          this.courseAvgTime = res.extra[0].courseAvgTime;
        } else {
          this.courseAvgTime = "暂无数据";
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
h5 {
  font-size: 14px;
  text-align: center;
  margin-bottom: 0;
}
h3 {
  font-size: 16px;
  text-align: center;
  color: red;
}
ul {
  max-height: 260px;
  overflow-y: auto;
  text-align: center;
  margin-bottom: 0;
  li {
    font-size: 12px;
    color: #1e3779;
    background-color: #fff;
  }
  li:not(:last-child) {
    margin-bottom: 6px;
  }
}
</style>
