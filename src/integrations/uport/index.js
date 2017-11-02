import { WALLET_PROVIDER } from 'integrations/constants'
import InjectedWeb3 from 'integrations/injectedWeb3'
import { Connect, SimpleSigner } from 'uport-connect'

let instance = null

class Uport extends InjectedWeb3 {
    static providerName = WALLET_PROVIDER.UPORT

    /**
   * Provider with highest priority starts off as active, if other providers are also available.
   * This allows "fallback providers" like a remote ethereum host to be used as a last resort.
   */
    static providerPriority = 100

    constructor() {
        if (!instance) {
            super(false, 0)
            instance = this
        }
        return instance
    }

    /**
   * Tries to initialize and enable the current provider
   * @param {object} opts - Integration Options
   * @param {function} opts.runProviderUpdate - Function to run when this provider updates
   * @param {function} opts.runProviderRegister - Function to run when this provider registers
   */
    async initialize(opts) {
        super.initialize(opts)
        this.runProviderRegister(this, { priority: Uport.providerPriority })

        this.uport = new Connect('Gnosis', {
            clientId: '2ozUxc1QzFVo7b51giZsbkEsKw2nJ87amAf',
            network: 'rinkeby',
            signer: SimpleSigner('80b6d12233a5dc01ea46ebf773919f2418b44412c6318d0f2b676b3a1c6b634a'),
        })

        if (!opts.uportDefaultAccount) {
            await this.uport.requestCredentials({ notifications: true })
        }

        this.web3 = await this.uport.getWeb3()

        this.provider = await this.uport.getProvider()
        this.network = await this.getNetwork()
        this.networkId = await this.getNetworkId()
        this.account = opts.uportDefaultAccount || await this.getAccount()

        return this.runProviderUpdate(this, {
            available: true,
            network: this.network,
            networkId: this.networkId,
            account: this.account,
        })
    }
}

export default new Uport()
