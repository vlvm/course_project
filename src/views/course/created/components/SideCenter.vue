<template>
  <div class="center">
    <Tab
      style="margin-bottom: 10px"
      :tabIndex="tabIndex"
      :tab-data="[
        { id: '0', name: '创建课程' },
        { id: '1', name: '处理课程' },
        { id: '2', name: '课程结果' },
      ]"
      :showRedDot="
        $store.state.catalogIds.includes(parseInt($route.query.catalogId)) &&
        courseList.length > 0
      "
      @changeIndex="changeIndex"
      v-if="role === 1"
    >
    </Tab>
    <div class="tabs">
      <div
        class="swiper_box"
        :style="{ width: isOtherTeacher ? '100%' : '770px' }"
      >
        <a-icon
          type="left"
          style="font-size: 16px"
          @click="slidePrev"
          v-if="courseList.length > 4"
        />
        <swiper
          :options="swiperOption"
          ref="mySwiper"
          class="swiper"
          :style="{ width: !isOtherTeacher ? '700px' : '800px' }"
        >
          <swiper-slide
            v-for="(o, i) in courseList"
            :key="o.id"
            :class="{ sideActive: courseId === o.id }"
          >
            <div class="courseName" v-if="courseList.length > 0">
              <a-icon
                v-if="o.coursePublishTag === 1"
                type="safety"
                style="font-size: 16px; color: #52c41a"
              />
              <a-tooltip placement="bottomLeft" :title="`${o.courseName}`">
                <span v-if="o.courseType === 1">【错题重做】</span>
                <span v-if="o.courseType === 2">【分层课程】</span>
                <span v-if="o.courseType === 3">【分类课程】</span>
                {{ o.courseName }}
              </a-tooltip>
            </div>
            <div>
              <a-dropdown :trigger="['click']">
                <a-icon type="more" @click="(e) => e.stopPropagation()" />
                <a-menu slot="overlay" @click="dropdownClick($event, o)">
                  <template v-if="!isOtherTeacher">
                    <a-menu-item key="0">
                      <a-icon type="edit" />
                      重命名
                    </a-menu-item>
                    <template v-if="courseList.length > 1">
                      <a-menu-item key="1" v-if="i !== 0">
                        <a-icon type="menu-fold" />
                        左移
                      </a-menu-item>
                      <a-menu-item key="2" v-if="i < courseList.length - 1">
                        <a-icon type="menu-unfold" />
                        右移
                      </a-menu-item>
                    </template>
                    <a-menu-item
                      key="3"
                      v-if="o.courseShareTag !== 1 && o.coursePublishTag !== 1"
                    >
                      <a-icon type="scissor" />
                      移动到
                    </a-menu-item>
                    <a-menu-item key="6">
                      <a-icon type="snippets" />
                      复制到
                    </a-menu-item>
                    <a-menu-item key="4">
                      <a-icon type="copy" />
                      创建副本
                    </a-menu-item>
                    <a-menu-item key="5">
                      <a-icon type="delete" />
                      删除
                    </a-menu-item>
                  </template>
                  <a-menu-item key="6" v-else>
                    <a-icon type="snippets" />
                    复制到
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
      <a-button v-if="!isOtherTeacher" @click="openCreateCourseModal">
        创建课程
      </a-button>
    </div>
    <div class="center_content">
      <template v-if="courseList.length > 0">
        <div class="c_top">
          <div class="btn_group_l">
            <a-button
              size="small"
              :disabled="isOtherTeacher || isFilter"
              @click="
                (modal.addContentTextModal = true),
                  $refs.editor && $refs.editor.editor.clear()
              "
            >
              文字
            </a-button>
            <a-button
              v-if="!upLoadStatus"
              size="small"
              :disabled="isOtherTeacher || isFilter"
              @click="uploadFile"
            >
              文件
            </a-button>
            <a-button v-else size="small" disabled>
              上传中<a-badge
                style="padding-left: 5px"
                :numberStyle="{ width: '8px', height: '8px' }"
                color="#00D45E"
                status="processing"
              />
            </a-button>
            <a-button
              size="small"
              :disabled="isOtherTeacher || isFilter"
              @click="$refs.RecordQuestions.showModal = true"
            >
              题
            </a-button>
            <input
              type="file"
              ref="fileUpload"
              style="display: none"
              accept=".docx,.doc,.dotx,.pptx,.ppt,.potx,.pdf,.mp4,.mp3"
              @change="upload($event)"
            />
          </div>
          <div class="btn_group_r">
            <a-button
              size="small"
              :disabled="isOtherTeacher || questionCounts === 0"
              @click="changeAnswerArea(0)"
              v-if="showAnswerArea === 0"
            >
              显示作答区
            </a-button>
            <a-button
              size="small"
              type="primary"
              @click="changeAnswerArea(1)"
              v-if="showAnswerArea === 1"
            >
              隐藏作答区
            </a-button>
            <a-button
              size="small"
              :type="isFilter ? 'primary' : ''"
              @click="openFilterModal"
            >
              筛选
            </a-button>
          </div>
        </div>
        <!--内容区域-->
        <ContentBox ref="contentBox"></ContentBox>
      </template>
    </div>
    <!--创建课程输入名字与修改名字-->
    <a-modal
      v-model="modal.changeNameModal"
      :maskClosable="false"
      :title="nameModalType === 0 ? '新建课程' : '重命名课程'"
    >
      <a-input placeholder="请输入课程名称" v-model="courseName" />
      <template slot="footer">
        <a-button @click="modal.changeNameModal = false"> 取消 </a-button>
        <a-button
          v-if="nameModalType === 0"
          type="primary"
          @click="createdCourse"
        >
          确定
        </a-button>
        <a-button
          v-if="nameModalType === 1"
          type="primary"
          @click="renameCourse"
        >
          确定
        </a-button>
      </template>
    </a-modal>
    <!--添加文字-->
    <a-modal
      :width="870"
      :maskClosable="false"
      v-model="modal.addContentTextModal"
      title="添加文字"
      @ok="addContentText"
    >
      <Editor ref="editor"></Editor>
    </a-modal>
    <!--添加试题-->
    <RecordQuestions ref="RecordQuestions"></RecordQuestions>
    <!--课程内容筛选-->
    <a-modal
      v-model="modal.showFilterModal"
      :maskClosable="false"
      title="课程筛选"
      @ok="contentFilter"
      @cancel="handleCancel"
    >
      <a-space direction="vertical" :size="10" style="width: 100%">
        <div class="group">
          <a-divider> 文字 </a-divider>
          <a-checkbox
            :checked="filter.courseText"
            @change="onChange($event, 'courseText')"
          >
            文字
          </a-checkbox>
          <a-checkbox
            :checked="filter.point"
            @change="onChange($event, 'point')"
          >
            重点
          </a-checkbox>
        </div>
        <div>
          <div class="group">
            <a-divider> 文件 </a-divider>
          </div>
          <a-row>
            <a-col :span="4">
              <a-checkbox
                :checked="filter.word"
                @change="onChange($event, 'word')"
              >
                word
              </a-checkbox>
            </a-col>
            <a-col :span="4">
              <a-checkbox
                :checked="filter.ppt"
                @change="onChange($event, 'ppt')"
              >
                ppt
              </a-checkbox>
            </a-col>
            <a-col :span="4">
              <a-checkbox
                :checked="filter.pdf"
                @change="onChange($event, 'pdf')"
              >
                pdf
              </a-checkbox>
            </a-col>
            <a-col :span="4">
              <a-checkbox
                :checked="filter.sounds"
                @change="onChange($event, 'sounds')"
              >
                音频
              </a-checkbox>
            </a-col>
            <a-col :span="4">
              <a-checkbox
                :checked="filter.video"
                @change="onChange($event, 'video')"
              >
                视频
              </a-checkbox>
            </a-col>
            <a-col :span="4">
              <a-checkbox
                :checked="filter.handle"
                @change="onChange($event, 'handle')"
              >
                必办
              </a-checkbox>
            </a-col>
          </a-row>
        </div>
        <div>
          <div class="group">
            <a-divider> 题 </a-divider>
          </div>
          <a-row>
            <a-col :span="4">
              <a-checkbox
                :checked="filter.single"
                @change="onChange($event, 'single')"
              >
                单选
              </a-checkbox>
            </a-col>
            <a-col :span="5">
              <a-checkbox
                :checked="filter.multiSelect"
                @change="onChange($event, 'multiSelect')"
              >
                不定项
              </a-checkbox>
            </a-col>
            <a-col :span="4">
              <a-checkbox
                :checked="filter.filling"
                @change="onChange($event, 'filling')"
              >
                填空
              </a-checkbox>
            </a-col>
            <a-col :span="4">
              <a-checkbox
                :checked="filter.shortAnswer"
                @change="onChange($event, 'shortAnswer')"
              >
                简答
              </a-checkbox>
            </a-col>
            <a-col :span="4">
              <a-checkbox
                :checked="filter.mustDoing"
                @change="onChange($event, 'mustDoing')"
              >
                必做
              </a-checkbox>
            </a-col>
          </a-row>
        </div>
      </a-space>
    </a-modal>
    <!--选择移动目录-->
    <a-modal
      v-model="modal.dirModal"
      :maskClosable="false"
      :width="870"
      title="选择目录"
      @ok="chooseDir(chooseDirType)"
    >
      <div class="radioTree">
        <div class="tree1">
          <h3>学生目录</h3>
          <RadioTree
            ref="tree1"
            :list="list1"
            :role="1"
            :radioTreeId="treeId"
            @chooseTreeData="chooseTreeData"
          ></RadioTree>
        </div>
        <div class="tree2">
          <h3>学校目录</h3>
          <RadioTree
            ref="tree2"
            :list="list2"
            :role="2"
            :radioTreeId="treeId"
            @chooseTreeData="chooseTreeData"
          ></RadioTree>
        </div>
        <div class="tree3">
          <h3>个人目录</h3>
          <RadioTree
            ref="tree3"
            :list="list3"
            :role="3"
            :radioTreeId="treeId"
            @chooseTreeData="chooseTreeData"
          ></RadioTree>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
// 使用Swiper组件
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import { upGo, downGo } from "@/until";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";

import {
  createCourse,
  renameCourse,
  deleteCreateCourse,
  createCourseCopy,
  getCourseContentById,
  filterCourseContent,
  addCourseText,
  addCourseFile,
  copyCourse,
  setCourseSort,
  copyCourseTo,
} from "@/request/course/created/course";
import { getDirectory } from "@/request/directory";

export default {
  name: "SideCenter",
  components: {
    Tab: () => import("../../../../components/Tab"),
    swiper,
    swiperSlide,
    Editor: () => import("@/components/MyEditor"),
    RadioTree: () => import("@/components/RadioTree"),
    ContentBox: () => import("./ContentBox"),
    RecordQuestions: () => import("../../components/RecordQuestions"),
  },
  data() {
    return {
      creator: JSON.parse(sessionStorage.getItem("course_userInfo")).userId,
      modal: {
        changeNameModal: false,
        addContentTextModal: false,
        dirModal: false,
        showFilterModal: false,
      },
      tabIndex: "0",
      drag: false,
      swiperOption: {
        // 鼠标无法拖动，手机也无法滑动
        allowTouchMove: false,
        // 5个为一组
        slidesPerView: 4,
        // 间隔为5
        spaceBetween: 5,
        on: {
          tap: () => {
            this.setCourseId(this.courseList[this.swiper.clickedIndex].id);
            this.changeCourseContentId("");
            this.getCourseContentById(this.courseId, true);
          },
        },
      },
      // 修改课程名字弹窗类型
      nameModalType: 0,
      // 课程名字
      courseName: "",
      // 上传状态
      upLoadStatus: false,
      filter: {
        courseText: false,
        point: false,
        word: false,
        ppt: false,
        pdf: false,
        sounds: false,
        video: false,
        handle: false,
        single: false,
        multiSelect: false,
        filling: false,
        shortAnswer: false,
        mustDoing: false,
      },
      chooseDirType: "3",
      treeId: "",
      list1: [],
      list2: [],
      list3: [],
    };
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    },
    ...mapState({
      role: (state) => state.role,
      // 选中课程id
      courseId: (state) => state.c.courseId,
      // 当前目录下课程数据
      courseList: (state) => state.c.courseList,
      courseContentId: (state) => state.c.courseContentId,
      isOtherTeacher: (state) => state.c.isOtherTeacher,
      showAnswerArea: (state) => state.c.showAnswerArea,
      contentData: (state) => state.c.contentData,
    }),
    ...mapGetters("c", ["courseSelectedData"]),
    // 试题数
    questionCounts() {
      return this.contentData.filter((o) => o.contentType === 2).length;
    },
    // 是否筛选状态
    isFilter() {
      return Object.values(this.filter).some((o) => o);
    },
  },
  mounted() {
    // 获取当前目录下所有课程
    if (this.$route.query.catalogId) {
      this.getCourseList(this.$route.query.catalogId);
    }
  },
  methods: {
    ...mapMutations("c", [
      "changeCourseContentId",
      "setCourseId",
      "setCourseList",
      "replaceContent",
      "replaceContentNoFilter",
    ]),
    ...mapActions("c", [
      "changeAnswerArea",
      "getCourseListData",
      "getCourseTagAttrData",
    ]),
    // 获取当前目录下所有课程
    getCourseList(catalogId) {
      this.getCourseListData(catalogId).then((res) => {
        if (res.extra.length > 0) {
          this.setCourseId(res.extra[0].id);
          this.getCourseContentById(res.extra[0].id, true);
        }
      });
    },
    // 切换顶部页面选项卡
    changeIndex(index) {
      if (this.courseList.length === 0) {
        this.$warning({
          title: "请先创建课程！",
          content: "当前目录下没有课程！",
        });
        return;
      }
      this.changeCourseContentId("");
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
    // 打开创建课程弹窗
    openCreateCourseModal() {
      if (!this.$route.query.catalogId || this.$route.query.catalogId == "") {
        this.$message.warn("请先选择目录！");
        return;
      }
      this.nameModalType = 0;
      this.courseName = "";
      this.modal.changeNameModal = true;
    },
    // 创建课程
    createdCourse() {
      if (this.courseName === "") {
        this.$message.warn("请输入课程名称！");
        return;
      }
      createCourse({
        courseName: this.courseName,
        catalogId: this.$route.query.catalogId,
        courseTagId: parseInt(this.role),
      }).then((res) => {
        this.setCourseList([...this.courseList, res.extra]);
        let downGoArr = this.courseList.map((o, i) => {
          return { id: o.id, courseIndex: i };
        });
        setCourseSort(downGoArr);
        const courseIndex = this.courseList.length - 1;
        this.setCourseId(this.courseList[courseIndex].id);
        this.swiper.slideTo(courseIndex, 10, false);
        this.courseName = "";
        this.modal.changeNameModal = false;
        this.getCourseContentById(this.courseId, true);
      });
    },
    // 课程重命名
    renameCourse() {
      if (this.courseName === "") {
        this.$message.warn("请输入课程名称！");
        return;
      }
      renameCourse({
        id: this.courseId,
        courseName: this.courseName,
      }).then((res) => {
        if (res.extra) {
          this.modal.changeNameModal = false;
          const courseIndex = this.courseList.findIndex(
            (o) => o.id === this.courseId
          );
          this.courseList[courseIndex].courseName = this.courseName;
          this.setCourseList(this.courseList);
        }
      });
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
    // 课程下拉框 事件处理
    dropdownClick(e, item) {
      const _this = this;
      const { key } = e;
      let i = this.courseList.findIndex((item) => item.id === this.courseId);
      switch (key) {
        case "0":
          this.courseName = this.courseList[i].courseName;
          this.nameModalType = 1;
          this.modal.changeNameModal = true;
          break;
        case "1":
          upGo(this.courseList, i);
          // eslint-disable-next-line no-case-declarations
          let upGoArr = this.courseList.map((o, i) => {
            return { id: o.id, courseIndex: i };
          });
          setCourseSort(upGoArr);
          break;
        case "2":
          downGo(this.courseList, i);
          // eslint-disable-next-line no-case-declarations
          let downGoArr = this.courseList.map((o, i) => {
            return { id: o.id, courseIndex: i };
          });
          setCourseSort(downGoArr);
          break;
        case "3":
          getDirectory(1).then((res) => {
            this.list1 = res.extra;
          });
          getDirectory(2).then((res) => {
            this.list2 = res.extra.filter(
              (o) => o.catalogParentId === 2 && o.creator === this.creator
            );
          });
          getDirectory(3).then((res) => {
            this.list3 = res.extra;
          });
          this.chooseDirType = "3";
          this.modal.dirModal = true;
          this.treeId = "";
          break;
        // 创建副本
        case "4":
          createCourseCopy({
            id: item.id,
            catalogId: item.catalogId,
          }).then((res) => {
            let index = this.courseList.findIndex((o) => o.id === item.id);
            this.courseList.splice(index + 1, 0, res.extra);
            this.setCourseList(this.courseList);
            this.setCourseId(res.extra.id);
            this.swiper.slideTo(this.courseList.length - 1, 10, false);
            this.getCourseContentById(this.courseId, true);
          });
          break;
        // 删除
        case "5":
          this.$confirm({
            title: "是否确定要删除这个课程?",
            // content: "Some descriptions",
            okText: "删除",
            okType: "danger",
            cancelText: "取消",
            onOk() {
              deleteCreateCourse(item.id).then((res) => {
                console.log(res);
                _this.setCourseList(
                  _this.courseList.filter((o) => o.id !== item.id)
                );
                if (_this.courseList.length > 0) {
                  const courseIndex = _this.courseList.length - 1;
                  _this.setCourseId(_this.courseList[courseIndex].id);
                  _this.getCourseContentById(_this.courseId, true);
                  _this.getCourseTagAttrData(_this.courseId);
                }
              });
            },
            onCancel() {
              console.log("Cancel");
            },
          });
          break;
        case "6":
          getDirectory(1).then((res) => {
            this.list1 = res.extra;
          });
          getDirectory(2).then((res) => {
            this.list2 = res.extra.filter(
              (o) => o.catalogParentId === 2 && o.creator === this.creator
            );
          });
          getDirectory(3).then((res) => {
            this.list3 = res.extra;
          });
          this.chooseDirType = "6";
          this.modal.dirModal = true;
          this.treeId = "";
          break;
      }
    },
    chooseTreeData({ item }) {
      this.treeId = item.id;
    },
    // 选择目录
    chooseDir(type = "3") {
      if (this.treeId === "") {
        this.$error({
          content: "请先选择目录!",
        });
        return;
      }
      if (type === "3") {
        copyCourse({
          courseIndex: this.courseSelectedData.courseIndex,
          id: this.courseId,
          catalogId: this.treeId,
        }).then(() => {
          this.courseList.splice(this.courseSelectedData.courseIndex, 1);
          this.modal.dirModal = false;
          this.$message.success("已移动到所选目录！");
        });
      } else if (type === "6") {
        copyCourseTo(this.courseId, this.treeId).then((res) => {
          console.log(res);
          if (res.extra) {
            this.modal.dirModal = false;
            this.$message.success("已复制到所选目录！");
          }
        });
      }
    },
    getTitleIds() {
      let arr = [];
      this.contentData.forEach((o, i) => {
        if (o.content.titleLevel === 1) {
          arr.push(i);
        }
      });
      let index = this.contentData.findIndex((o) => o.content.titleLevel === 1);
      let lastIndex = this.contentData.findLastIndex(
        (o) => o.content.titleLevel === 1
      );
      alert(lastIndex);
      console.log(arr);
      this.titleIds = [];
      if (arr.length > 1) {
        arr.reduce((a, b) => {
          // console.log([a + 1, b]);
          this.titleIds = [
            ...this.titleIds,
            this.contentData.slice(a + 1, b).map((o) => {
              return o.content.id;
            }),
          ];
          return b;
        });
        if (lastIndex !== -1) {
          this.titleIds = [
            ...this.titleIds,
            this.contentData.slice(lastIndex + 1).map((o) => {
              return o.content.id;
            }),
          ];
        }
      } else {
        this.titleIds = this.contentData.slice(index + 1).map((o) => {
          return o.content.id;
        });
      }
      console.log(this.titleIds);
    },
    // 根据课程id获取课程内容
    getCourseContentById(courseId, noFilter) {
      if (noFilter) {
        getCourseContentById(courseId).then((res) => {
          this.replaceContentNoFilter(res.extra);
          this.getCourseTagAttrData(courseId);
          this.$store.commit("c/setTitleIds");
        });
      } else {
        getCourseContentById(courseId).then((res) => {
          this.replaceContent(res.extra);
          this.getCourseTagAttrData(courseId);
          this.$store.commit("c/setTitleIds");
        });
      }
    },
    // 课程添加文字
    addContentText() {
      if (this.$refs.editor.editor.isEmpty()) {
        this.$message.warning("请输入文字内容！");
        return;
      }
      let params = {
        courseId: this.courseId,
        textContent: this.$refs.editor.html,
        wordCounts: this.$refs.editor.editor.getText().length,
      };
      if (this.courseContentId === "") {
        addCourseText(params).then((res) => {
          this.modal.addContentTextModal = false;
          this.replaceContent([...this.contentData, res.extra]);
          this.$refs.editor.editor.clear();
          this.getCourseTagAttrData(this.courseId);
        });
      } else {
        let index = this.contentData.findIndex(
          (o) => o.content.id === this.courseContentId
        );
        if (this.contentData[index].contentType === 2) {
          let mappingIdList = this.contentData[index].content.mappingIdList;
          if (mappingIdList.length > 0) {
            let i = this.contentData.findIndex(
              (o) => o.content.id === mappingIdList[mappingIdList.length - 1]
            );
            params.textIndex = i + 2;
            addCourseText(params).then((res) => {
              this.contentData.splice(i + 1, 0, res.extra);
              this.replaceContent(this.contentData);
              this.$refs.editor.editor.clear();
              this.modal.addContentTextModal = false;
              this.getCourseTagAttrData(this.courseId);
            });
            return;
          }
        }
        params.textIndex = index + 2;
        addCourseText(params).then((res) => {
          this.contentData.splice(index + 1, 0, res.extra);
          this.replaceContent(this.contentData);
          this.$refs.editor.editor.clear();
          this.modal.addContentTextModal = false;
        });
      }
    },
    // 模拟点击上传文件
    uploadFile() {
      this.$refs.fileUpload.click();
    },
    // 上传文件操作
    upload(e) {
      this.upLoadStatus = true;
      let file = e.target.files[0];
      if (this.courseContentId === "") {
        addCourseFile({ uploadFile: file }, this.courseId).then((res) => {
          this.upLoadStatus = false;
          this.replaceContent([...this.contentData, res.extra]);
          this.getCourseTagAttrData(this.courseId);
        });
      } else {
        let index = this.contentData.findIndex(
          (o) => o.content.id === this.courseContentId
        );
        if (this.contentData[index].contentType === 2) {
          addCourseFile({ uploadFile: file }, this.courseId).then((res) => {
            this.upLoadStatus = false;
            let mappingIdList = this.contentData[index].content.mappingIdList;
            if (mappingIdList && mappingIdList.length > 0) {
              let i = this.contentData.findIndex(
                (o) => o.content.id === mappingIdList[mappingIdList.length - 1]
              );
              this.contentData.splice(i + 1, 0, res.extra);
              this.replaceContent(this.contentData);
              this.$refs.fileUpload.value = "";
              this.getCourseTagAttrData(this.courseId);
            } else {
              this.upLoadStatus = false;
              this.contentData.splice(index + 1, 0, res.extra);
              this.replaceContent(this.contentData);
              this.$refs.fileUpload.value = "";
              this.getCourseTagAttrData(this.courseId);
            }
          });
        } else {
          addCourseFile({ uploadFile: file }, this.courseId).then((res) => {
            this.upLoadStatus = false;
            this.contentData.splice(index + 1, 0, res.extra);
            this.replaceContent(this.contentData);
            this.$refs.fileUpload.value = "";
            this.getCourseTagAttrData(this.courseId);
          });
        }
      }
    },
    onChange(e, name) {
      this.filter[name] = e.target.checked;
    },
    // 取消筛选
    handleCancel() {
      for (let key in this.filter) {
        this.filter[key] = false;
      }
      getCourseContentById(this.courseId).then((res) => {
        this.replaceContentNoFilter(res.extra || []);
        this.contentData
          .filter((o) => o.contentType === 0 && o.content.titleLevel === 1)
          .forEach((o) => {
            o.content.titleLevelCaret = 1;
          });
        this.$store.commit("c/clearTitleIds");
      });
    },
    // 打开筛选弹窗
    openFilterModal() {
      this.modal.showFilterModal = true;
      this.contentData
        .filter((o) => o.contentType === 0 && o.content.titleLevel === 1)
        .forEach((o) => {
          o.content.titleLevelCaret = 1;
        });
      this.$store.commit(
        "c/removeTitleIds",
        this.contentData.map((o) => {
          return o.content.id;
        })
      );
    },
    // 获取筛选课程内容
    contentFilter() {
      if (this.isFilter) {
        filterCourseContent({
          courseId: this.courseId,
          ...this.filter,
        }).then((res) => {
          this.replaceContentNoFilter(res.extra || []);
          this.contentData
            .filter((o) => o.contentType === 0 && o.content.titleLevel === 1)
            .forEach((o) => {
              o.content.titleLevelCaret = 1;
            });
          this.$store.commit("c/clearTitleIds");
          this.modal.showFilterModal = false;
        });
      } else {
        getCourseContentById(this.courseId).then((res) => {
          this.replaceContentNoFilter(res.extra);
          this.contentData
            .filter((o) => o.contentType === 0 && o.content.titleLevel === 1)
            .forEach((o) => {
              o.content.titleLevelCaret = 1;
            });
          this.$store.commit("c/clearTitleIds");
          this.modal.showFilterModal = false;
        });
      }
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
    width: 770px;
  }

  .swiper {
    width: 700px;

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
    padding: 15px 40px;

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
      width: 280px;
    }

    .btn_group_r {
      width: 200px;
    }
  }
}
.radioTree {
  display: flex;
  justify-content: space-between;
  .tree1,
  .tree2,
  .tree3 {
    width: 32%;
    min-height: 250px;
    overflow-y: auto;
    border: 1px solid #636f9f;
    border-radius: 4px;
    h3 {
      text-align: center;
      background: #636f9f;
      color: #fff;
    }
  }
}
</style>
