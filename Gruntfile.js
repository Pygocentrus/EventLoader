'use strict';
var SERVER_PORT = 9000;

module.exports = function(grunt) {

  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    connect: {
      all: {
        port: SERVER_PORT,
        base: 'app',
        livereload: true
      }
    },

    open: {
      all: {
        path: 'http://localhost:'+SERVER_PORT
      }
    },

    concat: {
      dist: {
        src: [
          '*.js'
        ],
        dest: 'eventLoader.js',
      }
    },

    uglify: {
      build: {
        src: 'eventLoader.js',
        dest: 'eventLoader.min.js'
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-connect');
  grunt.loadNpmTasks('grunt-open');

  //Concat & min
  grunt.registerTask('default', ['uglify']);

};
