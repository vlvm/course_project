<template>
  <TagBox name="成绩" no-padding>
    <div>
      <div class="statisticsName">
        <div>总分 {{ scoringTotal }} 分</div>
        <div>平均分 {{ scoringAverage }} 分</div>
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
    </div>
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
  getPaperStuStatistics,
  getExamAnalysisTag,
} from "@/request/exam/examResult";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Score",
  props: ["paperId"],
  data() {
    return {
      scoringAverage: 0,
      scoringTotal: 0,
      students: [],
      course0: [],
      course1: [],
      course2: [],
    };
  },
  watch: {
    paperId(id) {
      getExamAnalysisTag({
        paperId: id,
        type: 0,
      }).then((res) => {
        this.course0 = res.extra;
      });
      getExamAnalysisTag({
        paperId: id,
        type: 1,
      }).then((res) => {
        this.course1 = res.extra;
      });
      getExamAnalysisTag({
        paperId: id,
        type: 2,
      }).then((res) => {
        this.course2 = res.extra;
      });
    },
  },
  mounted() {
    this.getPaperStuStatistics();
    getExamAnalysisTag({
      paperId: this.paperId,
      type: 0,
    }).then((res) => {
      this.course0 = res.extra;
    });
    getExamAnalysisTag({
      paperId: this.paperId,
      type: 1,
    }).then((res) => {
      this.course1 = res.extra;
    });
    getExamAnalysisTag({
      paperId: this.paperId,
      type: 2,
    }).then((res) => {
      this.course2 = res.extra;
    });
  },
  methods: {
    getPaperStuStatistics() {
      getPaperStuStatistics({ paperId: this.paperId }).then((res) => {
        console.log(res.extra);
        this.scoringAverage = res.extra.scoringAverage;
        this.scoringTotal = res.extra.scoringTotal;
        this.students = res.extra.students;
      });
    },
  },
};
</script>

<style scoped lang="less">
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
