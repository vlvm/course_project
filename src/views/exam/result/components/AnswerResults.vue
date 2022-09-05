<template>
  <div>
    <TagBox name="作答结果">
      <span v-if="stuData.length === 0">暂无数据</span>
      <template v-else>
        <dl v-for="(item, i) in stuData" :key="i">
          <dt
            :class="{
              wrong: item.answer === null,
              right: item.judgeTag === 1,
              partially: item.judgeTag === 2 && tableItem.questionType === 1,
            }"
          >
            {{
              item.answer
                ? item.answer
                : item.answer !== null
                ? `${item.studentScore}分`
                : "未作答的学生"
            }}: {{ item.studentCount }} 人
          </dt>
          <dd
            :class="{
              rightColor: item.judgeTag === 1,
            }"
            v-if="item.studentNames !== ''"
          >
            {{ item.studentNames }}
          </dd>
          <dd v-else>暂无学生</dd>
        </dl>
      </template>
      <!--    <dl>
        <dt style="background-color: #33cc99; color: #fff">B: 8 人</dt>
        <dd style="color: #33cc99">
          学生1,学生2,学生3,学生4,学生1,学生2,学生3,学生4,
        </dd>
      </dl>
      <dl>
        <dt>C: 8 人</dt>
        <dd>学生1,学生2,学生3,学生4,学生1,学生2,学生3,学生4,</dd>
      </dl>
      <dl>
        <dt>D: 8 人</dt>
        <dd>学生1,学生2,学生3,学生4,学生1,学生2,学生3,学生4,</dd>
      </dl>-->
    </TagBox>
    <TagBox name="历史数据">
      <div class="pubCourse">
        <a-progress
          type="circle"
          :width="180"
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
  </div>
</template>

<script>
import { getAnswerData } from "@/request/exam/examResult";

export default {
  name: "AnswerResults",
  props: ["paperId", "tableItem"],
  data() {
    return {
      courseStudents: [],
      scoringRateHistory: 0,
    };
  },
  computed: {
    stuData() {
      return this.courseStudents || [];
    },
  },
  watch: {
    tableItem(data) {
      if (data.id) {
        getAnswerData(this.paperId, data.id).then((res) => {
          console.log(res.extra);
          this.courseStudents = res.extra.courseStudents;
          this.scoringRateHistory = res.extra.scoringRateHistory;
        });
      }
    },
  },
  mounted() {
    if (this.tableItem.id) {
      getAnswerData(this.paperId, this.tableItem.id).then((res) => {
        console.log(res.extra);
        this.courseStudents = res.extra.courseStudents;
        this.scoringRateHistory = res.extra.scoringRateHistory;
      });
    }
  },
};
</script>

<style scoped lang="less">
dl {
  dt {
    padding: 0 10px;
    margin: 10px 0;
    background: #fff;
  }
  dd {
    word-wrap: break-word;
    word-break: normal;
  }
}
.right {
  color: #fff;
  background: #33cc99 !important;
}

.wrong {
  color: #fff;
  background: #ff5252 !important;
}

.partially {
  color: #fff;
  background: #ffb100 !important;
}
.rightColor {
  color: #33cc99 !important;
}
.wrongColor {
  color: #ff5252 !important;
}
.partiallyColor {
  color: #ffb100 !important;
}
.pubCourse {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 0;
}

.number {
  font-size: 50px;
}
.tips {
  margin-top: 10px;
  font-size: 16px;
}
</style>
