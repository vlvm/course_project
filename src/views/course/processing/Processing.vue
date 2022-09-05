<template>
  <div>
    <div class="center">
      <!--切换课程选项卡-->
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
              v-for="(o, i) in courseList"
              :key="o.id"
              :class="{ sideActive: courseId === o.id }"
            >
              <div class="courseName">
                <a-tooltip placement="bottomLeft" :title="`${o.courseName}`">
                  <a-badge
                    status="error"
                    v-if="$store.state.courseIds.includes(o.id)"
                  />
                  <span v-if="o.originCourseType === 1">【错题重做】</span>
                  <span v-if="o.originCourseType === 2">【分层课程】</span>
                  <span v-if="o.originCourseType === 3">【分类课程】</span>
                  {{ o.courseName }}
                </a-tooltip>
              </div>
              <div>
                <a-dropdown :trigger="['click']">
                  <a-icon type="more" @click="(e) => e.stopPropagation()" />
                  <a-menu slot="overlay" @click="dropdownClick">
                    <a-menu-item key="0" v-if="i !== 0">
                      <a-icon type="menu-fold" />
                      左移
                    </a-menu-item>
                    <a-menu-item key="1" v-if="i < courseList.length - 1">
                      <a-icon type="menu-unfold" />
                      右移
                    </a-menu-item>
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
            v-if="courseList.length > 4"
          />
        </div>
      </div>
      <div class="center_content">
        <div class="c_top" v-if="courseList.length > 0">
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
                :disabled="o.mappingStatus === 0"
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
              <a-select-option :value="0"> 课程详情</a-select-option>
              <a-select-option :value="1"> 课程题目</a-select-option>
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
          :class="{ noCourse: courseList.length === 0 }"
        >
          <draggable
            v-model="contentData"
            :disabled="
              courseContentId === '' ||
              ['0', '1', '2', '3'].includes(editorType)
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
                  :courseContentId="courseContentId"
                  :contentType="item.contentType"
                  :isReply="isReply"
                  :data="item.content"
                  :class="item.content.id === courseContentId ? '' : 'forbid'"
                  @openReview="openReview"
                  @selectedCourseContentId="selectedCourseContentId"
                  @getReviewAnswer="getReviewAnswer"
                  @showIndexDiscussArea="showIndexDiscussArea"
                  @shareWindos="shareWindos"
                ></ContentQuestion>
              </div>
            </transition-group>
          </draggable>
          <a-button
            type="primary"
            ghost
            block
            v-if="courseSelectedData.courseTalkingSwitch === 1"
          >
            讨论区
          </a-button>
          <div
            class="stateBox"
            v-if="['0', '1', '2', '3'].includes(editorType)"
          >
            <p v-if="editorType === '0'">
              多题关联后，首题题干将被共享，并统计关联后总分！
            </p>
            <p v-if="editorType === '1'">
              请按顺序选择试题，后续试题将按照首题题号，顺序排列
            </p>
            <p v-if="editorType === '2'">
              连续设分后，所选题目分数将和首体分数相同
            </p>
            <a-space :size="10">
              <a-button @click="clearData">取消</a-button>
              <a-button
                type="primary"
                @click="relationTrue"
                v-if="['0', '1', '2'].includes(editorType)"
              >
                确定
              </a-button>
            </a-space>
          </div>
        </div>
      </div>
    </div>
    <SideRight
      :courseId="courseId"
      :courseList="courseList"
      :stuId="stuId"
      :courseSelectedData="courseSelectedData"
      :courseContentId="courseContentId"
      :contentData="contentData"
      :courseSelectedItemData="courseSelectedItemData"
      @getCourseContentData="getData"
    ></SideRight>
    <!--提问区-->
    <DiscussArea
      v-show="isDiscussArea"
      :AskCourseId="courseId"
      :AskQuestionId="askQuestionId"
      :contentType="discussAreaContentType"
      :discussStuId="discussStuId"
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
// 图片压缩
import Compressor from "compressorjs";
// 使用Swiper组件
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import draggable from "vuedraggable";
import { mapState, mapActions } from "vuex";
import {
  getCourseList,
  delCourse,
  getCourseStuList,
  getCourseContent,
  getReviewStatus,
  getReviewStatusQues,
  getReplayStatus,
  getReplayStatusQues,
  // getQuestionStuAnswer,
  readover,
  shareAnswerToClass,
} from "@/request/course/processing";
import { upload } from "@/request/course/created/course";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Processing",
  components: {
    Tab: () => import("../../../components/Tab"),
    swiper,
    swiperSlide,
    draggable,
    ContentQuestion: () => import("./components/ContentQuestion"),
    SideRight: () => import("./components/SideRight"),
    Board: () => import("./components/Board"),
    Editor: () => import("@/components/MyEditor"),
    ShareLayer: () => import("@/components/ShareLayer.vue"),
    DiscussArea: () => import("@/components/DiscussArea"),
  },
  data() {
    let _this = this;
    return {
      swiperKey: Math.random().toString(36).substr(2) /*随机的key*/,
      tabIndex: "1",
      drag: false,
      swiperOption: {
        // 鼠标无法拖动，也无法滑动
        allowTouchMove: false,
        // 4个为一组
        slidesPerView: 4,
        // 间隔为5
        spaceBetween: 5,
        on: {
          tap: () => {
            const id = this.courseList[this.swiper.clickedIndex].id;
            this.courseId = id;
            this.getCourseContentData(id, 0, this.screenCourse);
            getCourseStuList(id).then((res) => {
              this.stuId = 0;
              this.stuList = res.extra;
            });
            getReviewStatus({
              courseId: id,
              stuId: 0,
              detail: this.screenCourse,
            }).then((res) => {
              this.redPoint = res.extra;
            });
            getReplayStatus({
              courseId: id,
              stuId: 0,
              detail: this.screenCourse,
            }).then((res) => {
              this.replayRedPoint = res.extra;
            });
          },
        },
      },
      // 当前选中的courseId
      courseId: "",
      // 当前目录下课程列表
      courseList: [],
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
      courseContentId: "",
      // 课程内容数据
      contentData: [],
      // 批阅与查看答案弹窗状态
      modal: {
        showReview: false,
        showRightAnswer: false,
        addContentTextModal: false,
      },
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
                              courseId: reviewData.courseId,
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
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    },
    reviewSwiper() {
      return this.$refs.reviewSwiper.swiper;
    },
    // 选中的课程数据
    courseSelectedData() {
      return this.courseList.find((o) => o.id === this.courseId) || {};
    },
    // 选中的课程内容数据
    courseSelectedItemData() {
      return (
        this.contentData.find((o) => o.content.id === this.courseContentId) ||
        {}
      );
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
    ...mapState({
      editorType: (state) => state.p.selectItem.editorType,
      relation: (state) => state.p.selectItem.relation,
      contentCheckedArr: (state) => state.p.contentCheckedArr,
    }),
  },
  watch: {
    "$route.query.catalogId": {
      immediate: true,
      handler(val) {
        if (val) {
          this.stuId = 0;
          this.getData();
        }
      },
    },
    courseId(val) {
      if (val) {
        this.isReview = false;
        this.isReply = false;
      }
    },
  },
  mounted() {
    this.$store.dispatch("getRedDotList");
  },
  methods: {
    ...mapActions("p", ["changeEditorType", "changeContentCheckedArr"]),
    getData() {
      // 获取课程列表
      getCourseList({
        type: 1,
        catalogId: this.$route.query.catalogId,
      }).then((res) => {
        this.courseList = res.extra;
        if (res.extra.length > 0) {
          this.courseId = res.extra[0].id;
          getCourseStuList(this.courseId).then((res) => {
            this.stuList = res.extra;
            this.getCourseContentData(this.courseId, 0, this.screenCourse);
          });
          getReviewStatus({
            courseId: this.courseId,
            stuId: 0,
            detail: this.screenCourse,
          }).then((res) => {
            this.redPoint = res.extra;
          });
          getReplayStatus({
            courseId: this.courseId,
            stuId: 0,
            detail: this.screenCourse,
          }).then((res) => {
            this.replayRedPoint = res.extra;
          });
        } else {
          this.courseId = "";
          this.stuList = [];
          this.contentData = [];
        }
      });
    },
    // 获取处理课程数据
    getCourseContentData(courseId, stuId = 0, detail) {
      getCourseContent({
        courseId: courseId,
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
      this.getCourseContentData(this.courseId, stuId, this.screenCourse);
    },
    // 切换课程详情
    changeScreenCourse(screenCourse) {
      // this.stuId = 0;
      this.isReview = false;
      this.isReply = false;
      this.getCourseContentData(this.courseId, this.stuId, screenCourse);
    },
    // 切换课程顶部选项卡
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
    // 课程列表操作
    dropdownClick({ key }) {
      let _this = this;
      let i = this.courseList.findIndex((item) => item.id === this.courseId);
      // 左移
      function upGo(fieldData, index) {
        if (index !== 0) {
          console.log(
            fieldData[index].courseName,
            fieldData[index - 1].courseName
          );
          fieldData[index] = fieldData.splice(
            index - 1,
            1,
            fieldData[index]
          )[0];
        } else {
          fieldData.push(fieldData.shift());
        }
      }
      // 右移
      function downGo(fieldData, index) {
        if (index != fieldData.length - 1) {
          fieldData[index] = fieldData.splice(
            index + 1,
            1,
            fieldData[index]
          )[0];
        } else {
          fieldData.unshift(fieldData.splice(index, 1)[0]);
        }
      }
      switch (key) {
        case "0":
          upGo(this.courseList, i);
          break;
        case "1":
          downGo(this.courseList, i);
          break;
        case "2":
          this.$confirm({
            title: "是否确定要删除这个课程?",
            // content: "Some descriptions",
            okText: "删除",
            okType: "danger",
            cancelText: "取消",
            onOk() {
              delCourse(_this.courseId).then(() => {
                _this.getData();
              });
            },
            onCancel() {
              console.log("Cancel");
            },
          });
          break;
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
    // 筛选待批阅内容
    getReviewStatusQuestion() {
      this.stuId = 0;
      this.screenCourse = 0;
      if (!this.isReview) {
        getReviewStatusQues({
          courseId: this.courseId,
          stuId: this.stuId,
          detail: this.screenCourse,
        }).then((res) => {
          this.contentData = res.extra;
          this.isReview = true;
          this.isReply = false;
        });
      } else {
        getCourseContent({
          courseId: this.courseId,
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
          courseId: this.courseId,
          stuId: this.stuId,
          detail: this.screenCourse,
        }).then((res) => {
          this.contentData = res.extra;
          this.isReply = true;
          this.isReview = false;
        });
      } else {
        getCourseContent({
          courseId: this.courseId,
          stuId: 0,
          detail: 0,
        }).then((r) => {
          this.contentData = r.extra;
          this.isReply = false;
          this.isReview = false;
        });
      }
    },
    // 选中课程内容
    selectedCourseContentId({ id }) {
      if (id === this.courseContentId) {
        this.courseContentId = "";
        return;
      }
      this.courseContentId = id;
    },
    //开始拖拽事件
    onStart() {
      this.drag = true;
    },
    //拖拽结束事件
    onEnd() {
      this.drag = false;
      this.courseContentId = "";
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
          courseId: this.stuItem.courseId,
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
        params[0].courseId = changeSwiper.courseId;
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
          this.getCourseContentData(
            this.stuItem.courseId,
            this.stuId,
            this.screenCourse
          );
        }
        if (this.stuItem.readOverTag !== 0) {
          getReviewStatus({
            courseId: this.courseId,
            stuId: 0,
            detail: this.screenCourse,
          }).then((res) => {
            this.redPoint = res.extra;
          });
          this.$store.dispatch("getRedDotList");
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
        this.stuItem.courseId,
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
        courseId: this.courseId,
        stuId: 0,
        detail: this.screenCourse,
      }).then((res) => {
        this.replayRedPoint = res.extra;
      });
      this.$store.dispatch("getRedDotList");
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
