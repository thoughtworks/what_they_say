module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    browsers: ['ChromeHeadless'],
    files: [
      'src/js/model/*.js',
      'src/js/helper/*.js',
      'test/specs/*.js'
    ],
    reporters: ['progress', 'coverage'],
    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      'src/**/*.js': ['coverage'],
      'src/js/content.js': ['coverage'],
      'src/js/popup.js': ['coverage'],
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
