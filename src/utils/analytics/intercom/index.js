import { getThirdPartyConfig } from 'utils/features'

export const THIRD_PARTY_ID = 'intercom'

const { id: APP_ID } = getThirdPartyConfig(THIRD_PARTY_ID)

export default () => {
  const d = document

  const s = d.createElement('script')
  s.type = 'text/javascript'
  s.async = true
  s.src = `https://widget.intercom.io/widget/${APP_ID}`
  const x = d.getElementsByTagName('script')[0]
  x.parentNode.insertBefore(s, x)

  s.onload = () => {
    window.Intercom('boot', {
      app_id: APP_ID,
      consent: true,
    })
  }
}
