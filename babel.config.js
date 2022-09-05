// 项目在发布时需要用到的 babel 插件数组
const proPlugins = [];
// 如果当前是development开发环境或者是production生产环境，则使用去掉 console 的插件
if (process.env.NODE_ENV === "production") {
  proPlugins.push("transform-remove-console");
}
module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins: [
    [
      "import",
      { libraryName: "ant-design-vue", libraryDirectory: "es", style: "css" },
    ],
    ...proPlugins,
  ],
};
