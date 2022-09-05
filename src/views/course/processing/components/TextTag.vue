<template>
  <div>
    <TagBox name="文字属性">
      该段文字共有{{ courseSelectedItemData.content.wordCounts }}个字
    </TagBox>
    <TagBox name="设置标题">
      <a-space direction="vertical" :size="10" style="width: 100%">
        <a-button
          :type="titleLevel === 1 ? 'warning' : 'primary'"
          disabled="isOtherTeacher"
          block
          @click="setTitle(1)"
        >
          {{ titleLevel === 1 ? "取消" : "" }}设为标题
        </a-button>
        <!--<a-button
          :type="titleLevel === 2 ? 'warning' : 'primary'"
          disabled
          block
          style="width: 200px; margin-left: 20px"
          @click="setTitle(2)"
          >{{ titleLevel === 2 ? "取消" : "" }}设为二级标题
        </a-button>
        <a-button
          :type="titleLevel === 3 ? 'warning' : 'primary'"
          disabled
          block
          style="width: 180px; margin-left: 40px"
          @click="setTitle(3)"
          >{{ titleLevel === 3 ? "取消" : "" }}设为三级标题
        </a-button>-->
      </a-space>
    </TagBox>
    <!--<TagBox name="设置标题">
      <a-space direction="vertical" :size="10" style="width: 100%">
        <a-button
            :type="titleLevel === 1 ? 'warning' : 'primary'"
            :disabled="isOtherTeacher"
            block
            @click="setTitle(1)"
        >
          {{ titleLevel === 1 ? "取消" : "" }}设为一级标题
        </a-button>
        <a-button
            :type="titleLevel === 2 ? 'warning' : 'primary'"
            :disabled="isOtherTeacher"
            block
            style="width: 200px; margin-left: 20px"
            @click="setTitle(2)"
        >{{ titleLevel === 2 ? "取消" : "" }}设为二级标题
        </a-button>
        <a-button
            :type="titleLevel === 3 ? 'warning' : 'primary'"
            :disabled="isOtherTeacher"
            block
            style="width: 180px; margin-left: 40px"
            @click="setTitle(3)"
        >{{ titleLevel === 3 ? "取消" : "" }}设为三级标题
        </a-button>
      </a-space>
    </TagBox>-->
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import { setTextTitle } from "@/request/course/created/course";
export default {
  name: "TextTag",
  props: ["courseSelectedItemData", "contentData", "courseContentId"],
  computed: {
    ...mapState({
      isOtherTeacher: (state) => state.c.isOtherTeacher,
    }),
    titleLevel() {
      return this.courseSelectedItemData.content.titleLevel;
    },
    index() {
      return this.contentData.findIndex(
        (o) => o.content.id === this.courseContentId
      );
    },
  },
  methods: {
    ...mapMutations("c", ["replaceContentNoFilter"]),
    setTitle(titleLevel) {
      let arr = this.bb();
      if (this.titleLevel === titleLevel) {
        this.$store.commit("c/removeTitleIds", arr);
      }
      setTextTitle({
        id: this.courseContentId,
        titleLevel: this.titleLevel === titleLevel ? 0 : titleLevel,
      }).then(() => {
        /*let index = this.contentData.findIndex(
          (o) => o.content.id === this.courseContentId
        );
         this.contentData[index].content.titleLevel =
          this.titleLevel === titleLevel ? 0 : titleLevel;
        this.contentData[index].content.titleLevelCaret =
          this.titleLevel === titleLevel ? titleLevel : 0;
        this.replaceContentNoFilter(this.contentData);*/
      });
    },
    bb() {
      let i = this.contentData
        .slice(this.index + 1)
        .findIndex((o) => o.content.titleLevel === 1);
      console.log("i:", i, "index:", this.index);
      if (i === -1) {
        let arr = this.contentData.slice(this.index + 1).map((o) => {
          return o.content.id;
        });
        console.log(arr);
        return arr;
      } else {
        let arr = this.contentData
          .slice(this.index)
          .slice(1, i)
          .map((o) => {
            return o.content.id;
          });
        console.log(arr);
        return arr;
      }
    },
  },
};
</script>

<style scoped lang="less"></style>
