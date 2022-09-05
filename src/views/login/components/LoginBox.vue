<template>
  <div class="loginBox">
    <div class="name">新能源课程系统</div>
    <div class="box">
      <div class="inputBox">
        <div class="centerBox">
          <div>
            <div class="pageName">{{ name }}</div>
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginBox",
  props: {
    name: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped lang="less">
::v-deep .ant-input {
  background: #464f75;
  color: #ffffff;
  border: 0;
}

::v-deep svg path {
  fill: #abafb2;
}

.loginBox {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(38, 43, 64, 1);
  .name {
    margin-top: 80px;
    font-size: 60px;
    text-align: center;
    color: #fff;
  }
  .box {
    width: 660px;
    height: 460px;
    margin: 34px auto auto;
    border-radius: 20px;
    background-image: linear-gradient(to bottom right, #8f5ee3, #69e4fe);
    .inputBox {
      display: flex;
      justify-content: center;
      align-items: center;
      .centerBox {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 310px;
        height: 460px;
      }
      .pageName {
        margin-bottom: 25px;
        font-size: 20px;
        color: #fff;
        font-weight: 400;
      }
    }
  }
}
</style>
