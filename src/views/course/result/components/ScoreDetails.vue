<template>
  <TagBox name="作答详情">
    <dl>
      <dt style="background-color: #ff6666; color: #fff">
        0分: {{ zeroScore.studentCount }} 人
      </dt>
      <dd style="color: #ff6666">
        <template v-if="zeroScore.studentNames === ''">暂无学生</template>
        <template v-else>
          <span v-for="o in zeroScore.students" :key="o.stuId">
            {{ o.stuName }};
          </span>
        </template>
        <!--{{
          zeroScore.studentNames === "" ? "暂无学生" : zeroScore.studentNames
        }}-->
      </dd>
    </dl>
    <dl>
      <dt style="background-color: #ffb100; color: #fff">
        低于得分率: {{ ltScore.studentCount }} 人
      </dt>
      <dd style="color: #ffb100">
        <template v-if="ltScore.studentNames === ''">暂无学生</template>
        <template v-else>
          <span v-for="o in ltScore.students" :key="o.stuId">
            {{ o.stuName }};
          </span>
        </template>
        <!--{{ ltScore.studentNames === "" ? "暂无学生" : ltScore.studentNames }}-->
      </dd>
    </dl>
    <dl>
      <dt>高于得分率: {{ gtScore.studentCount }} 人</dt>
      <dd>
        <template v-if="gtScore.studentNames === ''">暂无学生</template>
        <template v-else>
          <span v-for="o in gtScore.students" :key="o.stuId">
            {{ o.stuName }};
          </span>
        </template>
        <!--{{ gtScore.studentNames === "" ? "暂无学生" : gtScore.studentNames }}-->
      </dd>
    </dl>
    <dl>
      <dt>满分: {{ fullScore.studentCount }} 人</dt>
      <dd>
        <template v-if="fullScore.studentNames === ''">暂无学生</template>
        <template v-else>
          <span v-for="o in fullScore.students" :key="o.stuId">
            {{ o.stuName }};
          </span>
        </template>
        <!--{{
          fullScore.studentNames === "" ? "暂无学生" : fullScore.studentNames
        }}-->
      </dd>
    </dl>
  </TagBox>
</template>

<script>
export default {
  name: "AnswerResults",
  props: ["modelLabelData"],
  computed: {
    zeroScore() {
      return this.modelLabelData.zeroScore;
    },
    ltScore() {
      return this.modelLabelData.ltScore;
    },
    gtScore() {
      return this.modelLabelData.gtScore;
    },
    fullScore() {
      return this.modelLabelData.fullScore;
    },
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
</style>
