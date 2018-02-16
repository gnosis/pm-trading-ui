import {
  findDefaultProvider,
  getActiveProviderName,
  getActiveProvider,
  initializedAllProviders,
  isRemoteConnectionEstablished,
  checkWalletConnection,
} from 'integrations/store/selectors'
import { ProviderRecord } from 'integrations/store/models'
import { Map } from 'immutable'
import { WALLET_PROVIDER } from 'integrations/constants'

const generateState = providerState => ({ integrations: Map({ ...providerState }) })

describe('Integrations selectors', () => {
  describe('findDefaultProvider', () => {
    it('Should return correct default provider (available and true) with the highest priority', () => {
      const METAMASK = new ProviderRecord({
        available: true,
        loaded: true,
        priority: 100,
      })
      const PARITY = new ProviderRecord({
        available: true,
        loaded: true,
        priority: 99,
      })
      const REMOTE = new ProviderRecord({
        available: false,
        loaded: true,
        priority: 50,
      })

      const state = generateState({
        providers: Map({
          METAMASK,
          PARITY,
          REMOTE,
        }),
      })
      expect(findDefaultProvider(state).equals(METAMASK)).toEqual(true)
    })

    it('Should return undefined when there are no available providers / no providers at all', () => {
      const METAMASK = new ProviderRecord({
        available: false,
        loaded: true,
        priority: 100,
      })
      const PARITY = new ProviderRecord({
        available: true,
        loaded: false,
        priority: 99,
      })

      const state = generateState({
        providers: Map({
          METAMASK,
          PARITY,
        }),
      })

      expect(findDefaultProvider(state)).toBeUndefined()
      state.integrations.get('providers').clear()
      expect(findDefaultProvider(state)).toBeUndefined()
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

  describe('initializedAllProviders', () => {
    it('Should return true if all providers are initialized', () => {
      const METAMASK = new ProviderRecord({
        loaded: true,
      })

      const REMOTE = new ProviderRecord({
        loaded: true,
      })

      const state = generateState({
        providers: Map({
          METAMASK,
          REMOTE,
        }),
      })

      expect(initializedAllProviders(state)).toEqual(true)
    })

    it('Should return false if atleast one provider is not initialized', () => {
      const METAMASK = new ProviderRecord({
        loaded: false,
      })

      const REMOTE = new ProviderRecord({
        loaded: true,
      })

      const PARITY = new ProviderRecord({
        loaded: false,
      })

      const state = generateState({
        providers: Map({
          METAMASK,
          REMOTE,
          PARITY,
        }),
      })

      expect(initializedAllProviders(state)).toEqual(false)
    })

    it('Should return false if there are no registered providers', () => {
      const state = generateState({
        providers: Map({}),
      })

      expect(initializedAllProviders(state)).toEqual(false)
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

    it('Should return falsy if remote connection is not established', () => {
      const state = generateState({
        providers: Map({
          [WALLET_PROVIDER.REMOTE]: {
            network: undefined,
          },
        }),
      })

      expect(isRemoteConnectionEstablished(state)).toEqual(false)
    })

    it('Should return falsy if there are no registered providers', () => {
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
