import { Record } from 'immutable'

const ProviderRecord = Record({
  name: undefined,
  available: false,
  loaded: false,
  network: undefined,
  account: null,
  priority: undefined,
  networkId: 0,
}, 'Provider')

export default ProviderRecord
