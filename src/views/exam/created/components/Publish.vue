<template>
  <div>
    <TagBox name="考试发送">
      <a-button
        type="primary"
        block
        @click="openModal"
        :disabled="
          [1, 2, 3].includes(paperData.paperType) &&
          paperData.paperPublishTag === 1
        "
      >
        {{ paperData.paperPublishTag === 1 ? "再次发布" : "发布" }}
      </a-button>
    </TagBox>
    <a-modal
      v-model="visible"
      :maskClosable="false"
      :title="`考试发送-${paperData.paperName}`"
      :width="650"
    >
      <div class="wrap" v-if="visible">
        <a-checkbox
          v-if="![1, 2, 3].includes(paperData.paperType)"
          style="margin: 5px 30px"
          :indeterminate="checkAllstudentsOVer"
          :checked="checkAllstudents"
          @change="checkAllTree"
        >
          全选
        </a-checkbox>
        <div class="wrapper">
          <div class="left">
            <template v-if="[1, 2, 3].includes(paperData.paperType)">
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
                  :allowClear="false"
                  :disabled-date="disabledStartDate"
                  :showTime="{
                    format: 'HH:mm',
                    defaultValue: moment('00:00', 'HH:mm'),
                  }"
                  :inputReadOnly="true"
                  :showToday="false"
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
                    minuteStep: 5,
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
                  <!--<template slot="renderExtraFooter">
                    <a-button
                      type="gost"
                      size="small"
                      block
                      @click="(endValue = null), (endOpen = false)"
                    >
                      无回收时间
                    </a-button>
                  </template>-->
                </a-date-picker>
              </div>
            </a-space>
          </div>
        </div>
      </div>
      <template slot="footer">
        <a-button @click="visible = false"> 取消 </a-button>
        <a-button type="primary" @click="publishPaper" :disabled="isPublish">
          确定
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import moment from "moment";
import { flattenDeep } from "lodash";
import {
  getGroupList,
  getOtherGroupList,
  publishPaper,
  getPaperList,
} from "@/request/exam/examCreated";
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
export default {
  name: "publishPapers",
  props: ["paperId", "paperData"],
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
      indeterminate: false,
    };
  },
  computed: {
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
    openModal() {
      this.checkedStuList = [];
      this.startValue = moment(
        moment().format("YYYY-MM-DD HH:mm") + ":00"
      ).format("YYYY-MM-DD HH:mm:ss");
      this.endValue = null;
      if ([1, 2, 3].includes(this.paperData.paperType)) {
        getOtherGroupList(this.paperId).then((res) => {
          this.treeData = flatten(res.extra);
          this.checkedStuList = this.treeData.map((o) => {
            return { groupId: o.groupId, studentUserId: o.id };
          });
          this.visible = true;
        });
      } else {
        getGroupList({ paperId: this.paperId }).then((res) => {
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
      if (this.endValue) {
        // 如果有回显初始值或者先选了结束日期
        // 大于今天的日期，并且小于选择的结束值
        return startValue < moment().endOf("day").subtract(1, "day");
      } else {
        // 没有选择结束日期，只考虑大于今天的日期
        return (
          startValue && startValue < moment().endOf("day").subtract(1, "day")
        );
      }
    },
    disabledEndDate(endValue) {
      if (this.startValue) {
        // 如果有回显初始值或者先选了开始日期
        // 当前可用日期大于开始日期
        return (
          endValue < moment(this.startValue).endOf("day").subtract(1, "day")
        );
      } else {
        /* 
          只能大于之后的一天，比如，今天是3月2号，那如果是先选择了结束日期，那么这个可选的
          只能从3月4号可选，因为选了3月3号的话，开始日期就没办法选了，因为要求开始日期不能等于
          结束日期
       */

        return endValue && endValue < moment().endOf("day").add(1, "day");
      }
    },
    range(start, end) {
      const result = [];
      for (let i = start; i < end; i++) {
        result.push(i);
      }
      return result;
    },
    handleEndOpenChange(open) {
      this.endOpen = open;
    },
    publishPaper() {
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
      if (!this.endValue) {
        this.$error({
          title: "错误",
          content: "请选择回收时间！",
        });
        return;
      }
      this.isPublish = true;
      publishPaper({
        paperId: this.paperId,
        publishTime: moment(this.startValue).format("YYYY-MM-DD HH:mm:ss"),
        recycleTime:
          this.endValue === null
            ? ""
            : moment(this.endValue).format("YYYY-MM-DD HH:mm:ss"),
        stuList: this.checkedStuList,
      }).then((res) => {
        if (res.extra) {
          getPaperList({ catalogId: this.$route.query.catalogId }).then(
            (res) => {
              this.$emit("changePaperList", res.extra);
              this.isPublish = false;
              this.visible = false;
              this.$message.success("发布成功！");
            }
          );
        } else {
          this.isPublish = false;
        }
      });
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
