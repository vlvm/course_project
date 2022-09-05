<template>
  <TagBox name="课程标签">
    <dl>
      <dt>素养：</dt>
      <div style="max-height: 100px; overflow-y: auto">
        <dd v-for="(item, i) in literacy" :key="i">
          <a-popover :title="`素养${item.libNumber}`" placement="left">
            <template slot="content">
              <div style="width: 300px">
                {{ item.libNumber }}{{ item.libName }}
              </div>
            </template>
            <span class="tag">{{ item.libNumber }}{{ item.libName }} </span>
          </a-popover>
          <span></span>
        </dd>
        <dd v-if="literacy.length === 0">暂无数据</dd>
      </div>
    </dl>
    <dl>
      <dt>能力：</dt>
      <div style="max-height: 100px; overflow-y: auto">
        <dd v-for="(item, i) in ability" :key="i">
          <a-popover :title="`能力${item.libNumber}`" placement="left">
            <template slot="content">
              <div style="width: 300px">
                {{ item.libNumber }}{{ item.libName }}
              </div>
            </template>
            <span class="tag">{{ item.libNumber }}{{ item.libName }} </span>
          </a-popover>
          <span></span>
        </dd>
        <dd v-if="ability.length === 0">暂无数据</dd>
      </div>
    </dl>
    <dl>
      <dt>知识点：</dt>
      <div style="max-height: 100px; overflow-y: auto">
        <dd v-for="(item, i) in knowledge" :key="i">
          <a-popover :title="`知识点${item.libNumber}`" placement="left">
            <template slot="content">
              <div style="width: 300px">
                {{ item.libNumber }}{{ item.libName }}
              </div>
            </template>
            <span class="tag">{{ item.libNumber }}{{ item.libName }} </span>
          </a-popover>
          <span></span>
        </dd>
        <dd v-if="knowledge.length === 0">暂无数据</dd>
      </div>
    </dl>
  </TagBox>
</template>
<script>
import { getLabelByCourseId, getCourseLabelsByType } from "@/request/label";
export default {
  name: "CourseContentTag",
  props: [
    "courseId",
    "contentType",
    "courseContentId",
    "courseSelectedItemData",
  ],
  data() {
    return {
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
    // 获课程内容蓝图
    getCourseTextLabelList() {
      for (let i = 0; i < 3; i++) {
        getCourseLabelsByType({
          courseId: this.courseId,
          sourceId: this.courseContentId,
          sourceType: this.contentType,
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
dl {
  dt {
    padding-bottom: 6px;
    font-size: 14px;
    color: #1e3779;
  }
  dd {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 6px;
    font-size: 12px;
    color: #1e3779;
    border: 1px solid #d1dce7;
    border-radius: 4px;
    background: #fff;
    .tag {
      width: 170px !important;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
