<template>
  <div>
    <div class="top">
      <div></div>
      <div>
        <a-dropdown>
          <a-menu slot="overlay" @click="handleMenuClick">
            <a-menu-item v-for="item in groupList" :key="item.id">
              {{ item.groupName }}
            </a-menu-item>
          </a-menu>
          <a-button type="primary" style="margin-right: 8px">
            <a-icon type="plus" /> 添加到分组 <a-icon type="down" />
          </a-button>
        </a-dropdown>
        <!--<a-button type="danger">删除</a-button>-->
      </div>
    </div>
    <div class="table">
      <a-table
        :columns="columns"
        :data-source="studentList"
        :rowKey="(record) => record.id"
        :row-selection="rowSelection"
        :customRow="customRow"
        :scroll="{ y: height - 130 }"
        :pagination="false"
        size="small"
      >
        <span slot="mappingStatus" slot-scope="record">
          <span style="color: #f45548" v-if="record.mappingStatus === '0'">
            待验证
          </span>
          <span style="color: #6c7af0" v-if="record.mappingStatus === '1'">
            已通过
          </span>
        </span>
      </a-table>
    </div>
  </div>
</template>

<script>
import {
  getStugroupList,
  getStuList,
  groupAddStudent,
} from "@/request/setting/stuGroup";

const columns = [
  {
    title: "姓名",
    width: 200,
    dataIndex: "userName",
  },
  {
    title: "性别",
    scopedSlots: { customRender: "sex" },
  },
  {
    title: "学号",
    dataIndex: "studentNumber",
  },
  {
    title: "学校",
    dataIndex: "subjectName",
  },
  {
    title: "身份证号",
    dataIndex: "idNumber",
  },
  {
    title: "入学时间",
    dataIndex: "enrollmentTime",
  },
  {
    title: "毕业时间",
    dataIndex: "graduationTime",
  },
  {
    title: "申请时间",
    dataIndex: "applyTime",
  },
  {
    title: "组别",
    align: "center",
    scopedSlots: { customRender: "mappingStatus" },
  },
];
export default {
  name: "StuRoster",
  data() {
    return {
      height: document.body.clientHeight,
      columns,
      selectedRowKeys: [],
      selectedRows: [],
      groupList: [],
      studentList: [],
    };
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(
            `selectedRowKeys: ${selectedRowKeys}`,
            "selectedRows: ",
            selectedRows
          );
          this.selectedRowKeys = selectedRowKeys;
          this.selectedRows = selectedRows;
        },
      };
    },
  },
  mounted() {
    getStugroupList().then((res) => {
      this.groupList = res.extra;
    });
    getStuList({
      groupId: null,
    }).then((r) => {
      this.studentList = r.extra.records;
    });
  },
  methods: {
    //设置表格隔行变色
    customRow(record, index) {
      return {
        style: {
          // 字体颜色
          color: record.remarkDesc ? record.remarkDesc.fontColor : "#1E3779",
          // 行背景色
          "background-color": index % 2 === 0 ? "#F7FBFE" : "#D7ECFD",
        },
      };
    },
    handleMenuClick({ key }) {
      if (this.selectedRowKeys.length === 0) {
        this.$error({
          title: "错误！",
          content: "添加分组前请先选择学生！",
        });
        return;
      }
      groupAddStudent(this.selectedRowKeys, key).then(() => {
        getStuList({
          groupId: key,
        }).then((r) => {
          this.studentList = r.extra.records;
        });
      });
    },
  },
};
</script>

<style scoped>
::v-deep .ant-table-thead > tr > th {
  color: #fff;
  background: #636f9f !important;
}
::v-deep .ant-table-small > .ant-table-content > .ant-table-body {
  margin: 0;
}
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.table {
  margin-top: 10px;
}
</style>
