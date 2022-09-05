<template>
  <div class="courseContent">
    <draggable
      v-model="contentData"
      :disabled="selectId === '' || ['0', '1', '2', '3'].includes(editorType)"
      filter=".forbid"
      @start="onStart"
      @end="onEnd"
    >
      <transition-group>
        <div
          class="quesBox"
          v-for="item in screenCourse === '0' ? contentData : questionData"
          :key="item.id"
        >
          <ContentQuestion
            :data="item"
            :class="item.id === selectId ? '' : 'forbid'"
            :key="item.id"
          ></ContentQuestion>
        </div>
      </transition-group>
    </draggable>
    <a-button type="primary" ghost block v-if="showDiscussionArea === 1">
      讨论区
    </a-button>
    <div class="stateBox" v-if="['0', '1', '2', '3'].includes(editorType)">
      <p v-if="editorType === '0'">
        多题关联后，首题题干将被共享，并统计关联后总分！
      </p>
      <p v-if="editorType === '1'">
        请按顺序选择试题，后续试题将按照首题题号，顺序排列
      </p>
      <p v-if="editorType === '2'">连续设分后，所选题目分数将和首体分数相同</p>
      <a-space :size="10">
        <a-button @click="clearData">取消</a-button>
        <a-button
          type="primary"
          @click="relationTrue"
          v-if="['0', '1', '2'].includes(editorType)"
        >
          确定
        </a-button>
      </a-space>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  name: "ContentBox",
  components: {
    draggable,
    ContentQuestion: () => import("./ContentQuestion"),
  },
  data() {
    return {};
  },
  computed: {
    contentData: {
      get() {
        return this.$store.state.p.contentData;
      },
      set(value) {
        this.replaceContent(value);
      },
    },
    ...mapState({
      editorType: (state) => state.p.selectItem.editorType,
      selectId: (state) => state.p.selectItem.selectId,
      relation: (state) => state.p.selectItem.relation,
      screenCourse: (state) => state.p.screenCourse,
      showAnswerArea: (state) => state.p.showAnswerArea,
      showDiscussionArea: (state) => state.p.showDiscussionArea,
      contentCheckedArr: (state) => state.p.contentCheckedArr,
    }),
    ...mapGetters({
      questionData: "p/questionData",
    }),
  },
  methods: {
    ...mapActions("p", [
      "changeEditorType",
      "changeSelectId",
      "replaceContent",
      "changeContentCheckedArr",
    ]),
    //开始拖拽事件
    onStart() {
      this.drag = true;
    },
    //拖拽结束事件
    onEnd() {
      this.drag = false;
      this.changeSelectId("");
    },
    // 内容多选时确定
    relationTrue() {
      let index = this.contentData.findIndex(
        (o) => o.id === this.contentCheckedArr[0]
      );
      if (this.editorType === "0") {
        let arr = JSON.parse(JSON.stringify(this.contentData));
        arr.forEach((o) => {
          if (this.contentCheckedArr.indexOf(o.id) !== -1) {
            o.relation = this.contentCheckedArr;
          }
        });
        this.replaceContent(arr);
        this.clearData();
      } else if (this.editorType === "1") {
        let arr = JSON.parse(JSON.stringify(this.contentData));
        let num = arr[index].quesNum;
        arr.forEach((o) => {
          if (this.contentCheckedArr.includes(o.id)) {
            o.quesNum = num++;
          }
        });
        this.replaceContent(arr);
        this.clearData();
      } else if (this.editorType === "2") {
        let arr = JSON.parse(JSON.stringify(this.contentData));
        arr.forEach((o) => {
          if (this.contentCheckedArr.includes(o.id)) {
            o.point = this.contentData[index].point;
          }
        });
        this.replaceContent(arr);
        this.clearData();
      }
    },
    // 重置内容编辑状态
    clearData() {
      this.changeEditorType("");
      this.changeSelectId("");
      this.changeContentCheckedArr([]);
    },
  },
};
</script>

<style scoped lang="less">
.courseContent {
  height: calc(100vh - 141px);
  padding: 24px 40px 50px 40px;
  overflow-y: auto;
  box-sizing: border-box;
  .quesBox {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .stateBox {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 880px;
    height: 40px;
    position: absolute;
    bottom: 0;
    z-index: 100;
    margin-left: -40px;
    background-color: #636f9f;

    p {
      line-height: 40px;
      font-size: 14px;
      color: #fff;
      margin-bottom: 0;
    }
  }
}
</style>
