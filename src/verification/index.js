import { getFeatureConfig, isFeatureEnabled } from 'utils/features'

// verification integrations
import onfido from './onfido'

const verificationEnabled = isFeatureEnabled('verification')
const {
  handler,
} = getFeatureConfig('verification')

const verificationHandlers = {
  onfido,
}

let verificationHandler
let isActive = false
if (verificationEnabled && typeof verificationHandlers[handler] === 'function') {
  verificationHandler = verificationHandlers[handler]
  isActive = true
}

export const verifcationActive = isActive
export default verificationHandler
