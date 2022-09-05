<template>
  <div>
    <TagBox name="创建个性化课程">
      <div class="pubCourse">
        <a-button
          type="primary"
          block
          v-if="module === 0"
          @click="showModal1 = true"
        >
          错题重做
        </a-button>
        <a-button
          type="primary"
          block
          v-if="module === 1"
          @click="showModal2 = true"
          >分层课程
        </a-button>
        <a-button
          type="primary"
          block
          v-if="module === 2"
          @click="showModal3 = true"
          >分类课程
        </a-button>
      </div>
    </TagBox>
    <!--错题重做-->
    <a-modal
      :width="1360"
      v-model="showModal1"
      :closable="false"
      centered
      @ok="specialCourse(1)"
    >
      <div class="wrongBox" v-if="showModal1">
        <div class="left">
          <div class="title">错题重做 {{ time }}</div>
          <a-table
            size="small"
            :columns="quesColumns"
            :data-source="tableData1"
            :rowKey="(record) => record.id"
            :row-selection="rowSelection"
            bordered
            :pagination="false"
            :scroll="{ y: 700 }"
          >
            <span slot="questionType" slot-scope="text">
              <span v-if="text === 0">单选题</span>
              <span v-if="text === 1">不定项</span>
              <span v-if="text === 2">填空题</span>
              <span v-if="text === 3">简答题</span>
            </span>
            <span slot="kl0" slot-scope="text">
              <span v-if="text === ''">--</span>
              <span v-else>
                <a-tag v-for="o in text.split(',')" :key="o">
                  {{ o }}
                </a-tag>
              </span>
            </span>
            <span slot="kl1" slot-scope="text">
              <span v-if="text === ''">--</span>
              <span v-else>
                <a-tag v-for="o in text.split(',')" :key="o">
                  {{ o }}
                </a-tag>
              </span>
            </span>
            <span slot="kl2" slot-scope="text">
              <span v-if="text === ''">--</span>
              <span v-else>
                <a-tag v-for="o in text.split(',')" :key="o">
                  {{ o }}
                </a-tag>
              </span>
            </span>
          </a-table>
        </div>
        <div class="right">
          <div class="title">选择结果</div>
          <div class="selectStu" style="height: 730px; overflow-y: auto">
            <dl v-for="(item, i) in wrongQuestions" :key="item.id">
              <dt>题号：{{ item.questionNumber }}</dt>
              <dd v-if="item.students.length > 0">
                <a-row>
                  <a-checkbox-group
                    v-model="stuCheckedList[i]"
                    style="width: 100%"
                    @change="onChange"
                  >
                    <a-col :span="24" v-for="o in item.students" :key="o.stuId">
                      <a-checkbox :value="o.stuId" :defaultChecked="true">
                        {{ o.stuName }}</a-checkbox
                      >
                    </a-col>
                  </a-checkbox-group>
                </a-row>
              </dd>
              <dd v-else>暂无数据</dd>
            </dl>
          </div>
        </div>
      </div>
    </a-modal>
    <!--分层课程-->
    <a-modal
      :width="1360"
      v-model="showModal2"
      :closable="false"
      centered
      @ok="specialCourse(2)"
    >
      <div class="wrongBox" v-if="showModal2">
        <div class="left">
          <div class="title">分层课程 {{ time }}</div>
          <a-table
            size="small"
            :columns="personColumns"
            :data-source="tableData2"
            :rowKey="(record) => record.id"
            :row-selection="rowSelection"
            bordered
            :pagination="false"
            :scroll="{ x: 750, y: 700 }"
          >
            <span
              v-for="(record, i) in customTitleList"
              :key="i"
              :slot="record.slot"
              slot-scope="text"
            >
              {{ text }}
            </span>
            <span
              v-for="(record, i) in customTitleList"
              :key="i"
              :slot="record.slot"
            >
              <span v-if="record.title.length < 6">{{ record.title }}</span>
              <a-tooltip placement="topLeft" :title="record.title" v-else>
                <span>{{ record.title.slice(0, 8) }}</span>
              </a-tooltip>
            </span>
          </a-table>
        </div>
        <div class="right">
          <div class="title">选择结果</div>
          <div class="selectStu" v-if="selectedRows.length > 0">
            <a-checkbox-group
              v-model="selectedRowKeys"
              style="width: 100%"
              @change="onChange"
            >
              <dl style="margin-bottom: 0">
                <dt>学生：</dt>
                <div style="max-height: 180px; overflow-y: auto">
                  <dd v-if="selectedRows.length > 0">
                    <a-row v-for="item in selectedRows" :key="item.id">
                      <a-checkbox :value="item.id" disabled> </a-checkbox>
                      {{ item.userName }}
                    </a-row>
                  </dd>
                  <dd v-else>暂无数据</dd>
                </div>
              </dl>
            </a-checkbox-group>
            <dl>
              <div style="max-height: 180px; overflow-y: auto">
                <dt>共同错题：</dt>
                <dd v-if="commonWrongQues.length > 0">
                  <a-checkbox-group
                    v-model="commonWrongQuesId"
                    style="width: 100%"
                    @change="onChange"
                  >
                    <a-row
                      :span="24"
                      v-for="o in commonWrongQues"
                      :key="o.questionId"
                    >
                      <a-checkbox :value="o.questionId" :defaultChecked="true">
                        {{ o.questionNumber }}</a-checkbox
                      >
                    </a-row>
                  </a-checkbox-group>
                </dd>
                <dd v-else>暂无数据</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </a-modal>
    <!--分类课程-->
    <a-modal
      :width="1360"
      v-model="showModal3"
      :closable="false"
      centered
      @ok="specialCourse(3)"
    >
      <div class="wrongBox" v-if="showModal3">
        <div class="left">
          <div class="title">分类课程 {{ time }}</div>
          <a-table
            size="small"
            :rowKey="(record) => record.id"
            :columns="knowledgeColumns"
            :data-source="tableData3"
            :row-selection="rowSelection"
            bordered
            :pagination="false"
            :scroll="{ y: 700 }"
          >
            <span slot="libName" slot-scope="text, record">
              <a-popover
                placement="bottom"
                :title="`${
                  record.libType === 0
                    ? '素养'
                    : record.libType === 1
                    ? '能力'
                    : '知识点'
                }${record.libNumber}`"
              >
                <template slot="content">
                  <div style="width: 300px">
                    {{ record.libNumber }}{{ text }}
                  </div>
                </template>
                <div class="tag">
                  【{{
                    record.libType === 0
                      ? "素养"
                      : record.libType === 1
                      ? "能力"
                      : "知识点"
                  }}】{{ record.libNumber }}{{ text }}
                </div>
              </a-popover>
            </span>
            <span slot="noScore" slot-scope="text, record">
              {{ record.zeroScore.scoringRate }}/
              {{ record.zeroScore.studentCount }}人
            </span>
            <span slot="lowerScoreRate" slot-scope="text, record">
              {{ record.ltScore.scoringRate }} /
              {{ record.ltScore.studentCount }}人
            </span>
            <span slot="higherScoreRate" slot-scope="text, record">
              {{ record.gtScore.scoringRate }} /
              {{ record.gtScore.studentCount }}人
            </span>
            <span slot="fullScore" slot-scope="text, record">
              {{ record.fullScore.scoringRate }} /
              {{ record.fullScore.studentCount }}人
            </span>
            <span slot="questions" slot-scope="text">{{ text.length }}道 </span>
          </a-table>
        </div>
        <div class="right">
          <div class="title">选择结果</div>
          <div class="selectStu" v-if="selectedRows.length > 0">
            <dl v-if="selectedRows.length > 0">
              <dt>知识模块：</dt>
              <div style="max-height: 300px; overflow-y: auto">
                <dd class="tag" v-for="item in selectedRows" :key="item.id">
                  <a-popover
                    placement="left"
                    :title="`${
                      item.libType === 0
                        ? '素养'
                        : item.libType === 1
                        ? '能力'
                        : '知识点'
                    }${item.libNumber}`"
                  >
                    <template slot="content">
                      <div style="width: 300px">
                        {{ item.libNumber }}{{ item.libName }}
                      </div>
                    </template>
                    <div class="tag">
                      【{{
                        item.libType === 0
                          ? "素养"
                          : item.libType === 1
                          ? "能力"
                          : "知识点"
                      }}】 {{ item.libNumber }}{{ item.libName }}
                    </div>
                  </a-popover>
                </dd>
              </div>
            </dl>
            <a-checkbox-group
              v-model="ltScoreStudentsId"
              style="width: 100%"
              @change="onChange"
            >
              <dl>
                <dt>
                  学生
                  <span style="color: red">
                    (低于得分率{{ ltScoreStudents.length }}人) </span
                  >：
                </dt>
                <div style="max-height: 180px; overflow-y: auto">
                  <dd>
                    <a-row v-for="o in ltScoreStudents" :key="o.stuId">
                      <a-checkbox :value="o.stuId" disabled>
                        {{ o.stuName }}
                      </a-checkbox>
                    </a-row>
                  </dd>
                </div>
              </dl>
            </a-checkbox-group>
            <dl>
              <dt>共同错题：</dt>
              <div style="max-height: 180px; overflow-y: auto">
                <dd v-if="commonWrongQues.length > 0">
                  <a-checkbox-group
                    v-model="commonWrongQuesId"
                    style="width: 100%"
                    @change="onChange"
                  >
                    <a-row v-for="o in commonWrongQues" :key="o.questionId">
                      <a-checkbox :value="o.questionId" :defaultChecked="true">
                        {{ o.questionNumber }}
                      </a-checkbox>
                    </a-row>
                  </a-checkbox-group>
                </dd>
                <dd v-else>暂无数据</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
const personColumns = [
  {
    title: "学生",
    dataIndex: "userName",
    fixed: "left",
    width: 120,
  },
  {
    title: "得分率",
    dataIndex: "scoringRate",
    sorter: (a, b) => a.scoring - b.scoring,
    scopedSlots: { customRender: "scoreRate" },
    width: 100,
    fixed: "left",
  },
];
const knowledgeColumns = [
  {
    title: "知识模块",
    dataIndex: "libName",
    width: 230,
    scopedSlots: { customRender: "libName" },
  },
  {
    title: "得分率",
    dataIndex: "scoringRate",
    // defaultSortOrder: "descend",
    sorter: (a, b) => a.scoring - b.scoring,
    scopedSlots: { customRender: "scoringRate" },
  },
  {
    title: "0分 / 人",
    dataIndex: "noScore",
    scopedSlots: { customRender: "noScore" },
  },
  {
    title: "低于得分率 / 人",
    dataIndex: "lowerScoreRate",
    scopedSlots: { customRender: "lowerScoreRate" },
  },
  {
    title: "高于得分率 / 人",
    dataIndex: "higherScoreRate",
    scopedSlots: { customRender: "higherScoreRate" },
  },
  {
    title: "满分 / 人",
    dataIndex: "fullScore",
    scopedSlots: { customRender: "fullScore" },
  },
  {
    title: "涉及题目",
    dataIndex: "questions",
    scopedSlots: { customRender: "questions" },
  },
];
import {
  coursePersionStatistics,
  courseStatisticsByModule,
  courseStatisticsByPersion,
  courseStatisticsBytopic,
  createSpecialCourse,
  getCommonWronQues,
} from "@/request/course/courseResult";
import moment from "moment";
export default {
  name: "RedoQuestion",
  props: ["module", "courseId"],
  data() {
    const _this = this;
    return {
      time: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      showModal1: false,
      showModal2: false,
      showModal3: false,
      quesColumns: [
        { title: "题号", dataIndex: "questionNumber" },
        {
          title: "题型",
          dataIndex: "questionType",
          filters: [
            {
              text: "单选",
              value: 0,
            },
            {
              text: "不定项",
              value: 1,
            },
            {
              text: "填空",
              value: 2,
            },
            {
              text: "简答",
              value: 3,
            },
          ],
          filterMultiple: true,
          onFilter: (value, record) => record.questionType === value,
          scopedSlots: { customRender: "questionType" },
          onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
              _this.selectedRowKeys = [];
              _this.selectedRows = [];
            }
          },
        },
        {
          title: "得分率",
          dataIndex: "scoringRate",
          // defaultSortOrder: "descend",
          sorter: (a, b) => parseInt(a.scoring) - parseInt(b.scoring),
        },
        {
          title: "素养",
          dataIndex: "kl0",
          scopedSlots: { customRender: "kl0" },
        },
        {
          title: "能力",
          dataIndex: "kl1",
          scopedSlots: { customRender: "kl1" },
        },
        {
          title: "知识点",
          dataIndex: "kl2",
          scopedSlots: { customRender: "kl2" },
        },
      ],
      personColumns,
      customTitleList: [],
      knowledgeColumns,
      selectedRowKeys: [],
      selectedRows: [],
      tableData1: [],
      tableData2: [],
      tableData3: [],
      // 错题重做选中的学生id数据
      stuCheckedList: [],
      // 错题数据（题和做错的学生）
      wrongQuestions: [],
      // 错题重做参数数据
      wrongQuesParams: [],
      // 分层课程共同错题
      commonWrongQues: [],
      // 分层课程选中的共同错题Id
      commonWrongQuesId: [],
      // 分类课程 低于得分率的学生
      ltScoreStudents: [],
    };
  },
  computed: {
    rowSelection() {
      return {
        columnTitle: "选择", // 去掉头部全选框
        hideDefaultSelections: true,
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(
            `selectedRowKeys: ${selectedRowKeys}`,
            "selectedRows: ",
            selectedRows
          );
          this.selectedRowKeys = selectedRowKeys;
          this.selectedRows = selectedRows;
        },
        onSelect: (record, selected) => {
          if (this.showModal1) {
            if (selected) {
              coursePersionStatistics(this.courseId, record.id).then((res) => {
                let data = res.extra.courseStudents.filter(
                  (o) =>
                    o.judgeTag === 0 || o.judgeTag === 2 || o.answer === null
                );
                console.log("data:", data);
                this.wrongQuestions.push({
                  id: record.id,
                  questionNumber: record.questionNumber,
                  students:
                    data.length > 1
                      ? data.reduce((result, item) => {
                          return result.concat(
                            Array.isArray(item.students)
                              ? item.students.flat()
                              : []
                          );
                        }, [])
                      : /* data.reduce((acc, value) => {
                          if (value.students) {
                            return [...acc.students, ...value.students];
                          }
                        })*/

                      data.length === 0
                      ? []
                      : data[0].students,
                });
                console.log("wrongQuestions", this.wrongQuestions);
                this.stuCheckedList = [];
                this.wrongQuestions.forEach((o) => {
                  this.stuCheckedList.push(
                    o.students.map((item) => item.stuId)
                  );
                });
                this.wrongQuesParams = [];
                this.wrongQuestions.forEach((o) => {
                  o.students.forEach((item) => {
                    this.wrongQuesParams.push({
                      courseId: this.courseId,
                      questionId: o.id,
                      studentId: item.stuId,
                    });
                  });
                });
                console.log("wrongQuesParams", this.wrongQuesParams);
              });
            } else {
              this.wrongQuestions = this.wrongQuestions.filter(
                (o) => o.id !== record.id
              );
              this.wrongQuesParams = [];
              this.wrongQuestions.forEach((o) => {
                o.students.forEach((item) => {
                  this.wrongQuesParams.push({
                    courseId: this.courseId,
                    questionId: o.id,
                    studentId: item.stuId,
                  });
                });
              });
              console.log("wrongQuesParams", this.wrongQuesParams);
            }
          }
          if (this.showModal2) {
            if (this.selectedRowKeys.length === 0) return;
            getCommonWronQues({
              courseId: this.courseId,
              type: 1,
              ids: this.selectedRowKeys,
            }).then((res) => {
              this.commonWrongQues = res.extra;
              if (this.commonWrongQues.length === 0) {
                this.wrongQuesParams = [];
                this.selectedRowKeys.forEach((stuId) => {
                  this.wrongQuesParams.push({
                    courseId: this.courseId,
                    questionId: "",
                    studentId: stuId,
                  });
                });
              } else {
                this.wrongQuesParams = [];
                this.selectedRowKeys.forEach((stuId) => {
                  this.commonWrongQues.forEach(() => {
                    this.wrongQuesParams.push({
                      courseId: this.courseId,
                      questionId: "",
                      studentId: stuId,
                    });
                  });
                });
                console.log(22222, this.commonWrongQues);
              }
            });
          }
          if (this.showModal3) {
            if (selected) {
              this.ltScoreStudents.push(...record.ltScore.students);
              this.ltScoreStudents.push(...record.zeroScore.students);
              let obj = {};
              this.ltScoreStudents = this.ltScoreStudents.reduce(
                (sum, current) => {
                  if (!obj[current.stuId]) {
                    // 判断当前stuId是否已经在obj里面
                    obj[current.stuId] = true; // 则将当前stuId值设置true(可以是其他的)
                    sum.push(current); // 然后push进当前数组
                  }
                  return sum;
                },
                []
              );
              console.log("ltScoreStudents:", this.ltScoreStudents);
            } else {
              let aa = this.selectedRows
                .map((o) => o.ltScore.students)
                .concat(this.selectedRows.map((o) => o.zeroScore.students))
                .reduce((result, item) => {
                  return result.concat(Array.isArray(item) ? item.flat() : []);
                }, []);
              console.log("AA", aa);
              let arr = record.ltScore.students
                .map((o) => o.stuId)
                .concat(record.ltScore.students.map((o) => o.stuId));
              this.ltScoreStudents = aa.filter((o) => !arr.includes(o.stuId));
              let obj = {};
              this.ltScoreStudents = this.ltScoreStudents.reduce(
                (sum, current) => {
                  if (!obj[current.stuId]) {
                    // 判断当前age是否已经在arr3里面
                    obj[current.stuId] = true; // 则将当前age值设置true(可以是其他的)
                    sum.push(current); // 然后push进当前数组
                  }
                  return sum;
                },
                []
              );
              console.log("ltScoreStudents:", this.ltScoreStudents);
            }

            if (this.selectedRowKeys.length === 0) return;
            getCommonWronQues({
              courseId: this.courseId,
              type: 1,
              ids: this.ltScoreStudentsId,
            }).then((res) => {
              this.commonWrongQues = res.extra;
              this.wrongQuesParams = [];
              this.ltScoreStudentsId.forEach((stuId) => {
                this.commonWrongQues.forEach(() => {
                  this.wrongQuesParams.push({
                    courseId: this.courseId,
                    questionId: "",
                    studentId: stuId,
                  });
                });
              });
            });
          }
        },
        getCheckboxProps: (record) => ({
          props: {
            disabled:
              record.scoring >= 100 ||
              (this.showModal3 &&
                record.ltScore.scoring === 0 &&
                record.zeroScore.scoring === 0),
          },
        }),
      };
    },
    ltScoreStudentsId() {
      return this.ltScoreStudents.map((o) => o.stuId);
    },
  },
  watch: {
    module() {
      this.showModal1 = false;
      this.showModal2 = false;
      this.showModal3 = false;
      this.selectedRows = [];
      this.selectedRowKeys = [];
    },
    showModal1(value) {
      this.wrongQuestions = [];
      if (value) {
        // 按题统计
        courseStatisticsBytopic(this.courseId).then((res) => {
          this.tableData1 = res.extra;
        });
      }
    },
    showModal2(value) {
      if (value) {
        // 按人统计
        courseStatisticsByPersion(this.courseId).then((res) => {
          if (res.extra.length > 0 && res.extra[0].kls.length > 0) {
            this.customTitleList = res.extra[0].kls.map((o, j) => {
              return {
                slot: ["rate" + (j + 1)],
                title: `${
                  o.libType === 0 ? "素养" : o.libType === 1 ? "能力" : "知识点"
                } ${o.libNumber}`,
              };
            });
            let tr = res.extra[0].kls.map((o, j) => {
              return {
                dataIndex: "rate" + (j + 1),
                slots: { title: "rate" + (j + 1) },
                width: 100,
                scopedSlots: { customRender: "rate" + (j + 1) },
              };
            });
            this.personColumns = [...personColumns, ...tr];
            let data = [];
            for (let i = 0; i < res.extra.length; i++) {
              data.push(
                res.extra[i].kls.map((o, j) => {
                  return { ["rate" + (j + 1)]: o.scoringRate };
                })
              );
            }
            this.tableData2 = res.extra.map((o, i) => {
              let rates = data[i].reduce((acc, value) => {
                return { ...acc, ...value };
              });
              return { ...o, ...rates };
            });
          } else {
            this.tableData2 = res.extra;
          }
        });
      }
    },
    showModal3(value) {
      if (value) {
        // 按知识模块统计
        courseStatisticsByModule(this.courseId).then((res) => {
          this.tableData3 = res.extra;
        });
      }
    },
    tableData1: {
      handler: function () {
        this.selectedRows = [];
        this.selectedRowKeys = [];
      },
      deep: true,
    },
  },
  mounted() {},
  methods: {
    onChange(checkedValues) {
      if (this.showModal1) {
        this.wrongQuesParams = [];
        this.wrongQuestions.forEach((o, i) => {
          o.students.forEach((item) => {
            if (this.stuCheckedList[i].includes(item.stuId)) {
              this.wrongQuesParams.push({
                courseId: this.courseId,
                questionId: o.id,
                studentId: item.stuId,
              });
            }
          });
        });
      }
      if (this.showModal2) {
        this.wrongQuesParams = [];
        this.selectedRowKeys.forEach((stuId) => {
          this.commonWrongQues.forEach((o) => {
            this.wrongQuesParams.push({
              courseId: this.courseId,
              questionId: checkedValues.includes(o.questionId)
                ? o.questionId
                : "",
              studentId: stuId,
            });
          });
        });
        console.log(this.wrongQuesParams);
      }
      if (this.showModal3) {
        this.wrongQuesParams = [];
        this.ltScoreStudentsId.forEach((stuId) => {
          this.commonWrongQues.forEach((o) => {
            this.wrongQuesParams.push({
              courseId: this.courseId,
              questionId: checkedValues.includes(o.questionId)
                ? o.questionId
                : "",
              studentId: stuId,
            });
          });
        });
        console.log(this.wrongQuesParams);
      }
      console.log("checked = ", checkedValues);
    },
    // 个性化课程
    specialCourse(type) {
      if (this.showModal1 && this.selectedRows.length === 0) {
        this.$message.error("您还没有勾选试题！");
        return;
      }
      if (this.showModal1 && this.wrongQuesParams.length === 0) {
        this.$message.error("您还没有勾选学生！");
        return;
      }
      console.log(this.wrongQuesParams);
      if (this.showModal2 && this.selectedRows.length === 0) {
        this.$message.error("请先选择学生！");
        return;
      }
      createSpecialCourse({
        courseId: this.courseId,
        courseName: this.time,
        otherType: type,
        otherCQSMList: this.wrongQuesParams,
      }).then((res) => {
        if (res.extra) {
          this.showModal1 = false;
          this.showModal2 = false;
          this.showModal3 = false;
          this.$message.success("已创建个性化课程!");
          this.$router.push({
            path: "/course/created",
            query: {
              catalogId: this.$route.query.catalogId,
            },
          });
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
::v-deep .ant-modal-body {
  padding: 10px;
  background-color: #c5cce5;
}

.pubCourse {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.wrongBox {
  display: flex;
  justify-content: space-between;

  .left {
    width: 1090px;
    height: 784px;
    background-color: #fff;
    border-radius: 8px;

    .title {
      line-height: 36px;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      background-color: #636f9f;
      font-size: 16px;
      font-weight: 400;
      color: #fff;
      text-align: center;
    }
  }

  .right {
    width: 240px;
    height: 784px;
    border-radius: 8px;
    background-color: #e1e5f2;

    .title {
      line-height: 36px;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
      background-color: #fff;
      font-size: 16px;
      font-weight: 400;
      text-align: center;
    }

    .selectStu {
      width: 100%;
      padding: 10px;

      dl {
        margin-top: 10px;

        dt {
          margin-bottom: 10px;
          padding: 0 5px;
          background-color: #fff;
          line-height: 24px;
          border-radius: 4px;
        }
      }
    }
  }
}
.tag {
  width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
