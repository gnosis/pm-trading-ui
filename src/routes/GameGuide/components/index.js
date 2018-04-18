import { getProviderConfig } from 'utils/features'
import { WALLET_PROVIDER } from 'integrations/constants'
import LayoutMetamask from './LayoutMetamask'
import LayoutUport from './LayoutUport'

export default getProviderConfig().default === WALLET_PROVIDER ? LayoutMetamask : LayoutUport
