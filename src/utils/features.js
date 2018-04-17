
/* global GNOSIS_CONFIG, GNOSIS_INTERFACE */
export const getConfiguration = () => GNOSIS_CONFIG
export const getInterfaceConfiguration = () => GNOSIS_INTERFACE

export const getLogoConfig = () => GNOSIS_INTERFACE.logo

export const isFeatureEnabled = feature => GNOSIS_INTERFACE[feature] && GNOSIS_INTERFACE[feature].enabled

export const getFeatureConfig = feature => GNOSIS_INTERFACE[feature] && GNOSIS_INTERFACE[feature]

export const getCollateralToken = () => GNOSIS_INTERFACE.collateralToken

export const getProviderConfig = () => GNOSIS_INTERFACE.providers

export const getProviderIntegrationConfig = providerName =>
  GNOSIS_INTERFACE.providers.options[providerName.toUpperCase()]
