import { restFetch } from 'utils/helpers'
import { getROGnosisConnection } from 'api'
import { getGasPriceConfig } from 'utils/features'
import Decimal from 'decimal.js'


const gasPriceConfig = getGasPriceConfig()

export const getGasPriceFromEthereum = async () => {
  const gnosis = await getROGnosisConnection()
  const gasPrice = await new Promise((resolve, reject) =>
    gnosis.web3.eth.getGasPrice((e, r) => (e ? reject(e) : resolve(r))))
  return gasPrice
}

const ethGasStationFetch = async () => {
  const { external: { url } } = gasPriceConfig
  const response = await restFetch(url)

  if (response && response.safeLow) {
    return Decimal(response.safeLow).mul(1e8).toString()
  }

  return response
}

const ETH_GAS_STATION = 'ETH_GAS_STATION'
const externalGasPriceFetchers = {
  [ETH_GAS_STATION]: ethGasStationFetch,
}

export const getGasPriceFromExternal = async () => {
  const { external: { type } } = gasPriceConfig

  if (typeof externalGasPriceFetchers[type] === 'function') {
    return externalGasPriceFetchers[type]()
  }

  console.warn(`invalid external gasPrice fetcher: ${type}`)
}

/**
 * Returns the current gas price
 */
export const getGasPrice = async () => {
  const useExternal = typeof gasPriceConfig.external === 'object'
  return useExternal ? getGasPriceFromExternal() : getGasPriceFromEthereum()
}
