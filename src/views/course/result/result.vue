<template>
  <div>
    <div class="center">
      <Tab
        :showRedDot="
          $store.state.catalogIds.includes(parseInt($route.query.catalogId)) &&
          courseList.length > 0
        "
        :tabIndex="tabIndex"
        :tab-data="[
          { id: '0', name: '创建课程' },
          { id: '1', name: '处理课程' },
          { id: '2', name: '课程结果' },
        ]"
        @changeIndex="changeIndex"
      >
      </Tab>
      <div class="tabs">
        <div class="swiper_box">
          <a-icon
            type="left"
            style="font-size: 16px"
            @click="slidePrev"
            v-if="courseList.length > 4"
          />
          <swiper :options="swiperOption" ref="mySwiper" class="swiper">
            <swiper-slide
              v-for="o in courseList"
              :key="o.id"
              :class="{ sideActive: courseId === o.id }"
            >
              <div class="courseName">
                <a-tooltip placement="bottomLeft" :title="`${o.courseName}`">
                  <span v-if="o.originCourseType === 1">【错题重做】</span>
                  <span v-if="o.originCourseType === 2">【分层课程】</span>
                  <span v-if="o.originCourseType === 3">【分类课程】</span>
                  {{ o.courseName }}
                </a-tooltip>
              </div>
            </swiper-slide>
          </swiper>
          <a-icon
            type="right"
            style="font-size: 16px"
            @click="slideNext"
            v-if="courseList.length > 4"
          />
        </div>
      </div>
      <div class="center_content">
        <div class="c_top">
          <div class="btn_group_l">
            <a-button
              size="small"
              :type="module === 0 ? 'primary' : ''"
              @click="module = 0"
            >
              按题统计
            </a-button>
            <template v-if="courseSelectedData.originCourseType !== 1">
              <a-button
                size="small"
                :type="module === 1 ? 'primary' : ''"
                @click="module = 1"
                >按人统计</a-button
              >
              <a-button
                size="small"
                :type="module === 2 ? 'primary' : ''"
                @click="module = 2"
              >
                按知识模块统计
              </a-button>
            </template>
          </div>
        </div>
        <!--内容区域-->
        <div
          class="courseContent"
          :class="{ contentHeight: courseList.length === 0 }"
        >
          <div class="quesBox">
            <StatisticsByQuestion
              :courseId="courseId"
              @getQuesStatisticsData="getQuesStatisticsData"
              v-if="courseId && module === 0"
            >
            </StatisticsByQuestion>
            <StatisticsByPerson
              :courseId="courseId"
              @getPersonAnswerData="getPersonAnswerData"
              v-if="courseId && module === 1"
            >
            </StatisticsByPerson>
            <StatisticsByKnowledge
              :courseId="courseId"
              @getModelLabelData="getModelLabelData"
              v-if="courseId && module === 2"
            >
            </StatisticsByKnowledge>
          </div>
        </div>
      </div>
    </div>
    <SideRight
      :courseId="courseId"
      :courseList="courseList"
      :courseSelectedData="courseSelectedData"
      :module="module"
      :questionId="questionId"
      :quesStatisticsData="quesStatisticsData"
      :personStatisticsAnswer="personStatisticsAnswer"
      :personStatisticsLabel="personStatisticsLabel"
      :modelLabelData="modelLabelData"
    >
    </SideRight>
  </div>
</template>

<script>
// 使用Swiper组件
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";

import {
  getCourseList,
  coursePersionStatistics,
  personStatisticsAnswer,
  personStatisticsTag,
} from "@/request/course/courseResult";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "result",
  components: {
    Tab: () => import("../../../components/Tab"),
    swiper,
    swiperSlide,
    StatisticsByQuestion: () => import("./components/StatisticsByQuestion"),
    StatisticsByPerson: () => import("./components/StatisticsByPerson"),
    StatisticsByKnowledge: () => import("./components/StatisticsByKnowledge"),
    SideRight: () => import("./components/SideRight"),
  },
  data() {
    return {
      tabIndex: "2",
      swiperOption: {
        // 鼠标无法拖动，手机也无法滑动
        allowTouchMove: false,
        // 5个为一组
        slidesPerView: 4,
        // 间隔为5
        spaceBetween: 5,
        on: {
          tap: () => {
            this.courseId = this.courseList[this.swiper.clickedIndex].id;
          },
        },
      },
      // 课程id
      courseId: "",
      // 课程列表
      courseList: [],
      module: 0,
      // 选中试题id
      questionId: "",
      // 按题统计单题左侧统计数据
      quesStatisticsData: [],
      // 课程统计_按人员_学生答题信息
      personStatisticsAnswer: [],
      // 获取课程统计_按人员_学生蓝图信息
      personStatisticsLabel: [],
      // 获取课程统计_按知识模块蓝图数据
      modelLabelData: {},
    };
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    },
    // 选中的课程数据
    courseSelectedData() {
      return this.courseList.find((o) => o.id === this.courseId) || {};
    },
  },
  watch: {
    "$route.query.catalogId": {
      immediate: true,
      handler(val) {
        if (val) {
          this.module = 0;
          this.getData();
        }
      },
    },
    courseId(id) {
      console.log(id);
      this.module = 0;
    },
  },
  methods: {
    getData() {
      // 获取课程列表
      getCourseList({
        type: 2,
        catalogId: this.$route.query.catalogId,
      }).then((res) => {
        this.courseList = res.extra;
        if (res.extra.length > 0) {
          this.courseId = res.extra[0].id;
        } else {
          this.courseId = "";
          this.contentData = [];
        }
      });
    },
    changeIndex(index) {
      this.tabIndex = index;
      if (index === "0") {
        this.$router.push({
          path: "/course/created",
          query: {
            catalogId: this.$route.query.catalogId,
          },
        });
      } else if (index === "1") {
        this.$router.push({
          path: "/course/processing",
          query: {
            catalogId: this.$route.query.catalogId,
          },
        });
      } else if (index === "2") {
        this.$router.push({
          path: "/course/result",
          query: {
            catalogId: this.$route.query.catalogId,
          },
        });
      }
    },
    // 切换上一个课程
    slidePrev() {
      if (this.swiper.isBeginning) {
        this.$message.warning("已经是第一个课程了！");
        return;
      }
      this.swiper.slidePrev();
    },
    // 切换下一个课程
    slideNext() {
      if (this.swiper.isEnd) {
        this.$message.warning("已经是最后一个课程了！");
        return;
      }
      this.swiper.slideNext();
    },
    // 按题统计单题数据
    getQuesStatisticsData(questionId) {
      this.questionId = questionId;
      coursePersionStatistics(this.courseId, questionId).then((res) => {
        this.quesStatisticsData = res.extra;
      });
    },
    // 获取课程统计_按人员_学生答题信息
    getPersonAnswerData(item) {
      let klsId = item.kls.map((o) => {
        return o.libId;
      });
      personStatisticsAnswer(this.courseId, item.id).then((res) => {
        this.personStatisticsAnswer = res.extra;
      });
      personStatisticsTag(item.id).then((res) => {
        this.personStatisticsLabel = res.extra.filter((o) =>
          klsId.includes(o.libId)
        );
        this.personStatisticsLabel = this.personStatisticsLabel.map((o, i) => {
          return { ...o, rate: item.kls[i].scoring };
        });
        console.log(this.personStatisticsLabel);
      });
    },
    // 获取课程统计_按知识模块蓝图数据
    getModelLabelData(data) {
      this.modelLabelData = data;
    },
  },
};
</script>

<style scoped lang="less">
p {
  margin-bottom: 0;
}

.sideActive {
  color: #333951 !important;
  background: #fff !important;
}

.center {
  position: relative;
  width: 880px;
  height: calc(100vh - 20px);
  min-height: 500px;
}

.tabs {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;

  .swiper_box {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 880px;
  }

  .swiper {
    width: 800px;

    .swiper-slide {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 36px;
      font-size: 14px;
      padding: 0 5px;
      color: #b1b1ca;
      box-sizing: border-box;
      background-color: #f6f5fa;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      cursor: pointer;

      .courseName {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap; //文本不换行，这样超出一行的部分被截取，显示...
      }
    }
  }
}

.center_content {
  border-radius: 8px;
  background-color: #fff;

  .c_top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 40px 0;

    .ant-btn {
      min-width: 80px;
    }

    .btn_group_l,
    .btn_group_r {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .btn_group_l {
      width: 300px;
    }

    .btn_group_r {
      width: 200px;
    }
  }
}
.courseContent {
  position: relative;
  height: calc(100vh - 141px);
  padding: 15px 10px 50px 10px;
  overflow-y: auto;
  min-height: 500px;
  .quesBox {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
}
.contentHeight {
  height: calc(100vh - 105px);
}
</style>
