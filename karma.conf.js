module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    browsers: ['ChromeHeadless'],
    files: [
      'src/js/model/*.js',
      'src/js/helper/*.js',
      'test/specs/*.js'
    ],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    concurrency: Infinity
  })
}
