import { isFeatureEnabled, getProviderConfig } from 'utils/features'
import Metamask from './metamask'
import Parity from './parity'
import Remote from './remote'
import Uport from './uport'
import { WALLET_PROVIDER } from './constants'

const providersInstances = [Metamask, Parity, Remote]

// eslint-disable-next-line
let providers = {}

providersInstances.forEach((instance) => {
  providers[instance.constructor.providerName] = instance
})


const tournament = isFeatureEnabled('tournament')
const providerConfig = getProviderConfig()

if (tournament) {
  const provider = providerConfig.default
  if (provider) {
    if (provider === WALLET_PROVIDER.METAMASK) {
      providers = { [WALLET_PROVIDER.METAMASK]: Metamask, [WALLET_PROVIDER.REMOTE]: Remote }
    } else if (provider === WALLET_PROVIDER.UPORT) {
      providers = { [WALLET_PROVIDER.UPORT]: Uport, [WALLET_PROVIDER.REMOTE]: Remote }
    }
  }
}

export default providers
