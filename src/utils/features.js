

const getGlobal = key => (typeof global !== 'undefined' && global[key]) || (typeof window !== 'undefined' && window[key]) || {}

const config = getGlobal('GNOSIS_CONFIG')
const configInterface = getGlobal('GNOSIS_INTERFACE')

export const getConfiguration = () => config
export const getInterfaceConfiguration = () => configInterface

export const getLogoConfig = () => configInterface.logo

export const isFeatureEnabled = feature => configInterface[feature] && configInterface[feature].enabled

export const getFeatureConfig = feature => configInterface[feature] && configInterface[feature]

export const getCollateralToken = () => configInterface.collateralToken

export const getProviderConfig = () => configInterface.providers

export const getProviderIntegrationConfig = providerName =>
  configInterface.providers.options[providerName.toUpperCase()]
