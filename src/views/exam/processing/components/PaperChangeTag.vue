<template>
  <TagBox :name="stuId === 0 ? '考试修改' : '提交详情'">
    <div>
      <template v-if="stuId === 0">
        <p>
          发布时间：{{
            moment(paperData.paperPublishTime).format("YYYY-MM-DD HH:mm:ss")
          }}
        </p>
        <p>
          回收时间：{{
            !paperData.paperRecycleTime
              ? "无回收时间"
              : moment(paperData.paperRecycleTime).format("YYYY-MM-DD HH:mm:ss")
          }}
        </p>
        <a-space direction="vertical" :size="8" style="width: 100%">
          <a-row>
            <a-col :span="11">
              <a-button
                block
                size="small"
                :disabled="isOverRecoveryTime || overRecoveryTime"
                @click="openChangeTime"
              >
                修改时间
              </a-button>
            </a-col>
            <a-col :span="2"></a-col>
            <a-col :span="11">
              <a-button
                block
                size="small"
                type="warning"
                :disabled="!isOverRecoveryTime"
                @click="getStus"
              >
                补交
              </a-button>
            </a-col>
          </a-row>
          <a-button
            type="danger"
            block
            size="small"
            :disabled="isOverRecoveryTime || overRecoveryTime"
            @click="repealPaper"
          >
            强制撤销本次考试的发布
          </a-button>
        </a-space>
      </template>
      <template v-else>
        <p>提交时间：{{ paperEndTime }}</p>
        <p style="color: #ff9933">补交时间：{{ paperResubmitTime }}</p>
      </template>
    </div>
    <!--修改时间-->
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
              :showTime="{
                format: 'HH:mm',
                defaultValue: moment('00:00', 'HH:mm'),
              }"
              :showToday="false"
              :inputReadOnly="true"
              size="small"
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择发布时间"
              :disabled="startTimeDisabled"
            />
          </div>
          <div>
            <span>回收时间：</span>
            <a-date-picker
              v-model="endValue"
              :disabled-date="disabledEndDate"
              :showTime="{
                minuteStep: 5,
                format: 'HH:mm',
                defaultValue: moment('00:00', 'HH:mm'),
              }"
              :inputReadOnly="true"
              :showToday="false"
              size="small"
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择结束时间"
            />
          </div>
        </a-space>
      </div>
    </a-modal>
    <!--设置补交-->
    <a-modal
      v-model="makeUpTime"
      :maskClosable="false"
      title="设置补交截止时间"
      :width="500"
      @ok="setTime"
    >
      <div class="right">
        <a-space direction="vertical" :size="10" style="width: 100%">
          <div>
            <span>补交截止时间：</span>
            <a-date-picker
              v-model="paperSettingResubmitTime"
              :disabled-date="disabledDate"
              :showTime="{
                minuteStep: 5,
                format: 'HH:mm',
                defaultValue: moment('00:00', 'HH:mm'),
              }"
              :inputReadOnly="true"
              size="small"
              :showToday="false"
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择补交截止时间"
              style="margin-bottom: 20px"
            >
            </a-date-picker>
          </div>
          <a-checkbox
            :indeterminate="indeterminate"
            :checked="checkAll"
            @change="onCheckAllChange"
          >
            全选
          </a-checkbox>
          <a-divider style="margin: 3px 0" />
          <div style="max-height: 300px; overflow-y: auto">
            <a-checkbox-group
              v-model="checkedList"
              @change="onChange"
              style="width: 100%"
            >
              <a-row>
                <a-col :span="24">
                  <a-checkbox
                    v-for="item in stuList"
                    :key="item.stuId"
                    :value="item.stuId"
                  >
                    {{ item.stuName }}
                    {{
                      `，补交截止时间：${
                        item.paperSettingResubmitTime
                          ? item.paperSettingResubmitTime
                          : "--:--:--"
                      }`
                    }}
                  </a-checkbox>
                </a-col>
              </a-row>
            </a-checkbox-group>
          </div>
        </a-space>
      </div>
    </a-modal>
  </TagBox>
</template>

<script>
import {
  stuAnswerTime,
  changePaperTime,
  getPaperList,
  repealPaper,
  getResubmitStus,
  setMakeUpTime,
} from "@/request/exam/expamProcessing";
import moment from "moment";

export default {
  name: "paperChangeTag",
  props: ["paperId", "stuId", "paperData"],
  data() {
    return {
      moment,
      modal: false,
      makeUpTime: false,
      // 开始时间
      startValue: null,
      // 结束时间
      endValue: null,
      paperEndTime: "暂未提交",
      paperResubmitTime: "暂未补交",
      // 补交时间
      paperSettingResubmitTime: null,
      stuList: [],
      checkedList: [],
      checkAll: false,
      startTimeDisabled: false,
      // 是否能修改时间
      overRecoveryTime: false,
      isOverRecoveryTime: true,
    };
  },
  watch: {
    stuId(id) {
      if (id) {
        stuAnswerTime(this.paperId, id).then((res) => {
          console.log(res);
          this.paperEndTime =
            res.extra.paperEndTime === null
              ? "暂未提交"
              : res.extra.paperEndTime;
          this.paperResubmitTime =
            res.extra.paperResubmitTime === null
              ? "暂未补交"
              : res.extra.paperResubmitTime;
        });
      }
    },
  },
  computed: {
    indeterminate() {
      return (
        this.checkedList.length !== 0 &&
        this.checkedList.length < this.stuList.length
      );
    },
  },
  mounted() {
    const timer = setInterval(() => {
      if (this.paperData.paperRecycleTime) {
        this.isOverRecoveryTime =
          new Date().getTime() >
          new Date(this.paperData.paperRecycleTime).getTime();
      } else {
        this.isOverRecoveryTime = false;
      }
    }, 500);
    // 通过$once来监听定时器，在beforeDestroy钩子可以被清除。
    this.$once("hook:beforeDestroy", () => {
      clearInterval(timer);
    });
  },
  methods: {
    openChangeTime() {
      this.startTimeDisabled =
        new Date().getTime() >
        new Date(this.paperData.paperPublishTime).getTime();
      if (
        new Date().getTime() >
        new Date(this.paperData.paperRecycleTime).getTime()
      ) {
        this.$message.error("修改发布时间必须晚于当前设置的发布时间！");
        this.overRecoveryTime = true;
        return;
      }
      this.startValue = moment(this.paperData.paperPublishTime).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      this.endValue = moment(this.paperData.paperRecycleTime).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      this.modal = true;
    },
    repealPaper() {
      let _this = this;
      this.$confirm({
        title: "是否确定强制撤销本次考试?",
        okText: `确定`,
        // 点击蒙层是否允许关闭
        maskClosable: false,
        cancelText: "取消",
        onOk: () => {
          repealPaper(this.paperId).then((res) => {
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
      if (!this.disabledStartDate) {
        if (new Date(this.startValue).getTime() < new Date().getTime()) {
          this.$message.error("修改发布时间必须晚于当下时间！");
          return;
        }

        if (
          new Date(this.startValue).getTime() >
          new Date(this.paperData.paperRecycleTime).getTime()
        ) {
          this.$message.error("修改发布时间必须早于回收时间！");
          return;
        }
      }
      if (new Date(this.endValue).getTime() < new Date().getTime()) {
        this.$message.error("修改回收时间必须晚于当下时间！");
        return;
      }
      changePaperTime({
        paperPublishTime: this.startTimeDisabled
          ? ""
          : moment(this.startValue).format("YYYY-MM-DD HH:mm:ss"),
        paperRecycleTime: moment(this.endValue).format("YYYY-MM-DD HH:mm:ss"),
        id: this.paperId,
        classId: this.paperData.classId,
      }).then((res) => {
        if (res.extra) {
          getPaperList({
            type: 1,
            catalogId: this.$route.query.catalogId,
          }).then((res) => {
            let paperData = res.extra.find((o) => o.id === this.paperId);
            this.$emit("changePaperList", res.extra);
            this.startValue = paperData.paperPublishTime;
            this.endValue = paperData.paperRecycleTime;
            this.$message.success("修改成功！");
            this.modal = false;
          });
        }
      });
    },
    disabledStartDate(current) {
      return current && current < moment().startOf("day");
    },
    disabledEndDate(current) {
      return current && current < moment().subtract(1, "days"); //当天之前的不可选，不包括当天
    },
    disabledDate(current) {
      return current && current < moment().subtract(1, "days"); //当天之前的不可选，不包括当天
      //return current && current < moment().endOf(‘day');当天之前的不可选，包括当天
    },
    // 获取所有学生列表 (设置补交时间)
    getStus() {
      getResubmitStus(this.paperId).then((res) => {
        console.log(res.extra);
        this.stuList = res.extra;
        if (this.stuId === 0) {
          this.checkedList = this.stuList.map((o) => o.stuId);
        } else {
          this.checkedList = [this.stuId];
        }
        this.checkAll = this.stuList.length === this.checkedList.length;
        this.paperSettingResubmitTime = null;
        this.makeUpTime = true;
      });
    },
    onChange(checkedValues) {
      console.log("checked = ", checkedValues);
      if (this.checkedList.length === this.stuList.length) {
        this.checkAll = true;
      } else {
        this.checkAll = false;
      }
    },
    onCheckAllChange(e) {
      let ids = this.stuList.map((o) => o.stuId);
      Object.assign(this, {
        checkedList: e.target.checked ? ids : [],
        checkAll: e.target.checked,
      });
    },
    setTime() {
      if (!this.paperSettingResubmitTime) {
        this.$message.error("请选择补交时间！");
        return;
      }
      if (
        new Date(this.paperSettingResubmitTime).getTime() < new Date().getTime()
      ) {
        this.$message.error("补交时间必须晚于当下时间！");
        return;
      }
      if (this.checkedList.length === 0) {
        this.$message.error("请选择学生！");
        return;
      }
      let params = this.checkedList.map((o) => {
        return {
          stuId: o,
          paperSettingResubmitTime: moment(
            this.paperSettingResubmitTime
          ).format("YYYY-MM-DD HH:mm:ss"),
        };
      });
      setMakeUpTime(params, this.paperId).then((res) => {
        if (res.extra) {
          this.$message.success("设置成功！");
          this.makeUpTime = false;
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
p {
  padding: 0;
  margin: 0;
}
::v-deep .ant-checkbox-wrapper + .ant-checkbox-wrapper {
  margin-left: 0;
}
</style>
