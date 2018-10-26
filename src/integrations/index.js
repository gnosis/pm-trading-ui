import { WALLET_PROVIDER } from './constants'

import METAMASK from './metamask'
import PARITY from './parity'
import REMOTE from './remote'
import TRUST from './trustApp'
import STATUS from './status'

// eslint-disable-next-line
let providers = {
  [WALLET_PROVIDER.METAMASK]: METAMASK,
  [WALLET_PROVIDER.PARITY]: PARITY,
  [WALLET_PROVIDER.REMOTE]: REMOTE,
  [WALLET_PROVIDER.TRUST]: TRUST,
  [WALLET_PROVIDER.STATUS]: STATUS,
}

export default providers
