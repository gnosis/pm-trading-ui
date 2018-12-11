import Decimal from 'decimal.js'
import { TOKEN_SOURCE_ADDRESS, TOKEN_SOURCE_CONTRACT, TOKEN_SOURCE_ETH } from 'store/actions/blockchain'
import { getCurrentBalance, getCurrentAccount } from 'integrations/store/selectors'
import { weiToEth, hexWithPrefix, normalizeHex } from 'utils/helpers'

/**
 * Returns if pm-js is initialized or not
 * @param {*} state - redux state
 */
export const isGnosisInitialized = state => !!state.blockchain.get('gnosisInitialized')

export const isConnectedToBlockchain = state => !!state.blockchain.get('gnosisROInitialized')

export const getTargetNetworkId = state => state.blockchain.get('targetNetworkId')

export const isGasCostFetched = (state, property) => state.blockchain.getIn(['gasCosts', property]) !== undefined

export const getTokenAmount = (state, tokenAddress) => {
  const tokenAmount = state.blockchain.getIn(['tokenBalances', normalizeHex(tokenAddress)], 0)
  let defaultTokenDecimal

  try {
    defaultTokenDecimal = Decimal(tokenAmount)
  } catch (e) {
    defaultTokenDecimal = Decimal(0)
  }

  return defaultTokenDecimal
}

export const getTokenSymbol = (state, tokenAddress) => state.blockchain.getIn(['tokenSymbols', hexWithPrefix(tokenAddress)])

/**
 * @param {*} state - redux state
 * @returns {object} collateralToken - with Symbol, Balance in ETH
 */
export const getCollateralToken = (state) => {
  const collateralToken = state.blockchain.get('collateralToken').toJS()
  const accountConnected = !!getCurrentAccount(state)

  const { source, address, isWrappedEther } = collateralToken

  if (source === TOKEN_SOURCE_ADDRESS) {
    // hardcoded address for collateralToken contract
    if (address) {
      let tokenBalance = weiToEth(getTokenAmount(state, normalizeHex(address)))

      if (isWrappedEther && accountConnected) {
        const etherBalance = getCurrentBalance(state)
        tokenBalance = Decimal(tokenBalance).add(etherBalance).toString()
      }

      return {
        ...collateralToken,
        balance: tokenBalance,
      }
    }
  } else if (source === TOKEN_SOURCE_CONTRACT) {
    // might need to wait until address becomes available
    if (address) {
      let tokenBalance = weiToEth(getTokenAmount(state, normalizeHex(address)))

      if (isWrappedEther && accountConnected) {
        const etherBalance = getCurrentBalance(state)
        tokenBalance = Decimal(tokenBalance).add(etherBalance).toString()
      }

      return {
        ...collateralToken,
        balance: tokenBalance,
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
