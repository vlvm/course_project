<template>
  <div class="catalogueTree">
    <ul class="sidebar-item__anchors">
      <li
        class="sidebar-item__anchor"
        style="width: 100%"
        v-for="item in list"
        :key="item.id"
        :title="item.libName"
      >
        <span
          @click="catalogClick(item)"
          @contextmenu.prevent="rightClick($event, item)"
        >
          <!--<a-icon type="folder-open" style="padding-top: 4px" />-->
          {{ item.libNumber }} {{ item.libName }}
        </span>
        <ul class="sidebar-item__anchors" v-if="item.childList">
          <li
            class="sidebar-item__anchor"
            v-for="o in item.childList"
            :key="o.id"
            :title="o.libName"
          >
            <span
              @click="catalogClick(o)"
              @contextmenu.prevent="rightClick($event, o)"
            >
              <!--<a-icon type="folder-open" style="padding-top: 4px" />-->
              {{ o.libNumber }} {{ o.libName }}
            </span>

            <CatalogueTree
              v-on="$listeners"
              :list="o.childList"
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
    list: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    catalogClick(item) {
      this.$emit("catalogClick", item);
    },
    rightClick(e, item) {
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
  line-height: 20px;
}

.sidebar-item__anchor span {
  display: inline-block;
  width: 100%;
  padding-left: 2px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  cursor: pointer;
}
.sidebar-item__anchor span:hover {
  color: #fff;
  background-color: #8e99fa;
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
  top: 12px;
  border-bottom: 1px dashed #999999;
}
.active {
  font-weight: 500;
  color: #fff;
  background-color: #8e99fa !important;
}
</style>
