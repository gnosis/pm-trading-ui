const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const UglifyJsWebpackPlugin = require('uglifyjs-webpack-plugin')

const path = require('path')
const webpack = require('webpack')
const pkg = require('./package.json')

const configLoader = require('./configuration')

const version = process.env.BUILD_VERSION || pkg.version
const build = process.env.BUILD_NUMBER || 'SNAPSHOT'

module.exports = (env) => {
  const configEnvVars = env.GNOSIS_CONFIG || {}
  const interfaceEnvVars = env.GNOSIS_INTERFACE || {}

  const { config, interfaceConfig } = configLoader(process.env.GNOSIS_ENV || 'development', configEnvVars, interfaceEnvVars)

  return {
    devtool: 'source-map',
    context: path.join(__dirname, 'src'),
    entry: ['bootstrap-loader', 'index.js'],
    mode: 'production',
    output: {
      publicPath: '/',
      path: `${__dirname}/dist`,
      filename: '[hash].js',
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
          test: /\.mod\.(scss|css)$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  modules: true,
                  localIdentName: '[name]__[local]__[hash:base64:5]',
                  importLoaders: 2,
                },
              },
              {
                loader: 'postcss-loader',
              },
              {
                loader: 'sass-loader',
                options: { includePaths: [path.resolve(__dirname, './src')] },
              },
            ],
          }),
        },
        {
          test: /^((?!\.mod).)*\.(css|scss)$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 2,
                },
              },
              {
                loader: 'postcss-loader',
              },
              {
                loader: 'sass-loader',
                options: { includePaths: [path.resolve(__dirname, './src')] },
              },
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
        logo: interfaceConfig.logo.favicon,
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
      }),
      new webpack.DefinePlugin({
        'window.GNOSIS_CONFIG': JSON.stringify(config),
        'window.GNOSIS_INTERFACE': JSON.stringify(interfaceConfig),
      }),
      new UglifyJsWebpackPlugin({
        sourceMap: true,
        parallel: true,
        uglifyOptions: {
          compress: false,
        },
      }),
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/),
    ],
  }
}
