import { isTournament, getProvider } from 'utils/configuration'
import Metamask from './metamask'
import Parity from './parity'
import Remote from './remote'
import Uport from './uport'
import { WALLET_PROVIDER } from './constants'

// eslint-disable-next-line
let providers = { Metamask, Parity, Remote }
const tournament = isTournament()

if (tournament) {
  const provider = getProvider()
  if (provider) {
    if (provider === WALLET_PROVIDER.METAMASK) {
      providers = { Metamask, Remote }
    } else if (provider === WALLET_PROVIDER.UPORT) {
      providers = { Uport, Remote }
    }
  }
}

export default providers
