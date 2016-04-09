var path = require("path");
var webpack = require('webpack');
module.exports = function (grunt) {
	grunt.initConfig({
		webpack: {
			build: {
				entry: {
					app: './entry.js',
					vendor: ["lodash","angular","angular-cookies","angular-simple-logger","angular-google-maps"]
				},
				output: {
					path: 'src/web/dist/',
					filename: "[name].bundle.js",
				},
				resolve: {
					root: [path.join(__dirname, "bower_components")]
				},
				plugins: [
				new webpack.HotModuleReplacementPlugin()
				,
				new webpack.ResolverPlugin(
					new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin(".bower.json", ["main"])
					)
				]
			},
		},
		watch: {
			css: {
				files: ['src/web/less/*.*'],
				tasks: ['webpack']
			},
			js: {
				files: ['src/web/app/**/*.js','src/web/commonn/**/*.js','src/web/app/*.js'],
				tasks: ['webpack']
			}
		}
	});
	grunt.loadNpmTasks('grunt-webpack');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default', ['webpack','watch']);
};
