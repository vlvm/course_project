<template>
  <div class="stuGroup">
    <div class="left">
      <div class="title">我的分组</div>
      <ul>
        <li
          v-for="item in groupData"
          :key="item.id"
          @click="changeGroup(item.id)"
          :class="{ liActive: groupId === item.id }"
        >
          <span class="groupName">{{ item.groupName }}</span>
          <span>
            <a-icon
              type="edit"
              style="font-size: 16px"
              @click="openGroupModal(1, item.id)"
            />
            <a-icon
              type="delete"
              style="margin-left: 8px; color: red; font-size: 16px"
              @click="deleteGroup"
            />
          </span>
        </li>
        <a-button
          type="dashed"
          block
          style="margin-top: 15px"
          @click="openGroupModal(0)"
        >
          +添加分组
        </a-button>
      </ul>
    </div>
    <div class="right">
      <div class="title">分组学生</div>
      <div class="stuTools">
        <div class="stuNum">共 {{ stuData.length }} 人</div>
        <a-button type="primary" @click="openAddStuModal">
          <a-icon type="plus" />添加学生
        </a-button>
      </div>
      <ul v-if="stuData.length > 0">
        <li v-for="item in stuData" :key="item.id">
          <span>{{ item.userName }}</span>
          <span @click="deleteStudent(item.studentUserId)">移出该组</span>
        </li>
      </ul>
      <div style="clear: both" v-else>
        <a-empty />
      </div>
    </div>
    <!--创建分组与修改分组名字-->
    <a-modal
      v-model="createGroupModal"
      :title="type === 0 ? '新建分组' : '修改分组名称'"
      @ok="setGroup"
    >
      <a-input placeholder="请输入分组名称" v-model="groupName" />
    </a-modal>
    <a-modal
      v-model="addStuModal"
      :width="870"
      title="添加学生"
      @ok="addstudent"
      @cancel="(selectedRows = []), (selectedRowKeys = [])"
    >
      <a-table
        :columns="columns"
        :data-source="studentList"
        :rowKey="(record) => record.studentUserId"
        :row-selection="rowSelection"
        :customRow="customRow"
        size="small"
        :pagination="false"
        :scroll="{ y: 330 }"
      >
        <span slot="sex" slot-scope="record">
          <span v-if="record.sex === 0"> 女 </span>
          <span v-if="record.sex === 1"> 男 </span>
        </span>
      </a-table>
    </a-modal>
  </div>
</template>

<script>
import {
  getStugroupList,
  addStugroup,
  getStuList,
  changeGroupName,
  delGroup,
  groupAddStudent,
  deleteGroupStudent,
} from "@/request/setting/stuGroup";
const columns = [
  {
    title: "姓名",
    dataIndex: "userName",
    width: 120,
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
];
export default {
  name: "StuGroup",
  data() {
    return {
      type: 0,
      createGroupModal: false,
      addStuModal: false,
      groupName: "",
      groupId: 0,
      groupData: [],
      stuData: [],
      columns,
      studentList: [],
      selectedRowKeys: [],
      selectedRows: [],
    };
  },
  computed: {
    index() {
      return this.groupData.findIndex((o) => o.id === this.groupId);
    },
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
    this.getData();
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
    openGroupModal(type, id) {
      this.type = type;
      if (id) {
        this.groupId = id;
      }
      this.createGroupModal = true;
      if (type === 0) {
        this.groupName = "";
      } else {
        this.groupName = this.groupData[this.index].groupName;
      }
    },
    openAddStuModal() {
      this.addStuModal = true;
      getStuList({
        groupId: null,
      }).then((r) => {
        this.studentList = r.extra.records;
      });
    },
    getData() {
      getStugroupList().then((res) => {
        this.groupData = res.extra;
        if (res.extra.length > 0) {
          this.groupId = res.extra[0].id;
          getStuList({
            groupId: this.groupId,
          }).then((r) => {
            this.stuData = r.extra.records;
          });
        }
      });
    },
    // 切换分组
    changeGroup(id) {
      this.groupId = id;
      getStuList({
        groupId: this.groupId,
      }).then((r) => {
        this.stuData = r.extra.records;
      });
    },
    // 添加分组
    setGroup() {
      if (this.groupName === "") {
        this.$error({
          title: "请填写分组名称！",
        });
        return;
      }
      // 创建分组
      if (this.type === 0) {
        addStugroup({
          groupName: this.groupName,
        }).then((res) => {
          if (res.extra) {
            this.createGroupModal = false;
            this.$message.success("添加成功！");
            this.getData();
          }
        });
      } else {
        changeGroupName({
          id: this.groupId,
          groupName: this.groupName,
        }).then(() => {
          this.groupData[this.index].groupName = this.groupName;
          this.$message.success("修改成功！");
          this.createGroupModal = false;
        });
      }
    },
    // 删除分组
    deleteGroup() {
      const _this = this;
      this.$confirm({
        title: "是否确定要删除这个分组?",
        okText: "删除",
        okType: "danger",
        cancelText: "取消",
        onOk() {
          delGroup([_this.groupId]).then((res) => {
            if (res.extra) {
              _this.getData();
            }
          });
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    },
    // 添加学生
    addstudent() {
      groupAddStudent(this.selectedRowKeys, this.groupId).then(() => {
        getStuList({
          groupId: this.groupId,
        }).then((r) => {
          this.stuData = r.extra.records;
          this.addStuModal = false;
        });
      });
    },
    // 删除分组下学生
    deleteStudent(id) {
      deleteGroupStudent([id], this.groupId).then(() => {
        this.stuData = this.stuData.filter((o) => o.studentUserId !== id);
      });
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
  padding: 0;
  margin: 0;
}
.router-view {
  padding: 0 !important;
  background: #c5cce5 !important;
}

.stuGroup {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;

  .left {
    width: 345px;
    background: #e1e5f2;
    border-radius: 6px;

    ul {
      height: calc(100vh - 120px);
      overflow-y: auto;
      margin: 0 10px;
      text-align: center;

      li {
        display: flex;
        justify-content: space-between;
        padding: 0 10px;
        line-height: 36px;
        font-size: 14px;
        margin-top: 15px;
        background: #ffffff;
        border-radius: 6px;
        cursor: pointer;
        .groupName {
          width: 264px;
        }
      }

      li:hover {
        background: #b0bcec !important;
      }
    }
  }

  .right {
    width: 835px;
    border-radius: 6px;
    background: #fff;
    ul {
      height: calc(100vh - 120px);
      overflow-y: auto;
      margin: 0 10px;
      clear: both;
      li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 30px;
        line-height: 40px;
        font-size: 14px;
        span:last-child {
          color: #6c7af0;
          cursor: pointer;
        }
      }
      li:nth-child(odd) {
        background-color: #eff2fc;
      }
      li:nth-child(even) {
        background-color: #d6ddfa;
      }
    }
  }
}

.title {
  line-height: 36px;
  font-size: 14px;
  text-align: center;
  color: #fff;
  background: #636f9f;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}
.stuTools {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px;
  .stuNum {
    font-weight: 500;
    font-size: 16px;
  }
}
.liActive {
  background: #b0bcec !important;
}
</style>
