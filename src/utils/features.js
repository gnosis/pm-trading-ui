const { interfaceConfig } = process.env.CONFIG

export const getLogoConfig = () => interfaceConfig.logo

export const isFeatureEnabled = feature => interfaceConfig[feature] && interfaceConfig[feature].enabled

export const getFeatureConfig = feature => interfaceConfig[feature] && interfaceConfig[feature]

export const getCollateralToken = () => interfaceConfig.collateralToken

export const getProviderConfig = () => interfaceConfig.providers

export const getProviderIntegrationConfig = providerName => interfaceConfig.providers.options[providerName.toUpperCase()]
