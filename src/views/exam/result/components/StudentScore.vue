<template>
  <TagBox name="个人成绩" no-padding>
    <a-space direction="vertical" :size="10" style="width: 100%; padding: 10px">
      <div v-if="noRowClick" class="scoreRate">
        总分： {{ scoreData.score }} 分
      </div>
      <template v-else>
        <div class="scoreRate">满分： {{ scoreData.totalScore }} 分</div>
        <div class="scoreRate">个人得分率： {{ scoreData.scoringRate }}</div>
        <div class="scoreRate">
          班级平均分： {{ scoreData.classAverageScore }} 分
        </div>
      </template>
    </a-space>
    <div>
      <div class="statisticsName">
        <div>素养</div>
        <div></div>
      </div>
      <div class="contentBox" style="max-height: 140px">
        <a-row
          type="flex"
          justify="space-between"
          v-for="(item, i) in course0"
          :key="i"
        >
          <a-col :span="20" class="tag" style="padding-left: 10px">
            <a-popover :title="`素养${item.libNumber}`" placement="left">
              <template slot="content">
                <div style="width: 300px">
                  {{ item.libNumber }}{{ item.libName }}
                </div>
              </template>
              <span>{{ item.libNumber }}{{ item.libName }} </span>
            </a-popover>
          </a-col>
          <a-col :span="4">{{ item.scoringRate }}</a-col>
        </a-row>
      </div>
      <div v-if="course0.length === 0" style="padding: 10px">暂无数据</div>
    </div>
    <div>
      <div class="statisticsName">
        <div>能力</div>
        <div></div>
      </div>
      <div class="contentBox" style="max-height: 140px">
        <a-row
          type="flex"
          justify="space-between"
          v-for="(item, i) in course1"
          :key="i"
        >
          <a-col :span="20" class="tag" style="padding-left: 10px">
            <a-popover :title="`能力${item.libNumber}`" placement="left">
              <template slot="content">
                <div style="width: 300px">
                  {{ item.libNumber }}{{ item.libName }}
                </div>
              </template>
              <span>{{ item.libNumber }}{{ item.libName }} </span>
            </a-popover>
          </a-col>
          <a-col :span="4">{{ item.scoringRate }}</a-col>
        </a-row>
      </div>
      <div v-if="course1.length === 0" style="padding: 10px">暂无数据</div>
    </div>
    <div>
      <div class="statisticsName">
        <div>知识点</div>
        <div></div>
      </div>
      <div class="contentBox" style="max-height: 140px">
        <a-row
          type="flex"
          justify="space-between"
          v-for="(item, i) in course2"
          :key="i"
        >
          <a-col :span="20" class="tag" style="padding-left: 10px">
            <a-popover :title="`知识点${item.libNumber}`" placement="left">
              <template slot="content">
                <div style="width: 300px">
                  {{ item.libNumber }}{{ item.libName }}
                </div>
              </template>
              <span>{{ item.libNumber }}{{ item.libName }} </span>
            </a-popover>
          </a-col>
          <a-col :span="4">{{ item.scoringRate }}</a-col>
        </a-row>
      </div>
      <div v-if="course2.length === 0" style="padding: 10px">暂无数据</div>
    </div>
  </TagBox>
</template>

<script>
import {
  getStuStatistics,
  getExamAnalysisTag,
} from "@/request/exam/examResult";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "StudentScore",
  props: ["paperId", "studentId", "noRowClick", "rowClickId"],
  data() {
    return {
      scoreData: {
        score: 0,
        totalScore: 0,
        classAverageScore: 0,
      },
      course0: [],
      course1: [],
      course2: [],
    };
  },
  watch: {
    studentId(id) {
      if (id !== "") {
        this.getData();
      }
    },
    rowClickId(id) {
      console.log(id);
      this.getData();
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      getStuStatistics({
        paperId: this.paperId,
        studentId: this.studentId,
        pointId: this.rowClickId,
      }).then((res) => {
        this.scoreData = res.extra;
      });
      getExamAnalysisTag({
        studentId: this.studentId,
        paperId: this.paperId,
        type: 0,
      }).then((res) => {
        this.course0 = res.extra;
      });
      getExamAnalysisTag({
        studentId: this.studentId,
        paperId: this.paperId,
        type: 1,
      }).then((res) => {
        this.course1 = res.extra;
      });
      getExamAnalysisTag({
        studentId: this.studentId,
        paperId: this.paperId,
        type: 2,
      }).then((res) => {
        this.course2 = res.extra;
      });
    },
  },
};
</script>

<style scoped lang="less">
.scoreRate {
  //background: #c7d0f2;
  font-size: 13px;
  color: #1e3779;
  text-align: center;
}
.statisticsName {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 3px 5px;
  background: #c7d0f2;
  font-size: 14px;
  color: #1e3779;
}
.contentBox {
  max-height: 180px;
  overflow-y: auto;
}
.tag {
  width: 150px !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}
</style>
