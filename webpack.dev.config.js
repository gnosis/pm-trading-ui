const HtmlWebpackPlugin = require('html-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

const path = require('path')
const webpack = require('webpack')
const pkg = require('./package.json')

const version = process.env.BUILD_VERSION || pkg.version
const build = process.env.BUILD_NUMBER || 'SNAPSHOT'

const config = require('./src/config.json')

const whitelist = config.developmentWhitelist

const gnosisDbUrl =
  process.env.GNOSISDB_URL ||
  `${config.gnosisdb.protocol}://${config.gnosisdb.host}${config.gnosisdb.port ? `:${config.gnosisdb.port}` : ''}`

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: ['react-hot-loader/patch', 'bootstrap-loader', 'index.js'],
  devtool: 'eval-source-map',
  output: {
    publicPath: '/',
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
    ],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        use: 'babel-loader',
      },
      {
        test: /\.(jpe?g|png|svg)$/i,
        loader: 'file-loader?hash=sha512&digest=hex&name=img/[hash].[ext]',
      },
      {
        test: /\.(less|css)$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
            },
          },
          { loader: 'less-loader', options: { strictMath: true } },
        ],
      },
      {
        test: /\.(ttf|otf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
        loader: 'file-loader?name=fonts/[name].[ext]',
      },
    ],
  },
  devServer: {
    disableHostCheck: true,
    historyApiFallback: true,
    port: 5000,
    proxy: {
      '/api': {
        target: gnosisDbUrl,
        secure: false,
      },
    },
    watchOptions: {
      ignored: /node_modules/,
    },
  },
  plugins: [
    new FaviconsWebpackPlugin({
      logo: 'assets/img/olympia_logo_favicon.png',
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
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/html/index.html'),
    }),
    new webpack.EnvironmentPlugin({
      VERSION: `${version}#${build}`,
      NODE_ENV: 'development',
      GNOSISDB_URL: `${config.gnosisdb.protocol}://${config.gnosisdb.host}${config.gnosisdb.port
        ? `:${config.gnosisdb.port}`
        : ''}`,
      ETHEREUM_URL: `${config.ethereum.protocol}://${config.ethereum.host}${config.ethereum.port
        ? `:${config.ethereum.port}`
        : ''}`,
      WHITELIST: whitelist,
      INTERCOM_ID: undefined,
    }),
  ],
}
