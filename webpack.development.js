const merge = require('webpack-merge');
const common = require('./webpack.common');

// use style-loader over mini-css-extract-plugin in development for HMR
// (necessary until mini-css-extract-plugin supports HMR)
common.module.rules[1].use.unshift({ loader: 'style-loader' });

// DEVELOPMENT
module.exports = merge.smart(common, {
  mode: 'development', // (https://developers.google.com/web/fundamentals/performance/webpack/decrease-frontend-size)

  devtool: 'inline-source-map', // (https://webpack.js.org/configuration/devtool/)

  devServer: {
    contentBase: './dist', // (https://stackoverflow.com/questions/49290082/setting-up-react-on-the-front-end-and-express-js-as-a-server-with-webpack-4)
    historyApiFallback: true, // more info (https://github.com/bripkens/connect-history-api-fallback)
    hot: true,
    host: '0.0.0.0',
    port: 8080,
    open: false,
    overlay: true,
  },

  optimization: { // options turned on by default per mode (https://medium.com/webpack/webpack-4-mode-and-optimization-5423a6bc597a)
    nodeEnv: 'development',
  },
});
