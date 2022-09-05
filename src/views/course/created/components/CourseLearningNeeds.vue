<template>
  <TagBox name="课程学习要求">
    <a-row>
      <a-col :span="24">
        <a-badge
          color="#a1acdb"
          status="processing"
          :text="`重点内容 ${courseTagAttr.pointCounts || 0} 段`"
        />
      </a-col>
      <a-col :span="24">
        <a-badge
          color="#a1acdb"
          status="processing"
          :text="`必做题 ${courseTagAttr.mustDoCounts || 0} 道`"
        />
      </a-col>
      <a-col :span="24">
        <a-badge
          color="#a1acdb"
          status="processing"
          :text="`必办项 ${courseTagAttr.mustHandleCounts || 0} 项`"
        />
      </a-col>
    </a-row>
  </TagBox>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "CreatedLearningNeeds",
  computed: {
    ...mapState({
      courseTagAttr: (state) => state.c.courseTagAttr,
    }),
  },
};
</script>

<style scoped lang="less">
::v-deep .ant-badge-status-text {
  color: #1e3779;
}
</style>
