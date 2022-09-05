<template>
  <div class="right">
    <div
      style="
        height: calc(100vh - 20px);
        background: #e1e5f2;
        border-radius: 8px;
      "
      v-if="paperList.length === 0"
    ></div>
    <div style="height: calc(100vh - 20px); border-radius: 8px" v-else>
      <Publish
        :paperId="paperId"
        :paperData="paperData"
        :studentId="studentId"
        @changePaperList="changePaperList"
      ></Publish>
      <div class="content">
        <!--全班成绩显示-->
        <template v-if="studentId === ''">
          <template v-if="expandedRowIds.length === 0">
            <Score :paperId="paperId" v-if="spsId === ''"></Score>
            <ClassStatisticsClickData
              :paperId="paperId"
              :rowClickId="spsId"
              v-if="spsId !== ''"
            >
            </ClassStatisticsClickData>
          </template>
          <template v-else>
            <!--点击自定义统计点-->
            <template v-if="spsIds.includes(rowClickId)">
              <ClassStatisticsClickData
                :paperId="paperId"
                :rowClickId="rowClickId"
              >
              </ClassStatisticsClickData>
            </template>
            <!--点击非自定义统计点-->
            <template v-else>
              <AnswerResults :paperId="paperId" :tableItem="tableItem">
              </AnswerResults>
              <TagBox name="试题讲评" style="margin-bottom: 0">暂无数据</TagBox>
            </template>
          </template>
        </template>
        <!--某个学生成绩显示-->
        <template v-else>
          <template v-if="expandedRowIds.length === 0">
            <StudentScore
              :paperId="paperId"
              :studentId="studentId"
              :noRowClick="true"
            >
            </StudentScore>
          </template>
          <template v-else>
            <!--点击自定义统计点-->
            <template v-if="spsIds.includes(rowClickId)">
              <StudentScore
                :paperId="paperId"
                :studentId="studentId"
                :rowClickId="rowClickId"
              >
              </StudentScore>
            </template>
            <!--点击非自定义统计点-->
            <template v-else>
              <QuesAnswerResult
                v-if="[0, 1].includes(tableItem.questionType)"
                :paperId="paperId"
                :studentId="studentId"
                :tableItem="tableItem"
              >
              </QuesAnswerResult>
              <AnswerResults
                v-if="[2, 3].includes(tableItem.questionType)"
                :paperId="paperId"
                :tableItem="tableItem"
              >
              </AnswerResults>
              <TagBox name="试题讲评">暂无数据</TagBox>
            </template>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SideRight",
  props: [
    "paperId",
    "paperList",
    "paperData",
    "studentId",
    "rowClickId",
    "spsIds",
    "expandedRowIds",
    "tableItem",
    "spsId",
  ],
  components: {
    Publish: () => import("./Publish"),
    Score: () => import("./Score"),
    StudentScore: () => import("./StudentScore"),
    AnswerResults: () => import("./AnswerResults"),
    QuesAnswerResult: () => import("./QuesAnswerResult"),
    ClassStatisticsClickData: () => import("./ClassStatisticsClickData"),
  },
  computed: {
    questionType() {
      return this.tableItem.questionType || "";
    },
  },
  methods: {
    changePaperList(list) {
      this.$emit("update:paperList", list);
    },
  },
};
</script>

<style scoped lang="less">
.right {
  width: 240px;
  height: calc(100vh - 20px);
  min-height: 500px;
}

.content {
  height: calc(100vh - 202px);
  margin-top: 10px;
  overflow-y: auto;
  border-radius: 8px;
}
.content::-webkit-scrollbar {
  width: 0;
}
</style>
