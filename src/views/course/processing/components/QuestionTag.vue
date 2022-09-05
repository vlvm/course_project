<template>
  <TagBox name="过程数据">
    <h3>未作答（{{ stuData.length }}人）</h3>
    <ul>
      <li v-for="o in stuData" :key="o.stuId">{{ o.stuName }}</li>
    </ul>
  </TagBox>
</template>

<script>
import { getQuesNoSubmitStu } from "@/request/course/processing";
export default {
  name: "QuestionTag",
  props: ["courseId", "courseContentId"],
  data() {
    return {
      stuData: [],
    };
  },
  mounted() {
    if (this.courseContentId) {
      getQuesNoSubmitStu(this.courseId, this.courseContentId).then((res) => {
        this.stuData = res.extra;
      });
    }
  },
  watch: {
    courseContentId(courseContentId) {
      getQuesNoSubmitStu(this.courseId, courseContentId).then((res) => {
        this.stuData = res.extra;
      });
    },
  },
};
</script>

<style scoped lang="less">
h3 {
  font-size: 16px;
  text-align: center;
  color: red;
  margin-bottom: 0;
}

ul {
  max-height: 100px;
  overflow-y: auto;
  text-align: center;
  margin-bottom: 0;

  li {
    font-size: 14px;
    color: #1e3779;
  }
  li:not(:last-child) {
    margin-bottom: 5px;
  }
}
</style>
