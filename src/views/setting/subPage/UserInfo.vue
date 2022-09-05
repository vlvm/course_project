<template>
  <div>
    <div class="title">个人信息</div>
    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item ref="name" label="姓名：" prop="name">
        <a-input
          style="width: 220px"
          v-model="form.name"
          placeholder="请填写姓名"
          @blur="
            () => {
              $refs.name.onFieldBlur();
            }
          "
        />
      </a-form-model-item>
      <a-form-model-item label="性别：" prop="sex">
        <a-select
          v-model="form.sex"
          placeholder="请选择性别"
          style="width: 120px"
        >
          <a-select-option :value="0"> 女</a-select-option>
          <a-select-option :value="1"> 男</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item ref="phone" label="电话：" prop="phone">
        <a-input
          style="width: 220px"
          v-model="form.phone"
          placeholder="请填写电话"
          disabled
          @blur="
            () => {
              $refs.phone.onFieldBlur();
            }
          "
        />
        <!--<a-button type="primary" style="margin-left: 10px">更换手机号</a-button>-->
      </a-form-model-item>
      <a-form-model-item ref="phone" label="邮箱">
        <a-input
          v-model="form.email"
          placeholder="请填写邮箱"
          style="width: 220px"
        />
      </a-form-model-item>
      <a-form-model-item label="地域：">
        <a-select
          v-model="form.address"
          placeholder="请选择地域"
          style="width: 220px"
        >
          <a-select-option value=""> 请选择地域 </a-select-option>
          <a-select-option
            v-for="o in regionList"
            :key="o.regionId"
            :value="o.regionId"
          >
            {{ o.regionName }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="学校：" prop="school">
        <a-select
          v-model="form.school"
          placeholder="请选择学校"
          style="width: 220px"
        >
          <a-select-option value=""> 请选择学校 </a-select-option>
          <a-select-option v-for="o in schoolList" :key="o.id" :value="o.id">
            {{ o.schoolName }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="学科：" prop="subjectId">
        <a-select
          v-model="form.subjectId"
          placeholder="请选择学科"
          style="width: 220px"
        >
          <a-select-option value=""> 请选择学科 </a-select-option>
          <a-select-option v-for="o in subjectList" :key="o.id" :value="o.id">
            {{ o.subjectName }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 14, offset: 2 }">
        <a-button type="primary" @click="onSubmit"> 保存设置</a-button>
        <!--        <a-button style="margin-left: 10px" @click="resetForm"> 重置</a-button>-->
      </a-form-model-item>
    </a-form-model>
    <div class="title" style="margin-top: 40px">个人账号</div>
    <a-form-model-item :wrapper-col="{ span: 14, offset: 2 }">
      <div style="width: 220px; margin-bottom: 10px">
        <!--<a-button type="primary" block @click="$router.push('/retrieve')">
          修改密码
        </a-button>-->
        <a-button type="primary" block @click="changePwd = true">
          修改密码
        </a-button>
      </div>
      <div style="width: 220px">
        <a-button type="danger" block @click="logout"> 退出登录</a-button>
      </div>
    </a-form-model-item>
    <a-modal
      title="修改密码"
      :visible="changePwd"
      @ok="changePwdFun"
      @cancel="changePwd = false"
    >
      <a-space direction="vertical">
        <div class="form-group">
          <div class="inputName">旧密码：</div>
          <a-input-password v-model.trim="oldPwd" placeholder="请输入旧密码">
            <a-icon
              slot="prefix"
              type="lock"
              style="color: rgba(0, 0, 0, 0.25)"
            />
          </a-input-password>
        </div>
        <div class="form-group">
          <div class="inputName">新密码：</div>
          <a-input-password v-model.trim="newPwd" placeholder="请输入新密码">
            <a-icon
              slot="prefix"
              type="lock"
              style="color: rgba(0, 0, 0, 0.25)"
            />
          </a-input-password>
        </div>
        <div class="form-group">
          <div class="inputName">确认密码：</div>
          <a-input-password
            v-model.trim="newPwdAgain"
            placeholder="请输入确认密码"
          >
            <a-icon
              slot="prefix"
              type="lock"
              style="color: rgba(0, 0, 0, 0.25)"
            />
          </a-input-password>
        </div>
      </a-space>
    </a-modal>
  </div>
</template>

<script>
import { logout } from "@/request/login";
import {
  getRegionList,
  getSchoolList,
  getSubjectList,
  setUserInfo,
  userChangePwd,
} from "@/request/setting/userInfo";
export default {
  name: "UserInfo",
  data() {
    return {
      labelCol: { span: 2 },
      wrapperCol: { span: 20 },
      other: "",
      form: {
        name: JSON.parse(sessionStorage.getItem("course_userInfo")).userName,
        sex: JSON.parse(sessionStorage.getItem("course_userInfo")).sex,
        phone: JSON.parse(sessionStorage.getItem("course_userInfo")).mobile,
        email: JSON.parse(sessionStorage.getItem("course_userInfo")).mail || "",
        address:
          JSON.parse(sessionStorage.getItem("course_userInfo")).regionCode ||
          "",
        school: "",
        subjectId:
          JSON.parse(sessionStorage.getItem("course_userInfo")).subjectId || "",
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入姓名！",
            trigger: "blur",
          },
          {
            min: 1,
            max: 15,
            message: "姓名应该为1-15个字！",
            trigger: "blur",
          },
        ],
        sex: {
          required: true,
          message: "请选择性别！",
          trigger: "change",
        },
        phone: {
          required: true,
          message: "请填写电话！",
          trigger: "blur",
        },
        school: {
          required: true,
          message: "请选择学校！",
          trigger: "change",
        },
        subjectId: {
          required: true,
          message: "请选择学科！",
          trigger: "change",
        },
      },
      // 地域数据
      regionList: [],
      // 学校数据
      schoolList: [],
      // 学科数据
      subjectList: [],
      changePwd: false,
      oldPwd: "",
      newPwd: "",
      newPwdAgain: "",
    };
  },
  mounted() {
    getRegionList().then((res) => {
      this.regionList = res.extra;
    });
    getSchoolList().then((res) => {
      this.schoolList = res.extra;
      let schoolName = JSON.parse(
        sessionStorage.getItem("course_userInfo")
      ).schoolName;
      if (schoolName === null) {
        this.form.school = "";
      } else {
        let schoolData = this.schoolList.find(
          (o) => o.schoolName === schoolName
        );
        this.form.school = schoolData.id;
      }
    });
    getSubjectList().then((res) => {
      this.subjectList = res.extra;
    });
  },
  methods: {
    onSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const { name, sex, phone, email, address, school, subjectId } =
            this.form;
          let province = this.regionList.find((o) => o.regionId === address);
          let subject = this.subjectList.find((o) => o.id === subjectId);
          let schoolData = this.schoolList.find((o) => o.id === school);
          setUserInfo({
            userName: name,
            sex: sex,
            phoneNumber: phone,
            mail: email === null ? "" : email,
            provinceCode: address,
            province: province.regionName,
            schoolId: school,
            schoolName: schoolData.schoolName,
            subjectId: subjectId,
            subjectCode: subject.subjectCode,
            subjectName: subject.subjectName,
          }).then((res) => {
            sessionStorage.setItem(
              "course_userInfo",
              JSON.stringify(res.extra)
            );
            this.$message.success("保存成功！");
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
    logout() {
      this.$store.commit("c/clearState");
      logout().then(() => {
        this.$router.push("/login");
      });
    },
    changePwdFun() {
      if (this.oldPwd === "") {
        this.$message.warning("请输入旧密码！");
        return;
      }
      if (this.newPwd === "") {
        this.$message.warning("请输入新密码！");
        return;
      }
      if (this.newPwdAgain === "") {
        this.$message.warning("请输入确认密码！");
        return;
      }
      if (this.newPwd !== this.newPwdAgain) {
        this.$message.warning("新密码两次输入的不一样！");
        return;
      }
      userChangePwd({
        phoneNumber: this.form.phone,
        oldPwd: this.oldPwd,
        newPwd: this.newPwd,
      }).then((res) => {
        if (res.extra) {
          this.changePwd = false;
          this.$message.success("修改成功！请重新登录");
          this.$store.commit("c/clearState");
          logout().then(() => {
            this.$router.push("/login");
          });
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
::v-deep .ant-form-item {
  margin-bottom: 15px;
}
::v-deep .ant-modal-body {
  display: flex;
  justify-content: center;
}
.title {
  margin-bottom: 20px;
  padding-left: 40px;
  font-size: 16px;
  color: #1e3779;
  line-height: 30px;
  background-color: #d6ddfa;
}
.form-group {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 40px;
  .inputName {
    text-align: right;
    display: inline-block;
    width: 100px;
  }
}
</style>
