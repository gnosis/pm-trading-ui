import { Connect, SimpleSigner } from 'uport-connect'

const uport = new Connect('Gnosis', {
    clientId: '2ozUxc1QzFVo7b51giZsbkEsKw2nJ87amAf',
    network: 'rinkeby',
    signer: SimpleSigner('80b6d12233a5dc01ea46ebf773919f2418b44412c6318d0f2b676b3a1c6b634a'),
})

export default uport

export const requestCredentials = async () => {
    await uport.requestCredentials({ notifications: true })
}
