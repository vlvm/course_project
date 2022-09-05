<template>
  <TagBox name="交卷情况" noPadding>
    <template v-if="isOverRecoveryTime">
      <template v-if="submitData.length > 0">
        <div v-for="(item, i) in submitData" :key="i">
          <div class="statisticsName">
            <div>
              {{ item.type === 0 ? "提前交卷" : "白卷" }} {{ item.counts }} 人
            </div>
          </div>
          <div
            style="padding: 10px"
            v-if="item.paperStuSubmitTimeList === null"
          >
            暂无数据
          </div>
          <a-row
            style="padding: 0 10px"
            v-for="o in item.paperStuSubmitTimeList"
            :key="o.stuId"
          >
            <a-col :span="24">
              <a-badge
                :class="item.type !== 0 ? 'noAnswer' : ''"
                color="#a1acdb"
                status="processing"
                :text="`${o.stuName} ${
                  item.type === 0 ? o.submitTime : '--:--'
                }`"
              />
            </a-col>
          </a-row>
        </div>
      </template>
      <div v-else style="padding: 10px">暂无数据</div>
    </template>
    <div v-else style="padding: 10px">暂无数据</div>
  </TagBox>
</template>

<script>
import { getPaperSubmitDetail } from "@/request/exam/expamProcessing";
export default {
  name: "SubmitPaperData",
  props: ["paperId", "isOverRecoveryTime"],
  data() {
    return {
      submitData: [],
    };
  },
  mounted() {
    getPaperSubmitDetail(this.paperId).then((res) => {
      this.submitData = res.extra;
    });
  },
};
</script>

<style scoped lang="less">
::v-deep .ant-badge-status-text {
  padding-left: 5px;
  font-size: 12px;
  color: #1e3779;
}
.noAnswer {
  ::v-deep .ant-badge-status-text {
    color: #ff6666;
  }
}
.statisticsName {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 10px;
  background: #c7d0f2;
  font-size: 14px;
  color: #293364;
  cursor: pointer;
}
.noAnswerBg {
  background: #fe9c9d;
}
.noAnswer {
  color: #fe9c9d;
}
</style>
