<template>
  <TagBox :name="!name ? '课程数据' : name">
    <dl>
      <dt>素养：</dt>
      <div style="max-height: 100px; overflow-y: auto">
        <dd v-for="(item, i) in course0" :key="i">
          <a-popover :title="`素养${item.libNumber}`" placement="left">
            <template slot="content">
              <div style="width: 300px">
                {{ item.libNumber }}{{ item.libName }}
              </div>
            </template>
            <span class="tag">{{ item.libNumber }}{{ item.libName }} </span>
          </a-popover>
          <span style="color: #33cc99" v-if="item.scoring >= 85">{{
            item.scoringRate
          }}</span>
          <span v-if="item.scoring >= 60 && item.scoring < 85">
            {{ item.scoringRate }}
          </span>
          <span style="color: #ff6666" v-if="item.scoring < 60">
            {{ item.scoringRate }}
          </span>
        </dd>
        <dd v-if="course0.length === 0">暂无数据</dd>
        <!--<dd>
          <span>2、核心素养核心素养 </span>
          <span style="color: #33cc99 !important">
            <a-icon type="arrow-up" v-if="showIcon" />
            85%
          </span>
        </dd>-->
      </div>
    </dl>
    <dl>
      <dt>能力：</dt>
      <div style="max-height: 100px; overflow-y: auto">
        <dd v-for="(item, i) in course1" :key="i">
          <a-popover :title="`能力${item.libNumber}`" placement="left">
            <template slot="content">
              <div style="width: 300px">
                {{ item.libNumber }}{{ item.libName }}
              </div>
            </template>
            <span class="tag">{{ item.libNumber }}{{ item.libName }} </span>
          </a-popover>
          <span style="color: #33cc99" v-if="item.scoring >= 85">{{
            item.scoringRate
          }}</span>
          <span v-if="item.scoring >= 60 && item.scoring < 85">
            {{ item.scoringRate }}
          </span>
          <span style="color: #ff6666" v-if="item.scoring < 60">
            {{ item.scoringRate }}
          </span>
        </dd>
        <dd v-if="course1.length === 0">暂无数据</dd>
      </div>
    </dl>
    <dl>
      <dt>知识点：</dt>
      <div style="max-height: 100px; overflow-y: auto">
        <dd v-for="(item, i) in course2" :key="i">
          <a-popover :title="`知识点${item.libNumber}`" placement="left">
            <template slot="content">
              <div style="width: 300px">
                {{ item.libNumber }}{{ item.libName }}
              </div>
            </template>
            <span class="tag">{{ item.libNumber }}{{ item.libName }} </span>
          </a-popover>
          <span style="color: #33cc99" v-if="item.scoring >= 85">{{
            item.scoringRate
          }}</span>
          <span v-if="item.scoring >= 60 && item.scoring < 85">
            {{ item.scoringRate }}
          </span>
          <span style="color: #ff6666" v-if="item.scoring < 60">
            {{ item.scoringRate }}
          </span>
        </dd>
        <dd v-if="course2.length === 0">暂无数据</dd>
      </div>
    </dl>
  </TagBox>
</template>
<script>
import { getCourseTag } from "@/request/course/courseResult";
export default {
  name: "DataLabel",
  props: ["name", "showIcon", "courseId"],
  data() {
    return {
      course0: [],
      course1: [],
      course2: [],
    };
  },
  watch: {
    courseId(id) {
      getCourseTag(id, 0).then((res) => {
        this.course0 = res.extra;
      });
      getCourseTag(id, 1).then((res) => {
        this.course1 = res.extra;
      });
      getCourseTag(id, 2).then((res) => {
        this.course2 = res.extra;
      });
    },
  },
  mounted() {
    getCourseTag(this.courseId, 0).then((res) => {
      this.course0 = res.extra;
    });
    getCourseTag(this.courseId, 1).then((res) => {
      this.course1 = res.extra;
    });
    getCourseTag(this.courseId, 2).then((res) => {
      this.course2 = res.extra;
    });
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
      width: 150px !important;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
