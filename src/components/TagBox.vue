<template>
  <div class="tagBox">
    <div class="tab">{{ name }}</div>
    <div
      class="content"
      :class="{ noPadding: noPadding }"
      :style="{ height: height + 'px' }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "TagBox",
  props: {
    name: {
      type: String,
      required: true,
    },
    height: {
      type: Number,
    },
    noPadding: [Boolean],
  },
  data() {
    return {};
  },
};
</script>

<style scoped lang="less">
.tagBox {
  margin-bottom: 10px;
  border-radius: 8px;
  background: #e1e5f2;
  .tab {
    height: 36px;
    line-height: 36px;
    text-align: center;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    background: #fff;
    color: #636f9f;
  }
  .content {
    padding: 10px;
    color: #1e3779;
    font-size: 12px;
    line-height: 26px;
    overflow-y: auto;
    position: relative;
  }
  .noPadding {
    padding: 0;
  }
}
</style>
