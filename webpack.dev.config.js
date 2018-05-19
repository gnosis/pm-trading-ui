const HtmlWebpackPlugin = require('html-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')

const path = require('path')
const webpack = require('webpack')

const pkg = require('./package.json')

const configLoader = require('./configuration')

module.exports = (env = {}) => {
  const configEnvVars = env.GNOSIS_CONFIG || {}
  const interfaceEnvVars = env.GNOSIS_INTERFACE || {}

  const gnosisEnv = env.GNOSIS_ENV || 'local'

  console.info(`[WEBPACK-DEV]: using env configuration: '${gnosisEnv}'`)
  const { config, interfaceConfig } = configLoader(gnosisEnv, configEnvVars, interfaceEnvVars)

  const version = env.BUILD_VERSION || pkg.version
  const commitId = `${env.TRAVIS_BRANCH || 'local'}@${env.TRAVIS_COMMIT || 'SNAPSHOT'}`

  return {
    context: path.join(__dirname, 'src'),
    entry: ['bootstrap-loader', 'index.js'],
    devtool: 'eval-source-map',
    mode: 'development',
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
          target: config.gnosisdb.host,
          secure: false,
        },
      },
      watchOptions: {
        ignored: /node_modules/,
      },
      contentBase: [path.join(__dirname, 'dist'), path.join(__dirname, 'src')],
    },
    plugins: [
      new CaseSensitivePathsPlugin(),
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
        VERSION: `${version}#${commitId}`,
        NODE_ENV: 'development',
      }),
      new webpack.DefinePlugin({
        'window.GNOSIS_CONFIG': JSON.stringify(config),
        'window.GNOSIS_INTERFACE': JSON.stringify(interfaceConfig),
      }),
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/),
    ],
  }
}
