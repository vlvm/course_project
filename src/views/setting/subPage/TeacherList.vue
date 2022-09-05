<template>
  <div>
    <template v-if="false">
      <div class="top">
        <div class="topBox">
          添加老师：
          <a-input-search
            style="width: 300px"
            placeholder="请输入手机号"
            enter-button="添加"
            @search="addOtherTeacher"
          />
        </div>
        <a-button type="danger" @click="deleteTeachers">删除</a-button>
      </div>
      <div class="table">
        <a-table
          :columns="columns"
          :data-source="tableData"
          :rowKey="(record) => record.userId"
          :row-selection="rowSelection"
          :customRow="customRow"
          size="small"
          :pagination="false"
          :scroll="{ y: 800 }"
        >
          <span slot="action" slot-scope="record">
            <a-button type="primary" size="small" v-if="record.action === '0'">
              接受
            </a-button>
            <span style="color: #f45548" v-if="record.action === '1'">
              待验证
            </span>
            <span style="color: #007cf1" v-if="record.action === '2'">
              已通过
            </span>
          </span>
        </a-table>
      </div>
    </template>
    <template v-else>
      <div class="view">
        <a-result status="403" title="功能完善中，敬请期待">
          <template #extra>
            <a-button type="primary" @click="$router.back()"> 返回 </a-button>
          </template>
        </a-result>
      </div>
    </template>
  </div>
</template>

<script>
import {
  getTeacherList,
  addTeacher,
  delTeachers,
} from "@/request/setting/teacherList";

const columns = [
  {
    title: "序号",
    customRender: (text, record, index) => `${index + 1}`,
  },
  {
    title: "姓名",
    dataIndex: "userName",
  },
  {
    title: "性别",
    dataIndex: "sex",
    customRender: (text) => (text === null ? "--" : text === 0 ? "男" : "女"),
  },
  {
    title: "手机号",
    dataIndex: "mobile",
  },
  {
    title: "学校",
    dataIndex: "schoolName",
  },
  {
    title: "邮箱",
    dataIndex: "mail",
  },
  {
    title: "学科",
    dataIndex: "subjectId",
  },
  {
    title: "操作",
    align: "center",
    scopedSlots: { customRender: "action" },
  },
];
export default {
  name: "TeacherList",
  data() {
    return {
      columns,
      tableData: [],
      selectedRowKeys: [],
      selectedRows: [],
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
    getTeacherList().then((res) => {
      console.log(res.extra);
      this.tableData = res.extra;
    });
  },
  methods: {
    // 添加老师
    addOtherTeacher(phoneNumber) {
      const regex = /^1[3456789]\d{9}$/;
      if (phoneNumber === "") {
        this.$error({
          title: "错误",
          content: "请输入手机号！",
        });
        return;
      }
      if (!regex.test(phoneNumber)) {
        this.$error({
          title: "错误",
          content: "请输入正确的手机号！",
        });
        return;
      }
      addTeacher({ phoneNumber: phoneNumber }).then((res) => {
        console.log(res);
      });
    },
    // 批量删除老师
    deleteTeachers() {
      let _this = this;
      if (this.selectedRowKeys.length === 0) {
        this.$error({
          title: "错误",
          content: "请选要删除的老师！",
        });
        return;
      }
      this.$confirm({
        title: "是否确定删除所选人员?",
        content: "所选人员删除后不可恢复，需要重新添加，是否确定删除？",
        okText: "删除",
        // 点击蒙层是否允许关闭
        maskClosable: true,
        okType: "danger",
        cancelText: "取消",
        onOk: () => {
          delTeachers(this.selectedRowKeys).then((res) => {
            console.log(res);
            if (res.extra) {
              _this.tableData = _this.tableData.filter(
                (o) => !_this.selectedRowKeys.includes(o.userId)
              );
              _this.$message.success("删除成功");
            }
          });
        },
        onCancel: (error) => {
          console.log(error);
        },
      });
    },
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
  },
};
</script>

<style scoped lang="less">
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
.topBox {
  line-height: 32px;
}
.table {
  margin-top: 10px;
}
.view {
  display: flex;
  justify-content: center;
  margin: 10px;
  border-radius: 8px;
  background-color: #fff;
  .router-view {
    width: 1390px;
    border-radius: 8px;
    background-color: #fff;
  }
}
</style>
