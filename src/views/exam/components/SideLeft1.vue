<template>
  <div class="left">
    <div class="tree">
      <Tab
        :tabIndex="role"
        :tab-data="[
          { id: 1, name: '学生' },
          { id: 2, name: '学校' },
          { id: 3, name: '个人' },
        ]"
        @changeIndex="changeIndex"
      ></Tab>
      <MyTree
        ref="directory"
        :role="role"
        :isOtherTeacher="isOtherTeacher"
        @changeTeacher="changeTeacher"
      ></MyTree>
    </div>
    <div class="btn">
      <a-button
        block
        type="primary"
        @click="(dirName = ''), (addDirectoryModal = true)"
        v-if="role !== 2"
      >
        添加根目录
      </a-button>
      <a-button
        block
        @click="visible = true"
        style="border-bottom-left-radius: 8px; border-bottom-right-radius: 8px"
        v-if="$route.meta.moduleName !== 'exam'"
      >
        回收站
      </a-button>
    </div>
    <!--添加根目录弹窗-->
    <a-modal
      v-model="addDirectoryModal"
      :maskClosable="false"
      title="添加根目录"
      @ok="addDirectory"
    >
      <a-input placeholder="请输入目录名称" v-model.trim="dirName" />
    </a-modal>
    <!--回收站弹窗-->
    <a-modal v-model="visible" :maskClosable="false" title="回收站" width="60%">
      <template slot="footer">
        <a-button key="back" type="danger" @click="deleteData"> 删除</a-button>
        <a-button key="submit" type="primary" @click="recoveryData">
          恢复
        </a-button>
      </template>
      <a-table
        :row-selection="rowSelection"
        :rowKey="(record) => record.id"
        :columns="columns"
        :data-source="data"
        :scroll="{ y: 330 }"
      >
        <span slot="sourceName" slot-scope="text, record">
          【{{
            record.sourceType === 0
              ? "目录"
              : record.sourceType === 1
              ? "课程"
              : "考题"
          }}】{{ text }}
        </span>
        <span slot="catalogNamePath" slot-scope="text, record">
          {{ text }}/{{
            record.sourceType === 0
              ? "目录"
              : record.sourceType === 1
              ? "课程"
              : "考题"
          }}/{{ record.sourceName }}
        </span>
      </a-table>
    </a-modal>
  </div>
</template>

<script>
// import _mapKeys from "lodash/mapKeys";
import { createSubdirectory, siblingSort } from "@/request/exam/directory";
import {
  getRecycleBinList,
  deleteRecycleBinData,
  recoveryRecycleBinData,
} from "@/request/recycleBin";

export default {
  name: "SideLeft",
  props: ["role", "isOtherTeacher"],
  components: {
    Tab: () => import("@/components/Tab"),
    MyTree: () => import("./MyTree"),
  },
  data() {
    return {
      tabIndex: 1,
      addDirectoryModal: false,
      dirName: "",
      visible: false,
      treeData: [],
      columns: [
        {
          title: "名称",
          dataIndex: "sourceName",
          scopedSlots: { customRender: "sourceName" },
        },
        {
          title: "原位置",
          dataIndex: "catalogNamePath",
          scopedSlots: { customRender: "catalogNamePath" },
        },
        {
          title: "删除时间",
          dataIndex: "createTime",
        },
      ],
      data: [],
      selectedRowKeys: [],
    };
  },
  computed: {
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRowKeys = selectedRowKeys;
          console.log(
            `selectedRowKeys: ${selectedRowKeys}`,
            "selectedRows: ",
            selectedRows
          );
        },
      };
    },
  },
  watch: {
    visible(val) {
      if (val) {
        this.getData();
      }
    },
  },
  mounted() {
    /* const timer = setInterval(() => {
      this.$store.dispatch("getRedDotList");
    }, 60000);

    // 通过$once来监听定时器，在beforeDestroy钩子可以被清除。
    this.$once("hook:beforeDestroy", () => {
      clearInterval(timer);
    });*/
    // this.$store.dispatch("getRedDotList");
  },
  methods: {
    addNodes(params, fun) {
      createSubdirectory(params).then((res) => {
        this.treeData = res.extra.map(
          ({ catalogName: name, childList: children, ...rest }) => ({
            name,
            children,
            ...rest,
          })
        );
        fun();
      });
    },
    // 切换学生学校个人
    changeIndex(index) {
      this.tabIndex = index;
      if (this.role === index) return;
      if (
        this.role === 1 &&
        (this.$route.name === "processing" || this.$route.name === "result")
      ) {
        this.$router.push("/exam/created");
      }
      this.$emit("update:role", index);
      this.$emit("update:isOtherTeacher", false);
      this.$refs.directory.getCatalogueList(index);
    },
    // 添加根目录
    addDirectory() {
      if (this.dirName === "") {
        this.$message.warning("请输入目录名称！");
        return;
      }
      createSubdirectory({
        pid: this.role,
        catalogName: this.dirName,
        catalogParentId: this.role,
        classify: this.role,
        catalogIndex: 1,
        catalogIdPath: this.role.toString(),
      }).then((res) => {
        if (res.extra) {
          this.$refs.directory.catalogueList = [
            ...this.$refs.directory.catalogueList,
            { ...res.extra, childList: [] },
          ];
          let params = this.$refs.directory.catalogueList.map((o, i) => {
            return { id: o.id, catalogIndex: i + 1 };
          });
          siblingSort(this.role, params);
          this.addDirectoryModal = false;
        }
      });
    },
    getData() {
      getRecycleBinList({
        page: 1,
        size: 99999,
      }).then((res) => {
        this.data = res.extra.records;
      });
    },
    recoveryData() {
      if (this.selectedRowKeys.length === 0) {
        this.$error({
          title: "请选择想要恢复的内容！",
        });
        return;
      }
      recoveryRecycleBinData(this.selectedRowKeys).then((res) => {
        if (res.extra) {
          this.data = this.data.filter(
            (item) => !this.selectedRowKeys.includes(item.id)
          );
          this.visible = false;
        }
      });
    },
    deleteData() {
      const _this = this;
      if (this.selectedRowKeys.length === 0) {
        this.$error({
          title: "请选择想要删除的内容！",
        });
        return;
      }
      this.$confirm({
        title: "是否确定要删除选中的数据?",
        okText: `删除`,
        // 点击蒙层是否允许关闭
        maskClosable: true,
        okType: "danger",
        cancelText: "取消",
        onOk: () => {
          deleteRecycleBinData(_this.selectedRowKeys).then((res) => {
            if (res.extra) {
              _this.data = _this.data.filter(
                (item) => !_this.selectedRowKeys.includes(item.id)
              );
            }
          });
        },
        onCancel: () => {
          console.log("Cancel");
        },
      });
    },
    changeTeacher(Boolean) {
      this.$emit("update:isOtherTeacher", Boolean);
    },
  },
};
</script>

<style scoped lang="less">
.left {
  width: 240px;
  height: calc(100vh - 20px);
  min-height: 500px;
  background: #e1e5f2;
  border-radius: 8px;

  .courseTree {
    height: calc(100vh - 88px);
  }

  .btn {
    width: 240px;

    ::v-deep .ant-btn {
      border-radius: 0;
    }
  }
}
</style>
