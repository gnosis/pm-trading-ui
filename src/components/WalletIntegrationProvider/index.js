import { getGnosisConnection, getOlympiaTokensByAcoount } from 'api'
import { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'
import { map } from 'lodash'
import { registerProvider, updateProvider, initGnosis } from 'actions/blockchain'
import { getUportDefaultAccount, isGnosisInitialized } from 'selectors/blockchain'

const GNOSIS_REINIT_KEYS = ['network', 'account', 'available']

class WalletIntegrationProvider extends Component {
  constructor(props) {
    super(props)
    const { integrations } = props

    const providerOptions = {
      runProviderUpdate: this.handleProviderUpdate,
      runProviderRegister: this.handleProviderRegister,
    }

    window.addEventListener('load', () =>
      Promise.all(map(integrations, integration => integration.initialize(providerOptions)))
        .then(this.props.initGnosis)
        .catch(this.props.initGnosis),
    )
  }

  @autobind
  async handleProviderUpdate(provider, data) {
    await this.props.updateProvider({
      provider: provider.constructor.providerName,
      ...data,
    })

    if (this.props.gnosisInitialized) {
      let requireGnosisReinit = false
      GNOSIS_REINIT_KEYS.forEach((searchKey) => {
        if (Object.keys(data).indexOf(searchKey) > -1) {
          requireGnosisReinit = true
        }
      })

      if (requireGnosisReinit) {
        // Just in case any other provider is updated and the default one
        // is UPORT we do not want to scan the code again
        await this.props.initGnosis(this.props.uportDefaultAccount)
      }

      return
    }

    if (provider.constructor.providerName === 'UPORT') {
        await this.props.initGnosis(this.props.uportDefaultAccount)
        const account = (await getGnosisConnection()).defaultAccount
        const balance = await getOlympiaTokensByAcoount(account)

        await this.props.updateProvider({
          ...data,
          provider: provider.constructor.providerName,
          account,
          balance,
        })
    }
  }

  @autobind
  async handleProviderRegister(provider, data) {
    if (provider.constructor.providerName === 'UPORT') {
        data.account = this.props.uportDefaultAccount
    }
    await this.props.registerProvider({
      provider: provider.constructor.providerName,
      ...data,
    })
  }

  render() {
    const { children } = this.props

    return children
  }
}

WalletIntegrationProvider.propTypes = {
  children: PropTypes.element,
  integrations: PropTypes.objectOf(PropTypes.object),
  gnosisInitialized: PropTypes.bool,
  registerProvider: PropTypes.func.isRequired,
  updateProvider: PropTypes.func.isRequired,
  initGnosis: PropTypes.func.isRequired,
  uportDefaultAccount: PropTypes.string,
}

const mapStateToProps = state => ({
  gnosisInitialized: isGnosisInitialized(state),
  uportDefaultAccount: getUportDefaultAccount(state),
})

export default connect(mapStateToProps, {
  registerProvider,
  updateProvider,
  initGnosis,
})(WalletIntegrationProvider)
