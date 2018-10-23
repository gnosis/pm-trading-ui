import { WALLET_PROVIDER } from './constants'

import METAMASK from './metamask'
import PARITY from './parity'
import REMOTE from './remote'

// eslint-disable-next-line
let providers = {
  [WALLET_PROVIDER.METAMASK]: METAMASK,
  [WALLET_PROVIDER.PARITY]: PARITY,
  [WALLET_PROVIDER.REMOTE]: REMOTE,
}

export default providers
