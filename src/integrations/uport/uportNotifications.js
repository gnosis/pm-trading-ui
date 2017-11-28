import { decodeToken } from 'jsontokens'

const isValid = (cred) => {
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
  const valid = expiration - oneDay > now

  return valid
}

const assignSessionProps = (cred, uport) => {
  /* eslint-disable */
  uport.address = cred.address
  uport.pushToken = cred.pushToken
  uport.publicEncKey = cred.publicEncKey
  /* eslint-enable */
}

const init = async (uport, requestCredentials, getCredential) => {
  let credential = getCredential()
  if (!isValid(credential)) {
    await requestCredentials()
  }

  credential = getCredential()

  if (credential) {
    assignSessionProps(uport, credential)
  }

  return uport
}

export default init
