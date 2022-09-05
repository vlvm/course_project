<template>
  <TagBox name="课程用时">
    <h5>学习时长</h5>
    <h3>{{ courseAvgTime }}</h3>
    <ul>
      <li v-for="(o, i) in stuData" :key="i">
        <template v-if="o.contentType === 1">
          <div v-for="(item, j) in o.content" :key="j">
            文件{{ fileData[item.attachmentType] }}：
            {{ item.openTime === null ? "未打开" : item.openTime }}
          </div>
        </template>
        <template v-if="o.contentType === 2">
          <div v-for="(item, j) in o.content" :key="j">
            题号{{ item.questionNumber }}：{{
              item.studentSubmitTime === null
                ? "未作答"
                : item.studentSubmitTime
            }}
          </div>
        </template>
      </li>
    </ul>
  </TagBox>
</template>

<script>
import { getOneStuAnswerTime } from "@/request/course/processing";
export default {
  name: "CourseTimeStuUse",
  props: ["courseId", "stuId"],
  data() {
    return {
      courseAvgTime: "暂无数据",
      stuData: [],
      fileData: {
        0: "word",
        1: "ppt",
        2: "pdf",
        3: "音频",
        4: "视频",
      },
    };
  },
  mounted() {
    if (this.courseId) {
      getOneStuAnswerTime(this.courseId, this.stuId).then((res) => {
        this.stuData = res.extra;
        if (res.extra && res.extra.length > 0) {
          this.courseAvgTime = res.extra[0].courseAvgTime;
        } else {
          this.courseAvgTime = "暂无数据";
        }
      });
    }
  },
  watch: {
    stuId(stuId) {
      getOneStuAnswerTime(this.courseId, stuId).then((res) => {
        this.stuData = res.extra;
        if (res.extra && res.extra.length > 0) {
          this.courseAvgTime = res.extra[0].courseAvgTime;
        } else {
          this.courseAvgTime = "暂无数据";
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
h5 {
  font-size: 14px;
  text-align: center;
  margin-bottom: 0;
}
h3 {
  font-size: 16px;
  text-align: center;
  color: red;
}
ul {
  max-height: 260px;
  overflow-y: auto;
  text-align: center;
  margin-bottom: 0;
  li {
    font-size: 12px;
    text-align: left;
    color: #1e3779;
  }
  li div {
    padding: 0 10px;
    background-color: #fff;
  }
  li div:not(:last-child) {
    margin-bottom: 6px;
  }
  li:not(:last-child) {
    margin-bottom: 6px;
  }
}
</style>
