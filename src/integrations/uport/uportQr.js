const isValid = cred => !!cred

const assignSessionProps = (cred, uport) => {
  // eslint-disable-next-line
  uport.address = cred.address
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
