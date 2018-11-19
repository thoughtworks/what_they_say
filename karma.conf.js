module.exports = function(config) {
  config.set({
    frameworks: ['jasmine',],
    browsers: ['ChromeHeadless'],
    files: [
      'src/js/provider/*.js',
      'src/js/model/*.js',
      'src/js/presenter/*.js',
      'test/specs/**/*.js'
    ],
    reporters: ['progress'],
    port: 9876,
    singleRun: true,
    colors: true,
    logLevel: config.LOG_INFO,
    concurrency: Infinity
  })
  //TODO FIND SOME COVERAGE THAT SUPORT EC6
}
