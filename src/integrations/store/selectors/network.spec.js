import {
  getCurrentNetworkId,
  getCurrentNetwork,
} from 'integrations/store/selectors'
import { WALLET_PROVIDER } from 'integrations/constants'
import { ProviderRecord } from 'integrations/store/models'
import { Map } from 'immutable'

const generateState = providerState => ({ integrations: Map({ ...providerState }) })

describe('Integrations selectors related to network', () => {
  describe('getCurrentNetworkId', () => {
    it('Should return network id used in active provider', () => {
      const state = generateState({
        providers: Map({
          [WALLET_PROVIDER.REMOTE]: new ProviderRecord({
            networkId: 4,
          }),
        }),
        activeProvider: WALLET_PROVIDER.REMOTE,
      })

      expect(getCurrentNetworkId(state)).toEqual(4)
    })

    it('Should return undefined if there is no active provider', () => {
      const state = generateState({
        providers: Map({
          [WALLET_PROVIDER.REMOTE]: new ProviderRecord({
            networkId: 4,
          }),
        }),
      })

      expect(getCurrentNetworkId(state)).toBeUndefined()
    })
  })

  describe('getCurrentNetwork', () => {
    it('Should return network used in active provider', () => {
      const state = generateState({
        providers: Map({
          [WALLET_PROVIDER.REMOTE]: new ProviderRecord({
            network: 'RINKEBY',
          }),
        }),
        activeProvider: WALLET_PROVIDER.REMOTE,
      })

      expect(getCurrentNetwork(state)).toEqual('RINKEBY')
    })

    it('Should return undefined if there is no active provider', () => {
      const state = generateState({
        providers: Map({
          [WALLET_PROVIDER.REMOTE]: new ProviderRecord({
            network: 'RINKEBY',
          }),
        }),
      })

      expect(getCurrentNetwork(state)).toBeUndefined()
    })
  })
})
