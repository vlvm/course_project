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
          <span
            style="color: #ff6666 !important"
            v-if="item.rate < item.scoring"
          >
            {{ item.scoringRate }}
          </span>
          <span
            style="color: #33cc99 !important"
            v-if="item.rate > item.scoring"
          >
            {{ item.scoringRate }}
          </span>
          <span v-if="item.rate === item.scoring">
            {{ item.scoringRate }}
          </span>
        </dd>
        <dd v-if="course0.length === 0">暂无数据</dd>
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
          <span
            style="color: #ff6666 !important"
            v-if="item.rate < item.scoring"
          >
            {{ item.scoringRate }}
          </span>
          <span
            style="color: #33cc99 !important"
            v-if="item.rate > item.scoring"
          >
            {{ item.scoringRate }}
          </span>
          <span v-if="item.rate === item.scoring">
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
          <span
            style="color: #ff6666 !important"
            v-if="item.rate < item.scoring"
          >
            {{ item.scoringRate }}
          </span>
          <span
            style="color: #33cc99 !important"
            v-if="item.rate > item.scoring"
          >
            {{ item.scoringRate }}
          </span>
          <span v-if="item.rate === item.scoring">
            {{ item.scoringRate }}
          </span>
        </dd>
        <dd v-if="course2.length === 0">暂无数据</dd>
      </div>
    </dl>
  </TagBox>
</template>
<script>
export default {
  name: "DataLabel",
  props: ["name", "personStatisticsLabel"],
  data() {
    return {};
  },
  computed: {
    course0() {
      return this.personStatisticsLabel.filter((o) => o.libType === 0);
    },
    course1() {
      return this.personStatisticsLabel.filter((o) => o.libType === 1);
    },
    course2() {
      return this.personStatisticsLabel.filter((o) => o.libType === 2);
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
      width: 140px !important;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
