import {
  findActiveProvider,
  getActiveProviderName,
  getActiveProvider,
  isRemoteConnectionEstablished,
  checkWalletConnection,
} from 'integrations/store/selectors'
import { ProviderRecord } from 'integrations/store/models'
import { Map } from 'immutable'
import { WALLET_PROVIDER, WALLET_STATUS } from 'integrations/constants'

const generateState = providerState => ({ integrations: Map({ ...providerState }) })

describe('Integrations selectors', () => {
  describe('findActiveProvider', () => {
    it('Should return correct active provider', () => {
      const METAMASK = new ProviderRecord({
        status: WALLET_STATUS.INITIALIZED,
      })
      const PARITY = new ProviderRecord({
        status: WALLET_STATUS.READY_TO_INIT,
      })
      const REMOTE = new ProviderRecord({
        status: WALLET_STATUS.NOT_INSTALLED,
      })

      const state = generateState({
        providers: Map({
          METAMASK,
          PARITY,
          REMOTE,
        }),
      })
      expect(findActiveProvider(state).equals(METAMASK)).toEqual(true)
    })

    it('Should return undefined when there are no available providers / no providers at all', () => {
      const METAMASK = new ProviderRecord({
        status: WALLET_STATUS.ERROR,
      })
      const PARITY = new ProviderRecord({
        status: WALLET_STATUS.READY_TO_INIT,
      })
      const REMOTE = new ProviderRecord({
        status: WALLET_STATUS.NOT_INSTALLED,
      })

      const state = generateState({
        providers: Map({
          METAMASK,
          PARITY,
          REMOTE,
        }),
      })

      expect(findActiveProvider(state)).toBeUndefined()
      state.integrations.get('providers').clear()
      expect(findActiveProvider(state)).toBeUndefined()
    })
  })

  describe('getActiveProviderName', () => {
    it("It should return active provider's name", () => {
      const activeProvider = 'METAMASK'
      const state = generateState({
        activeProvider,
      })

      expect(getActiveProviderName(state)).toEqual(activeProvider)
    })
  })

  describe('getActiveProvider', () => {
    it('Should return active provider when it is set', () => {
      const METAMASK = new ProviderRecord({
        loaded: true,
        available: true,
        priority: 100,
      })

      const state = generateState({
        providers: Map({
          METAMASK,
        }),
        activeProvider: 'METAMASK',
      })

      expect(getActiveProvider(state).equals(METAMASK)).toEqual(true)
    })

    it('Should return undefined when there are no active provider', () => {
      const METAMASK = new ProviderRecord({
        loaded: true,
        available: true,
        priority: 100,
      })

      const state = generateState({
        providers: Map({
          METAMASK,
        }),
      })

      expect(getActiveProvider(state)).toBeUndefined()
    })
  })

  describe('isRemoteConnectionEstablished', () => {
    it('Should return true if remote connection is established', () => {
      const state = generateState({
        providers: Map({
          [WALLET_PROVIDER.REMOTE]: {
            network: 'RINKEBY',
          },
        }),
      })

      expect(isRemoteConnectionEstablished(state)).toEqual(true)
    })

    it('Should return false if remote connection is not established', () => {
      const state = generateState({
        providers: Map({
          [WALLET_PROVIDER.REMOTE]: {
            network: undefined,
          },
        }),
      })

      expect(isRemoteConnectionEstablished(state)).toEqual(false)
    })

    it('Should return false if there are no registered providers', () => {
      const state = generateState({
        providers: Map({}),
      })

      expect(isRemoteConnectionEstablished(state)).toEqual(false)
    })
  })

  describe('checkWalletConnection', () => {
    it('Should return true if an account is set in active provider', () => {
      const state = generateState({
        providers: Map({
          [WALLET_PROVIDER.METAMASK]: new ProviderRecord({
            account: '0x000000',
          }),
        }),
        activeProvider: WALLET_PROVIDER.METAMASK,
      })

      expect(checkWalletConnection(state)).toEqual(true)
    })

    it('Should return true if an account is not set in active provider / active provider is not set', () => {
      const state = generateState({
        providers: Map({
          [WALLET_PROVIDER.METAMASK]: new ProviderRecord(),
        }),
        activeProvider: WALLET_PROVIDER.METAMASK,
      })

      expect(checkWalletConnection(state)).toEqual(false)
      state.integrations.set('activeProvider', undefined)
      expect(checkWalletConnection(state)).toEqual(false)
    })
  })
})
