module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    browsers: ['ChromeHeadless'],
    files: [
      'test/*.js',
    //   'content.js',
    //   'popup.js'
    ],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    concurrency: Infinity
  })
}
