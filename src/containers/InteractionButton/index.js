import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import cn from 'classnames'

import Tooltip from 'rc-tooltip'
import 'rc-tooltip/assets/bootstrap.css'

import LoadingIndicator from 'components/LoadingIndicator'

import { checkWalletConnection, isGnosisInitialized, isConnectedToCorrectNetwork, isOnWhitelist } from 'selectors/blockchain'

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

  const isDisabled = disabled || !hasWallet || !gnosisInitialized || !correctNetwork
  const isLoading = loading || !gnosisInitialized

  const btn = (
    <button
      className={cn(
        className,
        { disabled },
      )}
      type={type || 'button'}
      onClick={onClick && !disabled ? onClick : null}
      disabled={disabled}
    >
      {children}
    </button>
  )

  if (isLoading) {
    return <LoadingIndicator />
  }

  if (isDisabled) {
    return <Tooltip overlay="You need a wallet connected in order to create a market">{btn}</Tooltip>
  }

  if (!correctNetwork) {
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
