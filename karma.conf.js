module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    browsers: ['ChromeHeadless'],
    files: [
      'src/js/model/*.js',
      'src/js/provider/*.js'
    ],
    reporters: ['progress'],
    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      'src/**/*.js': [],
      'src/js/content.js': [],
      'src/js/popup.js': [],
    },
    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    },
    port: 9876,
    singleRun: true,
    colors: true,
    logLevel: config.LOG_INFO,
    concurrency: Infinity
  })
}
