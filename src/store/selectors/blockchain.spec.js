import {
  isGnosisInitialized, isConnectedToBlockchain, getTokenAmount, getCollateralToken,
} from 'store/selectors/blockchain'
import {
  getGasPrice, getGasCosts, isGasCostFetched, isGasPriceFetched,
} from 'routes/MarketDetails/store/selectors'
import { ProviderRecord } from 'integrations/store/models'

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

  describe('isConnectedToBlockchain', () => {
    it('Should return falsy if none or one of pm-js instances was initialized', () => {
      const state = { blockchain: Map({ gnosisInitialized: false, gnosisROInitialized: false }) }

      expect(isConnectedToBlockchain(state)).toBe(false)
      state.blockchain.set('gnosisInitialized', true)
      expect(isConnectedToBlockchain(state)).toBe(false)
    })

    it('Should return truthy value if both pm-js instances are initialized', () => {
      const state = { blockchain: Map({ gnosisInitialized: true, gnosisROInitialized: true }) }

      expect(isConnectedToBlockchain(state)).toBe(true)
    })
  })

  describe('isGasCostFetched', () => {
    it('Should return false if gasCost for a prop is not set', () => {
      const state = { blockchain: Map({ gasCosts: Map({ market: undefined }) }) }

      expect(isGasCostFetched(state)).toEqual(false)
    })

    it('Should return false value if gasCost prop is not set', () => {
      const state = { blockchain: Map({ gasCosts: Map() }) }

      expect(isGasCostFetched(state)).toEqual(false)
    })

    it('Should return true if gasCost for a prop is set', () => {
      const gasCost = '2000000000'
      const state = { blockchain: Map({ gasCosts: Map({ market: gasCost }) }) }

      expect(isGasCostFetched(state, 'market')).toEqual(true)
    })
  })

  describe('getGasCosts', () => {
    it('Should return gasCosts and if no gasCost is found, return undefined', () => {
      const buySharesGasCost = '500000'
      const sellSharesGasCost = '55405300'

      const state = {
        blockchain: Map({
          gasCosts: Map({ buyShares: buySharesGasCost, sellShares: sellSharesGasCost, market: undefined }),
        }),
      }

      const gasCosts = getGasCosts(state)
      expect(gasCosts.size).toEqual(3)
      expect(gasCosts.get('buyShares', buySharesGasCost)).toEqual(buySharesGasCost)
      expect(gasCosts.get('sellShares', sellSharesGasCost)).toEqual(sellSharesGasCost)
      expect(gasCosts.get('market')).toBeUndefined()
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
    it('Should return false if no gas price is fetched yet', () => {
      const state = {
        blockchain: Map({
          gasPrice: undefined,
        }),
      }

      expect(isGasPriceFetched(state)).toEqual(false)
    })

    it('Should return true if gas price is defined', () => {
      const state = {
        blockchain: Map({
          gasPrice: '12345678',
        }),
      }

      expect(isGasPriceFetched(state)).toEqual(true)
    })
  })

  describe('getGasPrice', () => {
    it('Should return undefined if no gas price is fetched yet', () => {
      const state = {
        blockchain: Map({
          gasPrice: undefined,
        }),
      }

      expect(getGasPrice(state)).toBeUndefined()
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

  describe('getCollateralToken', () => {
    describe('source: "contract"', () => {
      it('Should return empty collateralToken if no collateralToken is set yet', () => {
        const state = {
          blockchain: Map({
            collateralToken: Map({
              address: undefined,
              source: undefined,
            }),
          }),
        }

        expect(getCollateralToken(state)).toMatchObject({
          address: undefined,
          source: undefined,
        })
      })

      it('Should return the collateralToken with address and with non-falsey balance if no balance was fetched yet', () => {
        const state = {
          blockchain: Map({
            collateralToken: Map({
              address: '0x123',
              source: 'contract',
            }),
          }),
        }

        expect(getCollateralToken(state)).toHaveProperty('balance', '0')
        expect(getCollateralToken(state)).toHaveProperty('address', '0x123')
      })

      it('Should return the collateralToken with address and with the balance in eth, if a balance was fetched', () => {
        const state = {
          blockchain: Map({
            collateralToken: Map({
              address: '0x123',
              source: 'contract',
            }),
            tokenBalances: Map({
              '0x123': 1e18.toString(), // 1 eth
            }),
          }),
        }

        expect(getCollateralToken(state)).toHaveProperty('balance', '1')
        expect(getCollateralToken(state)).toHaveProperty('address', '0x123')
      })
    })

    describe('source: "address"', () => {
      it('Should return undefined if no collateralToken is set yet', () => {
        const state = {
          blockchain: Map({
            collateralToken: Map({
              address: undefined,
              source: undefined,
            }),
          }),
        }

        expect(getCollateralToken(state)).toMatchObject({
          address: undefined,
          source: undefined,
        })
      })

      it('Should return the collateralToken with address and with non-falsey balance if no balance was fetched yet', () => {
        const state = {
          blockchain: Map({
            collateralToken: Map({
              address: '0x123',
              source: 'address',
            }),
          }),
        }

        expect(getCollateralToken(state)).toHaveProperty('balance', '0')
        expect(getCollateralToken(state)).toHaveProperty('address', '0x123')
      })

      it('Should return the collateralToken with address and with the balance in eth, if a balance was fetched', () => {
        const state = {
          blockchain: Map({
            collateralToken: Map({
              address: '0x123',
              source: 'address',
            }),
            tokenBalances: Map({
              '0x123': 1e18.toString(), // 1 eth
            }),
          }),
        }

        expect(getCollateralToken(state)).toHaveProperty('balance', '1')
        expect(getCollateralToken(state)).toHaveProperty('address', '0x123')
      })
    })

    describe('source: "eth"', () => {
      it('Should return the balance of the current account in ETH', () => {
        const state = {
          blockchain: Map({
            collateralToken: Map({
              source: 'eth',
            }),
          }),
          integrations: Map({
            providers: Map({
              METAMASK: new ProviderRecord({
                name: 'METAMASK',
                available: true,
                loaded: true,
                balance: '5',
                account: '0x123',
              }),
            }),
            activeProvider: 'METAMASK',
          }),
        }

        expect(getCollateralToken(state)).toMatchObject({ balance: '5', source: 'eth' })
      })

      it('Should return 0 instead of falsey values if no ETH balance was fetched yet', () => {
        const state = {
          blockchain: Map({
            collateralToken: Map({
              source: 'eth',
            }),
          }),
          integrations: Map({
            providers: Map({
              METAMASK: new ProviderRecord({
                name: 'METAMASK',
                available: true,
                loaded: true,
                balance: undefined,
                account: '0x123',
              }),
            }),
            activeProvider: 'METAMASK',
          }),
        }

        expect(getCollateralToken(state)).toMatchObject({ balance: '0', source: 'eth' })
      })
    })
  })
})
