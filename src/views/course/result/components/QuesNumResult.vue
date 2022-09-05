<template>
  <TagBox name="作答结果">
    <a-tag
      v-for="item in personStatisticsAnswer"
      :key="item.id"
      :color="
        item.judgeTag === 1
          ? '#33CC99'
          : item.judgeTag === 2
          ? '#ffb100'
          : item.judgeTag === -1
          ? '#636f9f'
          : '#ff6666'
      "
    >
      {{ item.questionNumber }}
    </a-tag>
  </TagBox>
</template>

<script>
export default {
  name: "AnswerResults",
  props: ["personStatisticsAnswer"],
};
</script>

<style scoped lang="less"></style>
