import React from 'react'
import ReactDOM from 'react-dom'
import { Connect, SimpleSigner } from 'uport-connect'
import { getProviderIntegrationConfig, isFeatureEnabled, getFeatureConfig } from 'utils/features'
import Bold from 'components/layout/Bold'
import Block from 'components/layout/Block'
import Paragraph from 'components/layout/Paragraph'
import { isValid as isValidPushNotificaiton } from './uportNotifications'
import { isValid as isValidQrCredential } from './uportQr'
import { notificationsEnabled } from './connector'

const termsOfUseConfig = getFeatureConfig('termsOfUse')

const {
  clientId, appName, network, privateKey,
} = getProviderIntegrationConfig('uport')
const tournamentEnabled = isFeatureEnabled('tournament')

export const UPORT_KEY = `${appName.replace(' ', '_')}_USER`

const UPORT_QR_TEXT = 'uport-qr-text'

const UportStyle = {
  marginBottom: '20px',
}

const TermsStyle = {
  textDecoration: 'underline',
  color: '#333',
}

const LoginUport = () => (
  <Block id={UPORT_QR_TEXT}>
    <Paragraph style={UportStyle}>
      {'Log into '}
      <Bold>{appName}</Bold>
    </Paragraph>
    {!!termsOfUseConfig.url && (
      <Paragraph size="small">
        By logging in via uPort, <br />
        {` you agree to ${appName}'s `}
        <Bold>
          {/* <Link>s rendered outside of a router context cannot navigate */}
          <a style={TermsStyle} href={termsOfUseConfig.url} target="_blank">
            {'terms of use'}
          </a>
        </Bold>
      </Paragraph>
    )}
  </Block>
)

let uport = null
// Get clientId, privateKey from
// http://developer.uport.me/guides.html#register-your-app
export const connect = () => {
  if (!tournamentEnabled) {
    uport = new Connect('Gnosis', {
      clientId: '2ozUxc1QzFVo7b51giZsbkEsKw2nJ87amAf',
      network: 'rinkeby',
      signer: SimpleSigner('80b6d12233a5dc01ea46ebf773919f2418b44412c6318d0f2b676b3a1c6b634a'),
    })
  } else if (clientId && network && privateKey) {
    uport = new Connect(appName, {
      clientId,
      network,
      signer: SimpleSigner(privateKey),
    })
  } else {
    console.error('No options were specified for uPort')
  }
}

export const getCredentialsFromLocalStorage = () => {
  const cred = localStorage.getItem(UPORT_KEY)

  return cred ? JSON.parse(cred) : cred
}

export const areCredentialsValid = () => {
  const cred = getCredentialsFromLocalStorage()
  return notificationsEnabled ? isValidPushNotificaiton(cred) : isValidQrCredential(cred)
}

export const isUserConnected = uportInstance => !!uportInstance.address

const modifyUportLoginModal = (firstReq) => {
  if (!document && !firstReq) {
    return
  }

  // https://github.com/uport-project/uport-connect/blob/develop/src/util/qrdisplay.js#L41
  // https://github.com/uport-project/uport-connect/blob/develop/src/util/qrdisplay.js#L72
  setTimeout(() => {
    ReactDOM.render(<LoginUport />, document.getElementById(UPORT_QR_TEXT).parentElement)
  }, 100)
}

const requestCredentials = useNotifications => async () => {
  try {
    modifyUportLoginModal(uport.firstReq)
    const cred = await uport.requestCredentials({ notifications: useNotifications })
    localStorage.setItem(UPORT_KEY, JSON.stringify(cred))

    return cred
  } catch (err) {
    localStorage.removeItem(UPORT_KEY)
    return null
  }
}

export const connectorLogOut = () => {
  // localStorage.removeItem(UPORT_KEY)
  // localStorage.removeItem(`GNOSIS_${process.env.VERSION}`)
  localStorage.clear()
  connect()
}

const initUportConnector = async (useNotifications) => {
  const provider = useNotifications ? await import('./uportNotifications') : await import('./uportQr')

  return provider.default(uport, requestCredentials(useNotifications), getCredentialsFromLocalStorage)
}

export default initUportConnector
