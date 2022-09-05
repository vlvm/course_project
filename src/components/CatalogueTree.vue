<template>
  <div class="catalogueTree">
    <ul class="sidebar-item__anchors">
      <li
        class="sidebar-item__anchor"
        style="width: 100%"
        :style="{
          color: redDotIds.includes(item.id) ? 'red' : '#000',
        }"
        v-for="(item, i) in list"
        :key="i"
        :title="item.catalogName"
      >
        <span
          class="span"
          :class="{ active: $route.query.catalogId == item.id }"
          @click="catalogClick(item)"
          @contextmenu.prevent="rightClick($event, item)"
        >
          <a-icon
            :type="item.openNode ? 'caret-down' : 'caret-right'"
            v-show="item.childList && item.childList.length > 0"
          />
          <a-icon type="folder-open" style="padding-top: 4px" />
          {{ item.catalogName }}
        </span>
        <ul
          class="sidebar-item__anchors"
          v-if="item.childList"
          v-show="item.openNode"
        >
          <li
            class="sidebar-item__anchor"
            v-for="o in item.childList"
            :key="o.id"
            :title="o.catalogName"
            :style="{
              color: redDotIds.includes(o.id) ? 'red' : '#000',
            }"
          >
            <span
              class="span"
              :class="{ active: $route.query.catalogId == o.id }"
              @click="catalogClick(o)"
              @contextmenu.prevent="rightClick($event, o)"
            >
              <a-icon
                :type="o.openNode ? 'caret-down' : 'caret-right'"
                v-show="o.childList && o.childList.length > 0"
              />
              <a-icon type="folder-open" style="padding-top: 4px" />
              {{ o.catalogName }}
            </span>
            <CatalogueTree
              v-on="$listeners"
              :list="o.childList"
              v-show="o.openNode"
            ></CatalogueTree>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "CatalogueTree",
  props: {
    redDotIds: {
      type: Array,
      default: () => [],
    },
    list: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {};
  },
  methods: {
    catalogClick(item) {
      item.openNode = !item.openNode;
      console.log(item.openNode);
      this.$emit("catalogClick", item);
    },
    rightClick(e, item) {
      item.openNode = true;
      this.$emit("rightClick", { x: e.clientX, y: e.clientY }, item);
    },
  },
};
</script>

<style scoped>
.sidebar-item__anchors {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}

.sidebar-item__anchors {
  position: relative;
  -webkit-box-flex: 0;
  -ms-flex: 0 0 100%;
  flex: 0 0 100%;
  flex-wrap: wrap;
  padding-left: 8px;
  overflow: hidden;
  list-style: none;
  margin-bottom: 0;
}

.sidebar-item__anchor {
  position: relative;
  -webkit-box-flex: 0;
  -ms-flex: 0 0 100%;
  flex: 0 0 100%;
  padding-left: 7px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  line-height: 25px;
}

.sidebar-item__anchor .span {
  display: inline-block;
  width: 100%;
  padding-left: 2px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
}
.sidebar-item__anchor .span:hover {
  color: #fff;
  background-color: #c7d0f2;
}

.sidebar-item__anchors:before {
  content: "";
  position: absolute;
  height: 100%;
  top: 0;
  left: 5px;
  border-left: 1px dashed #999999;
}

.sidebar-item__anchor:before {
  content: "";
  position: absolute;
  width: 5px;
  left: 0;
  top: 13px;
  border-bottom: 1px dashed #999999;
}
.active {
  font-weight: 500;
  color: #fff;
  background-color: #8e99fa !important;
}
.anticon-caret-down,
.anticon-caret-up {
  font-size: 12px;
  padding-right: 5px;
}
</style>
