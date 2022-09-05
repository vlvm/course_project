<template>
  <div>
    <!--    <div>
      <button @click="printEditorHtml">打印 html</button>
      <button @click="getEditorText">打印纯文本</button>
    </div>-->
    <div style="border: 1px solid #ccc; margin-top: 10px">
      <!-- 工具栏 -->
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editor"
        mode="simple"
        :defaultConfig="toolbarConfig"
        v-if="showToolbar"
      />
      <!-- 编辑器 -->
      <Editor
        :style="{ height: height + 'px' }"
        :defaultConfig="editorConfig"
        :mode="showToolbar ? 'simple' : 'default'"
        v-model="html"
        @onChange="onChange"
        @onCreated="onCreated"
      />
    </div>
  </div>
</template>

<script>
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { upload } from "@/request/course/created/course";
export default {
  name: "MyEditor",
  props: {
    // 编辑器高度
    height: {
      type: Number,
      default: 300,
    },
    // 编辑器是否显示编辑菜单
    showToolbar: {
      type: Boolean,
      default: () => true,
    },
    // 编辑器显示的默认内容
    defaultHtml: {
      type: String,
    },
    // 编辑器是否只读
    isReadOnly: {
      type: Boolean,
      default: () => false,
    },
  },
  components: { Editor, Toolbar },
  data() {
    const _this = this;
    return {
      editor: null,
      html: this.defaultHtml ? this.defaultHtml : "",
      text: "",
      // 工具栏配置
      toolbarConfig: {
        // 显示哪些菜单，如何排序、分组
        // toolbarKeys: [],
        // 隐藏哪些菜单
        excludeKeys: [
          "numberedList",
          "todo",
          "blockquote",
          "emotion",
          "group-video",
          "insertVideo",
          "uploadVideo",
          "insertTable",
          "undo",
          "redo",
          "fullScreen",
        ],
      },
      // 编辑器配置
      editorConfig: {
        // 是否只读
        readOnly: _this.isReadOnly,
        // readOnly: true,
        // 默认显示内容
        placeholder: "请输入内容...",
        // maxLength: 5000,
        // autoFocus: false,
        // 所有的菜单配置，都要在 MENU_CONF 属性下
        MENU_CONF: {
          // 配置上传图片
          uploadImage: {
            /* // server: "/exam/api/atta/upload", // 上传图片地址
            // server: "http://106.12.198.214:3000/api/upload-img", // 上传图片地址
            timeout: 5 * 1000, // 5s
            fieldName: "uploadFile",
            meta: {
              token: "xxx",
              a: 100,
            },
            metaWithUrl: true, // 参数拼接到 url 上
            headers: {
              Accept: "text/x-json",
            },
            maxFileSize: 10 * 1024 * 1024, // 10M
            base64LimitSize: 5 * 1024, // 5kb 以下插入 base64
            */

            // onBeforeUpload(files) {
            //   console.log("onBeforeUpload", files);
            //   return files; // 返回哪些文件可以上传
            //   // return false 会阻止上传
            // },
            // onProgress(progress) {
            //   console.log("onProgress", progress);
            // },
            // onSuccess(file, res) {
            //   console.log("onSuccess", file, res);
            // },
            // onFailed(file, res) {
            //   alert(res.message);
            //   console.log("onFailed", file, res);
            // },
            // onError(file, err, res) {
            //   alert(err.message);
            //   console.error("onError", file, err, res);
            // },

            // // 用户自定义插入图片
            // customInsert(res, insertFn) {
            //   console.log('customInsert', res)
            //   const imgInfo = res.data[0] || {}
            //   const { url, alt, href } = imgInfo
            //   if (!url) throw new Error(`Image url is empty`)

            //   // 自己插入图片
            //   console.log('自己插入图片', url)
            //   insertFn(url, alt, href)
            // },

            // 自定义上传图片
            async customUpload(file, insertFn) {
              // console.log("customUpload", file);
              upload({ uploadFile: file }).then((result) => {
                const { attachmentLinkAddress, attachmentName } = result.extra;
                // 最后插入图片
                insertFn(
                  `/exam${attachmentLinkAddress}`,
                  attachmentName,
                  `/exam${attachmentLinkAddress}`
                );
              });
            },

            // // 自定义选择图片（如图床）
            // customBrowseAndUpload(insertFn) {
            //   // 插入一张图片，模拟异步
            //   setTimeout(() => {
            //     const src = 'https://www.baidu.com/img/flexible/logo/pc/result@2.png'
            //     insertFn(src, '百度 logo', src) // 插入图片
            //   }, 500)
            // },
          },
        },
      },
    };
  },
  methods: {
    onCreated(editor) {
      // 【注意】一定要用 Object.seal() 否则会报错
      this.editor = Object.seal(editor);
    },
    // onChange 时获取编辑器最新内容
    onChange(editor) {
      // console.log("onChange", editor.getHtml());
      this.text = editor.getText();
    },
    // 清空编辑器内容
    clear() {
      this.editor.clear();
    },
    // 设置Html
    setHtml(html) {
      this.html = html;
    },
    getEditorText() {
      const editor = this.editor;
      if (editor == null) return;
      console.log(editor.getText()); // 执行 editor API
    },
    printEditorHtml() {
      const editor = this.editor;
      if (editor == null) return;
      console.log(editor.getHtml()); // 执行 editor API
    },
  },
  mounted() {
    // 模拟 ajax 请求，异步渲染编辑器
    /*setTimeout(() => {
      this.html = "<p>Ajax 异步设置内容 HTML</p>";
    }, 1500);*/
  },
  beforeDestroy() {
    const editor = this.editor;
    if (editor == null) return;
    editor.destroy(); // 组件销毁时，及时销毁 editor ，重要！！！
  },
};
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
<style scoped>
::v-deep .w-e-text-container {
  background-color: #f6f5fa;
}
</style>
