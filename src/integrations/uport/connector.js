import ReactDOM from 'react-dom'
import Block from 'components/layout/Block'
import Bold from 'components/layout/Bold'
import Paragraph from 'components/layout/Paragraph'
import * as React from 'react'
import { Connect, SimpleSigner } from 'uport-connect'
import { isValid as isValidPushNotificaiton } from './uportNotifications'
import { isValid as isValidQrCredential } from './uportQr'
import { notificationsEnabled } from './connector'

export const UPORT_OLYMPIA_KEY = 'GNOSIS_OLYMPIA_USER'

const UPORT_OLYMPIA_KEY = 'GNOSIS_OLYMPIA_USER'
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
      <Bold>Gnosis Olympia</Bold>
    </Paragraph>
    <Paragraph size="small">
      {'By logging in via uPort, you agree to Olympia\'s '}
      <Bold>
        {/* <Link>s rendered outside of a router context cannot navigate */}
        <a style={TermsStyle} href="/uport-terms" target="_blank">
          {'terms of use'}
        </a>
      </Bold>
    </Paragraph>
  </Block>
)

const uport = new Connect('Gnosis', {
  clientId: '2ozUxc1QzFVo7b51giZsbkEsKw2nJ87amAf',
  network: 'rinkeby',
  signer: SimpleSigner('80b6d12233a5dc01ea46ebf773919f2418b44412c6318d0f2b676b3a1c6b634a'),
})

export const getCredentialsFromLocalStorage = () => {
  const cred = localStorage.getItem(UPORT_OLYMPIA_KEY)

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
    localStorage.setItem(UPORT_OLYMPIA_KEY, JSON.stringify(cred))

    return cred
  } catch (err) {
    localStorage.removeItem(UPORT_OLYMPIA_KEY)
    return null
  }
}

const initUportConnector = async (useNotifications) => {
  const provider = useNotifications ? await import('./uportNotifications') : await import('./uportQr')

  return provider.default(uport, requestCredentials(useNotifications), getCredentialsFromLocalStorage)
}

export default initUportConnector
