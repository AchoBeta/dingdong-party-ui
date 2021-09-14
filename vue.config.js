module.exports = {
  publicPath: "./",
  devServer: {
    proxy: {
      "/api": {
        target: "https://api.dingdongtongxue.com/dingdong-party",
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
};
