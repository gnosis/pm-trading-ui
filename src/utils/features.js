/* globals FALLBACK_CONFIG */
/* eslint-disable no-underscore-dangle */

/* How configuration loading works:
 * - FALLBACK_CONFIG is defined as a Webpack Define (needs to be encoded because it gets replaced in code)
 * - window.__GNOSIS_CONFIG__ gets injected by config.js in dist after build
 *
 * Fallback Config is used for development and production builds, but as soon as /config.js becomes available on
 * production servers, the external configuration specified in config.js is used. This allows us
 * to define the configuration after building and it allows to be easily interchanged, when config.js gets changed.
 */
const fallbackConfigEncoded = process.env.FALLBACK_CONFIG

let fallbackConfig
if (fallbackConfigEncoded) {
  fallbackConfig = JSON.parse(atob(fallbackConfigEncoded))
}
const externalConfig = window.__GNOSIS_CONFIG__

window.__GNOSIS_CONFIG_FALLBACK__ = fallbackConfig

const config = externalConfig || fallbackConfig

export const getConfiguration = () => config

export const getLogoConfig = () => config.logo

export const getGasPriceConfig = () => config.gasPrice || {}

export const isFeatureEnabled = feature => config[feature] && config[feature].enabled

export const getFeatureConfig = feature => config[feature] && config[feature]

export const getProviderConfig = () => config.providers

export const getProviderIntegrationConfig = providerName => (config.providers
    && config.providers.options
    && config.providers.options[providerName.toUpperCase()]) || {}

export const isThirdPartyIntegrationEnabled = thirdPartyName => config.thirdparty?.[thirdPartyName]?.enabled === true

export const getThirdPartyConfig = thirdPartyName => (isThirdPartyIntegrationEnabled(thirdPartyName) ? config.thirdparty[thirdPartyName] : {})

export const getConstant = constantName => config.constants?.[constantName]
