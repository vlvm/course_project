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
        <a-checkbox
          :value="item.id"
          :checked="checkArr.includes(item.id)"
          @change="onChange($event, item)"
        >
          <span>
            <!--<a-icon type="folder-open" style="padding-top: 4px" />-->
            {{ item.libNumber }}{{ item.libName }}
          </span>
        </a-checkbox>
        <ul class="sidebar-item__anchors" v-if="item.childList">
          <li
            class="sidebar-item__anchor"
            v-for="o in item.childList"
            :key="o.id"
            :title="o.libName"
          >
            <a-checkbox
              :value="o.id"
              :checked="checkArr.includes(o.id)"
              @change="onChange($event, o)"
            >
              <span>
                <!--<a-icon type="folder-open" style="padding-top: 4px" />-->
                {{ o.libNumber }} {{ o.libName }}
              </span>
            </a-checkbox>
            <CatalogueTree
              v-on="$listeners"
              :paperId="paperId"
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
    paperId: [String, Number],
    list: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      checkArr: [],
      checkedData: [],
    };
  },
  computed: {},
  methods: {
    onChange(e, item) {
      if (e.target.checked) {
        this.checkArr.push(e.target.value);
        this.checkedData.push({
          paperId: this.paperId,
          libId: item.id,
          libType: item.libType,
        });
        this.$emit("getCheckData", this.checkedData);
      } else {
        let i = this.checkArr.indexOf(e.target.value);
        this.checkArr = this.checkArr.filter((o, index, data) => o !== data[i]);
        this.checkedData = this.checkedData.filter((o) => o.libId !== item.id);
        this.$emit("getCheckData", this.checkedData);
      }
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
.ant-checkbox-wrapper {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
</style>
