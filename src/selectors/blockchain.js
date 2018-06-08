import Decimal from 'decimal.js'
import { TOKEN_SOURCE_ADDRESS, TOKEN_SOURCE_CONTRACT, TOKEN_SOURCE_ETH } from 'actions/blockchain'
import { getCurrentBalance } from 'integrations/store/selectors'
import { weiToEth } from 'utils/helpers'

/**
 * Returns if gnosis.js is initialized or not
 * @param {*} state - redux state
 */
export const isGnosisInitialized = state => !!state.blockchain.get('gnosisInitialized')

export const triedToConnect = state => !!state.blockchain.get('connectionTried')

export const isGasCostFetched = (state, property) => state.blockchain.getIn(['gasCosts', property]) !== undefined

export const getTokenAmount = (state, tokenAddress) => {
  const tokenAmount = state.blockchain.getIn(['tokenBalances', tokenAddress], 0)
  let defaultTokenDecimal
  try {
    defaultTokenDecimal = Decimal(tokenAmount.toString())
  } catch (e) {
    defaultTokenDecimal = Decimal(0)
  }

  return defaultTokenDecimal
}

export const getTokenSymbol = (state, tokenAddress) => state.blockchain.getIn(['tokenSymbols', tokenAddress])

/**
 * @param {*} state - redux state
 * @returns {object} collateralToken - with Symbol, Balance in ETH
 */
export const getCollateralToken = (state) => {
  const collateralToken = state.blockchain.get('collateralToken').toJS()

  const { source, address } = collateralToken

  if (source === TOKEN_SOURCE_ADDRESS) {
    // hardcoded address for collateralToken contract
    if (address) {
      return {
        ...collateralToken,
        balance: weiToEth(getTokenAmount(state, address)),
      }
    }
  } else if (source === TOKEN_SOURCE_CONTRACT) {
    // might need to wait until address becomes available
    if (address) {
      return {
        ...collateralToken,
        balance: weiToEth(getTokenAmount(state, address)),
      }
    }
  } else if (source === TOKEN_SOURCE_ETH) {
    // use eth balance as currency

    const balance = getCurrentBalance(state)

    return {
      ...collateralToken,
      balance: (balance || 0).toString(),
    }
  }

  // no collateral token available
  return collateralToken
}
