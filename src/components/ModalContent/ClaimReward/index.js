import React from 'react'
import cn from 'classnames/bind'
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router-dom'
import Decimal from 'decimal.js'
import { decimalToText, decimalJsTest } from 'components/DecimalValue'
import Tooltip from 'rc-tooltip'
import 'rc-tooltip/assets/bootstrap.css'

import { ETHEREUM_NETWORK_IDS } from 'integrations/constants'
import { getFeatureConfig } from 'utils/features'
import IndefiniteSpinner from 'components/Spinner/Indefinite'
import style from './ClaimReward.mod.scss'

const cx = cn.bind(style)
const { rewardToken } = getFeatureConfig('rewards')

class ClaimReward extends React.Component {
  constructor() {
    super()

    this.state = {
      claimState: 'unknown',
    }

    this.handleClaim = this.handleClaim.bind(this)
  }

  componentDidMount() {
    const { requestGasPrice, requestClaimRewardGasCost } = this.props
    requestGasPrice()
    requestClaimRewardGasCost()
  }

  async handleClaim() {
    const { closeModal, claimUserRewards } = this.props
    await this.setState({ claimState: 'loading' })
    try {
      await claimUserRewards()
      await this.setState({ claimState: 'success' })
    } catch (e) {
      await this.setState({ claimState: 'error' })
      console.error(e)
    }

    await closeModal()
  }

  render() {
    const {
      closeModal,
      gasPrice,
      currentNetwork,
      currentNetworkId,
      claimRewardGasCost,
      currentBalance,
      rewardValue,
    } = this.props

    const { claimState } = this.state

    const targetNetwork = ETHEREUM_NETWORK_IDS[rewardToken.networkId]
    const isWrongNetwork = !Decimal(currentNetworkId).eq(rewardToken.networkId)
    const hasGasCosts = typeof gasPrice !== 'undefined' && typeof claimRewardGasCost !== 'undefined'
    const gasCosts = Decimal(gasPrice || 0)
      .mul(claimRewardGasCost || 0)
      .div(1e18)

    const balance = Decimal(currentBalance)

    let sufficentFunds = balance.gt(0)
    if (hasGasCosts) {
      sufficentFunds = gasCosts.lt(balance)
    }

    let problemMessage
    if (isWrongNetwork) {
      problemMessage = 'Please connect to the mentioned network, before you can claim your reward.'
    } else if (!sufficentFunds) {
      problemMessage = 'You do not have enough ETH for this transaction to cover the gas costs.'
    }

    const canClaim = sufficentFunds && !isWrongNetwork

    let claimButton
    if (claimState === 'loading') {
      claimButton = (
        <button
          className={cx('btn', 'btn-primary', 'claim', 'disabled')}
          disabled
        >
          <IndefiniteSpinner width={16} height={16} />
        </button>
      )
    } else if (claimState === 'error') {
      claimButton = (
        <Tooltip overlay="Unfortunately, the transaction failed. Please try again or contact our support for further assistance.">
          <button className={cx('btn', 'btn-primary', 'claim')}>CLAIM</button>
        </Tooltip>
      )
    } else if (!canClaim) {
      claimButton = (
        <Tooltip overlay={problemMessage}>
          <button
            className={cx('btn', 'btn-primary', 'claim', 'disabled')}
            disabled
          >
            CLAIM
          </button>
        </Tooltip>
      )
    } else {
      claimButton = (
        <button
          onClick={this.handleClaim}
          className={cx('btn', 'btn-primary', 'claim')}
        >
          CLAIM
        </button>
      )
    }

    return (
      <div className={cx('claimRewards')}>
        <button className={cx('closeButton')} onClick={closeModal} />
        <div className={cx('claimContainer')}>
          <h4 className={cx('heading')}>
            Claim
            {rewardToken.symbol}
          </h4>
          <p className={cx('annotation')}>
            In order to claim your{' '}
            <span className={cx('rewardInfo')}>
              {rewardValue} {rewardToken.symbol}
            </span>{' '}
            tokens, you first have to switch to the{' '}
            <span className={cx('network')}>{targetNetwork}</span> network in
            your MetaMask wallet. Also make sure you have enough ETH to submit
            the transaction with the claim request. More information in{' '}
            <Link to="/game-guide" href="/game-guide" className={cx('faqLink')}>
              FAQ
            </Link>
            .
          </p>
          <div className={cx('currentNetworkContainer')}>
            Current network:
            <span className={cx('network', { wrongNetwork: isWrongNetwork })}>
              {currentNetwork}
            </span>
          </div>
          {!isWrongNetwork && (
            <p className={cx('gasCosts')}>
              Estimated Gas Costs:{' '}
              {hasGasCosts ? (
                <b className={cx('gasEstimation')}>{decimalToText(gasCosts)}</b>
              ) : (
                <IndefiniteSpinner width={18} height={18} />
              )}
            </p>
          )}
          {claimButton}
        </div>
      </div>
    )
  }
}

ClaimReward.propTypes = {
  closeModal: PropTypes.func.isRequired,
  currentBalance: PropTypes.string,
  claimUserRewards: PropTypes.func.isRequired,
  requestClaimRewardGasCost: PropTypes.func.isRequired,
  requestGasPrice: PropTypes.func.isRequired,
  currentNetwork: PropTypes.string,
  currentNetworkId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  gasPrice: PropTypes.instanceOf(Decimal),
  claimRewardGasCost: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    decimalJsTest,
  ]),
  rewardValue: PropTypes.number.isRequired,
}

ClaimReward.defaultProps = {
  currentBalance: '0',
  currentNetworkId: 0,
  currentNetwork: '',
  gasPrice: Decimal(0),
  claimRewardGasCost: Decimal(0),
}

export default withRouter(ClaimReward)
