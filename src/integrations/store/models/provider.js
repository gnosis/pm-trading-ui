import { Record } from 'immutable'

const ProviderRecord = Record(
  {
    name: undefined,
    network: undefined,
    balance: undefined,
    account: undefined,
    networkId: 0,
    mainnetAddress: undefined,
    verificationHash: undefined,
    status: undefined,
  },
  'Provider',
)

export default ProviderRecord
