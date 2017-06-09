module.exports = function(grunt) {
  // 1. All configuration goes here
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      dist: {
        src: [
          'src/discount-air-jordans.js'
        ],
        dest: 'public/src/build.js'
      }
    },

    uglify: {
      build: {
        src: 'public/src/build.js',
        dest: 'public/src/build.js'
      }
    },

    sass: {
      dist: {
        options: {
          style: 'compressed'
        },
        files: {
          'public/res/styles.css': 'res/styles.scss'
        }
      }
    },

    watch: {
      files: ['src/*.js', 'res/*.scss'],
      tasks: ['concat', 'sass'],
      options: {
        spawn: false
      }
    }
  });

  // 3. Where we tell Grunt we plan to use this plug-in.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
  grunt.registerTask('default', ['concat', 'uglify', 'sass']);
  grunt.registerTask('dev', ['concat', 'sass', 'watch']);

};
