import Decimal from 'decimal.js'
import { getCollateralToken } from 'utils/features'
import { getCurrentBalance } from 'integrations/store/selectors'
import { weiToEth } from 'utils/helpers'

const ETH_TOKEN_ICON = 'assets/img/icons/icon_etherTokens.svg'

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
    defaultTokenDecimal = Decimal(tokenAmount)
  } catch (e) {
    defaultTokenDecimal = Decimal(0)
  }

  return defaultTokenDecimal
}

export const getTokenSymbol = (state, tokenAddress) => state.blockchain.getIn(['tokenSymbols', tokenAddress])

/**
 * @param {*} state - redux state
 * @returns {object} collateralToken - with Symbol, Amount in ETH and Address
 */
export const getCollateralTokenInfo = (state) => {
  const collateralToken = getCollateralToken()

  if (!collateralToken) {
    return {
      symbol: 'ETH',
      amount: weiToEth(getCurrentBalance(state)),
      address: undefined,
      icon: ETH_TOKEN_ICON,
    }
  }

  return {
    symbol: getTokenSymbol(state, collateralToken.address),
    amount: weiToEth(getTokenAmount(state, collateralToken.address)),
    address: collateralToken.address,
    icon: collateralToken.icon,
  }
}
