const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new CopyWebpackPlugin([{ from: "./src/index.html", to: "index.html" }]),
  ],
  mode: "none",
  node: {
    net: 'empty',
    tls: 'empty',
    dns: 'empty'
  },
  
  externals:[{
    xmlhttprequest: '{XMLHttpRequest:XMLHttpRequest}'
}],
  devServer: { contentBase: path.join(__dirname, "dist"), compress: true },
};
