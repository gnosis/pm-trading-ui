import { getROGnosisConnection } from 'api'

/**
 * Returns the current gas price
 */
export const getGasPrice = async () => {
  const gnosis = await getROGnosisConnection()
  const gasPrice = await new Promise((resolve, reject) =>
    gnosis.web3.eth.getGasPrice((e, r) => (e ? reject(e) : resolve(r))))
  return gasPrice
}
