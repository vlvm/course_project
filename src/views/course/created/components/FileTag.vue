<template>
  <TagBox name="文件属性">
    <div>文件大小：{{ attachmentSize || "暂无数据" }}</div>
    <div>文件页数：{{ attachmentPageCounts || "暂无数据" }}</div>
    <div>时长：{{ attachmentDuration || "暂无数据" }}</div>
    <div>创建者：{{ creatorName || "暂无数据" }}</div>
  </TagBox>
</template>

<script>
import { getFileArribute } from "@/request/course/created/course";
import { mapGetters, mapState } from "vuex";
export default {
  name: "FileTag",
  data() {
    return {
      // 文件时长
      attachmentDuration: "",
      // 创建者名称
      creatorName: "",
      // 文件大小
      attachmentSize: "",
      // 文件页数
      attachmentPageCounts: "",
    };
  },
  computed: {
    ...mapState({
      role: (state) => state.role,
      courseId: (state) => state.c.courseId,
    }),
    ...mapGetters("c", ["courseSelectedItemData"]),
  },
  mounted() {
    let { id } = this.courseSelectedItemData.content;
    getFileArribute(this.courseId, id).then((res) => {
      this.attachmentDuration = res.extra.attachmentDuration;
      this.creatorName = res.extra.creatorName;
      this.attachmentSize = res.extra.attachmentSize;
      this.attachmentPageCounts = res.extra.attachmentPageCounts;
    });
  },
};
</script>

<style scoped lang="less"></style>
