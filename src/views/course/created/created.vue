<template>
  <div>
    <SideCenter></SideCenter>
    <SideRight></SideRight>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "created",
  components: {
    SideCenter: () => import("./components/SideCenter"),
    SideRight: () => import("./components/SideRight"),
  },
  methods: {},
};
</script>

<style scoped lang="less"></style>
