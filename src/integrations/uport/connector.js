import { Connect, SimpleSigner } from 'uport-connect'
import { getUportOptions, isTournament } from 'utils/configuration'
import { isValid as isValidPushNotificaiton } from './uportNotifications'
import { isValid as isValidQrCredential } from './uportQr'
import { notificationsEnabled } from './connector'

const {
  clientId, appName, network, privateKey,
} = getUportOptions()
const tournament = isTournament()

export const UPORT_KEY = `${appName}_USER`

let uport = null
// http://developer.uport.me/guides.html#register-your-app
export const connect = () => {
  if (!tournament) {
    uport = new Connect('Gnosis', {
      clientId: '2ozUxc1QzFVo7b51giZsbkEsKw2nJ87amAf',
      network: 'rinkeby',
      signer: SimpleSigner('80b6d12233a5dc01ea46ebf773919f2418b44412c6318d0f2b676b3a1c6b634a'),
    })
  } else {
    uport = new Connect(appName, {
      clientId,
      network,
      signer: SimpleSigner(privateKey),
    })
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

const requestCredentials = useNotifications => async () => {
  try {
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
