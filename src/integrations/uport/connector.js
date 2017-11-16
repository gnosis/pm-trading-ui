import { decodeToken } from 'jsontokens'
import { Connect, SimpleSigner } from 'uport-connect'

export const UPORT_OLYMPIA_KEY = 'GNOSIS_OLYMPIA_USER'

const uport = new Connect('Gnosis', {
  clientId: '2ozUxc1QzFVo7b51giZsbkEsKw2nJ87amAf',
  network: 'rinkeby',
  signer: SimpleSigner('80b6d12233a5dc01ea46ebf773919f2418b44412c6318d0f2b676b3a1c6b634a'),
})

export default uport

export const requestCredentials = async () => {
  try {
    const cred = await uport.requestCredentials({ notifications: true })
    localStorage.setItem(UPORT_OLYMPIA_KEY, JSON.stringify(cred))
  } catch (err) {
    localStorage.removeItem(UPORT_OLYMPIA_KEY)
  }
}

export const getCredentialsFromLocalStorage = () => {
  const cred = localStorage.getItem(UPORT_OLYMPIA_KEY)

  return cred ? JSON.parse(cred) : cred
}

export const hasValidCredential = () => {
  const cred = getCredentialsFromLocalStorage()
  if (cred === null) {
    return false
  }

  const pushToken = decodeToken(cred.pushToken)
  if (!pushToken) {
    return false
  }

  const expiration = pushToken.payload.exp // When the uPort credential will expire
  const oneDay = 24 * 60 * 6 // one day in seconds
  const now = new Date() / 1000 // in seconds
  const isValid = (expiration - oneDay) > now

  return isValid
}
