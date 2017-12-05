module.exports = function() {
  return {
    module: {
      rules: [
        {
          test: /\.scss$/,
          include: paths,
          use: ["style-loader", "css-loader", "sass-loader"]
        }
      ]
    }
  };
};
