<template>
  <!--课程内容筛选-->
  <a-modal
    v-model="showModal"
    :maskClosable="false"
    title="课程筛选"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-space direction="vertical" :size="10" style="width: 100%">
      <div class="group">
        <a-divider> 文字 </a-divider>
        <a-checkbox
          :checked="filter.courseText"
          @change="onChange($event, 'courseText')"
        >
          文字
        </a-checkbox>
        <a-checkbox :checked="filter.point" @change="onChange($event, 'point')">
          重点
        </a-checkbox>
      </div>
      <div>
        <div class="group">
          <a-divider> 文件 </a-divider>
        </div>
        <a-row>
          <a-col :span="4">
            <a-checkbox
              :checked="filter.word"
              @change="onChange($event, 'word')"
            >
              word
            </a-checkbox>
          </a-col>
          <a-col :span="4">
            <a-checkbox :checked="filter.ppt" @change="onChange($event, 'ppt')">
              ppt
            </a-checkbox>
          </a-col>
          <a-col :span="4">
            <a-checkbox :checked="filter.pdf" @change="onChange($event, 'pdf')">
              pdf
            </a-checkbox>
          </a-col>
          <a-col :span="4">
            <a-checkbox
              :checked="filter.sounds"
              @change="onChange($event, 'sounds')"
            >
              音频
            </a-checkbox>
          </a-col>
          <a-col :span="4">
            <a-checkbox
              :checked="filter.video"
              @change="onChange($event, 'video')"
            >
              视频
            </a-checkbox>
          </a-col>
          <a-col :span="4">
            <a-checkbox
              :checked="filter.handle"
              @change="onChange($event, 'handle')"
            >
              必办
            </a-checkbox>
          </a-col>
        </a-row>
      </div>
      <div>
        <div class="group">
          <a-divider> 题 </a-divider>
        </div>
        <a-row>
          <a-col :span="4">
            <a-checkbox
              :checked="filter.single"
              @change="onChange($event, 'single')"
            >
              单选
            </a-checkbox>
          </a-col>
          <a-col :span="4">
            <a-checkbox
              :checked="filter.multiSelect"
              @change="onChange($event, 'multiSelect')"
            >
              不定项
            </a-checkbox>
          </a-col>
          <a-col :span="4">
            <a-checkbox
              :checked="filter.filling"
              @change="onChange($event, 'filling')"
            >
              填空
            </a-checkbox>
          </a-col>
          <a-col :span="4">
            <a-checkbox
              :checked="filter.shortAnswer"
              @change="onChange($event, 'shortAnswer')"
            >
              简答
            </a-checkbox>
          </a-col>
          <a-col :span="4">
            <a-checkbox
              :checked="filter.mustDoing"
              @change="onChange($event, 'mustDoing')"
            >
              必做
            </a-checkbox>
          </a-col>
        </a-row>
      </div>
    </a-space>
  </a-modal>
</template>

<script>
export default {
  name: "CourseFilterModal",
  data() {
    return {
      showModal: false,
      filter: {
        courseText: false,
        point: false,
        word: false,
        ppt: false,
        pdf: false,
        sounds: false,
        video: false,
        handle: false,
        single: false,
        multiSelect: false,
        filling: false,
        shortAnswer: false,
        mustDoing: false,
      },
    };
  },
  methods: {
    onChange(e, name) {
      this.filter[name] = e.target.checked;
    },
    handleOk() {
      this.$emit("contentFilter", this.filter);
      this.showModal = false;
    },
    handleCancel() {
      for (let key in this.filter) {
        this.filter[key] = false;
      }
      this.$emit("contentFilter", this.filter);
      this.showModal = false;
    },
  },
};
</script>

<style scoped></style>
