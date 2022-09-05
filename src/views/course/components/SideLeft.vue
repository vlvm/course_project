<template>
  <div class="left">
    <div class="tree">
      <Tab
        :tabIndex="role"
        :tab-data="tabData"
        @changeIndex="changeIndex"
      ></Tab>
      <Tree class="courseTree" :treeData="treeData" @addNodes="addNodes"></Tree>
    </div>
    <div class="btn">
      <a-button
        block
        style="border-bottom-left-radius: 8px; border-bottom-right-radius: 8px"
      >
        回收站
      </a-button>
    </div>
  </div>
</template>

<script>
// import _mapKeys from "lodash/mapKeys";
import { mapActions, mapState } from "vuex";
import { createSubdirectory, getDirectory } from "@/request/directory";

export default {
  name: "SideLeft",
  components: {
    Tab: () => import("../../../components/Tab"),
    Tree: () => import("@/components/ZTree"),
  },
  data() {
    return {
      tabIndex: "0",
      tabData: [
        { id: "0", name: "学生" },
        { id: "1", name: "学校" },
        { id: "2", name: "个人" },
      ],
      visible: false,
      treeData: [],
    };
  },
  computed: {
    ...mapState({
      role: (state) => state.role,
      catalogueList: (state) => state.catalogueList,
    }),
    rowSelection() {
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(
            `selectedRowKeys: ${selectedRowKeys}`,
            "selectedRows: ",
            selectedRows
          );
        },
      };
    },
  },
  mounted() {
    const mapTree = (org) => {
      const haveChildren =
        Array.isArray(org.childList) && org.childList.length > 0;
      return {
        id: org.id,
        name: org.catalogName,
        catalogIdPath: org.catalogIdPath,
        catalogNamePath: org.catalogNamePath,
        catalogIndex: org.catalogIndex,
        catalogParentId: org.catalogParentId,
        classify: org.classify,
        createTime: org.createTime,
        updateTime: org.updateTime,
        creator: org.creator,
        delTag: org.delTag,
        informTag: org.informTag,
        //
        open: true,
        // drag: true,
        children: haveChildren ? org.childList.map((i) => mapTree(i)) : [],
      };
    };
    getDirectory(this.role).then((res) => {
      this.treeData = res.extra.map((org) => mapTree(org));
      console.log(this.treeData);
    });
    this.$store.dispatch("getCatalogueList", parseInt(this.role));
  },
  methods: {
    ...mapActions({
      changeRole: "changeRole",
    }),
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
    changeIndex(index) {
      this.$store.dispatch("c/changeSelectId", "");
      this.$store.commit("c/checkedOtherItem", false);
      this.$store.dispatch("p/changeSelectId", "");
      this.tabIndex = index;
      if (this.role === index) return;
      if (
        this.role === "0" &&
        (this.$route.name === "processing" || this.$route.name === "result")
      ) {
        this.$router.push("/course/created");
      }

      function getData(type) {
        getDirectory(type).then((res) => {
          let nodes = JSON.parse(
            JSON.stringify(res.extra)
              .replace(/catalogName/g, "name")
              .replace(/childList/g, "children")
          );
          this.treeData = Object.assign([], nodes);
        });
      }
      this.changeRole(index).then(() => {
        if (this.role === "0") {
          getData(1);
        } else if (this.role === "1") {
          getDirectory(2).then((res) => {
            console.log(res);
          });
          let arr = [
            {
              id: 1,
              name: "本人目录",
              open: true,
              childOuter: false,
              children: [
                { id: 11, name: "目录1", dropRoot: false },
                { id: 12, name: "目录2", dropRoot: false },
                { id: 13, name: "目录3", dropRoot: false },
                { id: 14, name: "目录4", dropRoot: false },
              ],
            },
            {
              id: 2,
              name: "王老师的目录",
              open: false,
              noR: true,
              drag: false,
              dropInner: false,
              children: [
                {
                  id: 21,
                  name: "王老师的目录1",
                  noR: true,
                  drag: false,
                  dropInner: false,
                },
                {
                  id: 22,
                  name: "王老师的目录2",
                  noR: true,
                  drag: false,
                  dropInner: false,
                },
                {
                  id: 23,
                  name: "王老师的目录3",
                  noR: true,
                  drag: false,
                  dropInner: false,
                },
                {
                  id: 24,
                  name: "王老师的目录4",
                  noR: true,
                  drag: false,
                  dropInner: false,
                },
              ],
            },
            {
              id: 3,
              name: "李老师的目录",
              open: false,
              noR: true,
              drag: false,
              dropInner: false,
              children: [
                {
                  id: 31,
                  name: "李老师的目录1",
                  noR: true,
                  drag: false,
                  dropInner: false,
                },
                {
                  id: 32,
                  name: "李老师的目录2",
                  noR: true,
                  drag: false,
                  dropInner: false,
                },
                {
                  id: 33,
                  name: "李老师的目录3",
                  noR: true,
                  drag: false,
                  dropInner: false,
                },
                {
                  id: 34,
                  name: "李老师的目录4",
                  noR: true,
                  drag: false,
                  dropInner: false,
                },
              ],
            },
            {
              id: 4,
              name: "张老师的目录",
              open: false,
              noR: true,
              drag: false,
              dropInner: false,
              children: [
                {
                  id: 41,
                  name: "张老师的目录1",
                  noR: true,
                  drag: false,
                  dropInner: false,
                },
                {
                  id: 42,
                  name: "张老师的目录2",
                  noR: true,
                  drag: false,
                  dropInner: false,
                },
                {
                  id: 43,
                  name: "张老师的目录3",
                  noR: true,
                  drag: false,
                  dropInner: false,
                },
                {
                  id: 44,
                  name: "张老师的目录4",
                  noR: true,
                  drag: false,
                  dropInner: false,
                },
              ],
            },
          ];
          this.treeData = Object.assign([], arr);
        } else if (this.role === "2") {
          getData(3);
        }
        console.log("end:", this.role);
      });
    },
    handleOk(e) {
      console.log(e);
      this.visible = false;
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
