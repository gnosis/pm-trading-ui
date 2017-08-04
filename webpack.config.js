const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

const path = require('path')
const webpack = require('webpack')
const pkg = require('./package.json')

const nodeEnv = process.env.NODE_ENV || 'development'
const version = process.env.BUILD_VERSION || pkg.version
const build = process.env.BUILD_NUMBER || 'SNAPSHOT'

const rpcUrl = process.env.ETHEREUM_HOST || 'http://localhost:8545'
const gnosisDbUrl = process.env.GNOSISDB_HOST || 'http://localhost:8000'

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: [
    'bootstrap-loader/extractStyles',
    'index.js',
  ],
  devtool: 'source-map',
  output: {
    path: `${__dirname}/dist`,
    filename: 'bundle.js',
  },
  resolve: {
    symlinks: false,
    modules: [
      `${__dirname}/src`,
      `${__dirname}/package.json`,
      'node_modules',
      `${__dirname}/../gnosis.js`,
      `${__dirname}/../gnosis.js/node_modules`,
    ] },
  module: {
    rules: [
      { test: /\.(js|jsx)$/, exclude: /(node_modules)/, use: 'babel-loader?babelrc=false&extends=' + path.join(__dirname, '/.babelrc') },
      {
        test: /\.(jpe?g|png)$/i,
        loader: 'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
      },
      { test: /\.(less|css)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            { loader: 'postcss-loader',
              options: {
                plugins: loader => [
                  require('autoprefixer')(),
                ],
              },
            },
            { loader: 'less-loader', options: { strictMath: true } },
          ],
        }),
      },
      {
        test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        loader: 'file-loader?name=fonts/[name].[ext]',
      }
    ],
  },
  devServer: {
    disableHostCheck: true,
    contentBase: false,
    port: 5000,
    proxy: {
      '/api': {
        target: gnosisDbUrl,
        secure: false,
      }
    },
  },
  plugins: [
    new ExtractTextPlugin('styles.css'),
    /* new FaviconsWebpackPlugin({
      logo: 'assets/Logo.png',
    // Generate a cache file with control hashes and
    // don't rebuild the favicons until those hashes change
      persistentCache: true,
      icons: {
        android: false,
        appleIcon: false,
        appleStartup: false,
        coast: false,
        favicons: true,
        firefox: false,
        opengraph: false,
        twitter: false,
        yandex: false,
        windows: false,
      },
    }), */
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/html/index.html'),
    }),
    new webpack.DefinePlugin({
      __VERSION__: JSON.stringify(`${version}#${build}`),
      __ENV__: JSON.stringify(nodeEnv),
      __ETHEREUM_HOST__: JSON.stringify(rpcUrl),
    }),
  ],
}
