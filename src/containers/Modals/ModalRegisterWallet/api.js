import { getGnosisConnection } from 'api'

const calcRegistrationGasCost = async (account) => {
  const gnosis = await getGnosisConnection()
  const gasCost = await gnosis.olympiaAddressRegistry.register.estimateGas(account)
  return gasCost
}

export { calcRegistrationGasCost }
