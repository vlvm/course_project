<template>
  <div>
    <a-radio-group
      v-model="subjectId"
      style="margin: 8px 0"
      button-style="solid"
      v-if="roleId === 8"
      @change="changeSubject"
    >
      <a-radio-button v-for="o in subjectList" :key="o.id" :value="o.id">
        {{ o.subjectName }}
      </a-radio-button>
    </a-radio-group>
    <a-collapse v-model="activeKey">
      <a-collapse-panel
        v-for="(item, i) in treeData"
        :key="i.toString()"
        :header="`${
          item.libType === 0 ? '素养' : item.libType === 1 ? '能力' : '知识点'
        }：${item.counts}个`"
      >
        <a-button
          slot="extra"
          size="small"
          @click.stop="addLabel(item)"
          v-if="roleId === 8"
        >
          添加根节点
        </a-button>
        <CheckBoxTree
          :list="item.libDTOList"
          @catalogClick="catalogClick"
          @rightClick="rightClick"
        ></CheckBoxTree>
      </a-collapse-panel>
    </a-collapse>
    <template v-if="roleId === 8">
      <ul
        class="menu"
        :style="{ left: position.x + 'px', top: position.y + 'px' }"
        v-if="position.x !== 0 || position.y !== 0"
      >
        <li @click="addCatalogue">添加子节点</li>
        <li @click="openChangeNameModal">重命名</li>
        <li @click="delCatalogue">删除</li>
      </ul>
    </template>
    <a-modal v-model="catalogueNameModal" title="重命名目录" @ok="rename">
      <a-input placeholder="请输入目录名称" v-model="catalogName" />
    </a-modal>
  </div>
</template>

<script>
import {
  getLabelList,
  addLabelContent,
  renameLabelContent,
  delLabelContent,
} from "@/request/label";
import { getSubjectList } from "@/request/setting/userInfo";

export default {
  name: "TagTree",
  props: {
    showRightMenu: {
      type: Boolean,
      default: true,
    },
    showCheckBox: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    CheckBoxTree: () => import("@/components/LabelTree"),
  },
  data() {
    return {
      subjectId: JSON.parse(sessionStorage.getItem("course_userInfo")).subjectId
        ? JSON.parse(sessionStorage.getItem("course_userInfo")).subjectId
        : 1,
      subjectList: [],
      roleId: JSON.parse(sessionStorage.getItem("course_userInfo")).roleId,
      activeKey: ["0", "1", "2"],
      treeData: [],
      catalogueNameModal: false,
      catalogName: "",
      position: {
        x: 0,
        y: 0,
      },
      catalogueData: {},
    };
  },
  mounted() {
    document.addEventListener("click", this.bodyCloseMenus);
    getSubjectList().then((res) => {
      this.subjectList = res.extra;
    });
    getLabelList(this.subjectId).then((res) => {
      console.log(res);
      this.treeData = res.extra;
    });
  },
  beforeDestroy() {
    document.removeEventListener("click", this.bodyCloseMenus);
  },
  watch: {
    activeKey(key) {
      console.log(key);
    },
  },
  methods: {
    changeSubject(e) {
      getLabelList(e.target.value).then((res) => {
        console.log(res);
        this.treeData = res.extra;
      });
    },
    loop(data, key, callback) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === key) {
          return callback(data[i], i, data);
        }
        if (data[i].childList) {
          this.loop(data[i].childList, key, callback);
        }
      }
    },
    bodyCloseMenus() {
      this.position = { x: 0, y: 0 };
    },
    openChangeNameModal() {
      this.catalogueNameModal = true;
      this.catalogName = this.catalogueData.catalogName;
    },
    delCatalogue() {
      const _this = this;
      const { id, libName } = this.catalogueData;
      this.$confirm({
        title: `确认删除【${libName}】吗？`,
        onOk() {
          delLabelContent([id]).then((res) => {
            if (res.extra) {
              _this.$message.success("已删除");
              getLabelList(_this.subjectId).then((res) => {
                _this.treeData = res.extra;
              });
            }
          });
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    },
    addCatalogue() {
      console.log(this.catalogueData);
      const {
        id,
        libIndex,
        libLevel,
        libNumber,
        libType,
        childList,
        subjectId,
      } = this.catalogueData;
      addLabelContent({
        libName: "新建子级蓝图",
        libParentId: id,
        libNumber: `${libNumber}.${
          childList === null ? 1 : childList.length + 1
        }`,
        libType: libType,
        libIndex: libIndex + 1,
        libLevel: libLevel + 1,
        subjectId,
      }).then(() => {
        getLabelList(subjectId).then((res) => {
          this.treeData = res.extra;
          this.$message.success("已添加");
        });
      });
    },
    catalogClick() {},
    rightClick(p, item) {
      this.position = p;
      this.catalogueData = item;
    },
    rename() {
      if (this.catalogName.length === 0) {
        this.$error({
          title: "目录名称不能为空！",
          content: "请检查目录并输入目录名称",
        });
        return false;
      }
      renameLabelContent([
        {
          id: this.catalogueData.id,
          libName: this.catalogName,
          libParentId: this.catalogueData.libParentId,
          libType: this.catalogueData.libType,
          libIndex: this.catalogueData.libType,
          libLevel: this.catalogueData.libLevel,
        },
      ]).then(() => {
        getLabelList(this.subjectId).then((res) => {
          this.treeData = res.extra;
          this.catalogueNameModal = false;
          this.$message.success("已修改");
        });
      });
    },
    // 添加根节点
    addLabel(item) {
      addLabelContent({
        libName: "新建蓝图",
        libParentId: 0,
        libNumber: this.treeData[item.libType].libDTOList.length + 1,
        libType: item.libType,
        libIndex: 1,
        libLevel: 1,
        subjectId: this.subjectId,
      }).then(() => {
        getLabelList(this.subjectId).then((res) => {
          this.treeData = res.extra;
        });
      });
    },
  },
};
</script>
<style scoped lang="less">
::v-deep .ant-collapse-header {
  padding-top: 5px;
  padding-bottom: 5px;
  background-color: #e1e5f2;
}
::v-deep .ant-collapse-content-box {
  height: 250px;
  overflow-y: auto;
}
.menu {
  position: fixed;
  z-index: 100;
  padding: 5px;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #d2d6e3;
  li {
    font-size: 12px;
    line-height: 20px;
  }
  li:hover {
    color: #fff;
    background-color: #8e99fa;
  }
}
</style>
