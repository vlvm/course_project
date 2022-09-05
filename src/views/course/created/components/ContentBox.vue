<template>
  <div class="courseContent" :class="{ computedHeight: role !== 1 }">
    <draggable
      v-model="contentData"
      :disabled="off"
      filter=".forbid"
      @start="onStart"
      @end="onEnd"
    >
      <transition-group>
        <div class="quesBox" v-for="item in contentData" :key="item.content.id">
          <ContentQuestion
            :contentType="item.contentType"
            :data="item.content"
            :class="item.content.id === courseContentId ? '' : 'forbid'"
            :key="item.content.id"
            v-show="!titleIds.includes(item.content.id)"
          >
          </ContentQuestion>
        </div>
      </transition-group>
    </draggable>
    <a-button
      style="margin-top: 10px"
      type="primary"
      ghost
      block
      v-if="courseSelectedData.courseTalkingSwitch === 1"
    >
      讨论区
    </a-button>
    <div class="stateBox" v-if="['0', '1', '2', '3'].includes(editorType)">
      <p v-if="editorType === '0'">
        多题关联后，首题题干将被共享，并统计关联后总分！
      </p>
      <p v-if="editorType === '1'">
        请按顺序选择试题，后续试题将按照首题题号，顺序排列
      </p>
      <p v-if="editorType === '2'">连续设分后，所选题目分数将和首题分数相同</p>
      <a-space :size="10">
        <a-button @click="clearData">取消</a-button>
        <a-button
          type="primary"
          @click="relationTrue"
          v-if="['0', '1', '2'].includes(editorType)"
        >
          确定
        </a-button>
        <template v-if="editorType === '3'">
          <a-button type="primary" @click="copyData"> 拷贝 </a-button>
          <a-button type="danger" @click="deleteContents"> 删除 </a-button>
        </template>
      </a-space>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import {
  addQuestionStore,
  batchDeleteCourseContent,
  getCourseContentById,
  setQuestionAssociated,
  setQuestionNumber,
  courseSort,
} from "@/request/course/created/course";
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
    off() {
      return (
        this.courseContentId === "" ||
        ["0", "1", "2", "3"].includes(this.editorType) ||
        this.isOtherTeacher
      );
    },
    contentData: {
      get() {
        return this.$store.state.c.contentData;
      },
      set(value) {
        this.replaceContent(value);
      },
    },
    ...mapState({
      role: (state) => state.role,
      editorType: (state) => state.c.selectItem.editorType,
      isOtherTeacher: (state) => state.c.isOtherTeacher,
      courseId: (state) => state.c.courseId,
      courseContentId: (state) => state.c.courseContentId,
      relation: (state) => state.c.selectItem.relation,
      contentCheckedArr: (state) => state.c.contentCheckedArr,
      titleIds: (state) => state.c.titleIds,
    }),
    ...mapGetters("c", ["courseSelectedData"]),
  },
  watch: {
    courseId() {
      this.clearData();
    },
  },
  methods: {
    ...mapMutations("c", [
      "changeCourseContentId",
      "replaceContent",
      "copyCourseData",
    ]),
    ...mapActions("c", [
      "changeEditorType",
      "changeContentCheckedArr",
      "getCourseTagAttrData",
    ]),
    //开始拖拽事件
    onStart() {
      this.drag = true;
    },
    //拖拽结束事件
    onEnd() {
      this.drag = false;
      this.changeCourseContentId("");
      let params = this.contentData.map((o, i) => {
        return {
          id: o.content.id,
          contentType: o.contentType,
          idx: i,
        };
      });
      courseSort(params, this.courseId).then((res) => {
        console.log("SORT", res);
      });
    },
    // 内容多选时确定
    relationTrue() {
      if (this.contentCheckedArr.length === 0) {
        this.$error({
          content: "请选择想要操作的内容！",
        });
        return;
      }
      let index = this.contentData.findIndex(
        (o) => o.content.id === this.contentCheckedArr[0]
      );
      if (this.editorType === "0") {
        setQuestionAssociated(this.contentCheckedArr).then(() => {
          this.contentData.forEach((o) => {
            if (this.contentCheckedArr.includes(o.content.id)) {
              o.content.firstQuestionId = this.contentCheckedArr[0];
              o.content.mappingIdList = this.contentCheckedArr;
            }
          });
          this.replaceContent(this.contentData);
          this.clearData();
        });
      } else if (this.editorType === "1") {
        // 连续编号
        let params = [];
        let num = this.contentData[index].content.questionNumber;
        if (num === "" || num === null || isNaN(parseInt(num))) {
          this.$error({
            content: "不能连续编号，请检查首题题号！",
          });
          return;
        }
        this.contentData.map((o) => {
          if (this.contentCheckedArr.includes(o.content.id)) {
            params.push({
              id: o.content.id,
              questionNumber: num++,
            });
          }
        });
        setQuestionNumber(params).then(() => {
          this.contentData.map((o) => {
            params.map((item, i) => {
              if (item.id === o.content.id) {
                o.content.questionNumber = params[i].questionNumber;
              }
            });
          });
          this.replaceContent(this.contentData);
          this.clearData();
        });
      } else if (this.editorType === "2") {
        // 连续设分
        let params = [];
        this.contentData.map((o) => {
          if (this.contentCheckedArr.includes(o.content.id)) {
            params.push({
              id: o.content.id,
              questionNumber: o.content.questionNumber,
              questionParentId: o.content.questionParentId,
              questionScore: this.contentData[index].content.questionScore,
            });
          }
        });
        addQuestionStore(params).then((res) => {
          if (res.extra) {
            this.contentData.map((o) => {
              if (this.contentCheckedArr.includes(o.content.id)) {
                o.content.questionScore = params[0].questionScore;
              }
            });
            this.replaceContent(this.contentData);
            this.clearData();
          }
        });
      }
    },
    // 内容多选时复制
    copyData() {
      if (this.contentCheckedArr.length === 0) {
        this.$error({
          content: "请选择想要复制的内容！",
        });
        return;
      }
      let data = {
        originCourseId: this.courseId,
        content: [],
      };
      this.contentData.map((o) => {
        if (this.contentCheckedArr.includes(o.content.id)) {
          data.content.push({ id: o.content.id, contentType: o.contentType });
        }
      });
      this.copyCourseData(data);
      this.$message.success("拷贝成功！");
      this.clearData();
    },
    // 内容多选时删除
    deleteContents() {
      if (this.contentCheckedArr.length === 0) {
        this.$error({
          content: "请选择想要删除的内容！",
        });
        return;
      }
      let _this = this;
      this.$confirm({
        title: "是否确定要删除所选内容?",
        content: "内容删除后不可恢复，您是否确定删除内容？",
        okText: "删除",
        // 点击蒙层是否允许关闭
        maskClosable: true,
        okType: "danger",
        cancelText: "取消",
        onOk: () => {
          let params = [];
          _this.contentData.map((o) => {
            if (_this.contentCheckedArr.includes(o.content.id)) {
              params.push({
                contentType: o.contentType,
                content: {
                  id: o.content.id,
                },
              });
            }
          });
          _this.$store.commit("c/removeTitleIds", _this.contentCheckedArr);
          batchDeleteCourseContent(params, _this.courseId).then(() => {
            getCourseContentById(_this.courseId).then((res) => {
              this.replaceContent(res.extra);
              this.getCourseTagAttrData(_this.courseId);
              _this.clearData();
            });
          });
        },
        onCancel: () => {
          console.log("Cancel");
        },
      });
    },
    // 重置内容编辑状态
    clearData() {
      this.changeEditorType("");
      this.changeCourseContentId("");
      this.changeContentCheckedArr([]);
    },
  },
};
</script>

<style scoped lang="less">
.courseContent {
  height: calc(100vh - 156px);
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
    width: 100%;
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
.computedHeight {
  height: calc(100vh - 110px);
}
</style>
