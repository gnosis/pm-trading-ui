import Decimal from 'decimal.js'

const getGasPrice = (state) => {
  const gasPrice = state.blockchain.get('gasPrice', undefined)
  let gasPriceDecimal
  try {
    gasPriceDecimal = Decimal(gasPrice.toString())
  } catch (e) {
    gasPriceDecimal = undefined
  }

  return gasPriceDecimal
}

export default getGasPrice
