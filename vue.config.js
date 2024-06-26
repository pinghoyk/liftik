module.exports = {
  lintOnSave: false, // Отключить ESLint во время сборки, если это необходимо
  chainWebpack: config => {
    config.module
      .rule('babel')
      .test(/\.js$/)
      .use('babel-loader')
      .loader('babel-loader')
      .tap(options => {
        return options;
      });
  }
};
