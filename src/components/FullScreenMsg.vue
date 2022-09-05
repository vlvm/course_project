<template>
  <div class="full-box">
    <div class="title">
      <div class="left-box f-18">提问内容</div>
      <div class="right-box txt-r f-24">
        <a-icon type="close-circle" @click="chose()" />
      </div>
    </div>
    <div class="content-box">
      <div class="left-box">
        <textarea
          placeholder="请输入提问内容(最大可输入1000字)"
          class="textarea"
          v-model="message"
          :maxLength="1000"
          allow-clear
        ></textarea>
      </div>
      <div class="right-box">
        <a-button type="primary" size="large" class="btn" @click="sendMsg">
          发送
        </a-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      message: "",
    };
  },
  methods: {
    chose() {
      this.$parent.outFullInput(this.message);
    },
    sendMsg() {
      if (this.message == "") {
        this.$message.warning("请输入要提问的问题内容");
        return;
      }
      this.$parent.FullInputSendMsg(this.message);
    },
    cheanMsg() {
      this.message = "";
    },
  },
};
</script>
<style scoped lang="less">
textarea.ant-input {
  height: 600px !important;
}
.full-box .content-box .left-box textarea {
  height: 600px !important;
  line-height: 1.8 !important;
  font-size: 14px;
  width: 100%;
  border-radius: 5px;
  border: 1px solid #ccc;
  padding: 10px 20px;
  outline-color: rgb(216, 215, 255);
}

.txt-r {
  text-align: right;
}
.f-18 {
  font-size: 18px;
}
.f-24 {
  font-size: 24px;
}
.full-box {
  background: #fff;
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 999;
  .title {
    padding: 0 30px;
    height: 50px;
    line-height: 50px;
    .left-box,
    .right-box {
      width: 50%;
      float: left;
    }
  }
  .content-box {
    padding: 0 30px;
    height: 600px;
    margin-top: 10px;
    .left-box {
      width: calc(100% - 150px);
      float: left;
      .textarea {
        height: 600px;
      }
    }
    .right-box {
      width: 150px;
      float: left;
      text-align: center;
      .btn {
        width: 100px;
        background: #86ed56;
        color: #000;
        border: 1px #86ed56 solid;
      }
    }
  }
}
</style>
