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
