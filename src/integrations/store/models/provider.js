import { Record } from 'immutable'
import { WALLET_STATUS } from 'integrations/constants'

const ProviderRecord = Record(
  {
    name: undefined,
    network: undefined,
    balance: undefined,
    account: undefined,
    networkId: 0,
    mainnetAddress: undefined,
    verificationHash: undefined,
    status: WALLET_STATUS.REGISTERED,
  },
  'Provider',
)

export default ProviderRecord
