<template>
  <div class="TagTree">
    <div v-if="type === 0">
      <div class="title">素养：{{ treeData[0].counts }}个</div>
      <div class="treeBox">
        <CheckBoxTree
          :paperId="paperId"
          :list="treeData[0].libDTOList"
          @getCheckData="getCheckData"
        ></CheckBoxTree>
      </div>
    </div>
    <div v-if="type === 1">
      <div class="title">能力：{{ treeData[1].counts }}个</div>
      <div class="treeBox">
        <CheckBoxTree
          :paperId="paperId"
          :list="treeData[1].libDTOList"
          @getCheckData="getCheckData"
        ></CheckBoxTree>
      </div>
    </div>
    <div v-if="type === 2">
      <div class="title">知识点：{{ treeData[2].counts }}个</div>
      <div class="treeBox">
        <CheckBoxTree
          :paperId="paperId"
          :list="treeData[2].libDTOList"
          @getCheckData="getCheckData"
        ></CheckBoxTree>
      </div>
    </div>
  </div>
</template>

<script>
import { getLabelList } from "@/request/label";
export default {
  name: "TreeComponent",
  props: {
    paperId: [String, Number],
    type: {
      type: Number,
      required: true,
      default: () => 0,
    },
  },
  components: {
    CheckBoxTree: () => import("./CheckBoxTree"),
  },
  data() {
    return {
      treeData: [
        { counts: 0, libDTOList: [] },
        { counts: 0, libDTOList: [] },
        { counts: 0, libDTOList: [] },
      ],
      checkData: [],
    };
  },

  mounted() {
    let subjectId = JSON.parse(
      sessionStorage.getItem("course_userInfo")
    ).subjectId;
    getLabelList(subjectId).then((res) => {
      this.treeData = res.extra;
    });
  },
  methods: {
    getCheckData(data) {
      this.checkData = data;
    },
  },
};
</script>

<style scoped lang="less">
::v-deep .ant-collapse > .ant-collapse-item > .ant-collapse-header {
  padding-top: 5px;
  padding-bottom: 5px;
  background-color: #e1e5f2;
}

.TagTree {
  padding: 10px;
  .title {
    padding: 5px 16px;
    background-color: #e1e5f2;
  }
  .treeBox {
    padding: 5px 16px;
  }
}

::v-deep .ant-collapse-content-box {
  height: 250px;
  overflow-y: auto;
}
</style>
