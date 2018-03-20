const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin')
const config = require('./src/config.json')
const path = require('path')
const webpack = require('webpack')
const pkg = require('./package.json')

const version = process.env.BUILD_VERSION || pkg.version
const build = process.env.BUILD_NUMBER || 'SNAPSHOT'
const branch = process.env.TRAVIS_BRANCH || 'development'

const isTournament = config.interface && config.interface.tournament
const defaultFavicon = isTournament ? 'assets/img/gnosis_apollo_favicon.png' : 'assets/img/gnosis_logo_favicon.png'
const faviconPath = config.interface && config.interface.faviconPath && isTournament ? config.interface.faviconPath : defaultFavicon

const isProductionEnv = branch.indexOf('release/') > -1
const isStagingEnv = branch === 'master'
let whitelist

if (isProductionEnv) {
  console.log('Using Production Whitelist')
  whitelist = config.productionWhitelist
} else if (isStagingEnv) {
  console.log('Using Staging Whitelist')
  whitelist = config.stagingWhitelist
} else {
  console.log('Using Development Whitelist')
  whitelist = config.developmentWhitelist
}

const gnosisDbUrl =
  process.env.GNOSISDB_URL ||
  `${config.gnosisdb.protocol}://${config.gnosisdb.hostProd}${config.gnosisdb.port ? `:${config.gnosisdb.port}` : ''}`

const ethereumUrl =
  process.env.ETHEREUM_URL ||
  `${config.ethereum.protocol}://${config.ethereum.hostProd}${config.ethereum.port ? `:${config.ethereum.port}` : ''}`

module.exports = {
  devtool: 'source-map',
  context: path.join(__dirname, 'src'),
  entry: ['bootstrap-loader', 'index.js'],
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
      { test: /\.(js|jsx)$/, exclude: /(node_modules)/, loader: 'babel-loader' },
      {
        test: /\.(jpe?g|png|svg)$/i,
        loader: 'file-loader?hash=sha512&digest=hex&name=img/[hash].[ext]',
      },
      {
        test: /\.(scss|css)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            {
              loader: 'postcss-loader',
            },
            { loader: 'sass-loader' },
          ],
        }),
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
  plugins: [
    new ExtractTextPlugin('styles.css'),
    new FaviconsWebpackPlugin({
      logo: faviconPath,
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
      NODE_ENV: 'production',
      GNOSISDB_URL: gnosisDbUrl,
      ETHEREUM_URL: ethereumUrl,
      WHITELIST: whitelist,
      INTERCOM_ID: undefined,
      RAVEN_ID: config.ravenPublicDSN,
      TRAVIS_BUILD_ID: undefined,
      TRAVIS_BRANCH: undefined,
    }),
    new UglifyJsWebpackPlugin({
      sourceMap: true,
      parallel: true,
      uglifyOptions: {
        compress: false,
      },
    }),
  ],
}
