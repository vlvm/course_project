<template>
  <div class="box">
    <LoginBox name="密码登录">
      <a-input
        v-model.trim="phoneNumber"
        placeholder="请输入账号"
        size="large"
        style="margin-bottom: 20px"
      />
      <a-input-password
        v-model.trim="pwd"
        placeholder="请输入密码"
        size="large"
        style="margin-bottom: 20px"
      />
      <a-button
        type="primary"
        block
        size="large"
        style="margin-bottom: 20px"
        @click="loginIn"
        :loading="loading"
      >
        {{ loading ? "正在登陆" : "开始使用" }}
      </a-button>
      <!--      <div class="LoginLink">
        <router-link class="text" to="/register">注册</router-link>
        <router-link class="text" to="/retrieve">忘记密码</router-link>
      </div>-->
    </LoginBox>
    <div class="Record">
      <a href="http://beian.miit.gov.cn/" target="_blank">
        京ICP备18048907号-2
      </a>
      <a
        target="_blank"
        href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010502050355"
        style="
          display: inline-block;
          width: 250px;
          text-align: center;
          text-decoration: none;
          height: 20px;
          line-height: 20px;
        "
      >
        <img
          src="../../assets/img/ico.png"
          style="float: left"
          alt="京公网安备"
        />
        <span
          style="
            float: left;
            height: 20px;
            line-height: 20px;
            margin: 0 0 0 5px;
            color: #939393;
          "
        >
          京公网安备 11010502050355号
        </span>
      </a>
    </div>
  </div>
</template>

<script>
import { login } from "@/request/login";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Login",
  components: {
    LoginBox: () => import("@/views/login/components/LoginBox"),
  },
  data() {
    this.$store.commit("changeRole", 1);
    this.$store.commit("setCatalogueList", []);
    return {
      loading: false,
      phoneNumber: "",
      pwd: "",
    };
  },
  methods: {
    loginIn() {
      const regex = /^1[3456789]\d{9}$/;
      if (this.phoneNumber === "") {
        this.$message.warning("请输入手机号！");
        return;
      }
      if (!regex.test(this.phoneNumber)) {
        this.$message.warning("请输入正确的手机号！");
        return;
      }
      if (this.pwd === "") {
        this.$message.warning("请输入密码！");
        return;
      }
      this.loading = true;
      login({
        phoneNumber: this.phoneNumber,
        pwd: this.pwd,
      }).then((res) => {
        if (res.extra) {
          sessionStorage.setItem("course_userInfo", JSON.stringify(res.extra));
          this.loading = false;
          this.$message.success("登录成功");
          this.$router.push("/course/created");
        } else {
          this.loading = false;
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.box {
  position: fixed;
  left: 0;
  height: 100vh;
  width: 100vw;
  background: #333951 !important;
}

.LoginLink {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.LoginLink .text {
  font-weight: 800;
  color: #0033ff;
}
.Record {
  position: absolute;
  width: 100%;
  bottom: 15px;
  text-align: center;
  a {
    display: block;
    width: 100%;
    text-align: center;
    color: #bbbdc5;
  }
}
</style>
