<template>
  <TagBox name="过程数据">
    <div class="title">
      未打开文件 <span class="noOpenNum">{{ stuData.length }}</span> 人
    </div>
    <ul>
      <li v-for="i in stuData" :key="i">{{ i }}</li>
    </ul>
  </TagBox>
</template>

<script>
import { getNoOpenFileStu } from "@/request/course/processing";
export default {
  name: "FileTag",
  props: ["courseId", "courseContentId"],
  data() {
    return {
      stuData: [],
    };
  },
  mounted() {
    getNoOpenFileStu(this.courseId, this.courseContentId).then((res) => {
      this.stuData = res.extra;
    });
  },
};
</script>

<style scoped lang="less">
h5 {
  font-size: 14px;
  text-align: center;
}
.h3 {
  font-size: 16px;
  color: red;
}
ul {
  height: 100px;
  overflow-y: auto;
  text-align: center;
  margin-bottom: 0;
  li {
    font-size: 14px;
    color: #1e3779;
  }
  li:not(:last-child) {
    margin-bottom: 6px;
  }
}
.title {
  padding: 0 15px;
  margin-bottom: 8px;
  font-size: 14px;
  text-align: center;
  background-color: #fff;
  .openNum {
    font-size: 16px;
    font-weight: bold;
    text-decoration: underline;
  }
  .noOpenNum {
    font-size: 16px;
    font-weight: bold;
    color: red;
  }
}
</style>
