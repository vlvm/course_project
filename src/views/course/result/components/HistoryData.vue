<template>
  <TagBox name="历史数据">
    <div class="pubCourse">
      <a-progress
        type="circle"
        :width="200"
        :percent="parseInt(scoringRateHistory)"
        strokeColor="#33CC99"
      >
        <template #format="percent">
          <div class="number">{{ percent }}%</div>
          <div class="tips">得分率</div>
        </template>
      </a-progress>
    </div>
  </TagBox>
</template>

<script>
export default {
  name: "AvgScoreRite",
  props: ["quesStatisticsData"],
  computed: {
    scoringRateHistory() {
      return this.quesStatisticsData.scoringRateHistory;
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
