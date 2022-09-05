<template>
  <Board
    reviewImg="https://img0.baidu.com/it/u=3678268834,3889036276&fm=253&fmt=auto&app=138&f=JPEG?w=892&h=500"
  >
  </Board>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Review",
  components: {
    Board: () => import("./components/Board"),
  },
};
</script>

<style scoped lang="less"></style>
