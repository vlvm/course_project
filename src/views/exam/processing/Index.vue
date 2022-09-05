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
              v-for="(o, i) in paperList"
              :key="o.id"
              :class="{ sideActive: paperId === o.id }"
            >
              <div class="paperName">
                <a-tooltip placement="bottomLeft" :title="`${o.paperName}`">
                  <a-badge
                    status="error"
                    v-if="redPaperIdDotIds.includes(o.id)"
                  />
                  {{ o.paperName }}
                </a-tooltip>
              </div>
              <div v-if="!isOtherTeacher">
                <a-dropdown :trigger="['click']">
                  <a-icon type="more" @click="(e) => e.stopPropagation()" />
                  <a-menu slot="overlay" @click="dropdownClick($event, o)">
                    <template v-if="paperList.length > 1">
                      <a-menu-item key="0" v-if="i !== 0">
                        <a-icon type="menu-fold" />
                        左移
                      </a-menu-item>
                      <a-menu-item key="1" v-if="i < paperList.length - 1">
                        <a-icon type="menu-unfold" />
                        右移
                      </a-menu-item>
                    </template>
                    <a-menu-item key="2">
                      <a-icon type="delete" />
                      删除
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
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
              v-model="stuId"
              style="width: 150px"
              size="small"
              @change="changeStudent"
            >
              <a-select-option :value="0"> 全部学生</a-select-option>
              <a-select-option
                v-for="o in stuList"
                :key="o.stuId"
                :value="o.stuId"
                :disabled="o.mappingStatus === 0 || !isOverRecoveryTime"
              >
                <a-icon
                  type="solution"
                  :style="{ color: '#52c41a' }"
                  v-if="o.mappingStatus === 1"
                />
                <a-icon
                  type="solution"
                  :style="{ color: '#ff0000' }"
                  v-if="o.mappingStatus === 0"
                />
                {{ o.stuName }}
              </a-select-option>
            </a-select>
            <a-select
              style="width: 100px"
              size="small"
              v-model="screenCourse"
              @change="changeScreenCourse"
            >
              <a-select-option :value="0"> 试卷详情</a-select-option>
              <a-select-option :value="1"> 试卷题目</a-select-option>
            </a-select>
            <a-badge :dot="redPoint">
              <a-button
                size="small"
                :type="isReview ? 'primary' : ''"
                @click="getReviewStatusQuestion"
              >
                待批阅
              </a-button>
            </a-badge>
            <a-badge :dot="replayRedPoint">
              <a-button
                size="small"
                :type="isReply ? 'primary' : ''"
                @click="getReplayStatusQuestion"
              >
                待回复
              </a-button>
            </a-badge>
          </div>
        </div>
        <div
          class="courseContent"
          :class="{ noCourse: paperList.length === 0 }"
        >
          <draggable
            v-model="contentData"
            :disabled="
              contentId === '' || ['0', '1', '2', '3'].includes(editorType)
            "
            filter=".forbid"
            @start="onStart"
            @end="onEnd"
          >
            <transition-group>
              <div
                class="quesBox"
                v-for="item in contentData"
                :key="item.content.id"
              >
                <ContentQuestion
                  :ref="`ContentQuestion${item.content.id}`"
                  :stuId="stuId"
                  :editorType.sync="editorType"
                  :contentId.sync="contentId"
                  :contentData="contentData"
                  :contentType="item.contentType"
                  :isReply="isReply"
                  :data="item.content"
                  :isOverRecoveryTime="isOverRecoveryTime"
                  :class="item.content.id === contentId ? '' : 'forbid'"
                  @openReview="openReview"
                  @getReviewAnswer="getReviewAnswer"
                  @showIndexDiscussArea="showIndexDiscussArea"
                  @shareWindos="shareWindos"
                ></ContentQuestion>
              </div>
            </transition-group>
          </draggable>
        </div>
      </div>
    </div>
    <SideRight
      :paperId="paperId"
      :paperData="paperData"
      :paperList.sync="paperList"
      :stuId="stuId"
      :contentId="contentId"
      :contentSelector="contentSelector"
      :isOverRecoveryTime="isOverRecoveryTime"
      @getPaperContentData="getData"
    ></SideRight>
    <!--提问区-->
    <DiscussArea
      v-show="isDiscussArea"
      :AskCourseId="paperId"
      :AskQuestionId="askQuestionId"
      :contentType="discussAreaContentType"
      :discussStuId="discussStuId"
      :sourceFirstType="1"
      ref="discuss"
      @setAskShareDTOList="setAskShareDTOList"
    ></DiscussArea>
    <!--查看分享-->
    <ShareLayer
      v-show="isShareLayer"
      ref="share"
      :askShareDTOList="askShareDTOList"
    ></ShareLayer>
    <!--TODO: 可修改为 js 方法弹出-->
    <!--批阅查看答案弹窗-->
    <a-modal
      :width="900"
      v-model="modal.showRightAnswer"
      title="查看答案"
      :footer="null"
      :maskClosable="false"
    >
      <div
        style="width: 100%; min-height: 500px; overflow: auto"
        v-html="reviewQues.answer"
      ></div>
    </a-modal>
    <!--添加文字批注-->
    <a-modal
      :width="870"
      :maskClosable="false"
      v-model="modal.addContentTextModal"
      title="批注"
    >
      <Editor ref="editor" v-if="modal.addContentTextModal"></Editor>
      <template slot="footer">
        <a-button @click="modal.addContentTextModal = false">取消</a-button>
        <a-button type="primary" @click="clearContentTxt"> 清空批注 </a-button>
        <a-button type="primary" @click="addContentText">确定</a-button>
      </template>
    </a-modal>
    <!-- 批阅弹框 -->
    <a-modal
      class="reviewModal"
      v-model="modal.showReview"
      :footer="null"
      :closable="false"
      :maskClosable="false"
    >
      <div class="review" v-if="modal.showReview">
        <div class="left">
          <div class="title">批阅打分</div>
          <div class="iconWrap">
            <div
              class="iconBox rightAnswer"
              :class="{
                right1: reviewQuesScore === parseInt(reviewQues.questionScore),
              }"
              @click="setReviewQuesScore(reviewQues.questionScore)"
            >
              <i class="iconfont lx-right-line"></i>
            </div>
            <div
              class="iconBox partially"
              :class="{
                partially1:
                  reviewQuesScore > 0 &&
                  reviewQuesScore < reviewQues.questionScore,
              }"
              @click="
                setReviewQuesScore(parseInt(reviewQues.questionScore) / 2)
              "
            >
              <i class="iconfont lx-partially-line"></i>
            </div>
            <div
              class="iconBox wrong"
              :class="{
                wrong1: reviewQuesScore === 0 && stuItem.readOverTag === 1,
              }"
              @click="setReviewQuesScore(0)"
            >
              <i class="iconfont lx-wrong-line"></i>
            </div>
          </div>
          <div class="pointBox">
            <div
              class="pointItem"
              :class="{
                wrong1:
                  reviewQuesScore === o &&
                  reviewQuesScore === 0 &&
                  stuItem.readOverTag === 1,
                right1:
                  reviewQuesScore === o &&
                  reviewQuesScore === reviewQues.questionScore,
                partially1:
                  reviewQuesScore === o &&
                  reviewQuesScore > 0 &&
                  reviewQuesScore < reviewQues.questionScore,
              }"
              v-for="o in quesStoreData"
              :key="o"
              @click="setReviewQuesScore(o)"
            >
              {{ o }}分
            </div>
            <div class="pointItem" style="visibility: hidden"></div>
          </div>
          <div class="seeAnswer" @click="modal.showRightAnswer = true">
            查看答案
          </div>
          <div
            class="seeAnswer"
            :style="{
              background:
                stuItem.teacherReadOverContent === null ||
                checkVal(stuItem.teacherReadOverContent)
                  ? ''
                  : '#1890ff',
            }"
            @click="openEditorModal"
          >
            {{
              stuItem.teacherReadOverContent === null ||
              checkVal(stuItem.teacherReadOverContent)
                ? "添加批注"
                : "查看批注"
            }}
          </div>
        </div>
        <div class="right">
          <div class="stuAnswerCtrl">
            <!--{{ reviewSwiperActiveIndex }}&#45;&#45;{{ reviewIndex }}&#45;&#45;{{
              haveHandwriting
            }}-->
            <div class="stu_top">
              <div class="c_left">
                <dl>
                  <dt>{{ reviewStu[reviewSwiperActiveIndex].stuName }}:</dt>
                  <dd
                    v-for="(o, i) in reviewStu[reviewSwiperActiveIndex]
                      .readAttachmentList"
                    :key="o.id"
                    :class="{ answerActive: reviewIndex === i }"
                    @click="changeAnswerImg(i)"
                  >
                    答案{{ i + 1 }}
                  </dd>
                </dl>
              </div>
              <!--<a-space :size="15" v-if="reviewStu.length > 1">
                <a-button size="small" @click="stuPrev">上一个学生</a-button>
                <a-button size="small" @click="stuNext">下一个学生</a-button>
              </a-space>-->
              <span class="c_right" @click="closeReviewModal">
                <a-icon type="close-circle" />关闭
              </span>
            </div>
            <ul class="tools">
              <li
                @click="canvasTool(0)"
                :style="{ color: toolsStatus === 0 ? '#FFF' : '' }"
              >
                <span class="iconfont lx-huabi">笔</span>
              </li>
              <li
                @click="canvasTool(1)"
                :style="{ color: toolsStatus === 1 ? '#FFF' : '' }"
              >
                <span class="iconfont"><a-icon type="drag" />移动</span>
              </li>
              <!--<li>
                <a-slider
                  v-model="canvasTool(2)"
                  :min="1"
                  :max="10"
                  style="width: 80px"
                />
              </li>-->
              <li
                @click="canvasTool(3)"
                :style="{ color: toolsStatus === 3 ? '#FFF' : '' }"
              >
                <span class="iconfont lx-xiangpica">笔擦</span>
              </li>
              <li
                @click="canvasTool(4)"
                :style="{ color: toolsStatus === 4 ? '#FFF' : '' }"
              >
                <span class="iconfont"><a-icon type="undo" />左转</span>
              </li>
              <li
                @click="canvasTool(5)"
                :style="{ color: toolsStatus === 5 ? '#FFF' : '' }"
              >
                <span class="iconfont"><a-icon type="redo" />右转</span>
              </li>
              <li @click="canvasTool(6)">
                <span class="iconfont lx-clear">清屏</span>
              </li>
              <!-- <li @click="handle">
                <span class="iconfont lx-save">保存</span>
              </li> -->
              <!--      <li>
                <span class="iconfont lx-iczoomout">放大</span>
              </li>
              <li><span class="iconfont lx-small">缩小</span></li>-->
              <!-- <li><span class="iconfont lx-yuanshibili">原尺寸</span></li> -->
              <li @click="shareCanvas">
                <span class="iconfont">
                  <a-icon type="share-alt" />分享到班
                </span>
              </li>
            </ul>
          </div>

          <div class="stuAnswer">
            <swiper
              :options="swiperReviewOption"
              ref="reviewSwiper"
              class="reviewSwiper"
              :key="swiperKey"
            >
              <swiper-slide v-for="(o, i) in reviewStu" :key="o.stuId">
                <template v-for="(item, j) in o.readAttachmentList">
                  <Board
                    v-if="reviewSwiperActiveIndex == i && reviewIndex === j"
                    :key="item.id"
                    :reviewImg="`/exam${item.attachmentLinkAddress}`"
                    ref="answerCanvas"
                    @shareCanvas="shareCanvas"
                    @setHandwriting="setHandwriting"
                  >
                  </Board>
                </template>
                <div
                  class="swiper-button-prev"
                  style="background: none; color: #fff; margin-top: -80px"
                >
                  上个学生
                </div>
                <div
                  class="swiper-button-next"
                  style="background: none; color: #fff; margin-top: -80px"
                >
                  下个学生
                </div>
              </swiper-slide>
            </swiper>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
// 使用Swiper组件
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import Compressor from "compressorjs";
import { upGo, downGo } from "@/until";
import draggable from "vuedraggable";
import {
  getPaperList,
  deletePaper,
  paperSort,
  getPaperContent,
  getPaperStuList,
  getReviewStatus,
  getReplayStatus,
  getReplayStatusQues,
  getReviewStatusQues,
  readover,
  shareAnswerToClass,
} from "@/request/exam/expamProcessing";
import { upload } from "@/request/course/created/course";

export default {
  name: "ExamCreateIndex",
  props: ["isOtherTeacher"],
  components: {
    Tab: () => import("@/components/Tab"),
    swiper,
    swiperSlide,
    draggable,
    Editor: () => import("@/components/MyEditor"),
    Board: () => import("./components/Board"),
    ContentQuestion: () => import("./components/ContentQuestion"),
    ShareLayer: () => import("@/components/ShareLayer.vue"),
    DiscussArea: () => import("@/components/DiscussArea"),
    SideRight: () => import("./components/SideRight"),
  },
  data() {
    let _this = this;
    return {
      swiperKey: Math.random().toString(36).substr(2) /*随机的key*/,
      tabIndex: "1",
      modal: {
        showReview: false,
        showRightAnswer: false,
        addContentTextModal: false,
      },
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
            this.getPaperContentData(this.paperId, 0, this.screenCourse);
          },
        },
      },
      paperId: "",
      paperList: [],
      // 当前选择的学生id
      stuId: 0,
      // 学生列表
      stuList: [],
      // 题目筛选
      screenCourse: 0,
      // 批阅红点
      redPoint: false,
      // 待批阅状态
      isReview: false,
      // 回复红点
      replayRedPoint: false,
      // 待回复状态
      isReply: false,
      // 课程内容选中id
      contentId: "",
      // 课程内容数据
      contentData: [],
      // 考试内容编辑状态
      editorType: null,
      drag: false,
      // 批阅swiper activeIndex
      reviewSwiperActiveIndex: 0,
      swiperReviewOption: {
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        // 鼠标无法拖动，手机也无法滑动
        allowTouchMove: false,
        effect: "fade",
        initialSlide: _this.reviewSwiperActiveIndex,
        observer: true, //修改swiper自己或子元素时，自动初始化swiper，主要是这两行
        observeParents: true, //修改swiper的父元素时，自动初始化swiper
        // allowSlideNext: false, //设置右箭头禁止点击
        // allowSlidePrev: false, //设置左箭头禁止点击
        on: {
          /* slideChangeTransitionEnd: function () {
            _this.reviewSwiperActiveIndex = this.activeIndex;
            _this.reviewIndex = 0;
          },*/
          slideChangeTransitionStart: function () {
            let previousIndex = this.previousIndex;
            let activeIndex = this.activeIndex;
            _this.reviewSwiperActiveIndex = activeIndex;
            if (_this.haveHandwriting) {
              if (!_this.isReviewIng) {
                /* _this.saveCanvas(() => {
                _this.haveHandwriting = false;
              }, false)*/
                _this.$refs.answerCanvas[0].save(
                  (file) =>
                    new Compressor(file, {
                      quality: _this.stuItem.readOverTag === 1 ? 0.8 : 0.4,
                      // maxWidth: 900,
                      success(result) {
                        let a = _this.blobToFile(
                          result,
                          new Date().getTime() + ".jpg"
                        );
                        upload({ uploadFile: a }).then((res) => {
                          if (res.extra) {
                            _this.$set(
                              _this.reviewStu[previousIndex].readAttachmentList,
                              _this.reviewIndex,
                              res.extra
                            );
                            // _this.$set(
                            //   _this.stuReviewList,
                            //   previousIndex,
                            //   _this.reviewStu[activeIndex].readAttachmentList
                            // );
                            _this.stuReviewList =
                              _this.reviewStu[previousIndex].readAttachmentList;

                            let reviewData = _this.reviewStu[previousIndex];
                            let changeSwiper = {
                              questionId:
                                reviewData.questionId || reviewData.id,
                              paperId: reviewData.paperId,
                              studentId: reviewData.stuId,
                              studentScore: reviewData.studentScore,
                              teacherReadOverContent:
                                reviewData.teacherReadOverContent,
                            };
                            _this.reviewOver(() => {
                              _this.reviewIndex = 0;
                              _this.haveHandwriting = false;
                            }, changeSwiper);
                          }
                        });
                      },
                      error(err) {
                        console.log(err.message);
                      },
                    })
                );
              }
            } else {
              _this.reviewIndex = 0;
            }
          },
        },
      },
      // 作答的学生数据
      reviewStu: [],
      // 当前学生作答的索引
      reviewIndex: 0,
      // 批阅当前学生作答数据
      stuReviewList: [],
      // 批阅当前试题数据
      reviewQues: {},
      // 画板功能按钮索引
      toolsStatus: 0,
      // 是否有笔迹
      haveHandwriting: false,
      // 是否批阅
      readOverTag: 0,
      // 显示提问区
      isDiscussArea: false,
      // 提问的学生Id
      discussStuId: "",
      askQuestionId: "",
      discussAreaContentType: "",
      //关闭或者显示分享窗口
      isShareLayer: false,
      //分享的数据列表
      askShareDTOList: [],
      // 是否正在批阅
      isReviewIng: false,
    };
  },
  inject: ["catalogIds", "courseIds", "getReddot"],
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
    // 选中的考试内容数据
    contentSelector() {
      return (
        this.contentData.find((o) => o.content.id === this.contentId) || {}
      );
    },
    // 是否到回收时间
    isOverRecoveryTime() {
      if (this.paperData.paperRecycleTime) {
        return (
          new Date().getTime() >
          new Date(this.paperData.paperRecycleTime).getTime()
        );
      } else {
        return false;
      }
    },
    // 选中的学生数据
    stuItem() {
      return this.reviewStu[this.reviewSwiperActiveIndex];
    },
    // 批阅打分分数
    reviewQuesScore: {
      get() {
        return this.reviewStu[this.reviewSwiperActiveIndex].studentScore;
      },
      set() {},
    },
    // 当前批阅的试题打分选项卡数据
    quesStoreData() {
      let a = [];
      let n = 0;
      for (let i = 0; i < this.reviewQues.questionScore / 0.5; i++) {
        n += 0.5;
        a.push(n);
      }
      return [0, ...a];
    },
  },
  watch: {
    "$route.query.catalogId": {
      immediate: true,
      handler(catalogId) {
        if (catalogId !== undefined && catalogId != "") {
          this.getData();
        }
      },
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
        type: 1,
      }).then((res) => {
        if (res.extra.length > 0) {
          this.paperId = res.extra[0].id;
        } else {
          this.paperId = null;
        }
        this.paperList = res.extra;
      });
    },
    // 考试列表菜单操作
    dropdownClick(e, item) {
      const _this = this;
      const { key } = e;
      let i = this.paperList.findIndex((item) => item.id === this.paperId);
      switch (key) {
        case "0":
          upGo(this.paperList, i);
          // eslint-disable-next-line no-case-declarations
          let upGoArr = this.paperList.map((o, i) => {
            return { id: o.id, paperIndex: i };
          });
          paperSort(upGoArr);
          break;
        case "1":
          downGo(this.paperList, i);
          downGo(this.paperList, i);
          // eslint-disable-next-line no-case-declarations
          let downGoArr = this.paperList.map((o, i) => {
            return { id: o.id, paperIndex: i };
          });
          paperSort(downGoArr);
          break;
        case "2":
          this.$confirm({
            title: "是否确定要删除这个考试?",
            // content: "Some descriptions",
            okText: "删除",
            okType: "danger",
            cancelText: "取消",
            onOk() {
              deletePaper(item.id).then((res) => {
                if (res.extra) {
                  _this.paperList = _this.paperList.filter(
                    (o) => o.id !== item.id
                  );
                  if (_this.paperList.length > 0) {
                    const index = _this.paperList.length - 1;
                    _this.paperId = _this.paperList[index].id;
                  }
                }
              });
            },
            onCancel() {
              console.log("Cancel");
            },
          });
          break;
      }
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
    getData() {
      // 获取试卷列表
      getPaperList({
        type: 1,
        catalogId: this.$route.query.catalogId,
      }).then((res) => {
        this.paperList = res.extra;
        if (res.extra.length > 0) {
          this.paperId = res.extra[0].id;
          getPaperStuList(this.paperId).then((res) => {
            this.stuList = res.extra;
            this.getPaperContentData(this.paperId, 0, this.screenCourse);
          });
          getReviewStatus({
            paperId: this.paperId,
            stuId: 0,
            detail: this.screenCourse,
          }).then((res) => {
            this.redPoint = res.extra;
          });
          getReplayStatus({
            paperId: this.paperId,
            stuId: 0,
            detail: this.screenCourse,
          }).then((res) => {
            this.replayRedPoint = res.extra;
          });
        } else {
          this.paperId = "";
          this.stuList = [];
          this.contentData = [];
        }
      });
    },
    // 获取处理试卷数据
    getPaperContentData(paperId, stuId = 0, detail) {
      this.contentId = "";
      getPaperContent({
        paperId: paperId,
        stuId: stuId,
        detail: detail,
      }).then((r) => {
        this.contentData = r.extra;
      });
    },
    // 切换学生
    changeStudent(stuId) {
      this.screenCourse = 0;
      this.isReview = false;
      this.isReply = false;
      this.getPaperContentData(this.paperId, stuId, this.screenCourse);
    },
    // 切换试卷详情
    changeScreenCourse(screenCourse) {
      // this.stuId = 0;
      this.isReview = false;
      this.isReply = false;
      this.getPaperContentData(this.paperId, this.stuId, screenCourse);
    },
    // 筛选待批阅内容
    getReviewStatusQuestion() {
      this.stuId = 0;
      this.screenCourse = 0;
      if (!this.isReview) {
        getReviewStatusQues({
          paperId: this.paperId,
          stuId: this.stuId,
          detail: this.screenCourse,
        }).then((res) => {
          this.contentData = res.extra;
          this.isReview = true;
          this.isReply = false;
        });
      } else {
        getPaperContent({
          paperId: this.paperId,
          stuId: 0,
          detail: 0,
        }).then((r) => {
          this.contentData = r.extra;
          this.isReview = false;
          this.isReply = false;
        });
      }
    },
    // 筛选待回复内容
    getReplayStatusQuestion() {
      this.stuId = 0;
      this.screenCourse = 0;
      if (!this.isReply) {
        getReplayStatusQues({
          paperId: this.paperId,
          stuId: this.stuId,
          detail: this.screenCourse,
        }).then((res) => {
          this.contentData = res.extra;
          this.isReply = true;
          this.isReview = false;
        });
      } else {
        getPaperContent({
          paperId: this.paperId,
          stuId: 0,
          detail: 0,
        }).then((r) => {
          this.contentData = r.extra;
          this.isReply = false;
          this.isReview = false;
        });
      }
    },
    //开始拖拽事件
    onStart() {
      this.drag = true;
    },
    //拖拽结束事件
    onEnd() {
      this.drag = false;
      this.contentId = "";
    },

    // 内容多选时确定
    relationTrue() {
      let index = this.contentData.findIndex(
        (o) => o.id === this.contentCheckedArr[0]
      );
      if (this.editorType === "0") {
        let arr = JSON.parse(JSON.stringify(this.contentData));
        arr.forEach((o) => {
          if (this.contentCheckedArr.indexOf(o.id) !== -1) {
            o.relation = this.contentCheckedArr;
          }
        });
        this.clearData();
      } else if (this.editorType === "1") {
        let arr = JSON.parse(JSON.stringify(this.contentData));
        let num = arr[index].quesNum;
        arr.forEach((o) => {
          if (this.contentCheckedArr.includes(o.id)) {
            o.quesNum = num++;
          }
        });
        this.clearData();
      } else if (this.editorType === "2") {
        let arr = JSON.parse(JSON.stringify(this.contentData));
        arr.forEach((o) => {
          if (this.contentCheckedArr.includes(o.id)) {
            o.point = this.contentData[index].point;
          }
        });
        this.clearData();
      }
    },
    // 重置内容编辑状态
    clearData() {
      this.changeEditorType("");
      this.changeContentCheckedArr([]);
    },
    // 打开批阅弹框
    openReview({ index, reviewStu, reviewQues }) {
      this.swiperReviewOption.initialSlide = index;
      this.reviewIndex = 0;
      this.reviewSwiperActiveIndex = index;
      // 获取学生数据
      this.reviewStu = reviewStu;
      // 获取当前试题数据
      this.reviewQues = reviewQues;
      // 设置批阅功能按钮状态
      this.toolsStatus = 0;
      // 打开批阅
      this.modal.showReview = true;
    },
    // 试题打分
    setReviewQuesScore(point) {
      this.reviewStu[this.reviewSwiperActiveIndex].studentScore = point;
      if (this.haveHandwriting) {
        if (!this.isReviewIng) {
          this.readOverTag = 1;
          this.reviewStu[this.reviewSwiperActiveIndex].readOverTag = 1;
          this.saveCanvas(() => {}, false);
        }
      } else {
        if (!this.isReviewIng) {
          this.readOverTag = 1;
          this.reviewStu[this.reviewSwiperActiveIndex].readOverTag = 1;
          this.reviewOver();
        }
      }
      /*if (this.reviewQuesScore === point) {
        this.reviewStu[this.reviewSwiperActiveIndex].studentScore = "";
        if (this.haveHandwriting) {
          if (!this.isReviewIng) {
            this.saveCanvas(() => {}, false);
          }
        } else {
          if (!this.isReviewIng) {
            this.reviewOver();
          }
        }
      } else {
        this.reviewStu[this.reviewSwiperActiveIndex].studentScore = point;
        if (this.haveHandwriting) {
          if (!this.isReviewIng) {
            this.saveCanvas(() => {}, false);
          }
        } else {
          if (!this.isReviewIng) {
            this.reviewOver();
          }
        }
      }*/
    },
    // 打开批阅窗口
    openEditorModal() {
      let html = this.stuItem.teacherReadOverContent;
      this.modal.addContentTextModal = true;
      setTimeout(() => {
        this.$refs.editor.editor.setHtml(html);
      }, 100);
    },
    // 批注检测是否为空
    checkVal(str) {
      let num = 0,
        reg = /<p>(&nbsp;|&nbsp;\s+)+<\/p>|<p>(<br>)+<\/p>/g;
      while (str !== null && num < str.length && str != "") {
        num++;
        let k = str.match(reg);
        if (k) {
          str = str.replace(k[0], "");
        }
      }
      return str == "";
    },
    // 批阅添加文字批注
    addContentText() {
      let _this = this;
      if (this.$refs.editor.editor.isEmpty()) {
        this.$confirm({
          title: "批注内容为空是否确定?",
          okText: `确定`,
          // 点击蒙层是否允许关闭
          maskClosable: false,
          cancelText: "取消",
          onOk: () => {
            if (_this.haveHandwriting) {
              if (!this.isReviewIng) {
                _this.saveCanvas(() => {
                  _this.reviewStu[
                    _this.reviewSwiperActiveIndex
                  ].teacherReadOverContent = _this.$refs.editor.html;
                  this.modal.addContentTextModal = false;
                }, false);
              }
            } else {
              if (!this.isReviewIng) {
                _this.reviewOver(() => {
                  // let quesIndex = this.contentData.findIndex(
                  //   (o) => o.content.id === this.stuItem.questionId
                  // );
                  _this.reviewStu[
                    _this.reviewSwiperActiveIndex
                  ].teacherReadOverContent = _this.$refs.editor.html;
                  this.modal.addContentTextModal = false;
                });
              }
            }
          },
          onCancel: () => {},
        });
      } else {
        if (_this.haveHandwriting) {
          if (!this.isReviewIng) {
            _this.saveCanvas(() => {
              _this.reviewStu[
                _this.reviewSwiperActiveIndex
              ].teacherReadOverContent = _this.$refs.editor.html;
              this.modal.addContentTextModal = false;
            }, false);
          }
        } else {
          if (!this.isReviewIng) {
            _this.reviewOver(() => {
              _this.reviewStu[
                _this.reviewSwiperActiveIndex
              ].teacherReadOverContent = _this.$refs.editor.html;
              this.modal.addContentTextModal = false;
            });
          }
        }
      }
    },
    //批阅清空文字批注
    clearContentTxt() {
      this.$refs.editor.editor.clear();
    },
    // 切换学生作答图片
    changeAnswerImg(index) {
      if (this.haveHandwriting) {
        if (!this.isReviewIng) {
          this.saveCanvas(() => {
            this.reviewIndex = index;
            this.haveHandwriting = false;
          }, false);
        }
      } else {
        if (!this.isReviewIng) {
          this.reviewIndex = index;
          this.haveHandwriting = false;
        }
      }
    },
    // 切换上一学生答案
    stuPrev() {
      if (this.reviewSwiper.isBeginning) {
        this.$message.warning("已经是第一个学生了！");
        return;
      }
      this.reviewSwiper.slidePrev();
    },
    // 切换下一个学生答案
    stuNext() {
      if (this.reviewSwiper.isEnd) {
        this.$message.warning("已经是最后一个学生了！");
        return;
      }
      this.reviewSwiper.slideNext();
    },
    // 获取学生主观题作答数据
    getReviewAnswer(data) {
      this.readOverTag = data.readOverTag === 1 ? data.readOverTag : 0;
      if (data.readOverTag === 1) {
        this.stuReviewList = data.readAttachmentList;
      } else {
        this.stuReviewList = data.stuAttachmentList;
      }
      this.reviewQuesScore = data.studentScore || "";
    },
    // 批阅作答图片
    reviewOver(func, changeSwiper) {
      let params = [
        {
          questionId: this.stuItem.questionId || this.stuItem.id,
          paperId: this.stuItem.paperId,
          studentId: this.stuItem.stuId,
          studentScore: this.reviewQuesScore,
          readAttachmentList: this.stuReviewList,
          teacherReadOverContent: this.$refs.editor
            ? this.$refs.editor.editor.isEmpty()
              ? null
              : this.$refs.editor.html
            : this.stuItem.teacherReadOverContent,
        },
      ];
      if (this.stuItem.readOverTag !== 0) {
        params[0].judgeTag =
          this.reviewQuesScore === 0
            ? 0
            : this.reviewQuesScore === this.reviewQues.questionScore
            ? 1
            : 2;
      }
      if (changeSwiper) {
        params[0].questionId = changeSwiper.questionId;
        params[0].paperId = changeSwiper.paperId;
        params[0].studentId = changeSwiper.studentId;
        params[0].studentScore = changeSwiper.studentScore;
        params[0].teacherReadOverContent = changeSwiper.teacherReadOverContent;
        if (this.stuItem.readOverTag !== 0) {
          params[0].judgeTag =
            changeSwiper.studentScore === 0
              ? 0
              : changeSwiper.studentScore === this.reviewQues.questionScore
              ? 1
              : 2;
        }
      }
      readover(params).then(() => {
        let id = params[0].questionId;
        if (this.stuId == 0) {
          this.$refs[`ContentQuestion${id}`][0].seeStuAnswers();
        } else {
          this.getPaperContent(
            this.stuItem.paperId,
            this.stuId,
            this.screenCourse
          );
        }
        if (this.stuItem.readOverTag !== 0) {
          getReviewStatus({
            paperId: this.paperId,
            stuId: 0,
            detail: this.screenCourse,
          }).then((res) => {
            this.redPoint = res.extra;
          });
          this.getReddot();
        }
        this.haveHandwriting = false;
        this.isReviewIng = false;
      });
      func && func();
    },
    // 批阅图片上传
    canvasUpload(file, func, close) {
      console.log("FILE:", file);
      let _this = this;
      new Compressor(file, {
        quality: _this.stuItem.readOverTag === 1 ? 0.8 : 0.4,
        // maxWidth: 900,
        // The compression process is asynchronous,
        success(result) {
          let a = _this.blobToFile(result, new Date().getTime() + ".jpg");
          upload({ uploadFile: a }).then((res) => {
            if (res.extra) {
              /*alert(
                `reviewSwiperActiveIndex:${_this.reviewSwiperActiveIndex}----reviewIndex:${_this.reviewIndex}----previousIndex:${_this.reviewSwiper.previousIndex}`
              );*/
              _this.$set(
                _this.reviewStu[_this.reviewSwiperActiveIndex]
                  .readAttachmentList,
                _this.reviewIndex,
                res.extra
              );
              _this.stuReviewList =
                _this.reviewStu[
                  _this.reviewSwiperActiveIndex
                ].readAttachmentList;
              console.log(_this.reviewStu);
              _this.reviewOver(() => {
                if (func) {
                  func();
                }
                if (close) {
                  _this.modal.showReview = false;
                }
              });
            }
          });
        },
        error(err) {
          console.log(err.message);
        },
      });
    },
    //将blob转换成file
    blobToFile(theBlob, fileName) {
      return new File([theBlob], fileName, {
        type: "image/jpeg",
        lastModified: Date.now(),
      });
    },
    // 手写作答保存
    saveCanvas(func, close = true) {
      this.isReviewIng = true;
      let _this = this;
      _this.$refs.answerCanvas[0].save((file) =>
        _this.canvasUpload(file, func, close)
      );
    },
    // 分享作答
    shareCanvas() {
      shareAnswerToClass(
        this.stuItem.paperId,
        this.stuItem.stuId,
        this.stuItem.questionId
      ).then(() => {
        let id = this.stuItem.questionId;
        this.$refs[`ContentQuestion${id}`][0].seeStuAnswers();
        this.$message.success("分享成功");
      });
    },
    // 设置笔迹状态
    setHandwriting(status) {
      this.haveHandwriting = status;
    },
    // 关闭批阅弹窗
    closeReviewModal() {
      if (this.haveHandwriting) {
        if (!this.isReviewIng) {
          this.saveCanvas(() => {}, true);
        }
      } else {
        this.modal.showReview = false;
      }
    },
    canvasTool(type) {
      this.$nextTick(() => {
        switch (type) {
          case 0:
            this.toolsStatus = type;
            this.$refs.answerCanvas[0].brush();
            break;
          case 1:
            this.toolsStatus = type;
            this.$refs.answerCanvas[0].canvasMoveClick();
            break;
          case 2:
            // this.$refs.answerCanvas[0].lineWidth;
            break;
          case 3:
            this.toolsStatus = type;
            this.$refs.answerCanvas[0].eraserClick();
            break;
          case 4:
            this.toolsStatus = type;
            this.$refs.answerCanvas[0].canvasRotate(0);
            break;
          case 5:
            this.toolsStatus = type;
            this.$refs.answerCanvas[0].canvasRotate(1);
            break;
          case 6:
            this.$refs.answerCanvas[0].clearCanvas();
            break;
        }
      });
    },
    // 关闭查看分享数据窗口
    choseShareWin() {
      this.isShareLayer = false;
    },
    // 设置分享提问内容
    setAskShareDTOList(data) {
      let i = this.contentData.findIndex(
        (o) => o.content.id === this.askQuestionId
      );
      let askShareDTOList = this.contentData[i].content.askShareDTOList;
      this.contentData[i].content.askShareDTOList = [data, ...askShareDTOList];
    },
    // 弹出查看分享窗口
    shareWindos(shareData) {
      let _this = this;
      _this.isShareLayer = true;
      _this.$refs.share.ShareDTOList(shareData);
    },
    // 显示提问弹窗
    showIndexDiscussArea({ data, stuId, contentType, askQuestionId }) {
      console.log(data);
      let _this = this;
      _this.discussAreaContentType = contentType;
      _this.discussStuId = stuId;
      _this.askQuestionId = askQuestionId;
      _this.isDiscussArea = true;
      _this.$refs.discuss.GetAskList();
    },
    // 关闭提问区
    closeDisussArea() {
      getReplayStatus({
        paperId: this.paperId,
        stuId: 0,
        detail: this.screenCourse,
      }).then((res) => {
        this.replayRedPoint = res.extra;
      });
      this.getReddot();
      this.isDiscussArea = false;
    },
  },
};
</script>

<style scoped lang="less">
::v-deep .ant-badge-status-text {
  margin-left: 0;
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
    padding: 15px 40px 15px;

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
      width: 430px;
    }

    .btn_group_r {
      width: 200px;
    }
  }
}
.courseContent {
  height: calc(100vh - 156px);
  padding: 24px 40px 50px 40px;
  overflow-y: auto;
  box-sizing: border-box;

  .quesBox {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .stateBox {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 880px;
    height: 40px;
    position: absolute;
    bottom: 0;
    z-index: 100;
    margin-left: -40px;
    background-color: #636f9f;

    p {
      line-height: 40px;
      font-size: 14px;
      color: #fff;
      margin-bottom: 0;
    }
  }
}
.noCourse {
  height: calc(100vh - 66px);
}
.review {
  padding: 10px;
  background: rgba(38, 43, 64, 1);
  overflow: auto;
  .left {
    width: 200px;
    float: left;
    height: calc(100vh - 20px);
    margin-right: 10px;
    background: #e1e5f2;
    .title {
      height: 35px;
      line-height: 35px;
      text-align: center;
      color: #fff;
      background: #50598d;
    }
    .iconWrap {
      display: flex;
      justify-content: space-around;
      align-items: center;
      margin-top: 10px;
      .iconBox {
        width: 50px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        border-radius: 4px;
        i {
          font-size: 18px;
        }
      }
    }
    .pointBox {
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      max-height: 300px;
      overflow-y: auto;
      margin-top: 20px;
      .pointItem {
        width: 90px;
        text-align: center;
        height: 24px;
        border: 1px solid #d7dfe9;
        border-radius: 4px;
        margin-bottom: 10px;
        cursor: pointer;
        background-color: #fff;
      }
    }
    .seeAnswer {
      width: 90%;
      height: 24px;
      line-height: 24px;
      color: #fff;
      text-align: center;
      background: #50598d;
      cursor: pointer;
      border-radius: 4px;
      margin: 10px auto auto;
    }
  }
  .right {
    //width: 1210px;
    width: calc(100vw - 230px);
    float: right;
    .stuAnswerCtrl {
      background: #636f9f;
      margin-bottom: 0;
      .stu_top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height: 36px;
        .c_left {
          padding-left: 10px;
          dl {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin-bottom: 0;
            font-weight: 400;
            -moz-user-select: none; /*火狐*/
            -webkit-user-select: none; /*webkit浏览器*/
            -ms-user-select: none; /*IE10*/
            user-select: none;
            dt {
              color: #fff;
            }
            dd {
              display: inline-block;
              height: 24px;
              line-height: 24px;
              margin-left: 15px;
              margin-bottom: 0;
              padding: 0 15px;
              font-size: 14px;
              border-radius: 4px;
              color: #1e3779;
              background: #919fcf;
              cursor: pointer;
            }
          }
        }
        .c_right {
          padding-right: 10px;
          text-align: center;
          color: #fff;
          font-weight: 500;
        }
      }
      .tools {
        display: flex;
        justify-content: space-around;
        align-items: center;
        //width: calc(100% - 170px);
        width: 100%;
        height: 35px;
        background: #394163;
        margin-bottom: 0;
        li {
          list-style: none;
          cursor: pointer;
          color: #9aa7fc;
          .iconfont {
            padding-left: 5px;
          }
        }
      }
    }

    .stuAnswer {
      //width: 1210px;
      width: calc(100vw - 230px);
      height: calc(100vh - 46px);
      overflow: auto;
    }
  }
  .right::after {
    content: "";
    clear: both;
  }
}
.answerActive {
  background: #fff !important;
  color: #1e3779 !important;
}
.reviewModal {
  ::v-deep .ant-modal {
    width: 100vw !important;
    max-width: 100vw !important;
    top: 0;
    padding-bottom: 0;
    background: rgba(38, 43, 64, 1);
  }

  ::v-deep .ant-modal-body {
    height: 100vh;
    //width: 1440px;
    margin: auto;
    padding: 0;
    overflow-y: hidden;
    .canvasAnswer {
      position: relative;
      .question {
        padding-top: 35px;
      }
      .answerCanvas {
        position: absolute;
        top: 35px;
      }
    }
  }
}

.rightAnswer {
  color: #00d86f;
  border: 2px solid #00d86f !important;
}
.wrong {
  color: #ff5252;
  border: 2px solid #ff5252 !important;
}
.partially {
  color: #ffb100;
  border: 2px solid #ffb100 !important;
}
.right1 {
  color: #fff !important;
  background: #00d86f !important;
}
.wrong1 {
  color: #fff !important;
  background: #ff5252 !important;
}
.partially1 {
  color: #fff !important;
  background: #ffb100 !important;
}
.reviewSwiper {
  height: calc(100vh - 60px);
}
.swiper-button-prev,
.swiper-button-next {
  width: 40px;
  height: 42px;
  text-align: center;
  vertical-align: center;
  border-radius: 4px;
  background-color: #1890ff !important;
}
</style>
