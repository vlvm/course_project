<template>
  <div class="center">
    <Tab :tabIndex="tabIndex" :tab-data="tabData" @changeIndex="changeIndex">
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
            v-for="(o, i) in courseList"
            :key="o.id"
            :class="{ sideActive: sideIndex === o.id }"
          >
            <div class="courseName">
              <a-tooltip placement="bottomLeft" :title="`${o.name}${i}`">
                {{ o.name }}{{ i }}
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
            @click="changeModule(0)"
            >安题统计</a-button
          >
          <a-button
            size="small"
            :type="module === 1 ? 'primary' : ''"
            @click="changeModule(1)"
            >按人统计</a-button
          >
          <a-button
            size="small"
            :type="module === 2 ? 'primary' : ''"
            @click="changeModule(2)"
          >
            按知识模块统计
          </a-button>
        </div>
      </div>
      <!--内容区域-->
      <div class="courseContent">
        <div class="quesBox">
          <StatisticsByQuestion v-if="module === 0"></StatisticsByQuestion>
          <StatisticsByPerson v-if="module === 1"></StatisticsByPerson>
          <StatisticsByKnowledge v-if="module === 2"></StatisticsByKnowledge>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 使用Swiper组件
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import { mapState, mapActions } from "vuex";

export default {
  name: "SideCenter",
  components: {
    Tab: () => import("../../../../components/Tab"),
    swiper,
    swiperSlide,
    StatisticsByPerson: () => import("./StatisticsByPerson"),
    StatisticsByQuestion: () => import("./StatisticsByQuestion"),
    StatisticsByKnowledge: () => import("./StatisticsByKnowledge"),
  },
  data() {
    return {
      modal: {
        visible: false,
      },
      tabIndex: "2",
      drag: false,
      tabData: [
        { id: "0", name: "创建课程" },
        { id: "1", name: "处理课程" },
        { id: "2", name: "课程结果" },
      ],
      swiperOption: {
        // 鼠标无法拖动，手机也无法滑动
        allowTouchMove: false,
        // 5个为一组
        slidesPerView: 4,
        // 间隔为5
        spaceBetween: 5,
        on: {
          tap: () => {
            this.sideIndex = this.courseList[this.swiper.clickedIndex].id;
            console.log(this.sideIndex);
          },
        },
      },
      sideIndex: 0,
      courseList: [
        { id: 0, name: "课程" },
        { id: 1, name: "课程" },
        { id: 2, name: "课程" },
        { id: 3, name: "课程课程课程课程课程课程课程课程课程课程" },
        { id: 4, name: "课程" },
      ],
    };
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    },
    courseName() {
      return this.courseList[this.sideIndex].name + this.sideIndex;
    },
    ...mapState({
      module: (state) => state.r.module,
    }),
  },
  methods: {
    ...mapActions("r", ["changeModule"]),
    changeStudent(val) {
      console.log(val);
    },
    handleOk() {
      this.modal.visible = false;
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
</style>
