module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		browserify: {
			'public/js/app.bundle.js': ['src/app.js']
		},
		watch: {
			css: {
				files: [
					'scss/*.scss'
				],
				tasks: [
					'sass'
				]
			},
			files: [
				'src/*.js',
				'src/**/*.js',
			],
			tasks: [
				'browserify',
			]
		},
		sass: {
			options: {
				sourceMap: true
			},
			dist: {
				files: {
					'public/css/app.css': 'scss/app.scss'
				}
			}
		}
	});


	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default', ['watch']);
}