<template>
  <div class="quesContent">
    <a-table
      :columns="columns"
      :data-source="tableData"
      :rowKey="(record) => record.id"
      bordered
      size="small"
      :expandIconAsCell="false"
      :expandIconColumnIndex="-1"
      :expanded-row-keys.sync="expandedRowKeys"
      :pagination="false"
      @expand="onExpand"
      :customRow="rowClick"
    >
      <div slot="expandedRowRender" slot-scope="record" style="margin: 0">
        <a-space direction="vertical" :size="10" style="width: 100%">
          <div
            v-if="
              record.questions.filter((o) => o.questionType === 0).length > 0
            "
          >
            <div>
              单选题：
              {{ record.questions.filter((o) => o.questionType === 0).length }}
              道
            </div>
            <div style="margin-top: 10px">
              <a-tag
                v-for="o in record.questions.filter(
                  (o) => o.questionType === 0
                )"
                :key="o.id"
              >
                {{ o.questionNumber }}
              </a-tag>
            </div>
          </div>
          <div
            v-if="
              record.questions.filter((o) => o.questionType === 1).length > 0
            "
          >
            <div>
              不定项：
              {{ record.questions.filter((o) => o.questionType === 1).length }}
              道
            </div>
            <div style="margin-top: 10px">
              <a-tag
                v-for="o in record.questions.filter(
                  (o) => o.questionType === 1
                )"
                :key="o.id"
              >
                {{ o.questionNumber }}
              </a-tag>
            </div>
          </div>
          <div
            v-if="
              record.questions.filter((o) => o.questionType === 2).length > 0
            "
          >
            <div>
              填空题：
              {{ record.questions.filter((o) => o.questionType === 2).length }}
              道
            </div>
            <div style="margin-top: 10px">
              <a-tag
                v-for="o in record.questions.filter(
                  (o) => o.questionType === 2
                )"
                :key="o.id"
              >
                {{ o.questionNumber }}
              </a-tag>
            </div>
          </div>
          <div
            v-if="
              record.questions.filter((o) => o.questionType === 3).length > 0
            "
          >
            <div>
              简答题：
              {{ record.questions.filter((o) => o.questionType === 3).length }}
              道
            </div>
            <div style="margin-top: 10px">
              <a-tag
                v-for="o in record.questions.filter(
                  (o) => o.questionType === 3
                )"
                :key="o.id"
              >
                {{ o.questionNumber }}
              </a-tag>
            </div>
          </div>
        </a-space>
      </div>
      <span slot="libName" slot-scope="text, record">
        <a-popover
          placement="bottom"
          :title="`${
            record.libType === 0
              ? '素养'
              : record.libType === 1
              ? '能力'
              : '知识点'
          }${record.libNumber}`"
        >
          <template slot="content">
            <div style="width: 300px">{{ record.libNumber }}{{ text }}</div>
          </template>
          <div class="tag">
            【{{
              record.libType === 0
                ? "素养"
                : record.libType === 1
                ? "能力"
                : "知识点"
            }}】{{ record.libNumber }}{{ text }}
          </div>
        </a-popover>
      </span>
      <span slot="noScore" slot-scope="text, record">
        {{ record.zeroScore.scoringRate }}/
        {{ record.zeroScore.studentCount }}人
      </span>
      <span slot="lowerScoreRate" slot-scope="text, record">
        {{ record.ltScore.scoringRate }} / {{ record.ltScore.studentCount }}人
      </span>
      <span slot="higherScoreRate" slot-scope="text, record">
        {{ record.gtScore.scoringRate }} / {{ record.gtScore.studentCount }}人
      </span>
      <span slot="fullScore" slot-scope="text, record">
        {{ record.fullScore.scoringRate }} /
        {{ record.fullScore.studentCount }}人
      </span>
      <span slot="questions" slot-scope="text">{{ text.length }}道 </span>
    </a-table>
  </div>
</template>

<script>
import { mapActions } from "vuex";

const columns = [
  {
    title: "知识模块",
    dataIndex: "libName",
    width: 120,
    scopedSlots: { customRender: "libName" },
  },
  {
    title: "得分率",
    align: "center",
    dataIndex: "scoringRate",
    // defaultSortOrder: "descend",
    sorter: (a, b) => a.scoring - b.scoring,
    scopedSlots: { customRender: "scoringRate" },
  },
  {
    title: "0分 / 人",
    align: "center",
    dataIndex: "noScore",
    scopedSlots: { customRender: "noScore" },
  },
  {
    title: "低于得分率 / 人",
    align: "center",
    dataIndex: "lowerScoreRate",
    scopedSlots: { customRender: "lowerScoreRate" },
  },
  {
    title: "高于得分率 / 人",
    align: "center",
    dataIndex: "higherScoreRate",
    scopedSlots: { customRender: "higherScoreRate" },
  },
  {
    title: "满分 / 人",
    align: "center",
    dataIndex: "fullScore",
    scopedSlots: { customRender: "fullScore" },
  },
  {
    title: "涉及题目",
    align: "center",
    dataIndex: "questions",
    scopedSlots: { customRender: "questions" },
  },
];

import { knowledgeData } from "@/mock/result";
import { courseStatisticsByModule } from "@/request/course/courseResult";

export default {
  name: "ContentQuestion",
  props: ["courseId"],
  data() {
    return {
      leftAlignId: "",
      expandedRowKeys: [],
      knowledgeData,
      tableData: [],
      columns,
    };
  },
  computed: {},
  watch: {
    expandedRowKeys(val) {
      this.changeSelectRow(val);
    },
    courseId(id) {
      // 按知识模块统计
      courseStatisticsByModule(id).then((res) => {
        this.tableData = res.extra;
      });
    },
  },
  mounted() {
    this.changeSelectRow(this.expandedRowKeys);
    // 按知识模块统计
    courseStatisticsByModule(this.courseId).then((res) => {
      this.tableData = res.extra;
    });
  },
  methods: {
    ...mapActions("r", ["changeSelectRow"]),
    onExpand() {
      alert("展开行触发事件！");
    },
    rowClick(record, index) {
      // let that = this;
      return {
        // 自定义属性，也就是官方文档中的props，可通过条件来控制样式
        style: {
          // 设置字体颜色
          color: record.id === this.leftAlignId ? "#fff" : "",
          //  设置行背景色 #E6F7FF
          "background-color": record.id === this.leftAlignId ? "#6C7AF0" : "",
          // 设置字体类型
          // 'font-family': 'Microsoft YaHei',
          // // 下划线
          // 'text-decoration': 'underline',
          // // 字体样式-斜体
          // 'font-style': 'italic',
          // // 字体加粗
          // 'font-weight': 'bold'
        },
        on: {
          click: () => {
            if (this.leftAlignId === record.id) {
              this.leftAlignId = "";
              this.expandedRowKeys = [];
            } else {
              // 记录当前点击的行标识
              this.leftAlignId = record.id;
              if (this.expandedRowKeys.length > 0) {
                let index = this.expandedRowKeys.indexOf(record.id);
                if (index > -1) {
                  this.expandedRowKeys.splice(index, 1);
                } else {
                  this.expandedRowKeys.splice(0, this.expandedRowKeys.length);
                  this.expandedRowKeys.push(record.id);
                }
              } else {
                this.expandedRowKeys.push(record.id);
              }
              this.$emit("getModelLabelData", record);
            }
            console.log(record, index);
          },
        },
      };
    },
  },
};
</script>

<style scoped lang="less">
.quesContent {
  position: relative;
  width: 100%;
  border: 2px solid transparent;
  //margin: 2px 0 0;
  padding: 5px 0;
}

::v-deep
  .ant-table-tbody
  > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)
  > td {
  color: rgba(0, 0, 0, 0.65);
  background: #f6f5fa;
}

::v-deep .ant-table-body {
  margin: 0 !important;
}
.tag {
  width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
