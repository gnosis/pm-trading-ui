// eslint-disable-next-line
const config = window.__GNOSIS_CONFIG__

export const getConfiguration = () => config

export const getLogoConfig = () => config.logo

export const getGasPriceConfig = () => config.gasPrice || {}

export const isFeatureEnabled = feature => config[feature] && config[feature].enabled

export const getFeatureConfig = feature => config[feature] && config[feature]

export const getProviderConfig = () => config.providers

export const getProviderIntegrationConfig = providerName =>
  (config.providers &&
    config.providers.options &&
    config.providers.options[providerName.toUpperCase()]) || {}

export const isThirdPartyIntegrationEnabled = thirdPartyName =>
  config.thirdparty?.[thirdPartyName]?.enabled === true

export const getThirdPartyConfig = thirdPartyName =>
  (isThirdPartyIntegrationEnabled(thirdPartyName) ? config.thirdparty[thirdPartyName] : {})

export const getConstant = constantName => config.constants?.[constantName]
