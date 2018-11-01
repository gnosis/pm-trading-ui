const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpackBaseDev = require('./webpackBase.dev.config')
const webpackBaseProd = require('./webpackBase.prod.config')

const getBase = env => (env === 'production' ? webpackBaseProd : webpackBaseDev)

const interfaceConfig = {
  name: 'Interface',
  entry: 'embedded/index.js',
  output: {
    publicPath: '/',
    path: `${__dirname}/dist/interface`,
    filename: '[hash].js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: `${__dirname}/src/html/index.html`,
    }),
  ],
}

const embeddedConfig = {
  name: 'Embedded view',
  entry: ['bootstrap-loader', 'index.js'],
  output: {
    publicPath: '/',
    path: `${__dirname}/embedded`,
    filename: '[hash].js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: `${__dirname}/src/embedded/html/index.html`,
    }),
  ],
}

const getConfig = project => (project === 'embedded ' ? embeddedConfig : interfaceConfig)

module.exports = (env = {}) => {
  if (!process.env.PROJECT) {
    // eslint-disable-next-line
    console.log(
      'Please specify PROJECT environment variable, it should be one of: "interface", "embedded". By default the interface will be built',
    )
  }

  const baseConfig = getBase(process.env.NODE_ENV)(env)
  const projectConfig = getConfig(process.env.PROJECT)

  return {
    ...baseConfig,
    ...projectConfig,
    plugins: [...baseConfig.plugins, ...projectConfig.plugins],
  }
}
