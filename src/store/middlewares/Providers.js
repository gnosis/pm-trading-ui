import integrations from 'integrations'
import { getMainnetAddressForRinkebyAccount } from 'api'
import { initGnosis, updateCollateralToken } from 'store/actions/blockchain'
import { setMainnetAddress } from 'store/actions/account'
import { runProviderRegister, runProviderUpdate, updateProvider } from 'integrations/store/actions'
import { getProvider, hasAcceptedTermsAndConditions } from 'integrations/store/selectors'
import { getProviderConfig, isFeatureEnabled, getFeatureConfig } from 'utils/features'
import { WALLET_STATUS, WALLET_PROVIDER } from 'integrations/constants'
import { openModal, closeModal } from 'store/actions/modal'

const providers = getProviderConfig()
const registrationConfig = getFeatureConfig('registration')
const legalComplianceEnabled = isFeatureEnabled('legalCompliance')
const requireRegistration = isFeatureEnabled('registration')
const requireVerification = isFeatureEnabled('verification')

const registrationContractAddress = registrationConfig.contractAddress

if (!providers.length) {
  console.error(`No providers specified. It means you won't be able to interact with the application.
  You need to configure providers, please check our docs for details: https://gnosis-apollo.readthedocs.io/en/latest/index.html`)
}

export default store => next => async (action) => {
  const { dispatch, getState } = store
  const prevState = getState()
  const handledAction = next(action)
  const { type, payload } = action

  const providerOptions = {
    runProviderUpdate: (provider, data) => dispatch(runProviderUpdate(provider, data)),
    runProviderRegister: (provider, data) => dispatch(runProviderRegister(provider, data)),
    initGnosis: () => dispatch(initGnosis()),
    dispatch,
  }

  if (type === 'CHECK_AVAILABLE_PROVIDERS') {
    const opts = { ...providerOptions, runProviderUpdate: (provider, data) => dispatch(updateProvider(provider, data)) }
    providers.map(provider => integrations[provider].checkAvailability(opts))
  }

  if (type === 'TRY_TO_INIT_LAST_USED_PROVIDER') {
    const providerAvailable = integrations[payload].checkIfInstalled()
    if (providerAvailable) {
      integrations[payload].initialize({ ...providerOptions, silent: true })
    }
  }

  if (type === 'INIT_PROVIDERS') {
    if (payload && payload.provider) {
      integrations[payload.provider].initialize(providerOptions)
    }
  }

  if (type === 'PROVIDER_LOGOUT') {
    Object.keys(integrations).forEach((providerName) => {
      const integration = integrations[providerName]

      if (integration.constructor.providerName === payload) {
        integration.logout()
      }
    })
  }

  if (type === 'UPDATE_PROVIDER') {
    if (payload) {
      const { provider, status, account } = payload

      if (provider === WALLET_PROVIDER.METAMASK) {
        if (status === WALLET_STATUS.USER_ACTION_REQUIRED) {
          dispatch(openModal({ modalName: 'ModalUnlockMetamask' }))
        }
      }

      if (status === WALLET_STATUS.INITIALIZED) {
        const state = getState()
        const prevStatus = getProvider(prevState, provider).status
        const firstInitialization = prevStatus !== status
        const shouldAcceptTOS = !hasAcceptedTermsAndConditions(state) && !legalComplianceEnabled

        if (firstInitialization) {
          if (shouldAcceptTOS) {
            dispatch(openModal({ modalName: 'ModalAcceptTOS' }))
            return handledAction
          }
          if (requireVerification) {
            // Verification has to implement the modals below:
            // - Registration
            // - Accept TOS
            dispatch(openModal({ modalName: 'ModalVerification' }))
            return handledAction
          }
          if (requireRegistration && account) {
            // Registration has to implement the modals below
            // - Accept TOS
            const mainnetAddress = await getMainnetAddressForRinkebyAccount(registrationContractAddress, account)
            dispatch(setMainnetAddress(account, mainnetAddress))

            if (!mainnetAddress) {
              // setTimeout because 'ModalRegisterWallet needs to know wallet address but doesn't have it yet
              setTimeout(() => dispatch(openModal({ modalName: 'ModalRegisterWallet' }), 1000))
            } else {
              dispatch(closeModal())
            }

            return handledAction
          }

          dispatch(closeModal())
        }
      }

      if (status === WALLET_STATUS.ERROR) {
        const prevStatus = getProvider(prevState, provider).status

        if (prevStatus !== status) {
          dispatch(openModal({ modalName: 'ModalInitialisationError', modalData: { provider } }))
        }
      }
    }
  }

  return handledAction
}
