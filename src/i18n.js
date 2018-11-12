
import i18n from 'i18next'
import { reactI18nextModule } from 'react-i18next'
import Backend from 'i18next-xhr-backend'
import LanguageDetector from 'i18next-browser-languagedetector'

function loadLocales(url, options, callback, data) {
  try {
    const locale = require(`./assets/locales/${url}.json`)
    callback(locale, { status: '200' })
  } catch (e) {
    callback(null, { status: '404' })
  }
}

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(reactI18nextModule) // passes i18n down to react-i18next
  .init({
    backend: {
      loadPath: '{{lng}}/{{ns}}',
      parse: d => d, // already parsed
      ajax: loadLocales,
    },
    // debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
