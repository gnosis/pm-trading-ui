const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const AutoDllPlugin = require('autodll-webpack-plugin')

const path = require('path')
const webpack = require('webpack')
const pkg = require('./package.json')

const configLoader = require('./scripts/configuration')

const version = process.env.BUILD_VERSION || pkg.version
const commitId = `${process.env.TRAVIS_BRANCH}@${process.env.TRAVIS_COMMIT}`

module.exports = (env = {}) => {
  const configEnvVars = env.GNOSIS_CONFIG || {}

  const gnosisEnv = process.env.GNOSIS_ENV

  console.info(`[WEBPACK-PROD]: using env configuration: '${gnosisEnv || 'default configuration (local)'}`)
  const config = configLoader(gnosisEnv, configEnvVars)

  return {
    devtool: 'source-map',
    context: `${__dirname}/src`,
    entry: ['bootstrap-loader', 'index.js'],
    mode: 'production',
    output: {
      publicPath: '/',
      path: `${__dirname}/dist`,
      filename: '[hash].js',
    },
    resolve: {
      symlinks: false,
      alias: {
        '~style': `${__dirname}/src/scss`,
        '~assets': `${__dirname}/src/assets`,
      },
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
          oneOf: [
            {
              resourceQuery: /^\?raw$/,
              use: [
                MiniCssExtractPlugin.loader,
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
                  options: { sourceMap: true, includePaths: [path.resolve(`${__dirname}/src`)] },
                },
              ],
            },
            {
              use: [
                MiniCssExtractPlugin.loader,
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
                  options: { includePaths: [path.resolve(`${__dirname}/src`)] },
                },
              ],
            },
          ],
        },
        {
          test: /\.(ttf|otf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
          loader: 'file-loader?name=fonts/[name].[ext]',
        },
        {
          test: /\.(md|txt)$/,
          use: 'raw-loader',
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'styles.css',
      }),
      new FaviconsWebpackPlugin({
        logo: config.logo.favicon,
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
        template: `${__dirname}/src/html/index.html`,
      }),
      new AutoDllPlugin({
        inject: true, // will inject the DLL bundles to index.html
        filename: '[name]_[hash].js',
        entry: {
          vendor: [
            'react',
            'react-dom',
            'redux',
            'react-redux',
            'immutable',
            'react-router-dom',
            'recharts',
            'redux-actions',
            'reselect',
            'web3',
            'moment-duration-format',
            '@gnosis.pm/pm-js',
          ],
        },
        plugins: [
          new TerserPlugin({
            sourceMap: true,
            parallel: true,
            cache: true,
          }),
          new webpack.EnvironmentPlugin({
            NODE_ENV: 'production',
          }),
          new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/),
        ],
      }),
      new webpack.EnvironmentPlugin({
        VERSION: `${version}#${commitId}`,
        NODE_ENV: 'production',
      }),
      new webpack.DefinePlugin({
        'process.env.FALLBACK_CONFIG': `"${Buffer.from(JSON.stringify(config)).toString('base64')}"`,
      }),
      new TerserPlugin({
        sourceMap: true,
        parallel: true,
        cache: true,
      }),
      new CopyWebpackPlugin([{ from: `${__dirname}/src/assets`, to: `${__dirname}/dist/assets` }]),
    ],
  }
}
