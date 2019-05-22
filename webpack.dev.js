const {CheckerPlugin, TsConfigPathsPlugin} = require('awesome-typescript-loader')
const externals = require('webpack-node-externals')
const path = require('path')
module.exports = {
  entry: {
    app: path.resolve(__dirname, 'src/Server.ts')
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  target: 'node',
  externals: [externals()],
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: [
          path.resolve(__dirname, 'src')
        ],
        use: [
          'awesome-typescript-loader'
        ]
      }
    ]
  },
  // Currently we need to add '.ts' to the resolve.extensions array.
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.css'],
    modules: [
      'node_modules',
      path.resolve(__dirname, 'src')
    ],
  },
  context: path.resolve(__dirname, 'src'), // string (absolute path!)
  // Source maps support ('inline-source-map' also works)
  devtool: 'source-map',
  plugins: [
    new CheckerPlugin(),
    new TsConfigPathsPlugin('tsconfig.json')
  ]
}
