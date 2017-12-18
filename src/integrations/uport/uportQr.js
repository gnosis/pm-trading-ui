export const isValid = cred => !!cred

const assignSessionProps = (uport, cred) => {
  // eslint-disable-next-line
  uport.address = cred.address
  // eslint-disable-next-line
  uport.firstReq = false
}

const init = async (uport, requestCredentials, getCredential) => {
  let credential = getCredential()
  if (!isValid(credential)) {
    uport.firstReq = true
    credential = await requestCredentials()
  }

  if (credential) {
    assignSessionProps(uport, credential)
  }

  return uport
}

export default init
