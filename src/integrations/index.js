import { WALLET_PROVIDER } from './constants'

import METAMASK from './metamask'
import PARITY from './parity'
import REMOTE from './remote'
import TRUST from './trust'
import STATUS from './status'

// eslint-disable-next-line
const providers = {
  [WALLET_PROVIDER.METAMASK]: METAMASK,
  [WALLET_PROVIDER.PARITY]: PARITY,
  [WALLET_PROVIDER.REMOTE]: REMOTE,
  [WALLET_PROVIDER.TRUST]: TRUST,
  [WALLET_PROVIDER.STATUS]: STATUS,
}

export default providers
