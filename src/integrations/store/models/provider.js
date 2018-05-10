import { Record } from 'immutable'

const ProviderRecord = Record(
  {
    name: undefined,
    available: false,
    loaded: false,
    network: undefined,
    balance: undefined,
    account: undefined,
    priority: 1,
    networkId: 0,
    mainnetAddress: undefined,
  },
  'Provider',
)

export default ProviderRecord
