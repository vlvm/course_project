<template>
  <TagBox name="数据标签" no-padding>
    <div>
      <div class="statisticsName">
        <div>素养：</div>
      </div>
      <div class="labelBox">
        <template v-if="course0.length > 0">
          <ul class="box">
            <li v-for="item in course0" :key="item.id">
              <div style="display: flex; justify-content: space-between">
                <div
                  style="
                    width: 170px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  "
                >
                  <a-popover :title="`能力${item.libNumber}`" placement="left">
                    <template slot="content">
                      <div style="width: 300px">
                        {{ item.libNumber }}{{ item.libName }}
                      </div>
                    </template>
                    {{ item.libNumber }}{{ item.libName }}
                  </a-popover>
                </div>
                <div>{{ item.totalScore }}分</div>
              </div>
              <div class="numberBox" v-if="item.numberString">
                <span v-for="o in item.numberString.split(',')" :key="o">
                  {{ o }}
                </span>
              </div>
            </li>
          </ul>
        </template>
        <div v-else>暂无数据</div>
      </div>
    </div>
    <div>
      <div class="statisticsName">
        <div>能力：</div>
      </div>
      <div class="labelBox">
        <template v-if="course1.length > 0">
          <ul class="box">
            <li v-for="item in course1" :key="item.id">
              <div style="display: flex; justify-content: space-between">
                <div
                  style="
                    width: 170px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  "
                >
                  <a-popover :title="`能力${item.libNumber}`" placement="left">
                    <template slot="content">
                      <div style="width: 300px">
                        {{ item.libNumber }}{{ item.libName }}
                      </div>
                    </template>
                    {{ item.libNumber }}{{ item.libName }}
                  </a-popover>
                </div>
                <div>{{ item.totalScore }}分</div>
              </div>
              <div class="numberBox" v-if="item.numberString">
                <span v-for="o in item.numberString.split(',')" :key="o">
                  {{ o }}
                </span>
              </div>
            </li>
          </ul>
        </template>
        <div v-else>暂无数据</div>
      </div>
    </div>
    <div>
      <div class="statisticsName">
        <div>知识点：</div>
      </div>
      <div class="labelBox">
        <template v-if="course2.length > 0">
          <ul class="box">
            <li v-for="item in course2" :key="item.id">
              <div style="display: flex; justify-content: space-between">
                <div
                  style="
                    width: 170px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  "
                >
                  <a-popover :title="`能力${item.libNumber}`" placement="left">
                    <template slot="content">
                      <div style="width: 300px">
                        {{ item.libNumber }}{{ item.libName }}
                      </div>
                    </template>
                    {{ item.libNumber }}{{ item.libName }}
                  </a-popover>
                </div>
                <div>{{ item.totalScore }}分</div>
              </div>
              <div class="numberBox" v-if="item.numberString">
                <span v-for="o in item.numberString.split(',')" :key="o">
                  {{ o }}
                </span>
              </div>
            </li>
          </ul>
        </template>
        <div v-else>暂无数据</div>
      </div>
    </div>
  </TagBox>
</template>

<script>
import { getLabelByPaperId } from "@/request/label";

export default {
  name: "DataLabel",
  props: ["paperId"],
  data() {
    return {
      course0: [],
      course1: [],
      course2: [],
    };
  },
  watch: {
    paperId() {
      getLabelByPaperId(this.paperId, 0).then((res) => {
        this.course0 = res.extra;
      });
      getLabelByPaperId(this.paperId, 1).then((res) => {
        this.course1 = res.extra;
      });
      getLabelByPaperId(this.paperId, 2).then((res) => {
        this.course2 = res.extra;
      });
    },
  },
  mounted() {
    getLabelByPaperId(this.paperId, 0).then((res) => {
      this.course0 = res.extra;
    });
    getLabelByPaperId(this.paperId, 1).then((res) => {
      this.course1 = res.extra;
    });
    getLabelByPaperId(this.paperId, 2).then((res) => {
      this.course2 = res.extra;
    });
  },
};
</script>

<style scoped lang="less">
::v-deep .ant-badge-status-text {
  padding-left: 5px;
  font-size: 12px;
  color: #1e3779;
}
.statisticsName {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 10px;
  background: #c7d0f2;
  font-size: 14px;
  color: #293364;
  cursor: pointer;
}
.labelBox {
  max-height: 140px;
  padding: 10px;
  overflow-y: auto;
}
.numberBox {
  line-height: 18px;
  padding-left: 5px;
  span {
    display: inline-block;
    height: 18px;
    background: #fff;
    padding: 0 5px;
    margin: 3px;
    border-radius: 4px;
  }
}
ul {
  margin-bottom: 0;
}
</style>
