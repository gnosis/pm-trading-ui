/* globals ga */
import { getThirdPartyConfig } from 'utils/features'

export const THIRD_PARTY_ID = 'googleAnalytics'

const config = getThirdPartyConfig(THIRD_PARTY_ID)

const GOOGLE_ANALYTICS_URL = 'https://www.google-analytics.com/analytics.js'

export const ga = (...args) =>
  (window.ga && window.ga.q && window.ga.q(...args)) ||
  (window.ga && window.ga(...args)) ||
  (() => {})(...args) // no-op

const loadGoogleAnalytics = () => new Promise((resolve) => {
  const script = document.createElement('script')
  script.src = GOOGLE_ANALYTICS_URL
  script.type = 'text/javascript'

  document.head.appendChild(script)

  script.onload = () => {
    ga('create', '', 'auto', config.name)
    ga('send', 'pageview')

    resolve()
  }
})

export const gaSend = (...args) => ga(config.name, ...args)

export default loadGoogleAnalytics
