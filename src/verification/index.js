import React from 'react'
import PropTypes from 'prop-types'
import { getFeatureConfig, isFeatureEnabled } from 'utils/features'

// if you want to create your own integration of a KYC/AML verification provider,
// take a look at the existing one in /verification/onfido.
// here's a rundown of what you need to do in order to get started with your own provider integrations:
// - KYC/AML Verificators are just React Components. This file manages which one to display,
//   they are shown from the "Verification" modal which you can find /components/ModalContent/Verification.
//   It will automaticaaly show an error modal if your verification fails
// - Verifications use containers that in the end, use the `setVerificationStatus` action
//   from /store/actions/account.js, which will write in the accounts local redux-store, to say if this
//   user was verified or not. It is your responsibility to ensure that an unidentified user won't be
//   able to access the interface, via backend and smart contract restrictions.
// For further information, check the documentation of the pm-apollo package at https://gnosis-apollo.readthedocs.io/en/latest/

// verification integrations
import onfido from './onfido'

// check for feature flag
const verificationEnabled = isFeatureEnabled('verification')

// add new verification components here
const verificationComponents = {
  onfido,
}

const {
  handler,
  config,
} = getFeatureConfig('verification')

class VerificationHandler extends React.Component {
  constructor(props) {
    super(props)

    this.enabled = verificationEnabled
    this.verificator = undefined

    if (verificationEnabled) {
      if (typeof verificationComponents[handler] !== 'undefined') {
        this.VerificationComponent = verificationComponents[handler]
      } else {
        console.warn(`unknown verification ${handler}`)
      }
    }
  }

  render() {
    const { errorComponent: ErrorComponent, ...props } = this.props
    if (!this.VerificationComponent) {
      return <ErrorComponent {...props} />
    }

    return (
      <this.VerificationComponent {...config} {...props} />
    )
  }
}

VerificationHandler.propTypes = {
  errorComponent: PropTypes.func,
}

VerificationHandler.defaultProps = {
  errorComponent: React.createElement('span'),
}

export default VerificationHandler
