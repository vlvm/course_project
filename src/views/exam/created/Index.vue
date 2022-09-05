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
        v-if="role === 1"
      >
      </Tab>
      <!--考试标签-->
      <div class="tabs">
        <div
          class="swiper_box"
          :style="{ width: isOtherTeacher ? '100%' : '770px' }"
        >
          <a-icon
            type="left"
            style="font-size: 16px"
            @click="slidePrev"
            v-if="paperList.length > 4"
          />
          <swiper
            :options="swiperOption"
            ref="mySwiper"
            class="swiper"
            :style="{ width: !isOtherTeacher ? '700px' : '800px' }"
          >
            <swiper-slide
              v-for="(o, i) in paperList"
              :key="o.id"
              :class="{ sideActive: paperId === o.id }"
            >
              <div class="paperName">
                <a-icon
                  v-if="o.paperPublishTag === 1"
                  type="safety"
                  style="font-size: 16px; color: #52c41a"
                />
                <a-tooltip placement="bottomLeft" :title="`${o.paperName}`">
                  {{ o.paperName }}
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
                      <template v-if="paperList.length > 1">
                        <a-menu-item key="1" v-if="i !== 0">
                          <a-icon type="menu-fold" />
                          左移
                        </a-menu-item>
                        <a-menu-item key="2" v-if="i < paperList.length - 1">
                          <a-icon type="menu-unfold" />
                          右移
                        </a-menu-item>
                      </template>
                      <a-menu-item
                        key="3"
                        v-if="o.paperShareTag !== 1 && o.paperPublishTag !== 1"
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
            v-if="paperList.length > 4"
          />
        </div>
        <a-button v-if="!isOtherTeacher" @click="openCreatePaterModal">
          创建考试
        </a-button>
      </div>
      <div class="center_content">
        <div class="c_top" v-if="paperList.length > 0">
          <div class="btn_group_l">
            <a-button size="small" @click="modal.addContentTextModal = true">
              文字
            </a-button>
            <a-button
              size="small"
              style="margin-left: 20px"
              @click="$refs.RecordQuestions.showModal = true"
            >
              题
            </a-button>
          </div>
        </div>
        <div
          class="courseContent"
          :class="{ computedHeight: role !== 1 }"
          v-if="paperList.length > 0"
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
                  :role="role"
                  :isOtherTeacher="isOtherTeacher"
                  :key="item.content.id"
                  :class="item.content.id === contentId ? '' : 'forbid'"
                  :contentType="item.contentType"
                  :paperId="paperId"
                  :editorType.sync="editorType"
                  :relationData.sync="relationData"
                  :serialNumberData.sync="serialNumberData"
                  :contentCheckedArr.sync="contentCheckedArr"
                  :contentId.sync="contentId"
                  :contentData="contentData"
                  :contentSelector="contentSelector"
                  :data="item.content"
                  :openChangeTextModal="
                    () => {
                      modal.changeTextModal = true;
                      $refs.editor.editor.setHtml(
                        contentSelector.content.textContent
                      );
                    }
                  "
                  @changeContent="changeContent"
                >
                </ContentQuestion>
              </div>
            </transition-group>
          </draggable>
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
              连续设分后，所选题目分数将和首题分数相同
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
              <template v-if="editorType === '3'">
                <a-button type="primary" @click="copyData"> 拷贝 </a-button>
                <a-button type="danger" @click="deleteContents">
                  删除
                </a-button>
              </template>
            </a-space>
          </div>
        </div>
      </div>
    </div>
    <SideRight
      :role="role"
      :isOtherTeacher="isOtherTeacher"
      :paperId="paperId"
      :paperList="paperList"
      :paperData="paperData"
      :contentId="contentId"
      :contentData="contentData"
      :contentSelector="contentSelector"
      @changePaperList="changePaperList"
      @changeContent="changeContent"
    ></SideRight>
    <!--创建考试输入试卷名-->
    <a-modal
      v-model="modal.createPater"
      :maskClosable="false"
      title="新建考试"
      @ok="createdExam"
    >
      <a-input placeholder="请输入试卷名称" v-model="paperName" />
    </a-modal>
    <!--修改试卷名称-->
    <a-modal
      v-model="modal.renamePaperName"
      :maskClosable="false"
      title="修改试卷名称"
      @ok="renamePaper"
    >
      <a-input placeholder="请输入试卷名称" v-model="renameVal" />
    </a-modal>
    <!--考试标签移动复制到选择目录-->
    <a-modal
      v-model="modal.chooseCatalogue"
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
    <!--添加文字-->
    <a-modal
      :width="870"
      :maskClosable="false"
      v-model="modal.addContentTextModal"
      title="添加文字"
      @ok="addContentText"
    >
      <Editor ref="addContentText"></Editor>
    </a-modal>
    <!--添加试题-->
    <RecordQuestions
      ref="RecordQuestions"
      :paperId="paperId"
      :contentId="contentId"
      :contentData="contentData"
      @changeContent="changeContent"
    ></RecordQuestions>
    <!--文字修改-->
    <a-modal
      :width="870"
      :maskClosable="false"
      v-model="modal.changeTextModal"
      title="内容修改"
      @ok="changeText"
    >
      <Editor
        ref="editor"
        :defaultHtml="contentSelector.content.textContent"
        v-if="contentSelector.contentType === 0"
      >
      </Editor>
    </a-modal>
  </div>
</template>

<script>
// 使用Swiper组件
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import { upGo, downGo } from "@/until";
import {
  getPaperList,
  createPater,
  paperCopy,
  renamePaper,
  deleteCreatePaper,
  paperSort,
  movePaper,
  copyPaper,
  addPaperText,
  getPaperContentById,
  changePaperText,
  paperContentSort,
  batchDeletePaperContent,
  setQuestionAssociated,
  addQuestionStore,
  setQuestionNumber,
} from "@/request/exam/examCreated";
import { getDirectory } from "@/request/exam/directory";
// import { courseSort } from "@/request/course/created/course";
import draggable from "vuedraggable";
import { mapMutations } from "vuex";

export default {
  name: "ExamCreateIndex",
  props: ["role", "isOtherTeacher"],
  components: {
    Tab: () => import("@/components/Tab"),
    swiper,
    swiperSlide,
    draggable,
    Editor: () => import("@/components/MyEditor"),
    RecordQuestions: () => import("../components/RecordQuestions"),
    RadioTree: () => import("@/components/RadioTree"),
    ContentQuestion: () => import("./components/ContentQuestion"),
    SideRight: () => import("./components/SideRight"),
  },
  data() {
    return {
      creator: JSON.parse(sessionStorage.getItem("course_userInfo")).userId,
      tabIndex: "0",
      modal: {
        // 创建考试
        createPater: false,
        // 修改考试名称
        renamePaperName: false,
        // 选择目录
        chooseCatalogue: false,
        // 添加文字
        addContentTextModal: false,
        // 修改文字
        changeTextModal: false,
      },
      paperName: "",
      renameVal: "",
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
            this.contentData = [];
            this.getPaperContent(this.paperId);
          },
        },
      },
      paperId: "",
      paperList: [],
      contentId: "",
      contentData: [],
      // 考试内容编辑类型
      editorType: null,
      // 多题关联试题Id 集合
      relationData: [],
      // 连续编号试题Id 集合
      serialNumberData: [],
      // 内容多选选中数据id 集合
      contentCheckedArr: [],
      chooseDirType: "3",
      treeId: "",
      list1: [],
      list2: [],
      list3: [],
    };
  },
  inject: ["catalogIds"],
  computed: {
    redCatalogIdsDotIds() {
      return this.catalogIds();
    },
    swiper() {
      return this.$refs.mySwiper.swiper;
    },
    // 选中的考试标签数据
    paperData() {
      return this.paperList.find((o) => o.id === this.paperId) || {};
    },
    // 选中的考试内容数据
    contentSelector() {
      return (
        this.contentData.find((o) => o.content.id === this.contentId) || {}
      );
    },
    off() {
      return (
        this.contentId === "" ||
        ["0", "1", "2", "3"].includes(this.editorType) ||
        this.isOtherTeacher
      );
    },
  },
  watch: {
    "$route.query.catalogId": {
      immediate: true,
      handler(catalogId) {
        if (catalogId !== undefined && catalogId != "") {
          this.getPaperList();
        } else {
          this.paperList = [];
        }
      },
    },
  },
  mounted() {},
  methods: {
    ...mapMutations("exam_create", ["copyPaperData"]),
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
        type: 0,
      }).then((res) => {
        if (res.extra.length > 0) {
          this.paperId = res.extra[0].id;
          this.getPaperContent(this.paperId);
        } else {
          this.paperId = null;
          this.contentData = [];
        }
        this.paperList = res.extra;
      });
    },
    // 打开创建考试弹窗
    openCreatePaterModal() {
      if (!this.$route.query.catalogId || this.$route.query.catalogId == "") {
        this.$message.warn("请先选择目录！");
        return;
      }
      this.modal.createPater = true;
    },
    // 创建考试
    createdExam() {
      if (this.paperName === "") {
        this.$message.warn("请输入考试名称！");
        return;
      }
      createPater({
        paperName: this.paperName,
        catalogId: this.$route.query.catalogId,
        paperTagId: 0,
      }).then((res) => {
        this.paperList = [...this.paperList, res.extra];
        const index = this.paperList.length - 1;
        this.paperId = this.paperList[index].id;
        this.swiper.slideTo(index, 10, false);
        this.paperName = "";
        this.contentData = [];
        this.modal.createPater = false;
      });
    },
    // 考试列表菜单操作
    dropdownClick(e, item) {
      const _this = this;
      const { key } = e;
      let i = this.paperList.findIndex((item) => item.id === this.paperId);
      switch (key) {
        // 重命名
        case "0":
          this.renameVal = this.paperData.paperName;
          this.modal.renamePaperName = true;
          break;
        // 左移
        case "1":
          upGo(this.paperList, i);
          // eslint-disable-next-line no-case-declarations
          let upGoArr = this.paperList.map((o, i) => {
            return { id: o.id, paperIndex: i };
          });
          paperSort(upGoArr);
          break;
        // 右移
        case "2":
          downGo(this.paperList, i);
          // eslint-disable-next-line no-case-declarations
          let downGoArr = this.paperList.map((o, i) => {
            return { id: o.id, paperIndex: i };
          });
          paperSort(downGoArr);
          break;
        // 移动到
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
          this.modal.chooseCatalogue = true;
          this.treeId = "";
          break;
        // 创建副本
        case "4":
          paperCopy({
            id: item.id,
            catalogId: item.catalogId,
          }).then((res) => {
            let index = this.paperList.findIndex((o) => o.id === item.id);
            this.paperList.splice(index + 1, 0, res.extra);
            this.paperId = res.extra.id;
            this.swiper.slideTo(this.paperList.length - 1, 10, false);
          });
          break;
        // 删除
        case "5":
          this.$confirm({
            title: "是否确定要删除这个考试?",
            // content: "Some descriptions",
            okText: "删除",
            okType: "danger",
            cancelText: "取消",
            onOk() {
              deleteCreatePaper(item.id).then((res) => {
                if (res.extra) {
                  _this.paperList = _this.paperList.filter(
                    (o) => o.id !== item.id
                  );
                  if (_this.paperList.length > 0) {
                    const index = _this.paperList.length - 1;
                    _this.paperId = _this.paperList[index].id;
                  }
                  _this.getPaperContent(_this.paperId);
                }
              });
            },
            onCancel() {
              console.log("Cancel");
            },
          });
          break;
        // 复制到
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
          this.modal.chooseCatalogue = true;
          this.treeId = "";
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
    // 修改考试名称
    renamePaper() {
      if (this.renameVal === "") {
        this.$message.warn("请输入试卷名称！");
        return;
      }
      renamePaper({
        id: this.paperId,
        paperName: this.renameVal,
      }).then((res) => {
        if (res.extra) {
          const i = this.paperList.findIndex((o) => o.id === this.paperId);
          this.paperList[i].paperName = this.renameVal;
          this.modal.renamePaperName = false;
          this.$message.success("修改成功！");
        }
      });
    },
    // 选择目录获取id
    chooseTreeData({ item }) {
      this.treeId = item.id;
    },
    // 移动或复制到某个目录
    chooseDir(type = "3") {
      if (this.treeId === "") {
        this.$error({
          content: "请先选择目录!",
        });
        return;
      }
      if (type === "3") {
        movePaper({
          paperIndex: this.paperData.paperIndex,
          id: this.paperId,
          catalogId: this.treeId,
        }).then(() => {
          this.paperList.splice(this.paperData.paperIndex, 1);
          this.modal.chooseCatalogue = false;
          this.$message.success("已移动到所选目录！");
        });
      } else if (type === "6") {
        copyPaper(this.paperId, this.treeId).then((res) => {
          console.log(res);
          if (res.extra) {
            this.modal.chooseCatalogue = false;
            this.$message.success("已复制到所选目录！");
          }
        });
      }
    },
    // 考试添加文字
    addContentText() {
      if (this.$refs.addContentText.editor.isEmpty()) {
        this.$message.warning("请输入文字内容！");
        return;
      }
      let params = {
        paperId: this.paperId,
        textContent: this.$refs.addContentText.html,
        wordCounts: this.$refs.addContentText.editor.getText().length,
      };

      if (this.contentId === "") {
        addPaperText(params).then((res) => {
          this.changeContent([...this.contentData, res.extra], true);
          this.$refs.addContentText.editor.clear();
          this.modal.addContentTextModal = false;
        });
      } else {
        let index = this.contentData.findIndex(
          (o) => o.content.id === this.contentId
        );
        if (this.contentData[index].contentType === 2) {
          let mappingIdList = this.contentData[index].content.mappingIdList;
          if (mappingIdList.length > 0) {
            let i = this.contentData.findIndex(
              (o) => o.content.id === mappingIdList[mappingIdList.length - 1]
            );
            params.textIndex = i + 2;
            addPaperText(params).then((res) => {
              let arr = this.contentData;
              arr.splice(i + 1, 0, res.extra);
              this.changeContent(arr, true);
              this.$refs.addContentText.editor.clear();
              this.modal.addContentTextModal = false;
            });
            return;
          }
        }
        addPaperText(params).then((res) => {
          let arr = this.contentData;
          arr.splice(index + 1, 0, res.extra);
          this.changeContent(arr, true);
          this.$refs.addContentText.editor.clear();
          this.modal.addContentTextModal = false;
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
      let params = this.contentData.map((o, i) => {
        return {
          id: o.content.id,
          contentType: o.contentType,
          idx: i,
        };
      });
      paperContentSort(params, this.paperId).then((res) => {
        console.log("SORT", res);
      });
    },
    // 获取考试内容
    getPaperContent(paperId) {
      this.contentId = "";
      getPaperContentById(paperId).then((res) => {
        this.contentData = res.extra;
      });
    },
    // 修改文字弹窗确定
    changeText() {
      const _this = this;
      const { contentType } = this.contentSelector;
      if (contentType === 0) {
        if (this.$refs.editor.editor.isEmpty()) {
          this.$message.warn("内容不能为空！");
          return;
        }
        this.$confirm({
          title: "是否确定修改内容?",
          okText: `确定`,
          // 点击蒙层是否允许关闭
          maskClosable: true,
          cancelText: "取消",
          onOk: () => {
            changePaperText({
              id: _this.contentId,
              textContent: _this.$refs.editor.editor.getHtml(),
            }).then(() => {
              let i = this.contentData.findIndex(
                (o) => o.content.id === _this.contentId
              );
              this.contentData[i].content.textContent =
                _this.$refs.editor.editor.getHtml();
              _this.modal.changeTextModal = false;
            });
          },
          onCancel: () => {},
        });
      }
    },
    // 修改考试列表
    changePaperList(data) {
      this.paperList = data;
    },
    // 修改考试内容
    changeContent(data, filter = false) {
      if (data.length > 0 && filter) {
        let params = data.map((o, i) => {
          return {
            id: o.content.id,
            contentType: o.contentType,
            idx: i,
          };
        });
        paperContentSort(params, this.paperId).then((res) => {
          console.log("SORT", res);
        });
      }
      console.log(data);
      this.contentData = data;
    },
    // 内容多选时确定
    relationTrue() {
      if (this.contentCheckedArr.length === 0) {
        this.$error({
          content: "请选择想要操作的内容！",
        });
        return;
      }
      let index = this.contentData.findIndex(
        (o) => o.content.id === this.contentCheckedArr[0]
      );
      if (this.editorType === "0") {
        setQuestionAssociated(this.contentCheckedArr).then(() => {
          this.contentData.forEach((o) => {
            if (this.contentCheckedArr.includes(o.content.id)) {
              o.content.firstQuestionId = this.contentCheckedArr[0];
              o.content.mappingIdList = this.contentCheckedArr;
            }
          });
          this.clearData();
        });
      } else if (this.editorType === "1") {
        // 连续编号
        let params = [];
        let num = this.contentData[index].content.questionNumber;
        if (num === "" || num === null || isNaN(parseInt(num))) {
          this.$error({
            content: "不能连续编号，请检查首题题号！",
          });
          return;
        }
        this.contentData.map((o) => {
          if (this.contentCheckedArr.includes(o.content.id)) {
            params.push({
              id: o.content.id,
              questionNumber: num++,
            });
          }
        });
        setQuestionNumber(params).then(() => {
          this.contentData.map((o) => {
            params.map((item, i) => {
              if (item.id === o.content.id) {
                o.content.questionNumber = params[i].questionNumber;
              }
            });
          });
          this.clearData();
        });
      } else if (this.editorType === "2") {
        // 连续设分
        let params = [];
        this.contentData.map((o) => {
          if (this.contentCheckedArr.includes(o.content.id)) {
            params.push({
              id: o.content.id,
              questionNumber: o.content.questionNumber,
              questionParentId: o.content.questionParentId,
              questionScore: this.contentData[index].content.questionScore,
            });
          }
        });
        addQuestionStore(params).then((res) => {
          if (res.extra) {
            this.contentData.map((o) => {
              if (this.contentCheckedArr.includes(o.content.id)) {
                o.content.questionScore = params[0].questionScore;
              }
            });
            this.clearData();
          }
        });
      }
    },
    // 内容多选时复制
    copyData() {
      if (this.contentCheckedArr.length === 0) {
        this.$error({
          content: "请选择想要复制的内容！",
        });
        return;
      }
      let data = {
        originPaperId: this.paperId,
        content: [],
      };
      this.contentData.map((o) => {
        if (this.contentCheckedArr.includes(o.content.id)) {
          data.content.push({ id: o.content.id, contentType: o.contentType });
        }
      });
      this.copyPaperData(data);
      this.$message.success("拷贝成功！");
      this.clearData();
    },
    // 内容多选时删除
    deleteContents() {
      if (this.contentCheckedArr.length === 0) {
        this.$error({
          content: "请选择想要删除的内容！",
        });
        return;
      }
      let _this = this;
      this.$confirm({
        title: "是否确定要删除所选内容?",
        content: "内容删除后不可恢复，您是否确定删除内容？",
        okText: "删除",
        // 点击蒙层是否允许关闭
        maskClosable: true,
        okType: "danger",
        cancelText: "取消",
        onOk: () => {
          let params = [];
          _this.contentData.map((o) => {
            if (_this.contentCheckedArr.includes(o.content.id)) {
              params.push({
                contentType: o.contentType,
                content: {
                  id: o.content.id,
                },
              });
            }
          });
          batchDeletePaperContent(params, _this.paperId).then(() => {
            _this.getPaperContent(_this.paperId);
            _this.clearData();
          });
        },
        onCancel: () => {
          console.log("Cancel");
        },
      });
    },
    // 重置内容编辑状态
    clearData() {
      this.editorType = "";
      this.contentId = "";
      this.contentCheckedArr = [];
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
      justify-content: flex-start;
      align-items: center;
    }
  }
}
.courseContent {
  height: calc(100vh - 156px);
  padding: 24px 40px 50px 40px;
  overflow-y: auto;
  box-sizing: border-box;
  .stateBox {
    display: flex;
    justify-content: space-around;
    align-items: center;
    width: 100%;
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
.computedHeight {
  height: calc(100vh - 110px);
}
</style>
