import { getCurrentBalance, getCurrentAccount } from 'integrations/store/selectors'
import { WALLET_PROVIDER } from 'integrations/constants'
import { ProviderRecord } from 'integrations/store/models'
import { Map } from 'immutable'

const generateState = providerState => ({ integrations: Map({ ...providerState }) })

describe('Integrations selectors related to user data', () => {
  describe('getCurrentBalance', () => {
    it('Should return balance set in active provider', () => {
      const balance = '180000000'
      const state = generateState({
        providers: Map({
          [WALLET_PROVIDER.METAMASK]: new ProviderRecord({
            balance,
          }),
        }),
        activeProvider: WALLET_PROVIDER.METAMASK,
      })

      expect(getCurrentBalance(state)).toEqual(balance)
    })

    it('Should return \'0\' when active provider is not set', () => {
      const balance = '180000000'
      const state = generateState({
        providers: Map({
          [WALLET_PROVIDER.METAMASK]: new ProviderRecord({
            balance,
          }),
        }),
      })

      expect(getCurrentBalance(state)).toEqual('0')
    })
  })

  describe('getCurrentAccount', () => {
    it('Should return account set in active provider', () => {
      const account = '0x0000000'
      const state = generateState({
        providers: Map({
          [WALLET_PROVIDER.METAMASK]: new ProviderRecord({
            account,
          }),
        }),
        activeProvider: WALLET_PROVIDER.METAMASK,
      })

      expect(getCurrentAccount(state)).toEqual(account)
    })

    it('Should return undefined when active provider is not set', () => {
      const account = '0x0000000'
      const state = generateState({
        providers: Map({
          [WALLET_PROVIDER.METAMASK]: new ProviderRecord({
            account,
          }),
        }),
      })

      expect(getCurrentAccount(state)).toBeUndefined()
    })
  })
})
