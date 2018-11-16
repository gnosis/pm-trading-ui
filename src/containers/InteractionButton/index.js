import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import cn from 'classnames/bind'
import { upperFirst } from 'lodash'

import Tooltip from 'rc-tooltip'
import 'rc-tooltip/assets/bootstrap.css'
import IndefiniteSpinner from 'components/Spinner/Indefinite'
import { isGnosisInitialized, getTargetNetworkId, isConnectedToCorrectNetwork } from 'store/selectors/blockchain'
import { isOnWhitelist, checkWalletConnection, hasAcceptedTermsAndConditions } from 'integrations/store/selectors'
import { ETHEREUM_NETWORK_IDS } from 'integrations/constants'
import style from './interactionButton.scss'

const cx = cn.bind(style)

class InteractionButton extends Component {
  constructor() {
    super()

    this.state = { loading: false }
  }

  componentDidMount() {
    this.mounted = true
  }

  componentWillUnmount() {
    this.mounted = false
  }

  render() {
    const {
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
      targetNetworkId,
      loading,
      termsNotRequiredOrAccepted,
      disableLegalCheck,
      disableWalletCheck,
      error,
    } = this.props
    const { loading: loadingState } = this.state

    if (whitelistRequired && !whitelisted) {
      return null
    }

    // "you need to accept our ToS"
    const termsAndConditionsError = !termsNotRequiredOrAccepted && !disableLegalCheck

    // "you need a wallet"
    const walletError = !disableWalletCheck && (!hasWallet || !gnosisInitialized)

    // "you are on the wrong chain"
    const networkError = !correctNetwork

    // loading from props or uninitialized gnosisjs
    const isLoading = loading || !gnosisInitialized || loadingState

    // disabled from props or wallet error or network error
    const isDisabled = disabled || walletError || networkError

    const classNames = cx('interactionButton', className, { disabled: isDisabled }, { loading: isLoading })

    const onClickHandler = (e) => {
      if (isDisabled) {
        e.preventDefault()
        return
      }

      if (typeof onClick === 'function') {
        const ret = onClick()

        if (typeof ret === 'object' && ret.constructor.name === 'Promise') {
          this.setState({ loading: true })
          ret
            .then(() => {
              if (this.mounted) this.setState({ loading: false })
            })
            .catch(() => {
              if (this.mounted) this.setState({ loading: false })
            })
        }
      }
    }

    const btn = (
      <button className={classNames} type={type || 'button'} onClick={onClickHandler} disabled={isDisabled}>
        <div className={cx('interactionButtonInner')}>{children}</div>
      </button>
    )

    if (isLoading) {
      return (
        <button className={classNames} type="button" disabled>
          <div className={cx('interactionButtonInner')}>{children}</div>
          <IndefiniteSpinner width={28} height={28} centered />
        </button>
      )
    }

    // disabled from props (passed)
    if (disabled && !!error) {
      // button is wrapped in span because of https://github.com/react-component/tooltip/issues/18
      // https://github.com/ant-design/ant-design/commit/f5d697988a9e130379f7506eafee85acca3c030b#diff-186839a30bf8b9d67a4b10bf7c091d5fR88
      const button = React.cloneElement(btn, {
        style: {
          pointerEvents: 'none',
        },
      })
      return (
        <Tooltip overlay={error}>
          <span
            style={{
              display: 'inline-block',
              cursor: 'not-allowed',
              width: '100%',
              height: '100%',
            }}
          >
            {button}
          </span>
        </Tooltip>
      )
    }

    if (termsAndConditionsError) {
      return (
        <Tooltip overlay="You need to accept our terms and conditions before you can interact with this application.">
          {btn}
        </Tooltip>
      )
    }

    if (walletError) {
      return (
        <Tooltip overlay="You need a wallet connected before you can interact with this application.">{btn}</Tooltip>
      )
    }

    if (networkError) {
      const wrongNetworkText = `You are connected to the wrong ethereum network. You can only interact using ${upperFirst(
        (ETHEREUM_NETWORK_IDS[targetNetworkId] || '').toLowerCase(),
      )} network.`
      return <Tooltip overlay={wrongNetworkText}>{btn}</Tooltip>
    }

    return btn
  }
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
  targetNetworkId: PropTypes.number,
  termsNotRequiredOrAccepted: PropTypes.bool,
  disableLegalCheck: PropTypes.bool,
  disableWalletCheck: PropTypes.bool,
  error: PropTypes.node,
}

InteractionButton.defaultProps = {
  className: '',
  onClick: () => {},
  hasWallet: false,
  correctNetwork: false,
  gnosisInitialized: false,
  whitelisted: false,
  whitelistRequired: false,
  children: <div />,
  type: 'button',
  disabled: false,
  loading: false,
  termsNotRequiredOrAccepted: false,
  disableLegalCheck: false,
  disableWalletCheck: false,
  targetNetworkId: 0,
  error: '',
}

export default connect(state => ({
  hasWallet: checkWalletConnection(state),
  gnosisInitialized: isGnosisInitialized(state),
  correctNetwork: isConnectedToCorrectNetwork(state),
  targetNetworkId: getTargetNetworkId(state),
  whitelisted: isOnWhitelist(state),
  termsNotRequiredOrAccepted: hasAcceptedTermsAndConditions(state),
}))(InteractionButton)
