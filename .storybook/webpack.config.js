// you can use this file to add your custom webpack plugins, loaders and anything you like.
// This is just the basic way to add additional webpack configurations.
// For more information refer the docs: https://storybook.js.org/configurations/custom-webpack-config

// IMPORTANT
// When you add this file, we won't add the default configurations which is similar
// to "React Create App". This only has babel loader to load JavaScript.

const devConfig = require('../webpack.dev.config');
const prodConfig = require('../webpack.prod.config');

module.exports = function(storybookConfig, configType) {
    // configType has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    const config = Object.assign({}, configType === 'DEVELOPMENT' ? devConfig : prodConfig);

    storybookConfig.module.rules = storybookConfig.module.rules.concat(config.module.rules)
    storybookConfig.resolve = config.resolve;

    return storybookConfig;
};
