const HtmlWebPackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Dotenv = require('dotenv-webpack');
const path = require('path');
require('dotenv').config()

const isDevelopment = process.env.NODE_ENV === "development"

const PORT = 3004;

const deps = require("./package.json").dependencies;
module.exports = {
  output: {
    publicPath: `http://localhost:${PORT}/`,
  },

  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".json", '.scss'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: './tsconfig.json'
      })
    ],
    alias: {
      react: path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
    }
  },

  devServer: {
    port: PORT,
    historyApiFallback: true,
    proxy: {
      '/data': {
        target: 'https://dev.cbi.cloudmaster.ru',
        changeOrigin: true
      },
    },
  },

  module: {
    rules: [
      {
        test: /\.m?js/,
        type: "javascript/auto",
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack', 'url-loader'],
      },
      {
        test: /\.(s?css)$/,
        oneOf: [
          {
            test: /\.module\.scss$/,
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: "css-loader",
                options: {
                  modules: {
                    localIdentName: '[local]_[hash:base64:8]',
                  },
                },
              },
              'sass-loader'
            ]
          },
          {
            use: [MiniCssExtractPlugin.loader, "css-loader", 'sass-loader']
          }
        ],
      },
    ],
  },
  optimization: {
    runtimeChunk: 'single'
  },

  plugins: [
    new Dotenv(),
    new ModuleFederationPlugin({
      name: "cm_mf_poc",
      filename: "remoteEntry.js",
      remotes: {},
      exposes: {},
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
      },
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
    }),
    new MiniCssExtractPlugin(),
  ],
};
