import { isGnosisInitialized, triedToConnect, getTokenAmount } from 'store/selectors/blockchain'
import { getGasPrice, getGasCosts, isGasCostFetched, isGasPriceFetched } from 'routes/MarketDetails/store/selectors'

import { Map } from 'immutable'

describe('Blockchain selectors', () => {
  describe('isGnosisInitialized', () => {
    it('Should return falsy if connection to gnosis is not initialized / Map doesnt have gnosisInitialized key', () => {
      const state = { blockchain: Map({ gnosisInitialized: false }) }

      expect(isGnosisInitialized(state)).toBeFalsy()
      state.blockchain.clear()
      expect(isGnosisInitialized(state)).toBeFalsy()
    })

    it('Should return truthy if connection to gnosis is initialized', () => {
      const state = { blockchain: Map({ gnosisInitialized: true }) }

      expect(isGnosisInitialized(state)).toBeTruthy()
    })
  })

  describe('triedToConnect', () => {
    it('Should return falsy if not tried to connect / Map doesnt have connectionTried key', () => {
      const state = { blockchain: Map({ connectionTried: false }) }

      expect(triedToConnect(state)).toBeFalsy()
      state.blockchain.clear()
      expect(triedToConnect(state)).toBeFalsy()
    })

    it('Should return falsy if we tried to connect', () => {
      const state = { blockchain: Map({ connectionTried: true }) }

      expect(triedToConnect(state)).toBeTruthy()
    })
  })

  describe('isGasCostFetched', () => {
    it('Should return false if gasCost for a prop is not set', () => {
      const state = { blockchain: Map({ gasCosts: Map({ market: undefined }) }) }

      expect(isGasCostFetched(state)).toEqual(false)
    })

    it('Should return falsy value if gasCost prop is not set', () => {
      const state = { blockchain: Map({ gasCosts: Map() }) }

      expect(isGasCostFetched(state)).toBeFalsy()
    })

    it('Should return true if gasCost for a prop is set', () => {
      const gasCost = '2000000000'
      const state = { blockchain: Map({ gasCosts: Map({ market: gasCost }) }) }

      expect(isGasCostFetched(state, 'market')).toEqual(true)
    })
  })

  describe('getGasCosts', () => {
    it('Should return gasCosts without falsy values and replace falsy values with 0', () => {
      const buySharesGasCost = '500000'
      const sellSharesGasCost = '55405300'
      const falsyValueReplacement = 0
      const state = {
        blockchain: Map({
          gasCosts: Map({ buyShares: buySharesGasCost, sellShares: sellSharesGasCost, market: undefined }),
        }),
      }

      const gasCosts = getGasCosts(state)
      expect(gasCosts.size).toEqual(3)
      expect(gasCosts.get('buyShares', buySharesGasCost)).toEqual(buySharesGasCost)
      expect(gasCosts.get('sellShares', sellSharesGasCost)).toEqual(sellSharesGasCost)
      expect(gasCosts.get('market')).toEqual(falsyValueReplacement)
    })

    it('Should return an empty map when there are no gas costs set', () => {
      const state = {
        blockchain: Map({
          gasCosts: Map(),
        }),
      }
      expect(getGasCosts(state).size).toEqual(0)
    })
  })

  describe('getTokenAmount', () => {
    it('Should return correct amount of tokens the user has', () => {
      const tokenAddress = '0x000000'
      const tokensAmount = '18000000000000'
      const state = {
        blockchain: Map({
          tokenBalances: Map({
            [tokenAddress]: tokensAmount,
          }),
        }),
      }

      expect(getTokenAmount(state, tokenAddress).toString()).toEqual(tokensAmount)
    })

    it('Should return 0 when ether tokens for account arent set', () => {
      const state = {
        blockchain: Map({
          tokenBalances: Map({}),
        }),
      }

      expect(getTokenAmount(state, '0x0000').toString()).toEqual('0')
    })

    it('Should return 0 when value is not a number', () => {
      const tokenAddress = '0x000000000'
      const tokensAmount = 'passed test'
      const state = {
        blockchain: Map({
          tokenBalances: Map({
            [tokenAddress]: tokensAmount,
          }),
        }),
      }

      expect(getTokenAmount(state, '0x0000').toString()).toEqual('0')
    })
  })

  describe('isGasPriceFetched', () => {
    it('Should return false if gas price is undefined', () => {
      const state = {
        blockchain: Map({
          gasPrice: undefined,
        }),
      }

      expect(isGasPriceFetched(state)).toEqual(false)
    })

    it('Should return true if gas price is undefined', () => {
      const state = {
        blockchain: Map({
          gasPrice: '12345678',
        }),
      }

      expect(isGasPriceFetched(state)).toEqual(true)
    })
  })

  describe('getGasPrice', () => {
    it('Should return 0 if gas price is undefined', () => {
      const state = {
        blockchain: Map({
          gasPrice: undefined,
        }),
      }

      expect(getGasPrice(state).toString()).toEqual('0')
    })

    it('Should return 0 if gas price is not a number', () => {
      const state = {
        blockchain: Map({
          gasPrice: 'passed test',
        }),
      }

      expect(getGasPrice(state).toString()).toEqual('0')
    })

    it('Should return correct gas price', () => {
      const gasPrice = '987654321'
      const state = {
        blockchain: Map({
          gasPrice,
        }),
      }

      expect(getGasPrice(state).toString()).toEqual(gasPrice)
    })
  })
})
