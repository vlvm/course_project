const { defineConfig } = require("@vue/cli-service");
const webpack = require("webpack");

module.exports = defineConfig({
  publicPath: "./",
  // 设置端口
  devServer: {
    port: 8010,
    https: true,
    proxy: {
      //这个是配跨域需要的
      "/exam": {
        // target: "http://8.142.35.235:8888/", //跨域到的目标服务器
        target: "https://xnykcxt.com/", //跨域到的目标服务器
        // target: "https://bdfz.xnykcxt.com:5002/", //跨域到的目标服务器
        changeOrigin: true, //跨域代理开启
        // ws: true,//是否启用websocket
        pathRewrite: {
          "^/exam": "/exam",
        },
      },
    },
  },
  chainWebpack: (config) => {
    // 移除 prefetch 插件
    config.plugins.delete("prefetch");
  },
  transpileDependencies: true,
  // 去掉map文件
  productionSourceMap: false,
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            "primary-color": "#3662EC",
            "link-color": "#24469F",
            "text-color": "#000",
          },
          javascriptEnabled: true,
        },
      },
    },
  },
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "windows.jQuery": "jquery",
      }),
    ],
  },
});
