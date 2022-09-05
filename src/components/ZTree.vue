<template>
  <div>
    <div
      :id="idName"
      ref="treeDmo"
      class="ztree"
      :style="{ height: height + 'px' }"
    ></div>
    <div class="rMenu" v-show="!hideRMenu">
      <ul>
        <li class="m_rename" @click="editName">重命名</li>
        <li class="m_del" @click="removeTreeNode">删除</li>
        <li class="m_copy" @click="copyTreeNode" v-if="!hiedIcon">创建副本</li>
        <li class="m_add" @click="addTreeNode">添加目录</li>
      </ul>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import "ztree";
import "ztree/css/zTreeStyle/zTreeStyle.css";
import { mapState } from "vuex";
import merge from "webpack-merge";
import {
  createSubdirectory,
  deleteDirectory,
  rename,
  copyDirectory,
  moveDirectory,
} from "@/request/directory";

export default {
  name: "ZTree",
  props: {
    treeData: {
      type: Array,
      default: () => [],
    },
    height: {
      type: Number,
      default: () => 200,
    },
    idName: {
      type: String,
      default: () => "treeDmo",
    },
    hiedIcon: {
      type: Boolean,
      default: () => false,
    },
    showCheckBox: {
      type: Boolean,
      default: () => false,
    },
    showRightMenu: {
      type: Boolean,
      default: () => true,
    },
  },
  data() {
    const _this = this;
    return {
      hideRMenu: true,
      addCount: 1,
      zTree: null,
      rMenu: null,
      setting: {
        view: {
          showIcon: !_this.hiedIcon,
        },
        check: {
          enable: _this.showCheckBox,
        },
        edit: {
          enable: true,
          showRemoveBtn: false,
          showRenameBtn: false,
          drag: {
            isCopy: false,
            isMove: true,
            prev: _this.dropPrev,
            next: _this.dropNext,
            inner: _this.dropInner,
          },
        },
        callback: {
          onRightClick: _this.OnRightClick,
          beforeRename: _this.beforeRename,
          beforeDrag: _this.beforeDrag,
          onDrop: _this.onDrop,
          beforeDrop: _this.beforeDrop,
          onClick: _this.onClick,
        },
      },
      zNodes: this.treeData,
      curDragNodes: null,
    };
  },
  computed: {
    ...mapState({
      role: (state) => state.role,
    }),
  },
  watch: {
    treeData: {
      handler(val) {
        this.zNodes = val;
        this.zTree = $.fn.zTree.init($(`#${this.idName}`), this.setting, val);
      },
      deep: true,
    },
  },
  mounted() {
    this.zTree = $.fn.zTree.init(
      $(`#${this.idName}`),
      this.setting,
      this.zNodes
    );
  },
  methods: {
    OnRightClick(event, treeId, treeNode) {
      if (!this.showRightMenu) return;
      if (
        !treeNode &&
        event.target.tagName.toLowerCase() !== "button" &&
        $(event.target).parents("a").length === 0
      ) {
        this.zTree.cancelSelectedNode();
        this.showRMenu("root", event.clientX, event.clientY);
      } else if (treeNode && !treeNode.noR) {
        this.zTree.selectNode(treeNode);
        if (treeNode.name === "本人目录") {
          this.showRMenu("self", event.clientX, event.clientY);
        } else {
          this.showRMenu("node", event.clientX, event.clientY);
        }
      }
    },
    showRMenu(type, x, y) {
      this.hideRMenu = false;
      if (type === "root") {
        if (this.role === "1") {
          $(".m_rename,.m_del,.m_copy,.m_add").hide();
        } else {
          $(".m_rename,.m_del,.m_copy").hide();
          $(".m_add")
            .show()
            .text(`添加${this.hiedIcon ? "根节点" : "根目录"}`);
        }
      } else if (type === "self") {
        $(".m_rename,.m_del,.m_copy").hide();
        $(".m_add")
          .show()
          .text(`添加${this.hiedIcon ? "子节点" : "子目录"}`);
      } else {
        $(".m_rename,.m_del,.m_copy").show();
        $(".m_add")
          .show()
          .text(`添加${this.hiedIcon ? "子节点" : "子目录"}`);
      }

      y += document.body.scrollTop;
      x += document.body.scrollLeft;
      $(".rMenu").css({
        top: y + "px",
        left: x + "px",
        visibility: "visible",
      });

      $("body").bind("mousedown", this.onBodyMouseDown);
    },
    onBodyMouseDown(event) {
      if (
        !(
          event.target.id === "rMenu" ||
          $(event.target).parents(".rMenu").length > 0
        )
      ) {
        this.hideRMenu = true;
      }
    },
    // 添加子节点
    addTreeNode() {
      /* let newNode = {
        id: this.addCount,
        name: "新建目录",
        open: true,
        children: [],
      };*/
      if (this.zTree.getSelectedNodes()[0]) {
        createSubdirectory({
          pid: this.zTree.getSelectedNodes()[0].id,
          catalogName: "新建目录",
          catalogParentId: this.zTree.getSelectedNodes()[0].id,
          classify: parseInt(this.role) + 1,
          catalogIndex: 1,
          catalogIdPath: this.zTree.getSelectedNodes()[0].catalogIdPath,
        }).then((res) => {
          let nodes = JSON.parse(
            JSON.stringify(res.extra)
              .replace(/catalogName/g, "name")
              .replace(/childList/g, "children")
          );
          this.zTree.addNodes(this.zTree.getSelectedNodes()[0], nodes);
          this.hideRMenu = true;
        });
      } else {
        createSubdirectory({
          pid: parseInt(this.role) + 1,
          catalogName: "新建目录",
          catalogParentId: parseInt(this.role) + 1,
          classify: parseInt(this.role) + 1,
          catalogIndex: 1,
          catalogIdPath: "1",
        }).then((res) => {
          let nodes = JSON.parse(
            JSON.stringify(res.extra)
              .replace(/catalogName/g, "name")
              .replace(/childList/g, "children")
          );
          this.zTree.addNodes(null, nodes);
          this.hideRMenu = true;
        });
      }
      this.addCount++;
    },
    // 复制节点
    copyTreeNode() {
      let newNode = this.zTree.getSelectedNodes()[0];
      // newNode.name = `${newNode.name}的副本`;
      if (this.zTree.getSelectedNodes()[0]) {
        copyDirectory({
          id: newNode.id,
          catalogName: `${newNode.name}的副本`,
        }).then((res) => {
          console.log(res);
        });
        // this.zTree.addNodes(
        //   this.zTree.getSelectedNodes()[0].getParentNode(),
        //   newNode
        // );
        this.hideRMenu = true;
      } else {
        this.zTree.addNodes(null, newNode);
        this.hideRMenu = true;
      }
      this.addCount++;
    },
    // 删除节点
    removeTreeNode() {
      const _this = this;
      this.hideRMenu = true;
      let nodes = this.zTree.getSelectedNodes();
      if (nodes && nodes.length > 0) {
        if (nodes[0].children && nodes[0].children.length > 0) {
          this.$confirm({
            title: `要删除的目录【${nodes[0].name}】是父级目录，如果删除将连同子目录一起删除。请确认！`,
            onOk() {
              deleteDirectory([nodes[0].id]).then((res) => {
                console.log(res);
                _this.zTree.removeNode(nodes[0]);
              });
            },
            onCancel() {
              console.log("Cancel");
            },
          });
        } else {
          this.$confirm({
            title: `确认删除目录【${nodes[0].name}】吗？`,
            onOk() {
              deleteDirectory([nodes[0].id]).then((res) => {
                console.log(res);
                _this.zTree.removeNode(nodes[0]);
              });
            },
            onCancel() {
              console.log("Cancel");
            },
          });
        }
      }
    },
    // 重命名
    editName() {
      let nodes = this.zTree.getSelectedNodes();
      if (nodes && nodes.length > 0) {
        this.zTree.editName(nodes[0]);
        this.hideRMenu = true;
      }
    },
    beforeRename(treeId, treeNode, newName) {
      if (newName.length === 0) {
        this.$error({
          title: "目录名称不能为空！",
          content: "请检查目录并输入目录名称",
        });
        return false;
      }
      rename({
        id: treeNode.id,
        catalogName: newName,
      }).then((res) => {
        console.log(res);
      });
      return true;
    },
    beforeDrag(treeId, treeNodes) {
      for (let i = 0, l = treeNodes.length; i < l; i++) {
        if (treeNodes[i].drag === false) {
          this.curDragNodes = null;
          return false;
        } else if (
          treeNodes[i].parentTId &&
          treeNodes[i].getParentNode().childDrag === false
        ) {
          this.curDragNodes = null;
          return false;
        }
      }
      this.curDragNodes = treeNodes;
      return true;
    },
    //
    dropNext(treeId, nodes, targetNode) {
      let pNode = targetNode.getParentNode();
      if (pNode && pNode.dropInner === false) {
        return false;
      } else {
        for (let i = 0, l = this.curDragNodes.length; i < l; i++) {
          let curPNode = this.curDragNodes[i].getParentNode();
          if (
            curPNode &&
            curPNode !== targetNode.getParentNode() &&
            curPNode.childOuter === false
          ) {
            return false;
          }
        }
      }
      return true;
    },
    //
    dropInner(treeId, nodes, targetNode) {
      if (targetNode && targetNode.dropInner === false) {
        return false;
      } else {
        for (let i = 0, l = this.curDragNodes.length; i < l; i++) {
          if (!targetNode && this.curDragNodes[i].dropRoot === false) {
            return false;
          }
          // else if (targetNode.getParentNode().dropInner === false) {
          //   return false;
          // } else if (targetNode.childOuter === false) {
          //   return false;
          // }
          else if (
            this.curDragNodes[i].parentTId &&
            this.curDragNodes[i].getParentNode() !== targetNode &&
            this.curDragNodes[i].getParentNode().childOuter === false
          ) {
            return false;
          }
        }
      }
      return true;
    },
    //
    dropPrev(treeId, nodes, targetNode) {
      const pNode = targetNode.getParentNode();
      if (pNode && pNode.dropInner === false) {
        return false;
      } else {
        for (let i = 0, l = this.curDragNodes.length; i < l; i++) {
          let curPNode = this.curDragNodes[i].getParentNode();
          if (
            curPNode &&
            curPNode !== targetNode.getParentNode() &&
            curPNode.childOuter === false
          ) {
            return false;
          }
        }
      }
      return true;
    },
    // 拖拽结束回调
    beforeDrop(treeId, treeNodes, targetNode) {
      return targetNode ? targetNode.drop !== false : true;
    },
    onDrop(event, treeId, treeNodes, targetNode, moveType) {
      console.log(event, treeId, treeNodes, targetNode, moveType);
      console.log("--------------------");
      console.log(treeNodes[0]);
      console.log("--------------------");
      moveDirectory({
        tpid: targetNode.id,
        // id: treeNodes[0].id,
        // catalogName: treeNodes[0].name,
        id: targetNode.id,
        catalogName: targetNode.name,
      }).then((res) => {
        console.log(res);
      });
    },
    // 节点点击
    onClick(event, treeId, treeNode) {
      console.log(event, treeId, treeNode);
      let returnedItem = true;
      function find(arr, id) {
        // 利用foreach循环遍历
        arr.forEach((item) => {
          // 判断递归结束条件
          if (item.id === id) {
            // 存储数据到空数组
            returnedItem = false;
          } else if (item.children != null) {
            // 判断chlidren是否有数据
            // 递归调用
            find(item.children, id);
          }
        });
        return returnedItem;
      }
      this.$store.commit(
        "c/checkedOtherItem",
        find([this.zTree.getNodes()[0]], treeNode.id)
      );

      this.$router.replace({
        query: merge(this.$route.query, { catalogId: treeNode.id }),
      });
    },
  },
};
</script>

<style scoped>
::v-deep .ztree li span.button.ico_docu {
  /*background-position: -147px 0;*/
  background-position: -110px 0;
}

::v-deep .ztree li a.curSelectedNode {
  /*background-color: #1990ff;*/
}

::v-deep .ztree * {
  font-size: 14px; /* 每个节点的字体大小 */
}

::v-deep .ztree li {
  line-height: 20px;
}
.rMenu {
  position: fixed;
  visibility: hidden;
  top: 0;
  background-color: #fff;
  text-align: left;
  padding: 2px;
}

.rMenu ul {
  margin-bottom: 0;
}

.rMenu ul li {
  margin: 1px 0;
  padding: 0 5px;
  cursor: pointer;
  font-size: 12px;
  list-style: none outside none;
  background-color: #e1e5f2;
}
</style>
