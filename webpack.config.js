// const path = require("path");
// const HtmlWebpackPlugin = require("html-webpack-plugin");
// const merge = require("webpack-merge");
// const devServer = require("./webpack/devserver");
// const sass = require("./webpack/sass");

// const common = {
//   entry: __dirname + "/app/js/main.js",
//   output: {
//     path: __dirname + "/dist/js",
//     filename: "main.min.js"
//   }
// };

// module.exports = function(env) {
//   if (env === "production") {
//     return common;
//   }
//   if (env === "development") {
//     return merge([common, devServer(), sass()]);
//   }
// };

module.exports = {
  watch: true,
  entry: "./app/js/main.js",
  output: {
    filename: "[name].min.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  }
};
