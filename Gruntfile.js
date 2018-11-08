module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    copy: {
      main: {
        files: [
          // includes files within path and its sub-directories
          {expand: true, src: ['src/**'], dest: 'dest/'},
          {expand: true, src: ['manifest.json'], dest: 'dest/'},
        ],
      },
    },
    bump: {
      options: {
        files: ['manifest.json'],
        updateConfigs: [],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['manifest.json'],
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: true,
        pushTo: 'origin',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
        globalReplace: false,
        prereleaseName: false,
        metadata: '',
        regExp: false
      }
    },
    compress: {
      main: {
        options: {
          archive: 'build.zip'
        },
        files: [
          {src: ['dest/**'], dest: '/'}, // includes files in path and its subdirs
        ]
      }
    }
    
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-contrib-compress');

  // Default task(s).
  grunt.registerTask('build', ['bump','copy','compress']);

};
