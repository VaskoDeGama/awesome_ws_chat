const path = require('path')
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  stats: "minimal",
  entry: {
    client: path.resolve(__dirname, 'src', 'client')
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: 'bundle.[hash].js',
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public", "index.html")
    })
  ]
};