// vue.config.js
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin");

module.exports = {
  filenameHashing: false,
  publicPath: "./",
  chainWebpack: config => {
    config.optimization.delete("splitChunks");
    config.module
      .rule("images")
      .use("url-loader")
      .tap(options => Object.assign({}, options, { name: "[name].[ext]" }));
  },
  css: {
    extract: {
      filename: "[name].css",
      chunkFilename: "[name].css"
    }
  },
  configureWebpack: {
    plugins: [      
      /*
      new HtmlWebpackPlugin({
        template: 'public/index.html',
        filename: 'index.html',
        inlineSource: '.(js|css)$',
        chunks: ['calcxactive'],
      }),
      new HtmlWebpackInlineSourcePlugin(), */
    ],
    output: {
      filename: "[name].js",
      chunkFilename: "[name].js"
    }
  },
  pages: {
    calcxactive: {
      entry: "src/main.js",
      template: "public/index.html",
      filename: "index.html",
      chunks: ["calcxactive"]
    }
  }
};
