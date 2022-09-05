<template>
  <TagBox name="过程数据">
    <template v-if="isOverRecoveryTime">
      <h3>未作答（{{ stuData.length }}人）</h3>
      <ul>
        <li v-for="o in stuData" :key="o.stuId">{{ o.stuName }}</li>
      </ul>
    </template>
    <div v-else>暂无数据</div>
  </TagBox>
</template>

<script>
import { getQuesNoSubmitStu } from "@/request/exam/expamProcessing";
export default {
  name: "QuestionTag",
  props: ["paperId", "contentId", "isOverRecoveryTime"],
  data() {
    return {
      stuData: [],
    };
  },
  mounted() {
    if (this.contentId) {
      getQuesNoSubmitStu(this.paperId, this.contentId).then((res) => {
        this.stuData = res.extra;
      });
    }
  },
  watch: {
    contentId(contentId) {
      getQuesNoSubmitStu(this.paperId, contentId).then((res) => {
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
