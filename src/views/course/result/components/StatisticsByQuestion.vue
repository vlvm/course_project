<template>
  <div class="quesContent">
    <a-table
      :columns="columns"
      :data-source="tableData"
      bordered
      size="small"
      :expandIconAsCell="false"
      :expandIconColumnIndex="-1"
      :expanded-row-keys.sync="expandedRowKeys"
      :rowKey="(record) => record.id"
      :pagination="false"
      @expand="onExpand"
      :customRow="rowClick"
      :loading="loading"
    >
      <div slot="expandedRowRender" slot-scope="record" style="margin: 0">
        <div
          slot="expandedRowRender"
          class="txt"
          v-html="record.questionStem"
        ></div>
      </div>
      <span slot="questionType" slot-scope="text">
        <span v-if="text === 0">单选题</span>
        <span v-if="text === 1">不定项</span>
        <span v-if="text === 2">填空题</span>
        <span v-if="text === 3">简答题</span>
      </span>
      <span slot="kl0" slot-scope="text">
        <span v-if="text === ''">--</span>
        <span v-else>
          <a-tag v-for="o in text.split(',')" :key="o">{{ o }}</a-tag>
        </span>
      </span>
      <span slot="kl1" slot-scope="text">
        <span v-if="text === ''">--</span>
        <span v-else>
          <a-tag v-for="o in text.split(',')" :key="o">{{ o }}</a-tag>
        </span>
      </span>
      <span slot="kl2" slot-scope="text">
        <span v-if="text === ''">--</span>
        <span v-else>
          <a-tag v-for="o in text.split(',')" :key="o">{{ o }}</a-tag>
        </span>
      </span>
    </a-table>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
const columns = [
  { title: "题号", dataIndex: "questionNumber" },
  {
    title: "题型",
    align: "center",
    dataIndex: "questionType",
    filters: [
      {
        text: "单选",
        value: 0,
      },
      {
        text: "不定项",
        value: 1,
      },
      {
        text: "填空",
        value: 2,
      },
      {
        text: "简答",
        value: 3,
      },
    ],
    filterMultiple: true,
    onFilter: (value, record) => record.questionType === value,
    scopedSlots: { customRender: "questionType" },
  },
  {
    title: "得分率",
    align: "center",
    dataIndex: "scoringRate",
    // defaultSortOrder: "descend",
    sorter: (a, b) => parseInt(a.scoring) - parseInt(b.scoring),
  },
  {
    title: "素养",
    dataIndex: "kl0",
    scopedSlots: { customRender: "kl0" },
  },
  {
    title: "能力",
    dataIndex: "kl1",
    scopedSlots: { customRender: "kl1" },
  },
  {
    title: "知识点",
    dataIndex: "kl2",
    scopedSlots: { customRender: "kl2" },
  },
];

import { courseStatisticsBytopic } from "@/request/course/courseResult";

export default {
  name: "ContentQuestion",
  props: ["courseId"],
  data() {
    return {
      loading: false,
      leftAlignId: "",
      expandedRowKeys: [],
      columns,
      tableData: [],
    };
  },
  computed: {},
  watch: {
    courseId(id) {
      this.loading = true;
      this.expandedRowKeys = [];
      this.changeSelectRow([]);
      // 按题统计
      courseStatisticsBytopic(id).then((res) => {
        this.tableData = res.extra;
        this.loading = false;
      });
    },
    expandedRowKeys(val) {
      this.expandedRowKeys = val;
      this.changeSelectRow(val);
    },
  },
  mounted() {
    this.loading = true;
    this.expandedRowKeys = [];
    this.changeSelectRow([]);
    this.$nextTick(() => {
      // 按题统计
      courseStatisticsBytopic(this.courseId).then((res) => {
        this.tableData = res.extra;
        this.loading = false;
      });
    });
  },
  methods: {
    ...mapMutations("r", ["changeSelectRow"]),
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
              this.$emit("getQuesStatisticsData", record.id);
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
.txt {
  width: 100%;
  word-break: break-all;
  ::v-deep p {
    text-indent: 0 !important;
  }
  ::v-deep li {
    text-indent: 0 !important;
  }
  ::v-deep p:last-child {
    margin-bottom: 0;
  }
  ::v-deep img {
    max-width: 100%;
  }
}
</style>
