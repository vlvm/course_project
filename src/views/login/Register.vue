<template>
  <div>
    <LoginBox name="手机号注册">
      <a-input
        v-model.trim.number="phoneNumber"
        placeholder="请输入手机号"
        size="large"
        style="margin-bottom: 20px"
      />
      <a-input-search
        v-model="code"
        placeholder="请输入验证码"
        size="large"
        style="margin-bottom: 20px"
        @search="validateBtn"
      >
        <a-button slot="enterButton" type="primary" :disabled="disabled">
          {{ btnTitle }}
        </a-button>
      </a-input-search>
      <a-input-password
        v-model="pwd"
        placeholder="请输入密码"
        size="large"
        style="margin-bottom: 20px"
      />
      <a-button type="primary" block size="large" @click="handleregister">
        注册
      </a-button>
    </LoginBox>
  </div>
</template>

<script>
import { getVerificationCode, register } from "@/request/login";
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Register",
  components: {
    LoginBox: () => import("@/views/login/components/LoginBox"),
  },
  data() {
    return {
      phoneNumber: "",
      pwd: "",
      code: "",
      disabled: false,
      btnTitle: "获取验证码",
    };
  },
  methods: {
    validateBtn() {
      if (!this.phoneNumber) {
        this.$message.warning("请填写手机号");
        return false;
      } else if (!/^1[345678]\d{9}$/.test(this.phoneNumber)) {
        this.$message.warning("请输入正确是手机号");
        return false;
      }
      //倒计时
      let time = 60;
      let timer = setInterval(() => {
        if (time === 0) {
          clearInterval(timer);
          this.disabled = false;
          this.btnTitle = "获取验证码";
        } else {
          this.btnTitle = time + "秒后重试";
          this.disabled = true;
          time--;
        }
      }, 1000);
      getVerificationCode({
        mobile: this.phoneNumber,
      }).then((res) => {
        console.log(res);
      });
    },
    handleregister() {
      if (!this.phoneNumber) {
        this.$message.warning("请填写手机号");
        return false;
      }
      if (!/^1[345678]\d{9}$/.test(this.phoneNumber)) {
        this.$message.warning("请输入正确是手机号");
        return false;
      }
      if (this.code.length === 0) {
        this.$message.warning("请输入验证码");
        return false;
      }
      if (this.pwd.length === 0) {
        this.$message.warning("请输入密码");
        return false;
      }
      register({
        phoneNumber: this.phoneNumber,
        pwd: this.pwd,
        code: this.code,
      }).then((res) => {
        if (res.extra) {
          this.$message.success("注册成功，请登录！");
          this.$router.push("/login");
        }
      });
    },
  },
};
</script>

<style scoped></style>
