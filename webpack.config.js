/**
 * Created by coin on 20/12/2016.
 */

const path = require('path')

module.exports = {

  entry: {
    app: './__tests__/example'
  },

  cache: true,

  output: {
    path: path.join(process.cwd(), '__tests__/dist'),
    publicPath: '',
    filename: '[name].js',
    sourceMapFilename: '[name].map'
  },

  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: { presets: ['es2015', 'stage-0'] }
      }
    ]
  },

  devtool: 'eval-source-map'
};