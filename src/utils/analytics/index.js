import { isThirdPartyIntegrationEnabled, getThirdPartyConfig } from 'utils/features'

import loadGoogleAnalytics, { THIRD_PARTY_ID as GOOGLE_ANALYTICS } from './google'
// import loadIntercom, { THIRD_PARTY_ID as INTERCOM } from './intercom'

const THIRD_PARTY_INTEGRATIONS = {
  [GOOGLE_ANALYTICS]: loadGoogleAnalytics,
//  [INTERCOM]: () => {}, // TBD
}

const initAnalytics = () => {
  Object.keys(THIRD_PARTY_INTEGRATIONS).forEach((THIRD_PARTY_ID) => {
    if (isThirdPartyIntegrationEnabled(THIRD_PARTY_ID)) {
      const init = THIRD_PARTY_INTEGRATIONS[THIRD_PARTY_ID]
      const thirdPartyConfig = getThirdPartyConfig(THIRD_PARTY_ID)


      // console.info(`Loading third party: ${THIRD_PARTY_ID}`)
      init(thirdPartyConfig)
        .then(() => {
        // console.info(`Finished loading third party: ${THIRD_PARTY_ID}`)
        })
    }
  })
}

export default initAnalytics
