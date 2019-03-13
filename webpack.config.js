const MODE = 'development';

module.exports = {
  entry: {
    main: './src/index.ts'
  },
  mode: MODE,
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
      }
    ]
  },
  resolve: {
    extensions: [
      '.ts'
    ],
  },
  output: {
    filename: '[name].bundle.js',
    path: `${__dirname}/dist`
  }
}