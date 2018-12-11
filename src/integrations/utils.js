// eslint-disable-next-line
export const getLogo = providerName => require(`integrations/${providerName}/assets/${providerName}-logo.svg`)

export const getLastUsedProvider = () => {
  if (window && window.localStorage) {
    return localStorage.getItem('LAST_USED_PROVIDER')
  }

  return undefined
}
