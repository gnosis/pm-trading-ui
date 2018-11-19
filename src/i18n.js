import i18n from 'i18next'
import { reactI18nextModule } from 'react-i18next'

import Backend from 'i18next-xhr-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

import { isFeatureEnabled, getFeatureConfig } from 'utils/features'

const enableI18N = isFeatureEnabled('i18n')
const { forceLanguage } = getFeatureConfig('i18n')

function loadLocales(url, options, callback, data) {
  try {
    const locale = require(`./assets/locales/${url}.json`)
    callback(locale, { status: '200' })
  } catch (e) {
    callback(null, { status: '404' })
  }
}

const i18nConfig = {
  backend: {
    loadPath: '{{lng}}/{{ns}}',
    parse: d => d, // already parsed
    ajax: loadLocales,
  },
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
}

if (!enableI18N) {
  i18nConfig.lng = forceLanguage || 'en'
}

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(reactI18nextModule) // passes i18n down to react-i18next
  .init(i18nConfig)

export default i18n
