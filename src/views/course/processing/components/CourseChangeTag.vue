<template>
  <TagBox :name="stuId === 0 ? '课程修改' : '提交详情'">
    <div class="pubCourse">
      <template v-if="stuId === 0">
        <p>发布时间：{{ courseData.coursePublishTime }}</p>
        <p>
          回收时间：{{
            !courseData.courseRecycleTime
              ? "无回收时间"
              : courseData.courseRecycleTime
          }}
        </p>
        <a-space direction="vertical" :size="8" style="width: 100%">
          <a-button block size="small" @click="modal = true">修改时间</a-button>
          <a-button type="danger" block size="small" @click="repealCourse">
            强制撤销本次课程的发布
          </a-button>
        </a-space>
      </template>
      <template v-else>
        <p>提交时间：{{ courseEndTime }}</p>
        <p>补交时间：{{ courseResubmitTime }}</p>
      </template>
    </div>
    <a-modal
      v-model="modal"
      :maskClosable="false"
      title="修改时间"
      @ok="changeTime"
    >
      <div class="right">
        <a-space direction="vertical" :size="10" style="width: 100%">
          <div>
            <span>发布时间：</span>
            <a-date-picker
              v-model="startValue"
              :disabled-date="disabledStartDate"
              show-time
              :inputReadOnly="true"
              size="small"
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择发布时间"
              @openChange="handleStartOpenChange"
            />
          </div>
          <div>
            <span>回收时间：</span>
            <a-date-picker
              v-model="endValue"
              :disabled-date="disabledEndDate"
              show-time
              :inputReadOnly="true"
              size="small"
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择结束时间"
              :open="endOpen"
              @openChange="handleEndOpenChange"
            />
          </div>
        </a-space>
      </div>
    </a-modal>
  </TagBox>
</template>

<script>
import {
  changeCourseTime,
  getCourseList,
  repealCourse,
  stuAnswerTime,
} from "@/request/course/processing";
import moment from "moment";

export default {
  name: "CourseChangeTag",
  props: ["courseId", "stuId"],
  data() {
    return {
      courseData: {},
      modal: false,
      // 开始时间
      startValue: null,
      // 结束时间
      endValue: null,
      endOpen: false,
      courseEndTime: "暂未提交",
      courseResubmitTime: "暂未补交",
    };
  },
  watch: {
    "$route.query.catalogId": {
      immediate: true,
      handler(val) {
        if (val) {
          getCourseList({
            type: 1,
            catalogId: this.$route.query.catalogId,
          }).then((res) => {
            // eslint-disable-next-line vue/no-mutating-props
            this.courseData = res.extra.find((o) => o.id === this.courseId);
            this.startValue = this.courseData.coursePublishTime;
            this.endValue = this.courseData.courseRecycleTime;
          });
        }
      },
    },
    stuId(id) {
      if (id) {
        stuAnswerTime(this.courseId, id).then((res) => {
          console.log(res);
          this.courseEndTime =
            res.extra.courseEndTime === null
              ? "暂未提交"
              : res.extra.courseEndTime;
          this.courseResubmitTime =
            res.extra.courseResubmitTime === null
              ? "暂未提交"
              : res.extra.courseResubmitTime;
        });
      }
    },
  },
  methods: {
    repealCourse() {
      let _this = this;
      this.$confirm({
        title: "是否确定强制撤销本次课程?",
        okText: `确定`,
        // 点击蒙层是否允许关闭
        maskClosable: false,
        cancelText: "取消",
        onOk: () => {
          repealCourse(this.courseId).then((res) => {
            if (res.extra) {
              _this.$emit("getData");
            }
          });
        },
        onCancel: () => {
          console.log("Cancel");
        },
      });
    },
    changeTime() {
      changeCourseTime({
        coursePublishTime: moment(this.startValue).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        courseRecycleTime: moment(this.endValue).format("YYYY-MM-DD HH:mm:ss"),
        id: this.courseId,
        classId: this.courseData.classId,
      }).then((res) => {
        if (res.extra) {
          getCourseList({
            type: 1,
            catalogId: this.$route.query.catalogId,
          }).then((res) => {
            // eslint-disable-next-line vue/no-mutating-props
            this.courseData = res.extra.find((o) => o.id === this.courseId);
            this.startValue = this.courseData.coursePublishTime;
            this.endValue = this.courseData.courseRecycleTime;
            this.$message.success("修改成功！");
            this.modal = false;
          });
        }
      });
    },
    disabledStartDate(startValue) {
      const endValue = this.endValue;
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > endValue.valueOf();
    },
    disabledEndDate(endValue) {
      const startValue = this.startValue;
      if (!endValue || !startValue) {
        return false;
      }
      return startValue.valueOf() >= endValue.valueOf();
    },
    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true;
      }
    },
    handleEndOpenChange(open) {
      this.endOpen = open;
    },
  },
};
</script>

<style scoped lang="less">
p {
  padding: 0;
  margin: 0;
}
</style>
