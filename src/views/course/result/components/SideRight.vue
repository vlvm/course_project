<template>
  <div>
    <div
      class="right"
      style="
        height: calc(100vh - 20px);
        background: #e1e5f2;
        border-radius: 8px;
      "
      v-if="courseList.length === 0"
    ></div>
    <div class="right" v-else>
      <template v-if="module === 0">
        <RedoQuestion :module="module" :courseId="courseId"></RedoQuestion>
        <template
          v-if="
            selectRow.length === 0 && courseSelectedData.originCourseType !== 1
          "
        >
          <DataLabel :courseId="courseId"></DataLabel>
          <AvgScoreRite
            :courseId="courseId"
            title="课程平均得分率"
            v-if="module === 0"
          >
          </AvgScoreRite>
        </template>
        <template v-if="selectRow.length > 0">
          <AnswerResults
            :courseId="courseId"
            :questionId="questionId"
            :quesStatisticsData="quesStatisticsData"
          >
          </AnswerResults>
          <HistoryData :quesStatisticsData="quesStatisticsData"></HistoryData>
        </template>
      </template>
      <template v-if="module === 1">
        <RedoQuestion :module="module" :courseId="courseId"></RedoQuestion>
        <template v-if="selectRow.length === 0">
          <DataLabel
            :courseId="courseId"
            v-if="selectRow.length === 0"
          ></DataLabel>
          <AvgScoreRite
            :courseId="courseId"
            title="课程平均得分率"
          ></AvgScoreRite>
        </template>
        <template v-if="selectRow.length > 0">
          <QuesNumResult :personStatisticsAnswer="personStatisticsAnswer">
          </QuesNumResult>
          <PersionDataLabel
            :personStatisticsLabel="personStatisticsLabel"
            name="个人历史数据"
          >
          </PersionDataLabel>
        </template>
      </template>
      <template v-if="module === 2">
        <RedoQuestion :module="module" :courseId="courseId"></RedoQuestion>
        <template v-if="selectRow.length === 0">
          <DataLabel :courseId="courseId" v-if="selectRow.length === 0">
          </DataLabel>
          <AvgScoreRite :courseId="courseId" title="课程平均得分率">
          </AvgScoreRite>
        </template>
        <template v-if="selectRow.length > 0">
          <ScoreDetails :modelLabelData="modelLabelData"></ScoreDetails>
          <ClassAvgScoreRite
            title="班级历史平均得分率"
            :modelLabelData="modelLabelData"
          >
          </ClassAvgScoreRite>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "SideRight",
  props: [
    "courseId",
    "courseList",
    "courseSelectedData",
    "module",
    "questionId",
    "quesStatisticsData",
    "personStatisticsAnswer",
    "personStatisticsLabel",
    "modelLabelData",
  ],
  components: {
    RedoQuestion: () => import("./RedoQuestion"),
    AvgScoreRite: () => import("./AvgScoreRite"),
    DataLabel: () => import("./DataLabel"),
    PersionDataLabel: () => import("./PersionDataLabel"),
    AnswerResults: () => import("./AnswerResults"),
    ScoreDetails: () => import("./ScoreDetails"),
    HistoryData: () => import("./HistoryData"),
    QuesNumResult: () => import("./QuesNumResult"),
    ClassAvgScoreRite: () => import("./ClassAvgScoreRite"),
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      selectRow: (state) => state.r.selectRow,
    }),
  },
  methods: {},
};
</script>

<style scoped lang="less">
.right {
  width: 240px;
  height: calc(100vh - 20px);
  min-height: 500px;
  overflow-y: auto;
  border-radius: 8px;
}

.requirement {
  margin-bottom: 10px;
  background: #e1e5f2;
  border-radius: 8px;

  .content {
    padding: 10px;
    color: #1e3779;
    font-size: 12px;
    line-height: 26px;
  }
}
.tagBox:last-child {
  margin-bottom: 0;
}
</style>
