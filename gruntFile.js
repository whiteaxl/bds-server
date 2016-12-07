var path = require("path");
var webpack = require('webpack');
module.exports = function (grunt) {
	grunt.initConfig({
		webpack: {
			build: {
				entry: {
					app: './entry.js',
					rewaylib: ["placeUtil","DanhMuc"],
					vendor: ["lodash","jquery","angular","angular-cookies","angular-simple-logger","angular-google-maps","angular-ui-router","angular-bootstrap","ngstorage","angular-messages","ng-file-upload","angular-socket-io","postal.js","angular-animate","angular-jwt","DateJS","mobile-detect","ngInfiniteScroll", "ng-dialog"]
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
				],
				module: {
				  loaders: [
				    {
				      test: /\.js$/,
				      exclude: /(node_modules|bower_components)/,
				      loader: 'babel', // 'babel-loader' is also a legal name to reference
				      query: {
				        // presets: ['es5']
				      }
				    }
				  ]
				}
			},
		},
		watch: {
			css: {
				files: ['src/web/**/*.css'],
				tasks: ['webpack']
			},
			js: {
				files: ['src/web/app/**/*.js','src/web/common/**/*.js','src/web/app/*.js'],
				tasks: ['webpack']
			}
		}
	});
	grunt.loadNpmTasks('grunt-webpack');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.registerTask('default', ['webpack','watch']);
};
