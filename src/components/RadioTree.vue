<template>
  <div class="catalogueTree">
    <ul class="sidebar-item__anchors">
      <li
        class="sidebar-item__anchor"
        style="width: 100%"
        v-for="item in list"
        :key="item.id"
        :title="item.catalogName"
      >
        <span
          :class="{ active: radioTreeId == item.id }"
          @click="catalogClick(item)"
        >
          <a-icon type="folder-open" style="padding-top: 4px" />
          {{ item.catalogName }}
        </span>
        <ul class="sidebar-item__anchors" v-if="item.childList">
          <li
            class="sidebar-item__anchor"
            v-for="o in item.childList"
            :key="o.id"
            :title="o.catalogName"
          >
            <span
              :class="{ active: radioTreeId == o.id }"
              @click="catalogClick(o)"
            >
              <a-icon type="folder-open" style="padding-top: 4px" />
              {{ o.catalogName }}
            </span>

            <RadioTree
              v-on="$listeners"
              :radioTreeId="radioTreeId"
              :list="o.childList"
            >
            </RadioTree>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "RadioTree",
  props: {
    role: [Number],
    list: [Array],
    radioTreeId: [Number, String],
  },
  data() {
    return {
      id: "",
    };
  },
  computed: {},
  methods: {
    catalogClick(item) {
      this.id = item.id;
      this.$emit("chooseTreeData", { item: item, role: this.role });
      console.log(item);
    },
  },
};
</script>

<style scoped>
.catalogueTree {
  max-height: 500px;
  overflow-y: auto;
}
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
  top: 12px;
  border-bottom: 1px dashed #999999;
}
.active {
  font-weight: 500;
  color: #fff;
  background-color: #8e99fa !important;
}
</style>
