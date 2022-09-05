<template>
  <TagBox name="考试标签">
    <dl>
      <dt>素养：</dt>
      <div style="max-height: 90px; overflow-y: auto">
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
import { getPaperLabelsByType } from "@/request/label";
export default {
  name: "CourseContentTag",
  props: ["paperId", "contentId", "contentSelector"],
  data() {
    return {
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
      return this.literacyData;
    },
    ability() {
      return this.abilityData;
    },
    knowledge() {
      return this.knowledgeData;
    },
  },
  watch: {
    contentId() {
      if (this.contentId !== "") {
        this.getCourseTextLabelList();
      }
    },
    paperId() {
      if (this.contentId !== "") {
        this.getCourseTextLabelList();
      }
    },
  },
  mounted() {
    this.getCourseTextLabelList();
  },
  methods: {
    // 获考试内容蓝图
    getCourseTextLabelList() {
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
