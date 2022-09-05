<template>
  <div>
    <div class="center">
      <!--考试选项卡-->
      <Tab
        style="margin-bottom: 10px"
        :tabIndex="tabIndex"
        :showRedDot="
          redCatalogIdsDotIds.includes(parseInt($route.query.catalogId)) &&
          paperList.length > 0
        "
        :tab-data="[
          { id: '0', name: '创建考试' },
          { id: '1', name: '处理考试' },
          { id: '2', name: '考后分析' },
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
            v-if="paperList.length > 4"
          />
          <swiper :options="swiperOption" ref="mySwiper" class="swiper">
            <swiper-slide
              v-for="o in paperList"
              :key="o.id"
              :class="{ sideActive: paperId === o.id }"
            >
              <div class="paperName">
                <a-tooltip placement="bottomLeft" :title="`${o.paperName}`">
                  {{ o.paperName }}
                </a-tooltip>
              </div>
            </swiper-slide>
          </swiper>
          <a-icon
            type="right"
            style="font-size: 16px"
            @click="slideNext"
            v-if="paperList.length > 4"
          />
        </div>
      </div>
      <div class="center_content">
        <div class="c_top" v-if="paperList.length > 0">
          <div class="btn_group_l">
            <a-select
              v-model="studentId"
              style="width: 180px"
              size="small"
              @change="changeStudent"
            >
              <a-select-option value=""> 全班成绩</a-select-option>
              <a-select-option
                v-for="o in stuList"
                :key="o.stuId"
                :value="o.stuId"
              >
                {{ o.stuName }}
              </a-select-option>
            </a-select>
            <!--<a-select
              v-model="pointId"
              style="width: 250px; margin-left: 10px"
              size="small"
              disabled
            >
              <a-select-option value=""> 全部知识模块</a-select-option>
              <a-select-option
                v-for="o in libData"
                :key="o.pointId"
                :value="o.pointId"
              >
                {{ o.stuName }}
              </a-select-option>
            </a-select>-->
            <a-select
              v-model="spsId"
              style="width: 250px; margin-left: 10px"
              size="small"
              @change="changePoint"
            >
              <a-select-option value=""> 整体试卷</a-select-option>
              <a-select-option v-for="o in sps" :key="o.id" :value="o.id">
                {{ o.pointName }}
              </a-select-option>
            </a-select>
          </div>
        </div>
        <!--内容区域-->
        <div
          class="courseContent"
          :class="{ contentHeight: paperList.length === 0 }"
        >
          <template v-if="paperList.length > 0">
            <!--全班成绩-->
            <ClassAnalysis
              ref="classAnalysis"
              :paperId="paperId"
              :studentId="studentId"
              :expandedRowIds.sync="expandedRowIds"
              :spsIds.sync="spsIds"
              :rowClickId.sync="rowClickId"
              :tableItem.sync="tableItem"
              :sps.sync="sps"
              :spsId.sync="spsId"
              v-if="studentId === ''"
            >
            </ClassAnalysis>
            <!--某个学生成绩-->
            <StudentAnalysis
              ref="studentAnalysis"
              :paperId="paperId"
              :studentId="studentId"
              :expandedRowIds.sync="expandedRowIds"
              :spsIds.sync="spsIds"
              :rowClickId.sync="rowClickId"
              :tableItem.sync="tableItem"
              :sps.sync="sps"
              :spsId.sync="spsId"
              v-else
            >
            </StudentAnalysis>
          </template>
        </div>
      </div>
    </div>
    <SideRight
      :paperId="paperId"
      :paperList.sync="paperList"
      :paperData="paperData"
      :studentId="studentId"
      :spsIds="spsIds"
      :rowClickId="rowClickId"
      :expandedRowIds="expandedRowIds"
      :tableItem="tableItem"
      :spsId="spsId"
    ></SideRight>
  </div>
</template>

<script>
// 使用Swiper组件
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import { getPaperList, getPaperStuList } from "@/request/exam/examResult";

export default {
  name: "ExamCreateIndex",
  components: {
    Tab: () => import("@/components/Tab"),
    swiper,
    swiperSlide,
    // draggable,
    StudentAnalysis: () => import("./components/StudentAnalysis"),
    ClassAnalysis: () => import("./components/ClassAnalysis"),
    SideRight: () => import("./components/SideRight"),
  },
  data() {
    return {
      isOtherTeacher: false,
      tabIndex: "2",
      modal: {},
      swiperOption: {
        // 鼠标无法拖动，也无法滑动
        allowTouchMove: false,
        // 4个为一组
        slidesPerView: 4,
        // 间隔为5
        spaceBetween: 5,
        on: {
          tap: () => {
            this.paperId = this.paperList[this.swiper.clickedIndex].id;
          },
        },
      },
      paperId: "",
      paperList: [],
      studentId: "",
      stuList: [],
      pointId: "",
      libData: [],
      // 统计点id集合
      spsIds: [],
      rowClickId: "",
      expandedRowIds: [],
      tableItem: {},
      spsId: "",
      sps: [],
    };
  },
  inject: ["catalogIds", "courseIds"],
  computed: {
    redPaperIdDotIds() {
      return this.courseIds();
    },
    redCatalogIdsDotIds() {
      return this.catalogIds();
    },
    swiper() {
      return this.$refs.mySwiper.swiper;
    },
    // 选中的考试数据
    paperData() {
      return this.paperList.find((o) => o.id === this.paperId) || {};
    },
  },
  watch: {
    "$route.query.catalogId": {
      immediate: true,
      handler(catalogId) {
        if (catalogId !== undefined && catalogId != "") {
          this.getPaperList();
        }
      },
    },
    paperId(paperId) {
      this.studentId = "";
      if (this.paperList.length > 0) {
        getPaperStuList(paperId).then((res) => {
          this.stuList = res.extra;
        });
      }
    },
  },
  mounted() {},
  methods: {
    // 切换考试顶部选项卡
    changeIndex(index) {
      this.tabIndex = index;
      if (index === "0") {
        this.$router.push({
          path: "/exam/created",
          query: {
            catalogId: this.$route.query.catalogId,
          },
        });
      } else if (index === "1") {
        this.$router.push({
          path: "/exam/processing",
          query: {
            catalogId: this.$route.query.catalogId,
          },
        });
      } else if (index === "2") {
        this.$router.push({
          path: "/exam/result",
          query: {
            catalogId: this.$route.query.catalogId,
          },
        });
      }
    },
    // 获取当前目录下所有考试
    getPaperList() {
      getPaperList({
        catalogId: this.$route.query.catalogId,
        type: 2,
      }).then((res) => {
        if (res.extra.length > 0) {
          this.paperId = res.extra[0].id;
        } else {
          this.paperId = "";
        }
        this.paperList = res.extra;
      });
    },
    // 切换上一个考试
    slidePrev() {
      if (this.swiper.isBeginning) {
        this.$message.warning("已经是第一个考试了！");
        return;
      }
      this.swiper.slidePrev();
    },
    // 切换下一个考试
    slideNext() {
      if (this.swiper.isEnd) {
        this.$message.warning("已经是最后一个考试了！");
        return;
      }
      this.swiper.slideNext();
    },
    changeStudent(stuId) {
      console.log(stuId);
      this.studentId = stuId;
      this.spsId = "";
      this.rowClickId = "";
      this.expandedRowIds = [];
    },
    changePoint(id) {
      console.log(id);
      this.rowClickId = "";
      this.expandedRowIds = [];
      // if (id === "") {
      //   this.$refs.classAnalysis.getQuesStatistics();
      // } else {
      //   this.$refs.studentAnalysis.getQuesStatisticsByStu(id);
      // }
    },
  },
};
</script>

<style scoped lang="less">
::v-deep .ant-badge-status-text {
  margin-left: 0;
}
::v-deep .ant-table-body {
  margin: 0;
}
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

      .paperName {
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
      //width: 300px;
    }

    .btn_group_r {
      width: 200px;
    }
  }
}
.courseContent {
  position: relative;
  height: calc(100vh - 141px);
  padding: 15px 10px 10px 10px;
  overflow-y: auto;
  min-height: 500px;
}
.contentHeight {
  height: calc(100vh - 66px);
}

::v-deep
  .ant-table-tbody
  > tr:hover:not(.ant-table-expanded-row):not(.ant-table-row-selected)
  > td {
  color: rgba(0, 0, 0, 0.65);
  background: #f6f5fa;
}
</style>
