<template>
  <div>
    <TagBox :name="role === 1 ? '创建课程' : '共享课程'">
      <a-button
        type="primary"
        block
        v-if="role === 1"
        @click="openModal"
        :disabled="
          [1, 2, 3].includes(courseSelectedData.courseType) &&
          courseSelectedData.coursePublishTag === 1
        "
      >
        {{
          courseSelectedData.coursePublishTag === 1
            ? "再次发布课程"
            : "发布课程"
        }}
      </a-button>
      <a-button type="primary" block v-if="role === 2 && isOtherTeacher">
        下载课程
      </a-button>
      <a-button
        type="primary"
        block
        v-if="role === 2 && !isOtherTeacher"
        @click="openSharedModal"
      >
        共享发布
      </a-button>
    </TagBox>
    <a-modal
      v-model="visible"
      :maskClosable="false"
      :title="`发布课程-${courseSelectedData.courseName}`"
      :width="650"
    >
      <div class="wrap" v-if="visible">
        <a-checkbox
          v-if="![1, 2, 3].includes(courseSelectedData.courseType)"
          style="margin: 5px 30px"
          :indeterminate="checkAllstudentsOVer"
          :checked="checkAllstudents"
          @change="checkAllTree"
        >
          全选
        </a-checkbox>
        <div class="wrapper">
          <div class="left">
            <template v-if="[1, 2, 3].includes(courseSelectedData.courseType)">
              <div v-for="o in treeData" :key="o.stuId">
                {{ o.userName }}
              </div>
            </template>
            <template v-else>
              <a-tree
                checkable
                :tree-data="treeData"
                :replace-fields="replaceFields"
                :default-checked-keys="selectedKeys"
                v-model="selectedKeys"
                @check="checkTreeNode"
              />
            </template>
          </div>
          <div class="right">
            <a-space direction="vertical" :size="10" style="width: 100%">
              <div>
                <span>发布时间：</span>
                <a-date-picker
                  v-model="startValue"
                  :disabled-date="disabledStartDate"
                  :showTime="{
                    format: 'HH:mm',
                    defaultValue: moment('00:00', 'HH:mm'),
                  }"
                  :inputReadOnly="true"
                  size="small"
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="请选择发布时间"
                />
              </div>
              <div style="margin-top: 15px">
                <span>回收时间：</span>
                <a-date-picker
                  v-model="endValue"
                  :disabled-date="disabledEndDate"
                  :open="endOpen"
                  :showTime="{
                    minuteStep: 30,
                    format: 'HH:mm',
                    defaultValue: moment('00:00', 'HH:mm'),
                  }"
                  :inputReadOnly="true"
                  :showToday="false"
                  size="small"
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="请选择回收时间"
                  @openChange="handleEndOpenChange"
                >
                  <template slot="renderExtraFooter">
                    <a-button
                      type="gost"
                      size="small"
                      block
                      @click="(endValue = null), (endOpen = false)"
                    >
                      无回收时间
                    </a-button>
                  </template>
                </a-date-picker>
              </div>
            </a-space>
          </div>
        </div>
      </div>
      <template slot="footer">
        <a-button @click="visible = false"> 取消 </a-button>
        <a-button type="primary" @click="publishCourse" :disabled="isPublish">
          确定
        </a-button>
      </template>
    </a-modal>
    <a-modal
      v-model="shareModal"
      :maskClosable="false"
      :title="`共享课程-${courseSelectedData.courseName}`"
      @ok="shareMyCourse"
    >
      <div>
        <div
          :style="{ borderBottom: '1px solid #E9E9E9', paddingBottom: '10px' }"
        >
          <a-checkbox
            :indeterminate="indeterminate"
            :checked="checkAll"
            @change="onCheckAllChange"
          >
            全选
          </a-checkbox>
        </div>
        <br />
        <a-checkbox-group
          v-model="checkedList"
          :options="plainOptions"
          @change="onChange"
        />
      </div>
    </a-modal>
  </div>
</template>

<script>
import moment from "moment";
import { mapActions, mapGetters, mapState } from "vuex";
import { flattenDeep } from "lodash";
import {
  getGroupList,
  getOtherGroupList,
  publishCourse,
  getTeacherList,
  shareCourse,
} from "@/request/course/created/course";
/*const plainOptions = [
  { label: "张老师", value: "0", disabled: true },
  { label: "王老师", value: "1", disabled: true },
  { label: "张三", value: "2", disabled: true },
  { label: "李老师", value: "3", disabled: true },
  { label: "孙老师", value: "4" },
  { label: "张老师", value: "5" },
  { label: "赵老师", value: "6" },
];*/
// eslint-disable-next-line no-unused-vars
function flatten(arr) {
  return arr.reduce((result, item) => {
    return result.concat(
      Array.isArray(item.students) ? item.students.flat() : []
    );
  }, []);
}
const key = "publishCourse";
export default {
  name: "PublishCourses",
  data() {
    return {
      isPublish: false,
      visible: false,
      replaceFields: {
        children: "students",
        title: "userName",
        key: "id",
      },
      // 选择的学生
      checkedStuList: [],
      // 设置默认选中
      selectedKeys: [],
      // 学生分组数据
      treeData: [],
      // 开始时间
      startValue: null,
      // 结束时间
      endValue: null,
      endOpen: false,
      shareModal: false,
      indeterminate: false,
      checkAll: false,
      // 选中的老师
      checkedList: [],
      // 可以共享的老师
      plainOptions: [],
    };
  },
  computed: {
    ...mapState({
      role: (state) => state.role,
      isOtherTeacher: (state) => state.c.isOtherTeacher,
      courseId: (state) => state.c.courseId,
    }),
    ...mapGetters("c", ["courseSelectedData"]),
    checkAllstudentsOVer() {
      return (
        this.selectedKeys.length > 0 &&
        this.selectedKeys.length < this.lookForAllId(this.treeData).length
      );
    },
    checkAllstudents() {
      return (
        this.selectedKeys.length > 0 &&
        this.selectedKeys.length === this.lookForAllId(this.treeData).length
      );
    },
  },
  watch: {
    startValue(val) {
      console.log("startValue", val);
    },
    endValue(val) {
      console.log("endValue", val);
    },
  },
  mounted() {},
  methods: {
    moment,
    ...mapActions("c", ["getCourseListData"]),
    openModal() {
      this.checkedStuList = [];
      this.startValue = moment().format("YYYY-MM-DD HH:mm:ss");
      this.endValue = null;
      if ([1, 2, 3].includes(this.courseSelectedData.courseType)) {
        getOtherGroupList(this.courseId).then((res) => {
          this.treeData = flatten(res.extra);
          this.checkedStuList = this.treeData.map((o) => {
            return { groupId: o.groupId, studentUserId: o.id };
          });
          this.visible = true;
        });
      } else {
        getGroupList({ courseId: this.courseId }).then((res) => {
          this.treeData = res.extra.map((o) => {
            return { userName: o.groupName, disabled: false, ...o };
          });
          this.treeData = JSON.parse(
            JSON.stringify(this.treeData).replace(
              /"publishFlag"/g,
              '"disabled"'
            )
          );
          function lookForCheckedIds(data = [], arr = []) {
            for (let item of data) {
              if (item.disabled) {
                arr.push(item.id);
              }
              if (item.students && item.students.length)
                lookForCheckedIds(item.students, arr);
            }
            return arr;
          }
          //判断某个数组中是否包含另一个数组
          function isContained(a, b) {
            if (!(a instanceof Array) || !(b instanceof Array)) return false;
            if (a.length < b.length) return false;
            let aStr = a.toString();
            for (let i = 0, len = b.length; i < len; i++) {
              if (aStr.indexOf(b[i]) === -1) return false;
            }
            return true;
          }
          let ids = lookForCheckedIds(this.treeData);
          this.treeData.forEach((o) => {
            let arr = o.students.map((o) => o.id);
            if (isContained(ids, arr)) {
              o.disabled = true;
              ids.push(o.id);
            }
          });
          this.selectedKeys = ids;
          this.visible = true;
        });
      }
    },
    checkAllTree(e) {
      if (e.target.checked) {
        this.selectedKeys = this.lookForAllId(this.treeData);
        console.log(this.selectedKeys);
        // 设置默认选中所有学生
        let stuArr = this.treeData.map((o) => {
          return o.students
            .filter((o) => !o.disabled)
            .map((j) => {
              return { groupId: j.groupId, studentUserId: j.studentUserId };
            });
        });
        this.checkedStuList = flattenDeep(stuArr);
      } else {
        // eslint-disable-next-line no-inner-declarations
        function lookForCheckedIds(data = [], arr = []) {
          for (let item of data) {
            if (item.disabled) {
              arr.push(item.id);
            }
            if (item.students && item.students.length)
              lookForCheckedIds(item.students, arr);
          }
          return arr;
        }
        this.selectedKeys = lookForCheckedIds(this.treeData);
        this.checkedStuList = [];
      }
    },
    checkTreeNode(checkedKeys, e) {
      if (e.checked) {
        if (e.node.dataRef.students && e.node.dataRef.students.length > 0) {
          let data = e.node.dataRef.students.filter((o) => !o.disabled);
          let stuData = data.map((o) => {
            return { groupId: o.groupId, studentUserId: o.studentUserId };
          });
          this.checkedStuList.push(...stuData);
        } else {
          const { groupId, studentUserId } = e.node.dataRef;
          this.checkedStuList.push({
            groupId: groupId,
            studentUserId: studentUserId,
          });
        }
      } else {
        if (e.node.dataRef.students && e.node.dataRef.students.length > 0) {
          let groupId = e.node.dataRef.id;
          this.checkedStuList = this.checkedStuList.filter(
            (o) => groupId !== o.groupId
          );
        } else {
          const { groupId, studentUserId } = e.node.dataRef;
          this.checkedStuList = this.checkedStuList.filter(
            (o) => !(o.studentUserId === studentUserId && o.groupId === groupId)
          );
        }
      }
    },
    disabledStartDate(startValue) {
      const endValue = this.endValue;
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > endValue.valueOf();
    },
    disabledEndDate(endValue) {
      const startValue = this.startValue;
      if (!endValue || !startValue) {
        return false;
      }
      return startValue.valueOf() >= endValue.valueOf();
    },
    handleEndOpenChange(open) {
      this.endOpen = open;
    },
    onChange(checkedList) {
      this.indeterminate =
        !!checkedList.length && checkedList.length < this.plainOptions.length;
      this.checkAll = checkedList.length === this.plainOptions.length;
      console.log(this.checkedList);
    },
    onCheckAllChange(e) {
      Object.assign(this, {
        checkedList: e.target.checked
          ? this.plainOptions.map((o) => {
              return o.value;
            })
          : [], // 可添加已共享的id
        indeterminate: false,
        checkAll: e.target.checked,
      });
      console.log(this.checkedList);
    },
    // 共享发布课程
    shareMyCourse() {
      shareCourse(this.checkedList, this.courseId).then((res) => {
        if (res.extra) {
          if (this.$route.query.catalogId) {
            this.getCourseListData(this.$route.query.catalogId).then(() => {
              this.$message.success("共享成功！");
              this.shareModal = false;
            });
          }
        }
      });
    },
    publishCourse() {
      if (this.checkedStuList.length === 0) {
        this.$error({
          title: "错误",
          content: "请选择学生！",
        });
        return;
      }
      if (!this.startValue) {
        this.$error({
          title: "错误",
          content: "请选择开始时间！",
        });
        return;
      }
      // if (!this.endValue) {
      //   this.$error({
      //     title: "错误",
      //     content: "请选择结束时间！",
      //   });
      //   return;
      // }
      this.isPublish = true;
      this.$message.loading({ content: "课程发布中...", key });
      publishCourse({
        courseId: this.courseId,
        publishTime: moment(this.startValue).format("YYYY-MM-DD HH:mm:ss"),
        recycleTime:
          this.endValue === null
            ? ""
            : moment(this.endValue).format("YYYY-MM-DD HH:mm:ss"),
        stuList: this.checkedStuList,
      }).then((res) => {
        if (res.extra) {
          this.getCourseListData(this.$route.query.catalogId).then(() => {
            this.isPublish = false;
            this.visible = false;
            this.$message.success({ content: "发布成功！", key, duration: 2 });
          });
        }
      });
    },
    openSharedModal() {
      this.shareModal = true;
      if (this.role === 2) {
        getTeacherList().then((res) => {
          this.plainOptions = res.extra.map((o) => {
            return { label: o.userName, value: o.userId, disabled: false };
          });
        });
      }
    },
    // 递归取出树形结构id
    lookForAllId(data = [], arr = []) {
      for (let item of data) {
        arr.push(item.id);
        if (item.students && item.students.length)
          this.lookForAllId(item.students, arr);
      }
      return arr;
    },
  },
};
</script>

<style scoped lang="less">
::v-deep .ant-checkbox-group-item {
  margin: 5px 0;
}
.wrap {
  .wrapper {
    display: flex;
    justify-content: space-around;
  }
  .left {
    width: 240px;
    height: 400px;
    overflow-y: auto;
    border: 1px solid #e1e5f2;
    padding: 15px;
    .stuGroup {
      margin-bottom: 0;
      dt {
        cursor: pointer;
      }
      dd {
        cursor: pointer;
        text-indent: 10px;
      }
    }
  }
}
</style>
