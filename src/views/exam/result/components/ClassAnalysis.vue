<template>
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
    :scroll="{ y: $store.state.screenHeight - 220 }"
  >
    <div
      slot="expandedRowRender"
      slot-scope="record"
      style="margin: 0; padding: 0"
    >
      <div
        slot="expandedRowRender"
        class="txt"
        :class="{ noPadding: spsIds.includes(rowClickId) }"
        v-html="record.questionStem"
      ></div>
      <ul style="margin: 0" v-if="record.questionStem !== null">
        <li v-if="record.klList.filter((o) => o.libType === 0).length > 0">
          【素养】
        </li>
        <li
          v-for="o in record.klList.filter((o) => o.libType === 0)"
          :key="o.libId"
        >
          <span class="tag" style="color: #6c7af0">
            {{ o.libNumber }}{{ o.libName }}
          </span>
        </li>
        <li v-if="record.klList.filter((o) => o.libType === 1).length > 0">
          【能力】
        </li>
        <li
          v-for="o in record.klList.filter((o) => o.libType === 1)"
          :key="o.libId"
        >
          <span class="tag" style="color: #6c7af0">
            {{ o.libNumber }}{{ o.libName }}
          </span>
        </li>
        <li v-if="record.klList.filter((o) => o.libType === 2).length > 0">
          【知识点】
        </li>
        <li
          v-for="o in record.klList.filter((o) => o.libType === 2)"
          :key="o.libId"
        >
          <span class="tag" style="color: #6c7af0">
            {{ o.libNumber }}{{ o.libName }}
          </span>
        </li>
      </ul>
    </div>
    <span slot="questionNumber" slot-scope="text">
      <a-popover placement="bottom">
        <template slot="content">
          <div style="width: 300px">{{ text }}</div>
        </template>
        <div class="tableTag">{{ text }}</div>
      </a-popover>
    </span>
    <span slot="questionType" slot-scope="text">
      <span v-if="text === 0">单选题</span>
      <span v-if="text === 1">不定项</span>
      <span v-if="text === 2">填空题</span>
      <span v-if="text === 3">简答题</span>
      <span v-if="text === ''">--</span>
    </span>
    <span slot="questionScoringRate" slot-scope="text, record">
      <span v-if="record.questionStem !== null">
        {{ record.questionScoringRate }}
      </span>
      <span v-if="record.questionStem === null">
        {{ record.scoringRateAverage }}
      </span>
    </span>
    <span slot="discrimPoint" slot-scope="text">
      <span v-if="text === ''">--</span>
      <span v-else>{{ text }}</span>
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
    <span slot="globalComment">
      <a-button type="link" disabled>整体讲评</a-button>
    </span>
    <span slot="comment" slot-scope="text, record">
      <a-button type="link" disabled v-if="record.questionStem !== null">
        试题讲评
      </a-button>
      <a-button type="link" disabled v-else>部分讲评</a-button>
    </span>
  </a-table>
</template>

<script>
import { getQuesStatistics } from "@/request/exam/examResult";
const columns = [
  {
    title: "题号",
    dataIndex: "questionNumber",
    width: 110,
    scopedSlots: { customRender: "questionNumber" },
  },
  {
    title: "题型",
    align: "center",
    dataIndex: "questionType",
    width: 80,
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
    title: "正答率/平均分",
    align: "center",
    width: 110,
    // dataIndex: "questionScoringRate",
    scopedSlots: { customRender: "questionScoringRate" },
    // defaultSortOrder: "descend",
    // sorter: (a, b) => parseInt(a.scoring) - parseInt(b.scoring),
  },
  {
    title: "得分率",
    align: "center",
    dataIndex: "scoringRate",
    // defaultSortOrder: "descend",
    // sorter: (a, b) => parseInt(a.scoring) - parseInt(b.scoring),
  },
  {
    title: "区分度",
    align: "center",
    width: 80,
    dataIndex: "discrimPoint",
    // defaultSortOrder: "descend",
    // sorter: (a, b) => parseInt(a.discrimPoint) - parseInt(b.discrimPoint),
    scopedSlots: { customRender: "discrimPoint" },
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
  {
    slots: { title: "globalComment" }, //表头插槽
    align: "center",
    width: 90,
    scopedSlots: { customRender: "comment" },
  },
];
export default {
  name: "ClassAnalysis",
  props: [
    "paperId",
    "studentId",
    "spsIds",
    "rowClickId",
    "expandedRowIds",
    "spsId",
    "sps",
  ],
  data() {
    return {
      leftAlignId: "",
      columns,
      expandedRowKeys: [],
      tableData: [],
    };
  },
  watch: {
    paperId() {
      this.leftAlignId = "";
      this.expandedRowKeys = [];
      this.getQuesStatistics(this.spsId === "" ? null : this.spsId);
    },
    studentId() {
      this.leftAlignId = "";
      this.expandedRowKeys = [];
    },
    spsId(id) {
      this.leftAlignId = id;
      if (id === "") {
        this.expandedRowKeys = [];
        this.$emit("update:expandedRowIds", []);
        this.getQuesStatistics();
      } else {
        this.expandedRowKeys = [id];
        this.$emit("update:expandedRowIds", [id]);
        this.getQuesStatistics(id);
      }
    },
    leftAlignId(id) {
      this.$emit("update:rowClickId", id);
      if (id === "") {
        this.$emit("update:expandedRowIds", []);
      } else {
        this.$emit("update:expandedRowIds", this.expandedRowKeys);
      }
    },
  },
  mounted() {
    this.getQuesStatistics(this.spsId === "" ? null : this.spsId);
  },
  methods: {
    getQuesStatistics(pointId = null) {
      let params;
      if (pointId) {
        params = {
          paperId: this.paperId,
          pointId: pointId,
        };
      } else {
        params = {
          paperId: this.paperId,
        };
      }
      getQuesStatistics(params).then((res) => {
        let ids = res.extra.sps.map((o) => o.id);
        this.$emit("update:spsIds", ids);
        this.$emit("update:sps", res.extra.sps);
        let sps = res.extra.sps.map((o) => {
          return {
            id: o.id,
            paperId: o.paperId,
            kl0: "",
            kl1: "",
            kl2: "",
            discrimPoint: "",
            questionNumber: o.pointName,
            questionStem: null,
            questionType: "",
            scoring: 0,
            scoringRateAverage: o.scoringRateAverage,
            scoringRate: o.scoringRate,
          };
        });
        if (this.spsId !== "") {
          sps = sps.filter((o) => o.id === this.spsId);
        }
        this.tableData = [...sps, ...res.extra.questions];
      });
    },
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
              // if (this.spsIds.includes(record.id)) {
              //   this.getQuesStatistics();
              // }
              this.$emit("update:tableItem", {});
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
                  // if (this.spsIds.includes(record.id)) {
                  //   this.getQuesStatistics(record.id);
                  // } else {
                  //   this.getQuesStatistics();
                  // }
                  this.$emit("update:tableItem", record);
                }
              } else {
                this.expandedRowKeys.push(record.id);
                // if (this.spsIds.includes(record.id)) {
                //   this.getQuesStatistics(record.id);
                // }
                this.$emit("update:tableItem", record);
                console.log(record, index);
              }
            }
          },
        },
      };
    },
  },
};
</script>

<style scoped lang="less">
::v-deep .ant-table-body {
  margin: 0 !important;
}
.txt {
  width: 100%;
  word-break: break-all;
  padding: 10px;
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
::v-deep .ant-table-expanded-row td {
  padding: 0 !important;
  box-sizing: border-box;
}
.tableTag {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.noPadding {
  padding: 0 !important;
}
</style>
