<template>
  <div class="tab">
    <div
      v-for="(o, i) in tabData"
      :key="o.id"
      :class="{ tabActive: tabIndex === o.id }"
      :style="{ cursor: tabData.length === 1 ? 'default' : 'pointer' }"
      @click="goToPage(o.id)"
    >
      <a-badge :dot="showRedDot && i === 1">
        {{ o.name }}
      </a-badge>
    </div>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Tab",
  props: {
    tabIndex: {
      type: [String, Number],
    },
    tabData: {
      type: Array,
      required: true,
    },
    showRedDot: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  methods: {
    goToPage(id) {
      this.$emit("changeIndex", id);
    },
  },
};
</script>

<style scoped lang="less">
.tabActive {
  width: 100px;
  background: #636f9f;
  color: #fff;
}
.tab {
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background: #fff;
  color: #636f9f;

  div {
    flex: 1;
    height: 36px;
    line-height: 36px;
    text-align: center;
  }

  div:first-child {
    border-top-left-radius: 8px;
  }

  div:last-child {
    border-top-right-radius: 8px;
  }
}
</style>
