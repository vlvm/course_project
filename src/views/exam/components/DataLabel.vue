<template>
  <div>
    <TagBox name="数据标签">
      <!--素养-->
      <a-dropdown :trigger="['click']" style="width: 190px; margin-bottom: 3px">
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
      <a-button size="small" @click="openModal(0)">
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
      <a-dropdown :trigger="['click']" style="width: 190px; margin: 3px 0">
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
      <a-button size="small" @click="openModal(1)">
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
      <a-dropdown :trigger="['click']" style="width: 190px; margin-top: 3px">
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
      <a-button size="small" @click="openModal(2)">
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
      v-model="modal.labelModal"
      :maskClosable="false"
      title="选择蓝图"
      :width="960"
      @ok="handleOk"
    >
      <TreeComponent
        v-if="modal.labelModal"
        ref="checkTag"
        :type="type"
        :paperId="paperId"
      >
      </TreeComponent>
    </a-modal>
  </div>
</template>

<script>
import {
  getLabelByPaperId,
  setPaperLabel,
  setPaperQuesLabel,
  setPaperTxtLabel,
  getPaperLabelsByType,
  delPaperLabel,
  delPaperTxtLabel,
  delPaperQuestionLabel,
} from "@/request/label";

export default {
  name: "DataLabel",
  props: ["paperId", "contentId", "contentSelector"],
  components: {
    TreeComponent: () => import("@/views/exam/components/TreeComponent"),
  },
  data() {
    return {
      modal: {
        labelModal: false,
      },
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
    literacy() {
      if (this.contentId === "") {
        return this.course0;
      } else {
        return this.literacyData;
      }
    },
    ability() {
      if (this.contentId === "") {
        return this.course1;
      } else {
        return this.abilityData;
      }
    },
    knowledge() {
      if (this.contentId === "") {
        return this.course2;
      } else {
        return this.knowledgeData;
      }
    },
  },
  watch: {
    contentId: {
      immediate: true,
      handler(val) {
        if (val === "") {
          getLabelByPaperId(this.paperId, 0).then((res) => {
            this.course0 = res.extra;
          });
          getLabelByPaperId(this.paperId, 1).then((res) => {
            this.course1 = res.extra;
          });
          getLabelByPaperId(this.paperId, 2).then((res) => {
            this.course2 = res.extra;
          });
        } else {
          getLabelByPaperId(this.paperId, 0).then((res) => {
            this.course0 = res.extra;
          });
          getLabelByPaperId(this.paperId, 1).then((res) => {
            this.course1 = res.extra;
          });
          getLabelByPaperId(this.paperId, 2).then((res) => {
            this.course2 = res.extra;
          });
          this.getPaperTextLabelList();
        }
      },
    },
    paperId() {
      if (this.contentId === "") {
        getLabelByPaperId(this.paperId, 0).then((res) => {
          this.course0 = res.extra;
        });
        getLabelByPaperId(this.paperId, 1).then((res) => {
          this.course1 = res.extra;
        });
        getLabelByPaperId(this.paperId, 2).then((res) => {
          this.course2 = res.extra;
        });
      } else {
        this.getPaperTextLabelList();
      }
    },
  },
  mounted() {
    if (this.contentId === "") {
      getLabelByPaperId(this.paperId, 0).then((res) => {
        this.course0 = res.extra;
      });
      getLabelByPaperId(this.paperId, 1).then((res) => {
        this.course1 = res.extra;
      });
      getLabelByPaperId(this.paperId, 2).then((res) => {
        this.course2 = res.extra;
      });
    } else {
      this.getPaperTextLabelList();
    }
  },
  methods: {
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
      this.modal.labelModal = true;
    },
    handleOk() {
      let itemData = this.$refs.checkTag.checkData;
      setPaperLabel(itemData).then(() => {
        getLabelByPaperId(this.paperId, this.type).then((res) => {
          if (this.type === 0) {
            this.course0 = res.extra;
          } else if (this.type === 1) {
            this.course1 = res.extra;
          } else if (this.type === 2) {
            this.course2 = res.extra;
          }
          this.modal.labelModal = false;
        });
        if (this.contentId !== "") {
          const text = (type) => {
            let params = [];
            for (let i = 0; i < itemData.length; i++) {
              params.push({
                paperId: itemData[i].paperId,
                courseTextId: this.contentId,
                libId: itemData[i].libId,
                courseTextLibType: type,
              });
            }
            setPaperTxtLabel(params).then(() => {
              // 获取文字蓝图
              this.getPaperTextLabelList();
            });
          };
          const question = (type) => {
            let params = [];
            for (let i = 0; i < itemData.length; i++) {
              params.push({
                paperId: itemData[i].paperId,
                questionId: this.contentId,
                libId: itemData[i].libId,
                libType: type,
              });
            }
            setPaperQuesLabel(params).then(() => {
              // 获取试题蓝图
              this.getPaperTextLabelList();
            });
          };
          if (this.contentSelector.contentType === 0) {
            text(this.type);
          } else if (this.contentSelector.contentType === 2) {
            question(this.type);
          }
        }
      });
    },
    // 获课程内容蓝图
    getPaperTextLabelList() {
      for (let i = 0; i < 3; i++) {
        getPaperLabelsByType({
          paperId: this.paperId,
          sourceId: this.contentId,
          sourceType: this.contentSelector.contentType,
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
    handleMenuClick({ key }, type) {
      let libId = this[`course${type}`][key].id;
      if (this.contentId === "") {
        return;
      }
      const text = (type) => {
        setPaperTxtLabel([
          {
            paperId: this.paperId,
            courseTextId: this.contentId,
            libId: libId,
            courseTextLibType: type,
          },
        ]).then(() => {
          // 获取文字蓝图
          this.getPaperTextLabelList();
        });
      };
      const question = (type) => {
        setPaperQuesLabel([
          {
            paperId: this.paperId,
            questionId: this.contentId,
            libId: libId,
            libType: type,
          },
        ]).then(() => {
          // 获取文字蓝图
          this.getPaperTextLabelList();
        });
      };
      if (this.contentSelector.contentType === 0) {
        text(type);
      } else if (this.contentSelector.contentType === 2) {
        question(type);
      }
    },
    // 删除蓝图
    deleteTarg(type, id) {
      if (this.contentId === "") {
        delPaperLabel(this.paperId, id).then(() => {
          getLabelByPaperId(this.paperId, type).then((res) => {
            this[`course${type}`] = res.extra;
          });
        });
      } else {
        if (this.contentSelector.contentType === 0) {
          delPaperTxtLabel(this.paperId, this.contentId, id).then((res) => {
            if (res.extra) {
              this.getPaperTextLabelList();
            }
          });
        } else if (this.contentSelector.contentType === 2) {
          delPaperQuestionLabel(this.paperId, this.contentId, id).then(() => {
            this.getPaperTextLabelList();
          });
        }
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
