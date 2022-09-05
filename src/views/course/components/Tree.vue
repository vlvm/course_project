<template>
  <div>
    <a-tree
      blockNode
      :tree-data="gData"
      :default-expanded-keys="expandedKeys"
      draggable
      @select="onSelect"
      @expand="onExpand"
      @dragenter="onDragEnter"
      @drop="onDrop"
    >
      <a-icon slot="switcherIcon" type="down" />
      <template #title="{ key: treeKey, title }">
        <a-dropdown :trigger="['contextmenu']">
          <span>{{ title }}</span>
          <template #overlay>
            <a-menu
              @click="
                ({ key: menuKey }) => onContextMenuClick(treeKey, menuKey)
              "
            >
              <a-menu-item key="1">重命名</a-menu-item>
              <a-menu-item key="2">删除</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </a-tree>
    <div :style="this.tmpStyle" v-if="this.NodeTreeItem">
      <a-button
        type="primary"
        title="添加"
        icon="plus"
        size="small"
        @click="orgAdd"
      />
      <a-button
        type="primary"
        title="编辑"
        icon="edit"
        size="small"
        @click="orgEdit"
      />
      <a-button
        type="primary"
        title="删除"
        icon="delete"
        size="small"
        @click="orgDelete"
      />
    </div>
  </div>
</template>

<script>
const gData = [
  {
    title: "目录1",
    key: "0-0",
    children: [
      { title: "目录1-1", key: "0-0-0" },
      { title: "目录1-2", key: "0-0-1" },
    ],
  },
  {
    title: "目录2",
    key: "0-1",
    children: [
      { title: "目录2-1", key: "0-1-0" },
      { title: "目录2-2", key: "0-1-1" },
    ],
  },
];
export default {
  name: "tree-component",
  data() {
    return {
      gData,
      expandedKeys: ["0-0", "0-0-0"],
    };
  },
  methods: {
    onSelect(keys, event) {
      console.log("Trigger Select", keys, event);
    },
    onExpand() {
      console.log("Trigger Expand");
    },
    onDragEnter(info) {
      console.log(info);
      // expandedKeys 需要受控时设置
      // this.expandedKeys = info.expandedKeys
    },
    onDrop(info) {
      console.log(info);
      const dropKey = info.node.eventKey;
      const dragKey = info.dragNode.eventKey;
      const dropPos = info.node.pos.split("-");
      const dropPosition =
        info.dropPosition - Number(dropPos[dropPos.length - 1]);
      const loop = (data, key, callback) => {
        data.forEach((item, index, arr) => {
          if (item.key === key) {
            return callback(item, index, arr);
          }
          if (item.children) {
            return loop(item.children, key, callback);
          }
        });
      };
      const data = [...this.gData];

      // Find dragObject
      let dragObj;
      loop(data, dragKey, (item, index, arr) => {
        arr.splice(index, 1);
        dragObj = item;
      });
      if (!info.dropToGap) {
        // Drop on the content
        loop(data, dropKey, (item) => {
          item.children = item.children || [];
          // where to insert 示例添加到尾部，可以是随意位置
          item.children.push(dragObj);
        });
      } else if (
        (info.node.children || []).length > 0 && // Has children
        info.node.expanded && // Is expanded
        dropPosition === 1 // On the bottom gap
      ) {
        loop(data, dropKey, (item) => {
          item.children = item.children || [];
          // where to insert 示例添加到尾部，可以是随意位置
          item.children.unshift(dragObj);
        });
      } else {
        let ar;
        let i;
        loop(data, dropKey, (item, index, arr) => {
          ar = arr;
          i = index;
        });
        if (dropPosition === -1) {
          ar.splice(i, 0, dragObj);
        } else {
          ar.splice(i + 1, 0, dragObj);
        }
      }
      this.gData = data;
    },
    onContextMenuClick(treeKey, menuKey) {
      console.log(`treeKey: ${treeKey}, menuKey: ${menuKey}`);
    },
  },
};
</script>

<style scoped></style>
