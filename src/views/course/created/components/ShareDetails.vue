<template>
  <TagBox name="共享详情">
    <div>
      <template v-if="courseSelectedData.creator === userId">
        <p>发布时间：{{ courseSelectedData.courseShareTime }}</p>
        <div style="max-height: 60px; overflow-y: auto">
          <a-tag
            v-for="item in shareTeacherList"
            :key="item.teacherId"
            :color="item.downloadTag === 1 ? '#87d068' : ''"
          >
            {{ item.userName }}
          </a-tag>
        </div>
        <a-button
          type="danger"
          block
          size="small"
          style="margin-top: 10px"
          @click="delShareCourse"
        >
          取消共享
        </a-button>
      </template>
      <a-button
        v-else
        type="primary"
        block
        size="small"
        @click="openMoveCatalogue"
      >
        下载课程
      </a-button>
      <!--选择移动目录-->
      <a-modal v-model="dirModal" :width="870" title="选择目录" @ok="chooseDir">
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
  </TagBox>
</template>

<script>
import {
  getShareTeacherList,
  delShareCourse,
  downloadShareCourse,
} from "@/request/course/created/course";
import { mapActions } from "vuex";
import { getDirectory } from "@/request/directory";

export default {
  name: "ShareDetails",
  props: ["role", "courseId", "courseSelectedData"],
  components: {
    RadioTree: () => import("@/components/RadioTree"),
  },
  data() {
    return {
      userId: JSON.parse(sessionStorage.getItem("course_userInfo")).userId,
      shareTeacherList: [],
      dirModal: false,
      treeId: "",
      list1: [],
      list2: [],
      list3: [],
    };
  },
  mounted() {
    getShareTeacherList(this.courseId).then((res) => {
      this.shareTeacherList = res.extra;
    });
  },
  methods: {
    ...mapActions("c", ["getCourseListData"]),
    delShareCourse() {
      delShareCourse(this.courseId).then((res) => {
        console.log("del", res);
        if (this.$route.query.catalogId) {
          this.getCourseListData(this.$route.query.catalogId);
        }
      });
    },
    // 打开下载窗口
    openMoveCatalogue() {
      getDirectory(1).then((res) => {
        this.list1 = res.extra;
      });
      getDirectory(2).then((res) => {
        this.list2 = res.extra.filter((o) => o.catalogParentId === 2);
      });
      getDirectory(3).then((res) => {
        this.list3 = res.extra;
      });
      this.dirModal = true;
      this.treeId = "";
    },
    chooseTreeData({ item }) {
      this.treeId = item.id;
    },
    // 选择目录
    chooseDir() {
      if (this.treeId === "") {
        this.$error({
          content: "请先选择目录!",
        });
        return;
      }
      if (this.treeId == this.$route.query.catalogId) {
        this.$error({
          content: "不能选择当前目录，请选择其他目录!",
        });
        this.treeId = "";
        return;
      }
      downloadShareCourse(this.courseId, this.treeId).then((res) => {
        console.log(res);
        if (res.extra) {
          this.dirModal = false;
          this.$message.success("下载成功");
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
p {
  margin-bottom: 5px;
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
