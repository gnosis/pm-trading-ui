const config = window.GNOSIS_CONFIG
const configInterface = window.GNOSIS_INTERFACE

export const getConfiguration = () => config
export const getInterfaceConfiguration = () => configInterface

export const getLogoConfig = () => configInterface.logo

export const getGasPriceConfig = () => config.gasPrice || {}

export const isFeatureEnabled = feature => configInterface[feature] && configInterface[feature].enabled

export const getFeatureConfig = feature => configInterface[feature] && configInterface[feature]

export const getProviderConfig = () => configInterface.providers

export const getProviderIntegrationConfig = providerName =>
  (configInterface.providers &&
  configInterface.providers.options &&
  configInterface.providers.options[providerName.toUpperCase()]) || {}

export const isThirdPartyIntegrationEnabled = thirdPartyName =>
  config.thirdparty?.[thirdPartyName]?.enabled === true

export const getThirdPartyConfig = thirdPartyName =>
  (isThirdPartyIntegrationEnabled(thirdPartyName) ? config.thirdparty[thirdPartyName] : {})
