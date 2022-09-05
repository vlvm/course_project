<template>
  <TagBox name="试卷讲评">
    <a-space direction="vertical" :size="10" style="width: 100%">
      <a-button
        :type="openAnswer ? 'warning' : 'primary'"
        block
        :disabled="studentId !== ''"
        @click="setExamSwitch(0, openAnswer ? 0 : 1)"
      >
        {{ openAnswer ? "取消公布答案" : "公布答案" }}
      </a-button>
      <a-button
        :type="openScore ? 'warning' : 'primary'"
        block
        :disabled="studentId !== ''"
        @click="setExamSwitch(1, openScore ? 0 : 1)"
      >
        {{ openScore ? "取消公布成绩" : "公布成绩" }}
      </a-button>
      <a-button
        :type="openCommenting ? 'warning' : 'primary'"
        block
        :disabled="studentId !== ''"
        @click="setExamSwitch(2, openCommenting ? 0 : 1)"
      >
        {{ openCommenting ? "取消发布讲评" : "发布讲评" }}
      </a-button>
    </a-space>
  </TagBox>
</template>

<script>
import { getPaperList, setPaperExamSwitch } from "@/request/exam/examResult";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Publish",
  props: ["paperId", "paperData", "studentId"],
  computed: {
    openCommenting() {
      return this.paperData.openCommenting !== 0;
    },
    openAnswer() {
      return this.paperData.openAnswer !== 0;
    },
    openScore() {
      return this.paperData.openScore !== 0;
    },
  },
  methods: {
    setExamSwitch(type, sw) {
      setPaperExamSwitch(this.paperId, type, sw).then((res) => {
        console.log(res);
        if (res.extra) {
          getPaperList({
            catalogId: this.$route.query.catalogId,
            type: 2,
          }).then((res) => {
            this.$emit("changePaperList", res.extra);
          });
        }
      });
    },
  },
};
</script>

<style scoped></style>
