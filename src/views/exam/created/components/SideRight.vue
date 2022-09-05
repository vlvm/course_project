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
      <Publish
        v-if="role === 1"
        :paperId="paperId"
        :paperData="paperData"
        @changePaperList="changePaperList"
      ></Publish>
      <div class="content">
        <template v-if="contentId === ''">
          <!--考试内容-->
          <ExamContentData :paperId="paperId" :contentData="contentData">
          </ExamContentData>
          <!--数据标签-->
          <createdPaperLabel
            :paperId="paperId"
            :contentId="contentId"
            :contentSelector="contentSelector"
          >
          </createdPaperLabel>
          <!--功能区-->
          <TagBox name="功能区" style="margin-bottom: 0">
            <a-button
              block
              :type="reviewSwitch ? 'warning' : 'primary'"
              :disabled="
                $route.name === 'processing' ||
                isOtherTeacher ||
                reviewQuesLength === 0
              "
              @click="setReview"
            >
              {{ reviewSwitch ? "主观题全部取消自阅" : "主观题全部设为自阅" }}
            </a-button>
          </TagBox>
        </template>
        <template v-else>
          <template v-if="contentSelector.contentType === 0">
            <!--文字属性-->
            <TagBox name="文字属性">
              该段文字共有{{ contentSelector.content.wordCounts }}个字
            </TagBox>
            <!--数据标签-->
            <!--          <DataLabel
            :paperId="paperId"
            :contentId="contentId"
            :contentSelector="contentSelector"
          ></DataLabel>-->
          </template>
          <template v-if="contentSelector.contentType === 2">
            <QuestionTag :contentSelector="contentSelector"></QuestionTag>
            <!--数据标签-->
            <DataLabel
              :paperId="paperId"
              :contentId="contentId"
              :contentSelector="contentSelector"
            ></DataLabel>
            <!--功能区-->
            <TagBox
              name="功能区"
              v-if="[2, 3].includes(this.contentSelector.content.questionType)"
            >
              <a-button
                block
                :type="
                  contentSelector.content.selfReadOverSwitch === 1
                    ? 'warning'
                    : 'primary'
                "
                :disabled="isOtherTeacher"
                @click="changeReview"
              >
                {{
                  contentSelector.content.selfReadOverSwitch === 1
                    ? "取消自阅"
                    : "添加为自阅"
                }}
              </a-button>
            </TagBox>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import {
  setQuesOverSwitch,
  setSelfReadOverSwitch,
} from "@/request/exam/examCreated";

export default {
  name: "SideRight",
  props: [
    "role",
    "isOtherTeacher",
    "paperId",
    "paperList",
    "paperData",
    "contentId",
    "contentData",
    "contentSelector",
  ],
  components: {
    DataLabel: () => import("@/views/exam/components/DataLabel"),
    createdPaperLabel: () => import("./createdPaperLabel"),
    ExamContentData: () => import("./ExamContentData"),
    QuestionTag: () => import("./QuestionTag"),
    Publish: () => import("./Publish"),
  },
  computed: {
    reviewQuesLength() {
      return this.contentData.filter((o) =>
        [2, 3].includes(o.content.questionType)
      ).length;
    },
    reviewSwitch() {
      let len1 = this.contentData.filter((o) =>
        [2, 3].includes(o.content.questionType)
      ).length;
      let len2 = this.contentData.filter(
        (o) =>
          [2, 3].includes(o.content.questionType) &&
          o.content.selfReadOverSwitch === 1
      ).length;
      return len1 === len2 && len2 !== 0;
    },
  },
  methods: {
    changePaperList(data) {
      this.$emit("changePaperList", data);
    },
    // 试题自阅添加取消自阅
    changeReview() {
      const { id, selfReadOverSwitch } = this.contentSelector.content;
      setSelfReadOverSwitch({
        id: id,
        selfReadOverSwitch: selfReadOverSwitch === 0 ? 1 : 0,
      }).then(() => {
        let data = this.contentData;
        let index = this.contentData.findIndex((o) => o.content.id === id);
        data[index].content.selfReadOverSwitch =
          selfReadOverSwitch === 0 ? 1 : 0;
        this.$emit("changeContent", data);
      });
    },
    // 试题批量自阅
    setReview() {
      let ids = this.contentData
        .filter((o) => [2, 3].includes(o.content.questionType))
        .map((o) => {
          return o.content.id;
        });
      setQuesOverSwitch(ids, this.paperId, this.reviewSwitch ? 0 : 1).then(
        (res) => {
          if (res.extra) {
            if (this.reviewSwitch) {
              this.contentData
                .filter((o) => [2, 3].includes(o.content.questionType))
                .forEach((o) => {
                  o.content.selfReadOverSwitch = 0;
                });
            } else {
              this.contentData
                .filter((o) => [2, 3].includes(o.content.questionType))
                .forEach((o) => {
                  o.content.selfReadOverSwitch = 1;
                });
            }

            this.$emit("changeContent", this.contentData);
            this.$message.success(
              this.reviewSwitch
                ? "试题已全部设为自阅！"
                : "试题已全部取消自阅！"
            );
          }
        }
      );
    },
  },
};
</script>

<style scoped lang="less">
::v-deep .ant-badge {
  padding-left: 5px;
}
.right {
  width: 240px;
  height: calc(100vh - 20px);
  min-height: 500px;
}

.content {
  height: calc(100vh - 118px);
  margin-top: 10px;
  overflow-y: auto;
  border-radius: 8px;
}
.content::-webkit-scrollbar {
  width: 0;
}
</style>
