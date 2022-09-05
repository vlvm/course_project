<template>
  <TagBox name="班级成绩" v-if="[0, 1].includes(tableItem.questionType)">
    <a-space direction="vertical" :size="10" style="width: 100%; padding: 10px">
      <div class="scoreRate">正确： {{ stuData[1] || 0 }} 人</div>
      <div class="scoreRate" v-if="tableItem.questionType === 1">
        半对： {{ stuData[2] || 0 }} 人
      </div>
      <div class="scoreRate">错误： {{ stuData[0] || 0 }} 人</div>
    </a-space>
  </TagBox>
</template>

<script>
import { getQuesAnswerResult } from "@/request/exam/examResult";
export default {
  name: "QuesAnswerResult",
  props: ["paperId", "studentId", "tableItem"],
  data() {
    return {
      stuData: [],
    };
  },
  watch: {
    tableItem(data) {
      getQuesAnswerResult({
        paperId: this.paperId,
        studentId: this.studentId,
        questionId: data.id,
      }).then((res) => {
        this.stuData = res.extra;
      });
    },
  },
  mounted() {
    this.getQuesAnswerResult();
  },
  methods: {
    getQuesAnswerResult() {
      getQuesAnswerResult({
        paperId: this.paperId,
        studentId: this.studentId,
        questionId: this.tableItem.id,
      }).then((res) => {
        this.stuData = res.extra;
      });
    },
  },
};
</script>

<style scoped></style>
