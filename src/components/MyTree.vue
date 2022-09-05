<template>
  <div style="position: relative">
    <div
      style="
        height: calc(100vh - 120px);
        padding: 5px 5px 180px;
        overflow-y: auto;
      "
      :class="{ noRoot: role === 2 }"
    >
      <CatalogueTree
        :redDotIds="$store.state.catalogIds"
        :list="catalogueList"
        @catalogClick="catalogClick"
        @rightClick="rightClick"
      ></CatalogueTree>
    </div>
    <ul
      class="menu"
      :style="{ left: position.x + 'px', top: position.y + 'px' }"
      v-if="
        catalogueData.creator === creator &&
        (position.x !== 0 || position.y !== 0)
      "
    >
      <li
        @click="(dirName = ''), (addDirectoryModal = true)"
        v-if="
          catalogueData.catalogParentId !== 0 &&
          catalogueData.catalogParentId !== null
        "
      >
        添加子目录
      </li>
      <template
        v-if="
          catalogueData.catalogParentId !== 2 &&
          catalogueData.catalogParentId !== 0 &&
          catalogueData.catalogParentId !== null
        "
      >
        <li @click="openChangeNameModal">重命名</li>
        <li @click="delCatalogue">删除</li>
        <!--<template v-if="!catalogueData.childList">-->
        <li @click="copyCatalogue">创建副本</li>
        <li @click="openMoveCatalogue(1)">复制到</li>
        <!--</template>-->
        <li @click="openMoveCatalogue(0)">移动到</li>
        <template v-if="siblingData.length > 1">
          <!--<li @click="siblingSort">同级目录调整</li>-->
          <li @click="dirUp" v-show="!isTop">上移</li>
          <li @click="dirDown" v-show="!isLast">下移</li>
        </template>
      </template>
    </ul>
    <ul
      class="menu"
      :style="{ left: position.x + 'px', top: position.y + 'px' }"
      v-if="
        catalogueData.creator !== creator &&
        role === 2 &&
        catalogueData.catalogParentId !== 2 &&
        (position.x !== 0 || position.y !== 0)
      "
    >
      <li @click="openMoveCatalogue(1)">复制到</li>
    </ul>
    <!--重命名目录弹窗-->
    <a-modal
      v-model="catalogueNameModal"
      :maskClosable="false"
      title="重命名目录"
      @ok="rename"
    >
      <a-input placeholder="请输入目录名称" v-model="catalogName" />
    </a-modal>
    <!--添加子目录弹窗-->
    <a-modal
      v-model="addDirectoryModal"
      :maskClosable="false"
      title="添加子目录"
      @ok="addCatalogue"
    >
      <a-input placeholder="请输入目录名称" v-model.trim="dirName" />
    </a-modal>
    <!--选择移动目录-->
    <a-modal v-model="dirModal" :width="870" title="选择目录" @ok="chooseDir">
      <div class="radioTree">
        <div class="tree1">
          <h3>学生目录</h3>
          <RadioTree
            ref="tree1"
            :list="list1"
            :role="1"
            :radioTreeId="treeId"
            @chooseTreeData="chooseTreeData"
          ></RadioTree>
        </div>
        <div class="tree2">
          <h3>学校目录</h3>
          <RadioTree
            ref="tree2"
            :list="list2"
            :role="2"
            :radioTreeId="treeId"
            @chooseTreeData="chooseTreeData"
          ></RadioTree>
        </div>
        <div class="tree3">
          <h3>个人目录</h3>
          <RadioTree
            ref="tree3"
            :list="list3"
            :role="3"
            :radioTreeId="treeId"
            @chooseTreeData="chooseTreeData"
          ></RadioTree>
        </div>
      </div>
    </a-modal>
    <!--同级目录排序-->
    <a-modal
      class="sortBoxModal"
      v-model="dirSortModal"
      :width="800"
      title="目录顺序调整（点击目录拖拽到合适的地方）"
      @ok="dirSort"
    >
      <div class="sortBox">
        <draggable
          v-model="dirData"
          filter=".forbid"
          ghost-class="ghost"
          animation="100"
          @start="onStart"
          @end="onEnd"
        >
          <transition-group>
            <div
              class="dragItem"
              :class="{ active: $route.query.catalogId == item.id }"
              v-for="item in dirData"
              :key="item.id"
            >
              <a-icon type="caret-right" v-if="item.childList" />
              <a-icon type="folder-open" /> {{ item.catalogName }}
            </div>
          </transition-group>
        </draggable>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from "vuex";
import merge from "webpack-merge";
import draggable from "vuedraggable";
import {
  copyDirectory,
  copyDirectoryTo,
  createSubdirectory,
  deleteDirectory,
  getDirectory,
  moveDirectory,
  rename,
  siblingSort,
} from "@/request/directory";
import { getCourseContentById } from "@/request/course/created/course";
export default {
  name: "MytTree",
  components: {
    draggable,
    CatalogueTree: () => import("@/components/CatalogueTree"),
    RadioTree: () => import("@/components/RadioTree"),
  },
  data() {
    return {
      creator: JSON.parse(sessionStorage.getItem("course_userInfo")).userId,
      catalogueNameModal: false,
      dirModal: false,
      addDirectoryModal: false,
      dirName: "",
      catalogName: "",
      position: {
        x: 0,
        y: 0,
      },
      catalogueData: {},
      isCopey: false,
      treeId: "",
      list1: [],
      list2: [],
      list3: [],
      dirSortModal: false,
      dirData: [],
      drag: false,
    };
  },
  computed: {
    ...mapState({
      role: (state) => state.role,
      catalogueList: (state) => state.catalogueList,
      isOtherTeacher: (state) => state.c.isOtherTeacher,
      courseId: (state) => state.c.courseId,
      courseContentId: (state) => state.c.courseContentId,
      contentData: (state) => state.c.contentData,
    }),
    siblingData() {
      let arr = [];
      const { id } = this.catalogueData;
      this.loop(this.catalogueList, id, (item, i, data) => {
        arr = data;
      });
      return arr;
    },
    isTop() {
      return this.catalogueData.id === this.siblingData[0].id;
    },
    isLast() {
      return (
        this.catalogueData.id ===
        this.siblingData[this.siblingData.length - 1].id
      );
    },
  },
  mounted() {
    document.addEventListener("click", this.bodyCloseMenus);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.bodyCloseMenus);
  },
  methods: {
    ...mapMutations({ setCatalogueList: "setCatalogueList" }),
    ...mapMutations("c", [
      "setCourseId",
      "changeCourseContentId",
      "replaceContentNoFilter",
      "checkedOtherItem",
    ]),
    ...mapActions("c", ["getCourseListData", "getCourseTagAttrData"]),
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
    changeList(data, key, arr) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === key) {
          for (let j = 0; j < arr.length; j++) {
            data[i] = arr[j];
          }
          return;
        }
        if (data[i].childList) {
          this.changeList(data[i].childList, key, arr);
        }
      }
    },
    bodyCloseMenus() {
      this.position = { x: 0, y: 0 };
    },
    catalogClick(item) {
      this.catalogueData = item;
      this.changeCourseContentId("");
      /* if (item.catalogParentId === 0 || item.catalogParentId === null) {
        this.checkedOtherItem(true);
      } else {
        this.checkedOtherItem(false);
      }*/
      if (item.classify === 2 && item.creator !== this.creator) {
        this.checkedOtherItem(true);
      } else {
        this.checkedOtherItem(false);
      }
      this.$forceUpdate();
      if (item.id == this.$route.query.catalogId || item.id === 0) return;
      this.getCourseListData(item.id).then((r) => {
        if (r.extra.length > 0) {
          this.setCourseId(r.extra[0].id);
          getCourseContentById(r.extra[0].id).then((res) => {
            this.replaceContentNoFilter(res.extra);
            if (res.extra.length > 0) {
              this.getCourseTagAttrData(r.extra[0].id);
              this.$store.commit("c/setTitleIds");
            }
          });
        } else {
          this.setCourseId("");
          this.replaceContentNoFilter([]);
        }
      });
      this.$router.replace({
        query: merge(this.$route.query, { catalogId: item.id }),
      });
    },
    rightClick(p, item) {
      this.changeCourseContentId("");
      this.position = p;
      this.catalogueData = item;
      if (item.id == this.$route.query.catalogId || item.id === 0) return;
      this.getCourseListData(item.id).then((r) => {
        if (r.extra.length > 0) {
          this.setCourseId(r.extra[0].id);
          getCourseContentById(r.extra[0].id).then((res) => {
            this.replaceContentNoFilter(res.extra);
            if (res.extra.length > 0) {
              this.getCourseTagAttrData(r.extra[0].id);
              this.$store.commit("c/setTitleIds");
            }
          });
        } else {
          this.setCourseId("");
          this.replaceContentNoFilter([]);
        }
      });
      this.$router.replace({
        query: merge(this.$route.query, { catalogId: item.id }),
      });
    },
    openChangeNameModal() {
      this.catalogueNameModal = true;
      this.catalogName = this.catalogueData.catalogName;
    },
    rename() {
      const { id } = this.catalogueData;
      if (this.catalogName.length === 0) {
        this.$error({
          title: "目录名称不能为空！",
          content: "请检查目录并输入目录名称",
        });
        return false;
      }
      rename({
        id: id,
        catalogName: this.catalogName,
      }).then((res) => {
        if (res.extra) {
          this.loop(this.catalogueList, id, (item) => {
            item.catalogName = this.catalogName;
          });
          this.setCatalogueList(this.catalogueList);
          this.$message.success("修改成功");
        } else {
          this.$message.error("修改失败！");
        }
        this.catalogueNameModal = false;
      });
    },
    // 删除目录
    delCatalogue() {
      const _this = this;
      const { id, catalogName } = this.catalogueData;
      this.$confirm({
        title: `确认删除目录【${catalogName}】吗？`,
        onOk() {
          deleteDirectory([id]).then((res) => {
            if (res.extra) {
              _this.loop(_this.catalogueList, id, (item, i, data) => {
                data.splice(i, 1);
              });
              _this.setCatalogueList(_this.catalogueList);
              _this.$router.replace({
                query: merge(_this.$route.query, { catalogId: "" }),
              });
              _this.replaceContentNoFilter([]);
              _this.$store.commit("c/setCourseId", "");
              _this.$store.commit("c/setCourseList", []);
              _this.$message.success("已删除");
            }
          });
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    },
    addCatalogue() {
      if (this.dirName === "") {
        this.$message.warning("请输入目录名称！");
        return;
      }
      const { id, catalogIdPath, catalogParentId } = this.catalogueData;
      createSubdirectory({
        pid: id,
        catalogName: this.dirName,
        catalogParentId: catalogParentId,
        classify: this.role,
        catalogIndex: 1,
        catalogIdPath: catalogIdPath,
      }).then((res) => {
        this.loop(this.catalogueList, id, (item) => {
          if (!item.childList) {
            item.childList = [];
            item.childList.push(res.extra);
          } else {
            item.childList.push(res.extra);
          }
        });
        this.setCatalogueList(this.catalogueList);
        this.loop(this.catalogueList, id, (item) => {
          let params = item.childList.map((o, i) => {
            return { id: o.id, catalogIndex: i + 1 };
          });
          siblingSort(item.id, params);
        });
        /*if (catalogParentId === 2) {
          this.loop(this.catalogueList, id, (item) => {
            let params = item.childList.map((o, i) => {
              return { id: o.id, catalogIndex: i + 1 };
            });
            siblingSort(item.id, params);
          });
        } else {
          this.loop(this.catalogueList, id, (item, i, data) => {
            let params = data.map((o, i) => {
              return { id: o.id, catalogIndex: i + 1 };
            });
            siblingSort(catalogParentId, params);
          });
        }*/
        this.addDirectoryModal = false;
      });
    },
    // 创建副本
    copyCatalogue() {
      const { id, catalogName } = this.catalogueData;
      copyDirectory({
        id: id,
        catalogName: `${catalogName}-副本`,
      }).then((res) => {
        if (res.extra) {
          this.loop(this.catalogueList, id, (item, i, data) => {
            data.push(res.extra);
          });
          this.setCatalogueList(this.catalogueList);
        }
      });
    },
    // 打开移动到窗口
    openMoveCatalogue(type) {
      if (type === 0) {
        this.isCopey = false;
      } else {
        this.isCopey = true;
      }
      getDirectory(1).then((res) => {
        if (res.extra.length === 0) {
          this.list1 = [{ id: 1, catalogName: "学生目录" }];
        } else {
          this.list1 = res.extra;
        }
      });
      getDirectory(2).then((res) => {
        this.list2 = res.extra.filter(
          (o) => o.catalogParentId === 2 && o.creator === this.creator
        );
      });
      getDirectory(3).then((res) => {
        if (res.extra.length === 0) {
          this.list3 = [{ id: 3, catalogName: "个人目录" }];
        } else {
          this.list3 = res.extra;
        }
      });
      this.dirModal = true;
      this.treeId = "";
    },
    chooseTreeData({ item }) {
      this.treeId = item.id;
    },
    // 选择目录
    chooseDir() {
      if (this.treeId === "") {
        this.$error({
          content: "请先选择目录!",
        });
        return;
      }
      if (this.treeId == this.$route.query.catalogId) {
        this.$error({
          content: "不能选择当前目录，请选择其他目录!",
        });
        this.treeId = "";
        return;
      }
      if (this.isCopey) {
        copyDirectoryTo({
          targetId: this.treeId,
          id: this.catalogueData.id,
        }).then(() => {
          this.$message.success("已复制");
          this.dirModal = false;
        });
        return;
      }
      moveDirectory({
        tpid: this.treeId,
        id: this.catalogueData.id,
      }).then(() => {
        this.$store.dispatch("getCatalogueList", this.role).then((res) => {
          if (res.extra.length > 0) {
            this.$router.replace({
              query: merge(this.$route.query, {
                catalogId: res.extra[0].id,
              }),
            });
            this.getCourseListData(res.extra[0].id).then((r) => {
              if (r.extra.length > 0) {
                this.setCourseId(r.extra[0].id);
                getCourseContentById(r.extra[0].id).then((res) => {
                  this.replaceContentNoFilter(res.extra);
                  this.getCourseTagAttrData(r.extra[0].id);
                  this.$store.commit("c/setTitleIds");
                });
              }
            });
          } else {
            this.$router.replace({
              query: merge(this.$route.query, {
                catalogId: "",
              }),
            });
            this.setCourseId("");
            this.$store.commit("c/setCourseList", []);
            this.replaceContentNoFilter([]);
          }
          this.$message.success("已移动");
          this.dirModal = false;
        });
      });
    },
    // 打开排序窗口初始化数据
    siblingSort() {
      const { id } = this.catalogueData;
      this.loop(this.catalogueList, id, (item, i, data) => {
        this.dirData = data;
        this.dirSortModal = true;
      });
    },
    // 根目录上移
    dirUp() {
      const { id, catalogParentId } = this.catalogueData;
      this.loop(this.catalogueList, id, (item, i, data) => {
        this.upGo(data, i);
        let params = data.map((o, i) => {
          return { id: o.id, catalogIndex: i + 1 };
        });
        this.setCatalogueList(this.catalogueList);
        siblingSort(catalogParentId, params);
      });
    },
    // 根目录下移
    dirDown() {
      const { id, catalogParentId } = this.catalogueData;
      this.loop(this.catalogueList, id, (item, i, data) => {
        this.downGo(data, i);
        let params = data.map((o, i) => {
          return { id: o.id, catalogIndex: i + 1 };
        });
        this.setCatalogueList(this.catalogueList);
        siblingSort(catalogParentId, params);
      });
    },
    // 上移
    upGo(fieldData, index) {
      if (index !== 0) {
        fieldData[index] = fieldData.splice(index - 1, 1, fieldData[index])[0];
      } else {
        fieldData.push(fieldData.shift());
      }
    },
    // 下移
    downGo(fieldData, index) {
      if (index != fieldData.length - 1) {
        fieldData[index] = fieldData.splice(index + 1, 1, fieldData[index])[0];
      } else {
        fieldData.unshift(fieldData.splice(index, 1)[0]);
      }
    },
    dirSort() {
      const { id, catalogParentId } = this.catalogueData;
      let params = this.dirData.map((o, i) => {
        return { id: o.id, catalogIndex: i + 1 };
      });
      this.changeList(this.catalogueList, id, this.dirData);
      siblingSort(catalogParentId, params).then((res) => {
        if (res.extra) {
          this.$message.success("调整成功！");
        }
      });
      this.setCatalogueList(this.catalogueList);
      this.dirSortModal = false;
    },
    //开始拖拽事件
    onStart() {
      this.drag = true;
    },
    //拖拽结束事件
    onEnd() {
      this.drag = false;
    },
  },
};
</script>

<style scoped lang="less">
.menu {
  position: fixed;
  z-index: 100;
  background: #fff;
  border-radius: 4px;
  border: 1px solid #d2d6e3;
  li {
    width: 150px;
    font-size: 14px;
    line-height: 30px;
    text-align: center;
  }
  li:hover {
    color: #fff;
    background-color: #c7d0f2;
  }
}
.noRoot {
  height: calc(100vh - 88px) !important;
}
.radioTree {
  display: flex;
  justify-content: space-between;
  .tree1,
  .tree2,
  .tree3 {
    width: 32%;
    min-height: 250px;
    overflow-y: auto;
    border: 1px solid #636f9f;
    border-radius: 4px;
    h3 {
      text-align: center;
      background: #636f9f;
      color: #fff;
    }
  }
}
.sortBoxModal {
  ::v-deep .ant-modal-body {
    max-height: 600px;
    overflow-y: auto;
  }
}
.sortBox {
  height: 500px;
  overflow-y: auto;
  .dragItem {
    color: #000;
    padding: 5px 10px;
    border: 1px solid #00000020;
    cursor: move;
    background-color: #f1f2f5;
  }
  .dragItem:not(div:last-child) {
    border-bottom: 0;
  }
}
.active {
  font-weight: 500;
  color: #fff !important;
  background-color: #8e99fa !important;
}
.ghost {
  color: #fff !important;
  background: #c7d0f2 !important;
}
</style>
