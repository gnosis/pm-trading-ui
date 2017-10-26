import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import cn from 'classnames'

import Tooltip from 'rc-tooltip'
import 'rc-tooltip/assets/bootstrap.css'

import LoadingIndicator from 'components/LoadingIndicator'

import { checkWalletConnection, isGnosisInitialized, isConnectedToCorrectNetwork, isOnWhitelist } from 'selectors/blockchain'

import './interactionButton.less'

const InteractionButton = ({
  className,
  onClick,
  hasWallet,
  correctNetwork,
  gnosisInitialized,
  whitelistRequired,
  whitelisted,
  children,
  type,
  disabled,
  loading,
}) => {
  if (whitelistRequired && !whitelisted) {
    return null
  }

  // "you need a wallet"
  const walletError = !hasWallet || !gnosisInitialized

  // "you are on the wrong chain"
  const networkError = !correctNetwork

  // loading from props or uninitialized gnosisjs
  const isLoading = loading || !gnosisInitialized

  // disabled from props or wallet error or network error
  const isDisabled = disabled || walletError || networkError

  const classNames = cn(
    'interactionButton',
    className,
    { disabled: isDisabled },
    { loading: isLoading },
  )

  const btn = (
    <button
      className={classNames}
      type={type || 'button'}
      onClick={(e) => {
        if (isDisabled) {
          e.preventDefault()
          return
        }

        if (typeof onClick === 'function') {
          onClick()
        }
      }}
      disabled={isDisabled}
    >
      {children}
    </button>
  )

  if (isLoading) {
    return (
      <button className={classNames} type="button" disabled>
        <LoadingIndicator width={28} height={28} />
      </button>
    )
  }

  if (walletError) {
    return <Tooltip overlay="You need a wallet connected in order to create a market">{btn}</Tooltip>
  }

  if (networkError) {
    return <Tooltip overlay="You are connected to the wrong chain. You can only interact with Gnosis when you're on the same chain as us.">{btn}</Tooltip>
  }

  return btn
}

InteractionButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  hasWallet: PropTypes.bool,
  correctNetwork: PropTypes.bool,
  gnosisInitialized: PropTypes.bool,
  whitelisted: PropTypes.bool,
  whitelistRequired: PropTypes.bool,
  children: PropTypes.node,
  type: PropTypes.oneOf(['button', 'submit']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
}

export default connect(state => ({
  hasWallet: checkWalletConnection(state),
  gnosisInitialized: isGnosisInitialized(state),
  correctNetwork: isConnectedToCorrectNetwork(state),
  whitelisted: isOnWhitelist(state),
}))(InteractionButton)
