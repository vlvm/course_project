<template>
  <div class="quesContent">
    <a-table
      :columns="columns"
      :data-source="tableData"
      :rowKey="(record, index) => index"
      bordered
      size="small"
      :expandIconAsCell="false"
      :expandIconColumnIndex="-1"
      :expanded-row-keys.sync="expandedRowKeys"
      :pagination="false"
      :customRow="rowClick"
      :scroll="{ x: 1000 }"
    >
      <div slot="expandedRowRender" slot-scope="record" style="margin: 0">
        <span v-if="record.kls.length === 0">暂无数据</span>
        <ul style="margin: 0" v-else>
          <li v-if="record.kls.filter((o) => o.libType === 0).length > 0">
            【素养】
          </li>
          <li
            v-for="o in record.kls.filter((o) => o.libType === 0)"
            :key="o.libId"
          >
            <span class="tag" style="color: #6c7af0">
              {{ o.libNumber }}{{ o.libName }}：
            </span>
            {{ o.scoringRate }}
          </li>
          <li v-if="record.kls.filter((o) => o.libType === 1).length > 0">
            【能力】
          </li>
          <li
            v-for="o in record.kls.filter((o) => o.libType === 1)"
            :key="o.libId"
          >
            <span class="tag" style="color: #6c7af0">
              {{ o.libNumber }}{{ o.libName }}：
            </span>
            {{ o.scoringRate }}
          </li>
          <li v-if="record.kls.filter((o) => o.libType === 2).length > 0">
            【知识点】
          </li>
          <li
            v-for="o in record.kls.filter((o) => o.libType === 2)"
            :key="o.libId"
          >
            <span class="tag" style="color: #6c7af0">
              {{ o.libNumber }}{{ o.libName }}：
            </span>
            {{ o.scoringRate }}
          </li>
        </ul>
      </div>
      <span slot="scoreRate" slot-scope="text">{{ text }}</span>
      <span
        v-for="(record, i) in customTitleList"
        :key="i"
        :slot="record.slot"
        slot-scope="text"
      >
        {{ text }}
      </span>
      <span v-for="(record, i) in customTitleList" :key="i" :slot="record.slot">
        <span v-if="record.title.length < 6">{{ record.title }}</span>
        <a-tooltip placement="topLeft" :title="record.title" v-else>
          <span>{{ record.title.slice(0, 8) }}</span>
        </a-tooltip>
      </span>
    </a-table>
  </div>
</template>

<script>
import { mapActions } from "vuex";

const columns = [
  {
    title: "学生",
    dataIndex: "userName",
    width: 120,
  },
  {
    title: "得分率",
    dataIndex: "scoringRate",
    sorter: (a, b) => a.scoring - b.scoring,
    scopedSlots: { customRender: "scoreRate" },
    width: 100,
    align: "center",
  },
];
import { courseStatisticsByPersion } from "@/request/course/courseResult";

export default {
  name: "ContentQuestion",
  props: ["courseId"],
  data() {
    return {
      leftAlignId: "",
      expandedRowKeys: [],
      tableData: [],
      columns,
      customTitleList: [],
    };
  },
  computed: {},
  watch: {
    expandedRowKeys(val) {
      this.changeSelectRow(val);
    },
    courseId(id) {
      // 按人统计
      courseStatisticsByPersion(id).then((res) => {
        if (res.extra.length > 0 && res.extra[0].kls.length > 0) {
          this.customTitleList = res.extra[0].kls.map((o, j) => {
            return {
              slot: ["rate" + (j + 1)],
              title: `${
                o.libType === 0 ? "素养" : o.libType === 1 ? "能力" : "知识点"
              } ${o.libNumber}`,
            };
          });
          let tr = res.extra[0].kls.map((o, j) => {
            return {
              dataIndex: "rate" + (j + 1),
              slots: { title: "rate" + (j + 1) },
              width: 100,
              align: "center",
              scopedSlots: { customRender: "rate" + (j + 1) },
            };
          });
          this.columns = [...columns, ...tr];
          let data = [];
          for (let i = 0; i < res.extra.length; i++) {
            data.push(
              res.extra[i].kls.map((o, j) => {
                return { ["rate" + (j + 1)]: o.scoringRate };
              })
            );
          }
          this.tableData = res.extra.map((o, i) => {
            let rates = data[i].reduce((acc, value) => {
              return { ...acc, ...value };
            });
            return { ...o, ...rates };
          });
        } else {
          this.tableData = res.extra;
        }
      });
      this.expandedRowKeys = [];
    },
  },
  mounted() {
    this.changeSelectRow(this.expandedRowKeys);
    // 按人统计
    courseStatisticsByPersion(this.courseId).then((res) => {
      if (res.extra.length > 0 && res.extra[0].kls.length > 0) {
        this.customTitleList = res.extra[0].kls.map((o, j) => {
          return {
            slot: ["rate" + (j + 1)],
            title: `${
              o.libType === 0 ? "素养" : o.libType === 1 ? "能力" : "知识点"
            } ${o.libNumber}`,
          };
        });
        let tr = res.extra[0].kls.map((o, j) => {
          return {
            dataIndex: "rate" + (j + 1),
            slots: { title: "rate" + (j + 1) },
            width: 100,
            align: "center",
            scopedSlots: { customRender: "rate" + (j + 1) },
          };
        });
        this.columns = [...columns, ...tr];
        let data = [];
        for (let i = 0; i < res.extra.length; i++) {
          data.push(
            res.extra[i].kls.map((o, j) => {
              return { ["rate" + (j + 1)]: o.scoringRate };
            })
          );
        }
        this.tableData = res.extra.map((o, i) => {
          let rates = data[i].reduce((acc, value) => {
            return { ...acc, ...value };
          });
          return { ...o, ...rates };
        });
      } else {
        this.tableData = res.extra;
      }
    });
  },
  methods: {
    ...mapActions("r", ["changeSelectRow"]),
    rowClick(record, index) {
      // let that = this;
      return {
        // 自定义属性，也就是官方文档中的props，可通过条件来控制样式
        style: {
          // 设置字体颜色
          color: index === this.leftAlignId ? "#fff" : "",
          //  设置行背景色 #E6F7FF
          "background-color": index === this.leftAlignId ? "#6C7AF0" : "",
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
            if (this.leftAlignId === index) {
              this.leftAlignId = "";
              this.expandedRowKeys = [];
            } else {
              // 记录当前点击的行标识
              this.leftAlignId = index;
              if (this.expandedRowKeys.length > 0) {
                let i = this.expandedRowKeys.indexOf(index);
                if (i > -1) {
                  this.expandedRowKeys.splice(i, 1);
                } else {
                  this.expandedRowKeys.splice(0, this.expandedRowKeys.length);
                  this.expandedRowKeys.push(index);
                }
              } else {
                this.expandedRowKeys.push(index);
              }
              this.$emit("getPersonAnswerData", record);
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
  display: inline-block;
  width: 95% !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
