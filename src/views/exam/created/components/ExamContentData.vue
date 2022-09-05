<template>
  <!--考试内容-->
  <TagBox name="考试内容" noPadding>
    <div style="max-height: 220px; min-height: 150px; overflow-y: auto">
      <div>
        <div class="statisticsName">
          <div>整体试卷</div>
          <div style="font-size: 12px">
            共{{ question.length }}题{{ paperScores }}分
          </div>
        </div>
        <a-row style="padding: 10px">
          <a-col :span="24" v-for="(item, i) in paperContentData" :key="i">
            <a-badge
              color="#a1acdb"
              status="processing"
              :text="`${getQuesType(item.type)} ${item.counts} 道， 共 ${
                item.totalScore
              } 分`"
            />
          </a-col>
        </a-row>
      </div>
      <div v-for="item in statisticsData" :key="item.id">
        <div class="statisticsName" @click="openStatisticsModal(item.id, true)">
          <div class="name">
            <a-icon
              type="close-circle"
              class="closeIcon"
              @click.stop="delPaperStatistics(item.id)"
            />
            <a-tooltip placement="left">
              <template slot="title">
                <span>{{ item.pointName }}</span>
              </template>
              {{ item.pointName }}
            </a-tooltip>
          </div>
          <div style="font-size: 12px">
            共{{ item.questionCounts }}题 {{ item.totalScore }}分
          </div>
        </div>
        <div class="numberBox">
          <div class="number" v-for="o in item.questionEntityList" :key="o.id">
            {{ o.questionNumber }}
          </div>
        </div>
      </div>
    </div>
    <a-button block size="small" @click="openStatisticsModal">
      自定义统计
    </a-button>
    <!--文字修改-->
    <a-modal
      :width="870"
      :maskClosable="false"
      v-model="addStatistics"
      title="创建统计"
      @ok="addPaperStatistics"
    >
      <a-row type="flex" align="middle">
        <a-col :span="4" align="right"> 输入统计名称： </a-col>
        <a-col :span="18">
          <a-input placeholder="请输入统计名称" v-model.trim="pointName" />
        </a-col>
      </a-row>
      <a-row type="flex" style="margin-top: 20px">
        <a-col :span="4" align="right" style="padding-top: 3px">
          选择需要统计的题：
        </a-col>
        <a-col :span="18">
          <div class="quesBox">
            <span
              class="ques"
              v-for="item in question"
              :key="item.content.id"
              :class="{ active: quesArr.includes(item.content.id) }"
              @click="quesClixk(item)"
            >
              {{ item.content.questionNumber }}
            </span>
          </div>
        </a-col>
      </a-row>
    </a-modal>
  </TagBox>
</template>

<script>
import {
  getPaperTagAttr,
  getPaperStatistics,
  addPaperStatistics,
  putPaperStatistics,
  delPaperStatistics,
} from "@/request/exam/examCreated";
export default {
  name: "ExamContentData",
  props: ["paperId", "contentData"],
  data() {
    return {
      addStatistics: false,
      // 考试内容数据
      paperContentData: [],
      pointId: "",
      pointName: "",
      quesArr: [],
      statisticsData: [],
      isEditing: false,
    };
  },
  computed: {
    question() {
      return this.contentData.filter((o) => o.contentType === 2);
    },
    paperScores() {
      const data = this.contentData.filter((o) => o.contentType === 2);
      let score = 0;
      data.map((o) => (score += o.content.questionScore));
      return score;
    },
  },
  watch: {
    contentData: {
      deep: true,
      handler() {
        this.getData();
      },
    },
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      getPaperTagAttr(this.paperId).then((res) => {
        this.paperContentData = res.extra;
      });
      getPaperStatistics(this.paperId).then((res) => {
        this.statisticsData = res.extra;
      });
    },
    quesClixk(item) {
      if (this.quesArr.includes(item.content.id)) {
        this.quesArr = this.quesArr.filter((o) => o !== item.content.id);
      } else {
        this.quesArr.push(item.content.id);
      }
    },
    addPaperStatistics() {
      if (this.pointName == "") {
        this.$message.warning("请输入统计名称！");
        return;
      }
      if (this.quesArr.length === 0) {
        this.$message.warning("请选择需要统计的试题！");
        return;
      }
      let params = {
        pointName: this.pointName,
        paperId: this.paperId,
        questionIds: this.quesArr,
      };
      if (this.isEditing) {
        putPaperStatistics({ ...params, id: this.pointId }).then((res) => {
          if (res.extra) {
            getPaperStatistics(this.paperId).then((res) => {
              this.statisticsData = res.extra;
            });
            this.$message.success("修改成功！");
            this.addStatistics = false;
          }
        });
      } else {
        addPaperStatistics(params).then((res) => {
          if (res.extra) {
            getPaperStatistics(this.paperId).then((res) => {
              this.statisticsData = res.extra;
            });
            this.$message.success("添加成功！");
            this.addStatistics = false;
          }
        });
      }
    },
    delPaperStatistics(pointId) {
      const _this = this;
      _this.$confirm({
        title: "操作确认",
        content: "是否确认删除当前统计点？",
        // 点击蒙层是否允许关闭
        maskClosable: false,
        onOk() {
          delPaperStatistics(_this.paperId, pointId).then((res) => {
            if (res.extra) {
              _this.statisticsData = _this.statisticsData.filter(
                (o) => o.id !== pointId
              );
              _this.$message.success("删除成功！");
              _this.addStatistics = false;
            }
          });
        },
        onCancel: () => {
          console.log("Cancel");
        },
      });
    },
    openStatisticsModal(pointId, isEditing = false) {
      if (!isEditing) {
        this.pointName = "";
        this.quesArr = [];
        this.isEditing = false;
        this.addStatistics = true;
      } else {
        let item = this.statisticsData.find((o) => o.id === pointId);
        this.pointName = item.pointName;
        this.quesArr = item.questionEntityList.map((o) => o.id);
        this.pointId = item.id;
        this.isEditing = true;
        this.addStatistics = true;
      }
    },
    getQuesType(type) {
      switch (type) {
        case 0:
          return "单选题";
        case 1:
          return "不定项";
        case 2:
          return "填空题";
        case 3:
          return "简答题";
      }
    },
  },
};
</script>

<style scoped lang="less">
::v-deep .ant-badge-status-text {
  padding-left: 5px;
}
.quesBox {
  min-height: 300px;
  max-height: 500px;
  overflow-y: auto;
  .ques {
    display: inline-block;
    padding: 3px 15px;
    background: #f7f7f7;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    cursor: pointer;
    margin: 0 10px 10px 0;
  }
}
.statisticsName {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 3px 5px;
  background: #c7d0f2;
  font-size: 14px;
  color: #1e3779;
  cursor: pointer;
  .name {
    width: 140px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
  }
}
.numberBox {
  padding: 5px;
  .number {
    display: inline-block;
    line-height: 18px;
    padding: 0 5px;
    margin: 3px;
    background: #fff;
    border-radius: 4px;
  }
}
.closeIcon {
  //padding-right: 5px;
}
.active {
  background: #6c7af0 !important;
  color: #fff;
}
</style>
