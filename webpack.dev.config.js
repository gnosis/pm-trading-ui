const HtmlWebpackPlugin = require('html-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')

const path = require('path')
const webpack = require('webpack')
const pkg = require('./package.json')

const version = process.env.BUILD_VERSION || pkg.version
const build = process.env.BUILD_NUMBER || 'SNAPSHOT'

const config = require('./src/config.json')

const whitelist = config.developmentWhitelist

const gnosisDbUrl =
  process.env.GNOSISDB_URL ||
  `${config.gnosisdb.protocol}://${config.gnosisdb.hostDev}${config.gnosisdb.port ? `:${config.gnosisdb.port}` : ''}`

const ethereumUrl =
  process.env.ETHEREUM_URL ||
  `${config.ethereum.protocol}://${config.ethereum.hostDev}${config.ethereum.port ? `:${config.ethereum.port}` : ''}`

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: ['bootstrap-loader', 'index.js'],
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
      // TODO: Remove this special rule for css-modules when all globally scoped CSS is removed
      // change the RegEx to: `/*.(scss|css)$/`
      {
        test: /\.mod\.(scss|css)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: true,
              localIdentName: '[name]__[local]___[hash:base64:5]',
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
            },
          },
          { loader: 'sass-loader', options: { sourceMap: true } },
        ],
      },
      {
        test: /^((?!\.mod).)*\.(css|scss)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: { sourceMap: true, includePaths: [path.resolve(__dirname, './src')] },
          },
        ],
      },
      {
        test: /\.(ttf|otf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
        loader: 'file-loader?name=fonts/[name].[ext]',
      },
      {
        test: /\.txt$/,
        use: 'raw-loader',
      },
    ],
  },
  devServer: {
    disableHostCheck: true,
    historyApiFallback: true,
    hot: true,
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
    new CaseSensitivePathsPlugin(),
    new FaviconsWebpackPlugin({
      logo: 'assets/img/gnosis_logo_favicon.png',
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
      inject: true,
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/html/index.html'),
    }),
    new webpack.EnvironmentPlugin({
      VERSION: `${version}#${build}`,
      NODE_ENV: 'development',
      GNOSISDB_URL: gnosisDbUrl,
      ETHEREUM_URL: ethereumUrl,
      WHITELIST: whitelist,
      INTERCOM_ID: null,
      RAVEN_ID: null,
      TRAVIS_BUILD_ID: null,
      TRAVIS_BRANCH: null,
    }),
  ],
}
