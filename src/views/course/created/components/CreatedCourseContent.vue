<template>
  <TagBox name="课程内容">
    <a-row style="height: 100px; overflow-y: auto">
      <a-col :span="24">
        <a-badge
          color="#a1acdb"
          status="processing"
          :text="`文字共 ${courseTagAttr.textCounts || 0} 段`"
        />
      </a-col>
      <a-col :span="24">
        <a-badge
          color="#a1acdb"
          status="processing"
          :text="`Word文件 ${courseTagAttr.docCounts || 0} 个`"
        />
      </a-col>
      <a-col :span="24">
        <a-badge
          color="#a1acdb"
          status="processing"
          :text="`PPT文件 ${courseTagAttr.pptCounts || 0} 个`"
        />
      </a-col>
      <a-col :span="24">
        <a-badge
          color="#a1acdb"
          status="processing"
          :text="`PDF文件 ${courseTagAttr.pdfCounts || 0} 个`"
        />
      </a-col>
      <a-col :span="24">
        <a-badge
          color="#a1acdb"
          status="processing"
          :text="`音频文件 ${courseTagAttr.soundsCounts} 个`"
        />
      </a-col>
      <a-col :span="24">
        <a-badge
          color="#a1acdb"
          status="processing"
          :text="`视频文件 ${courseTagAttr.videoCounts} 个`"
        />
      </a-col>
      <a-col :span="24">
        <a-badge
          color="#a1acdb"
          status="processing"
          :text="`单选题 ${courseTagAttr.singleQuestionCounts} 道`"
        />
      </a-col>
      <a-col :span="24">
        <a-badge
          color="#a1acdb"
          status="processing"
          :text="`不定项 ${courseTagAttr.multiSelectCounts} 道`"
        />
      </a-col>
      <a-col :span="24">
        <a-badge
          color="#a1acdb"
          status="processing"
          :text="`填空 ${courseTagAttr.fillingCounts} 道`"
        />
      </a-col>
      <a-col :span="24">
        <a-badge
          color="#a1acdb"
          status="processing"
          :text="`简答题 ${courseTagAttr.subjectivityQuestionCounts} 道`"
        />
      </a-col>
    </a-row>
  </TagBox>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "CreatedCourseContent",
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
