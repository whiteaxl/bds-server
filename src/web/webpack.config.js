var path = require("path");
var webpack = require('webpack');
module.exports = {
  entry: './entry.js',
  output: {
    path: 'srcdist/',
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style!css' },
    ],
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
};
