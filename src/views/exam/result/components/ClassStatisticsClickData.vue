<template>
  <TagBox name="成绩" no-padding>
    <div class="statisticsName">
      <div>总分 {{ scoringTotal }} 分</div>
    </div>
    <div class="contentBox">
      <a-row
        type="flex"
        justify="space-around"
        style="text-align: center"
        v-for="o in students"
        :key="o.id"
      >
        <a-col :span="8">{{ o.userName }}</a-col>
        <a-col :span="4"></a-col>
        <a-col :span="8">{{ o.scoring }} 分</a-col>
      </a-row>
    </div>
  </TagBox>
</template>

<script>
import { getPaperStuStatistics } from "@/request/exam/examResult";
export default {
  name: "ClassStatisticsClickData",
  props: ["paperId", "rowClickId"],
  data() {
    return {
      scoringAverage: 0,
      scoringTotal: 0,
      students: [],
    };
  },
  watch: {
    rowClickId(id) {
      this.getPaperStuStatistics(id);
    },
  },
  mounted() {
    this.getPaperStuStatistics(this.rowClickId);
  },
  methods: {
    getPaperStuStatistics(id) {
      getPaperStuStatistics({
        paperId: this.paperId,
        pointId: id,
      }).then((res) => {
        this.scoringTotal = res.extra.scoringTotal;
        this.students = res.extra.students;
      });
    },
  },
};
</script>

<style scoped>
.statisticsName {
  text-align: center;
  padding: 3px 5px;
  background: #c7d0f2;
  font-size: 14px;
  color: #1e3779;
}
.contentBox {
  min-height: 200px;
  max-height: 300px;
  overflow-y: auto;
}
</style>
