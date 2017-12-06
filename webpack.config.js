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
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel'
      }
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },

  devtool: 'eval-source-map'
};