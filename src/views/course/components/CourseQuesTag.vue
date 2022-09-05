<template>
  <div>
    <TagBox name="课程标签">
      <!--素养-->
      <a-dropdown
        :trigger="['click']"
        :disabled="isOtherTeacher"
        style="width: 190px; margin-bottom: 3px"
      >
        <a-menu slot="overlay" @click="handleMenuClick($event, 0)">
          <a-menu-item v-for="(item, i) in course0" :key="i">
            <a-popover :title="`素养${item.libNumber}`" placement="left">
              <template slot="content">
                <div style="width: 300px">
                  {{ item.libNumber }}{{ item.libName }}
                </div>
              </template>
              {{ item.libNumber }}{{ item.libName }}
            </a-popover>
          </a-menu-item>
          <a-menu-item v-if="course0.length === 0">暂无数据</a-menu-item>
        </a-menu>
        <a-button size="small"> 素养：</a-button>
      </a-dropdown>
      <a-button size="small" :disabled="isOtherTeacher" @click="openModal(0)">
        <a-icon type="plus" style="color: #1890ff" />
      </a-button>
      <!--素养列表-->
      <ul class="box" v-if="literacy.length > 0">
        <li v-for="(item, i) in literacy" :key="i">
          <a-popover :title="`素养${item.libNumber}`" placement="left">
            <template slot="content">
              <div style="width: 300px">
                {{ item.libNumber }}{{ item.libName }}
              </div>
            </template>
            <a-icon type="close-circle" @click="deleteTarg(0, item.id)">
            </a-icon>
            {{ item.libNumber }}{{ item.libName }}
          </a-popover>
        </li>
      </ul>
      <div v-else>暂无数据</div>

      <!--能力-->
      <a-dropdown
        :trigger="['click']"
        :disabled="isOtherTeacher"
        style="width: 190px; margin: 3px 0"
      >
        <a-menu slot="overlay" @click="handleMenuClick($event, 1)">
          <a-menu-item v-for="(item, i) in course1" :key="i">
            <a-popover :title="`能力:${item.libNumber}`" placement="left">
              <template slot="content">
                <div style="width: 300px">
                  {{ item.libNumber }}{{ item.libName }}
                </div>
              </template>
              {{ item.libNumber }}{{ item.libName }}
            </a-popover>
          </a-menu-item>
          <a-menu-item v-if="course1.length === 0">暂无数据</a-menu-item>
        </a-menu>
        <a-button size="small"> 能力：</a-button>
      </a-dropdown>
      <a-button size="small" :disabled="isOtherTeacher" @click="openModal(1)">
        <a-icon type="plus" style="color: #1890ff" />
      </a-button>
      <ul class="box" v-if="ability.length > 0">
        <li v-for="(item, i) in ability" :key="i">
          <a-popover :title="`能力${item.libNumber}`" placement="left">
            <template slot="content">
              <div style="width: 300px">
                {{ item.libNumber }}{{ item.libName }}
              </div>
            </template>
            <a-icon type="close-circle" @click="deleteTarg(1, item.id)">
            </a-icon>
            {{ item.libNumber }}{{ item.libName }}
          </a-popover>
        </li>
      </ul>
      <div v-else>暂无数据</div>
      <!--知识点-->
      <a-dropdown
        :trigger="['click']"
        :disabled="isOtherTeacher"
        style="width: 190px; margin-top: 3px"
      >
        <a-menu slot="overlay" @click="handleMenuClick($event, 2)">
          <a-menu-item v-for="(item, i) in course2" :key="i">
            <a-popover :title="`知识点:${item.libNumber}`" placement="left">
              <template slot="content">
                <div style="width: 300px">
                  {{ item.libNumber }}{{ item.libName }}
                </div>
              </template>
              {{ item.libNumber }}{{ item.libName }}
            </a-popover>
          </a-menu-item>
          <a-menu-item v-if="course2.length === 0">暂无数据</a-menu-item>
        </a-menu>
        <a-button size="small"> 知识点：</a-button>
      </a-dropdown>
      <a-button size="small" :disabled="isOtherTeacher" @click="openModal(2)">
        <a-icon type="plus" style="color: #1890ff" />
      </a-button>
      <ul class="box" v-if="knowledge.length > 0">
        <li v-for="(item, i) in knowledge" :key="i">
          <a-popover :title="`知识点${item.libNumber}`" placement="left">
            <template slot="content">
              <div style="width: 300px">
                {{ item.libNumber }}{{ item.libName }}
              </div>
            </template>
            <a-icon type="close-circle" @click="deleteTarg(2, item.id)">
            </a-icon>
            {{ item.libNumber }}{{ item.libName }}
          </a-popover>
        </li>
      </ul>
      <div v-else>暂无数据</div>
    </TagBox>
    <a-modal
      v-model="modalVisible"
      :maskClosable="false"
      title="选择蓝图"
      :width="960"
      @ok="handleOk"
    >
      <TreeComponent v-if="modalVisible" ref="checkTag" :type="type">
      </TreeComponent>
    </a-modal>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import {
  getLabelByCourseId,
  getCourseLabelsByType,
  setCourseLabel,
  setCourseTxtLabel,
  setCourseFileLabel,
  setCourseQuesLabel,
  delCourseLabel,
  delCourseTxtLabel,
  delCourseFileLabel,
  delCourseQuestionLabel,
} from "@/request/label";

export default {
  name: "courseQuesTag",
  components: {
    TreeComponent: () => import("@/views/setting/components/TreeComponent"),
  },
  data() {
    return {
      modalVisible: false,
      type: 0,
      course0: [],
      course1: [],
      course2: [],
      // 素养数据
      literacyData: [],
      // 能力数据
      abilityData: [],
      // 知识点数据
      knowledgeData: [],
    };
  },
  computed: {
    ...mapState({
      isOtherTeacher: (state) => state.c.isOtherTeacher,
      courseId: (state) => state.c.courseId,
      courseContentId: (state) => state.c.courseContentId,
    }),
    ...mapGetters("c", ["courseSelectedItemData"]),
    literacy() {
      if (this.courseContentId === "") {
        return this.course0;
      } else {
        return this.literacyData;
      }
    },
    ability() {
      if (this.courseContentId === "") {
        return this.course1;
      } else {
        return this.abilityData;
      }
    },
    knowledge() {
      if (this.courseContentId === "") {
        return this.course2;
      } else {
        return this.knowledgeData;
      }
    },
  },
  watch: {
    courseContentId(val) {
      if (val === "") {
        getLabelByCourseId(this.courseId, 0).then((res) => {
          this.course0 = res.extra;
        });
        getLabelByCourseId(this.courseId, 1).then((res) => {
          this.course1 = res.extra;
        });
        getLabelByCourseId(this.courseId, 2).then((res) => {
          this.course2 = res.extra;
        });
      } else {
        this.getCourseTextLabelList();
      }
    },
    courseId() {
      if (this.courseContentId === "") {
        getLabelByCourseId(this.courseId, 0).then((res) => {
          this.course0 = res.extra;
        });
        getLabelByCourseId(this.courseId, 1).then((res) => {
          this.course1 = res.extra;
        });
        getLabelByCourseId(this.courseId, 2).then((res) => {
          this.course2 = res.extra;
        });
      } else {
        this.getCourseTextLabelList();
      }
    },
  },
  mounted() {
    getLabelByCourseId(this.courseId, 0).then((res) => {
      this.course0 = res.extra;
    });
    getLabelByCourseId(this.courseId, 1).then((res) => {
      this.course1 = res.extra;
    });
    getLabelByCourseId(this.courseId, 2).then((res) => {
      this.course2 = res.extra;
    });
  },
  methods: {
    handleOk() {
      let itemData = this.$refs.checkTag.checkData;
      setCourseLabel(itemData).then(() => {
        getLabelByCourseId(this.courseId, this.type).then((res) => {
          if (this.type === 0) {
            this.course0 = res.extra;
          } else if (this.type === 1) {
            this.course1 = res.extra;
          } else if (this.type === 2) {
            this.course2 = res.extra;
          }
          this.modalVisible = false;
        });
        if (this.courseContentId !== "") {
          const text = (type) => {
            let params = [];
            for (let i = 0; i < itemData.length; i++) {
              params.push({
                courseId: itemData[i].courseId,
                courseTextId: this.courseContentId,
                libId: itemData[i].libId,
                courseTextLibType: type,
              });
            }
            setCourseTxtLabel(params).then(() => {
              // 获取文字蓝图
              this.getCourseTextLabelList();
            });
          };
          const file = (type) => {
            let params = [];
            for (let i = 0; i < itemData.length; i++) {
              params.push({
                courseId: itemData[i].courseId,
                attachmentId: this.courseContentId,
                libId: itemData[i].libId,
                libType: type,
              });
            }
            setCourseFileLabel(params).then(() => {
              // 获取文字蓝图
              this.getCourseTextLabelList();
            });
          };
          const question = (type) => {
            let params = [];
            for (let i = 0; i < itemData.length; i++) {
              params.push({
                courseId: itemData[i].courseId,
                questionId: this.courseContentId,
                libId: itemData[i].libId,
                libType: type,
              });
            }
            setCourseQuesLabel(params).then(() => {
              // 获取文字蓝图
              this.getCourseTextLabelList();
            });
          };
          if (this.courseSelectedItemData.contentType === 0) {
            text(this.type);
          } else if (this.courseSelectedItemData.contentType === 1) {
            file(this.type);
          } else if (this.courseSelectedItemData.contentType === 2) {
            question(this.type);
          }
        }
      });
    },
    // 打开选择蓝图窗口
    openModal(type) {
      this.type = type;
      let subjectId = JSON.parse(
        sessionStorage.getItem("course_userInfo")
      ).subjectId;
      if (subjectId === null) {
        this.$error({
          title: "该功能需要先设置学科！",
          content: "请到【设置】>【个人信息】页面完善个人信息！",
        });
        return;
      }
      this.modalVisible = true;
    },
    handleMenuClick({ key }, type) {
      let libId = this[`course${type}`][key].id;
      if (this.courseContentId === "") {
        return;
      }
      const text = (type) => {
        setCourseTxtLabel([
          {
            courseId: this.courseId,
            courseTextId: this.courseContentId,
            libId: libId,
            courseTextLibType: type,
          },
        ]).then(() => {
          // 获取文字蓝图
          this.getCourseTextLabelList();
        });
      };
      const file = (type) => {
        setCourseFileLabel([
          {
            courseId: this.courseId,
            attachmentId: this.courseContentId,
            libId: libId,
            libType: type,
          },
        ]).then(() => {
          // 获取文字蓝图
          this.getCourseTextLabelList();
        });
      };
      const question = (type) => {
        setCourseQuesLabel([
          {
            courseId: this.courseId,
            questionId: this.courseContentId,
            libId: libId,
            libType: type,
          },
        ]).then(() => {
          // 获取文字蓝图
          this.getCourseTextLabelList();
        });
      };
      if (this.courseSelectedItemData.contentType === 0) {
        text(type);
      } else if (this.courseSelectedItemData.contentType === 1) {
        file(type);
      } else if (this.courseSelectedItemData.contentType === 2) {
        question(type);
      }
    },
    deleteTarg(type, id) {
      if (this.courseContentId === "") {
        delCourseLabel(this.courseId, id).then(() => {
          getLabelByCourseId(this.courseId, type).then((res) => {
            this[`course${type}`] = res.extra;
          });
        });
      } else {
        if (this.courseSelectedItemData.contentType === 0) {
          delCourseTxtLabel(this.courseId, this.courseContentId, id).then(
            (res) => {
              if (res.extra) {
                this.getCourseTextLabelList();
              }
            }
          );
        } else if (this.courseSelectedItemData.contentType === 1) {
          delCourseFileLabel(this.courseId, this.courseContentId, id).then(
            () => {
              this.getCourseTextLabelList();
            }
          );
        } else if (this.courseSelectedItemData.contentType === 2) {
          delCourseQuestionLabel(this.courseId, this.courseContentId, id).then(
            () => {
              this.getCourseTextLabelList();
            }
          );
        }
      }
    },
    // 获课程内容蓝图
    getCourseTextLabelList() {
      for (let i = 0; i < 3; i++) {
        getCourseLabelsByType({
          courseId: this.courseId,
          sourceId: this.courseContentId,
          sourceType: this.courseSelectedItemData.contentType,
          type: i,
        }).then((res) => {
          if (i === 0) {
            this.literacyData = res.extra;
          } else if (i === 1) {
            this.abilityData = res.extra;
          } else if (i === 2) {
            this.knowledgeData = res.extra;
          }
        });
      }
    },
  },
};
</script>

<style scoped lang="less">
.box {
  max-height: 85px;
  overflow-y: auto;
  margin-bottom: 0;
  li {
    padding-left: 2px;
    width: 95%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  i {
    padding-right: 3px;
    cursor: pointer;
  }
}

::v-deep .ant-modal-body {
  height: 500px;
  overflow-y: auto;
  padding: 0;
}
::v-deep .ant-dropdown-menu-item {
  width: 190px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
