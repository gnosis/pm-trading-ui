import { shouldUseMetamask } from 'utils/configuration'
import LayoutMetamask from './LayoutMetamask'
import LayoutUport from './LayoutUport'

export default shouldUseMetamask() ? LayoutMetamask : LayoutUport
