import Decimal from 'decimal.js'

const getGasPrice = (state) => {
  const gasPrice = state.blockchain.get('gasPrice', undefined)

  if (typeof gasPrice === 'undefined') {
    return undefined
  }

  let gasPriceDecimal
  try {
    gasPriceDecimal = Decimal(gasPrice.toString())
  } catch (e) {
    gasPriceDecimal = Decimal(0)
  }

  return gasPriceDecimal
}

export default getGasPrice
