import {
  initGnosisConnection,
  initReadOnlyGnosisConnection,
  getROGnosisConnection,
  getCurrentBalance,
  getCurrentAccount,
  getGasPrice,
  getTokenSymbol,
  getTokenBalance,
} from 'api'
import Web3 from 'web3'

import {
  timeoutCondition, getGnosisJsOptions, hexWithoutPrefix, hexWithPrefix,
} from 'utils/helpers'
import { findDefaultProvider } from 'integrations/store/selectors'
import { createAction } from 'redux-actions'
import { setActiveProvider } from 'integrations/store/actions'
import { getFeatureConfig, getConfiguration } from 'utils/features'
import { getCollateralToken } from 'store/selectors/blockchain'

const collateralTokenFromConfig = getFeatureConfig('collateralToken')
const config = getConfiguration()
const ethereumUrl = `${config.ethereum.protocol}://${config.ethereum.host}`

// TODO define reducer for GnosisStatus
export const setGnosisInitialized = createAction('SET_GNOSIS_CONNECTION')
export const setGnosisROInitialized = createAction('SET_GNOSIS_RO_CONNECTION')
export const setConnectionStatus = createAction('SET_CONNECTION_STATUS')
export const setGasPrice = createAction('SET_GAS_PRICE')
export const setTokenBalance = createAction('SET_TOKEN_BALANCE')
export const setTokenSymbol = createAction('SET_TOKEN_NAME')
export const setCollateralToken = createAction('SET_COLLATERAL_TOKEN')

export const NETWORK_TIMEOUT = process.env.NODE_ENV === 'production' ? 10000 : 2000

export const TOKEN_SOURCE_CONTRACT = 'contract'
export const TOKEN_SOURCE_ETH = 'eth'
export const TOKEN_SOURCE_ADDRESS = 'address'

export const ETH_TOKEN_ICON = 'assets/img/icons/icon_etherTokens.svg'

export const requestGasPrice = () => async (dispatch) => {
  const gasPrice = await getGasPrice()
  dispatch(setGasPrice({ entityType: 'gasPrice', gasPrice }))
}

export const requestTokenSymbol = uTokenAddress => async (dispatch) => {
  const tokenAddress = hexWithPrefix(uTokenAddress)
  let tokenSymbol
  try {
    tokenSymbol = await getTokenSymbol(tokenAddress)
  } catch (e) {
    tokenSymbol = ''
  } finally {
    dispatch(setTokenSymbol({ tokenAddress, tokenSymbol }))
  }
}

export const requestTokenBalance = (uTokenAddress, accountAddress) => async (dispatch) => {
  const tokenAddress = hexWithPrefix(uTokenAddress)
  const tokenBalance = await getTokenBalance(tokenAddress, accountAddress)
  dispatch(setTokenBalance({ tokenAddress, tokenBalance }))
}

/**
 * Requests the configured tournaments collateralToken balance. If none is set, does nothing
 * @param {function} dispatch
 * @param {function} getState
 */
export const requestCollateralTokenBalance = account => (dispatch, getState) => {
  const state = getState()
  const collateralToken = getCollateralToken(state)

  // no collateral token defined yet - this information might be asynchronous, if the
  // defined collateral token is inside a contract.
  if (!collateralToken || !collateralToken.source) {
    return undefined
  }

  // if the collateralToken source is the ETH balance from the users wallet, we don't need
  // to start a request to fetch the balance, as it is auto updating in the current provider
  if (collateralToken.source === TOKEN_SOURCE_ETH) {
    return undefined
  }

  return dispatch(requestTokenBalance(collateralToken.address, account))
}

export const initReadOnlyGnosis = () => async (dispatch) => {
  // initialize
  try {
    await initReadOnlyGnosisConnection({
      ethereum: new Web3(new Web3.providers.HttpProvider(ethereumUrl)).currentProvider,
    })
    await dispatch(setGnosisROInitialized({ initialized: true }))
  } catch (error) {
    console.error(`Gnosis.js RO initialization Error: ${error}`)
  }
}

export const updateCollateralToken = () => async (dispatch) => {
  if (!collateralTokenFromConfig) {
    return dispatch(setCollateralToken({
      source: TOKEN_SOURCE_ETH,
    }))
  }

  const { source, options } = collateralTokenFromConfig


  if (source === TOKEN_SOURCE_ETH) {
    // options are optional here
    const { icon = ETH_TOKEN_ICON, symbol = 'ETH' } = options || {}

    return dispatch(setCollateralToken({
      source: TOKEN_SOURCE_ETH,
      symbol,
      icon,
    }))
  } if (source === TOKEN_SOURCE_CONTRACT) {
    const {
      contractName, symbol, icon, isWrappedEther = false,
    } = options

    if (!contractName) {
      throw new Error(
        `Invalid configuration for 'collateralToken.source': '${TOKEN_SOURCE_CONTRACT}': No contractName defined`,
      )
    }

    await dispatch(initReadOnlyGnosis())
    const gnosisROInstance = await getROGnosisConnection()

    if (!gnosisROInstance) {
      throw new Error(
        `Invalid configuration for 'collateralToken.source': '${TOKEN_SOURCE_CONTRACT}': Couldn't initialize RO connection to fetch contract`,
      )
    }

    const contractInstance = gnosisROInstance[contractName]

    if (!contractInstance) {
      throw new Error(
        `Invalid configuration for 'collateralToken.source': '${TOKEN_SOURCE_CONTRACT}': Contract "${contractName}" not found in pm-js. Please check https://github.com/gnosis/pm-js`,
      )
    }

    // use from config or fetch from contract
    let tokenSymbol = symbol
    if (!tokenSymbol) {
      tokenSymbol = await contractInstance.symbol()
    }

    return dispatch(setCollateralToken({
      source: TOKEN_SOURCE_CONTRACT,
      address: hexWithoutPrefix(contractInstance.address),
      symbol: tokenSymbol,
      icon: icon || ETH_TOKEN_ICON,
      isWrappedEther,
    }))
  } if (source === TOKEN_SOURCE_ADDRESS) {
    const {
      address, symbol, icon, isWrappedEther = false,
    } = options
    return dispatch(setCollateralToken({
      source: TOKEN_SOURCE_ADDRESS,
      address: hexWithoutPrefix(address),
      symbol,
      icon,
      isWrappedEther,
    }))
  }

  return undefined
}

/**
 * (Re)-Initializes Gnosis.js connection according to current providers settings
 */
export const initGnosis = () => async (dispatch, getState) => {
  // initialize
  let newProvider
  await dispatch(updateCollateralToken())

  try {
    const state = getState()

    // determine new provider
    newProvider = findDefaultProvider(state)

    if (newProvider) {
      await dispatch(setActiveProvider(newProvider.name))
      // init Gnosis connection

      const opts = getGnosisJsOptions(newProvider)
      await initGnosisConnection(opts)
      await dispatch(setGnosisInitialized({ initialized: true }))
    }
  } catch (error) {
    console.warn(`Gnosis.js initialization Error: ${error}`)
    dispatch(setConnectionStatus({ connected: false }))
    return dispatch(setGnosisInitialized({ initialized: false, error }))
  }

  if (newProvider) {
    // connect
    try {
      // runs test executions on gnosisjs
      const getConnection = async () => {
        // these throw if they're not available, meaning we don't have a connection
        const account = await getCurrentAccount()
        await getCurrentBalance(account)
      }

      await Promise.race([getConnection(), timeoutCondition(NETWORK_TIMEOUT, 'connection timed out')])
      await dispatch(setConnectionStatus({ connected: true }))
    } catch (error) {
      console.warn(`Gnosis.js connection Error: ${error}`)
      return dispatch(setConnectionStatus({ connected: false }))
    }
  }

  return undefined
}
