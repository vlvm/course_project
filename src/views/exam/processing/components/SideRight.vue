<template>
  <div class="right">
    <div
      style="
        height: calc(100vh - 20px);
        background: #e1e5f2;
        border-radius: 8px;
      "
      v-if="paperList.length === 0"
    ></div>
    <div style="height: calc(100vh - 20px); border-radius: 8px" v-else>
      <PaperChangeTag
        :paperId="paperId"
        :stuId="stuId"
        :paperData="paperData"
        :isOverRecoveryTime="isOverRecoveryTime"
        @changePaperList="changePaperList"
        @getData="$emit('getPaperContentData')"
      ></PaperChangeTag>
      <div class="content">
        <template v-if="stuId === 0">
          <template v-if="contentId === ''">
            <SubmitPaperData
              :paperId="paperId"
              :isOverRecoveryTime="isOverRecoveryTime"
            >
            </SubmitPaperData>
            <DataLabel :paperId="paperId"></DataLabel>
          </template>
          <template v-else>
            <TagBox name="文字属性" v-if="contentSelector.contentType === 0">
              该段文字共有{{ contentSelector.content.wordCounts }}个字
            </TagBox>
            <template v-if="contentSelector.contentType === 2">
              <QuestionTag
                :paperId="paperId"
                :contentId="contentId"
                :isOverRecoveryTime="isOverRecoveryTime"
              ></QuestionTag>
              <ContentQuesTag
                :paperId="paperId"
                :contentId="contentId"
                :contentSelector="contentSelector"
              ></ContentQuesTag>
            </template>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SideRight",
  props: [
    "paperId",
    "paperData",
    "paperList",
    "stuId",
    "contentId",
    "contentSelector",
    "isOverRecoveryTime",
  ],
  components: {
    PaperChangeTag: () => import("./PaperChangeTag"),
    SubmitPaperData: () => import("./SubmitPaperData"),
    DataLabel: () => import("./DataLabel"),
    QuestionTag: () => import("./QuestionTag"),
    ContentQuesTag: () => import("./ContentQuesTag"),
  },
  methods: {
    changePaperList(list) {
      this.$emit("update:paperList", list);
    },
  },
};
</script>

<style scoped lang="less">
.right {
  width: 240px;
  height: calc(100vh - 20px);
  min-height: 500px;
}
.rightBox {
  height: calc(100vh - 198px);
  overflow-y: auto;
  border-radius: 8px;
}
.rightBox::-webkit-scrollbar {
  width: 0;
}
.content {
  height: calc(100vh - 215px);
  margin-top: 10px;
  overflow-y: auto;
  border-radius: 8px;
}
.content::-webkit-scrollbar {
  width: 0;
}
</style>
