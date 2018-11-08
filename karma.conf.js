module.exports = function(config) {
  config.set({
    frameworks: ['jasmine',],
    browsers: ['ChromeHeadless'],
    files: [
      'src/js/provider/*.js',
      'src/js/model/language.js',
      'test/specs/**/*.js'
    ],
    reporters: ['progress'],
    port: 9876,
    singleRun: true,
    colors: true,
    logLevel: config.LOG_INFO,
    concurrency: Infinity
  })
}
