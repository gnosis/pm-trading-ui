import React from 'react'
import cn from 'classnames/bind'
import { compose } from 'recompose'
import { Trans, withNamespaces } from 'react-i18next'
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router-dom'
import Decimal from 'decimal.js'
import { decimalToText, decimalJsTest } from 'components/DecimalValue'
import Tooltip from 'rc-tooltip'
import 'rc-tooltip/assets/bootstrap.css?raw'

import { ETHEREUM_NETWORK_IDS } from 'integrations/constants'
import { getFeatureConfig } from 'utils/features'
import IndefiniteSpinner from 'components/Spinner/Indefinite'
import style from './ClaimReward.scss'

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
    const { closeModal, claimUserRewards, rewardValue } = this.props
    await this.setState({ claimState: 'loading' })
    try {
      await claimUserRewards(rewardValue)
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
      hasClaimedReward,
      t,
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
      problemMessage = t('reward_claim.errors.wrong_network')
    } else if (!sufficentFunds) {
      problemMessage = t('reward_claim.errors.not_enough_balance')
    }

    const canClaim = sufficentFunds && !isWrongNetwork

    let claimButton
    if (hasClaimedReward) {
      claimButton = (
        <button type="button" className={cx('btn', 'btn-primary', 'claim', 'disabled')} disabled>
          {t('reward_claim.already_claimed').toUpperCase()}
        </button>
      )
    } else if (claimState === 'loading') {
      claimButton = (
        <button type="button" className={cx('btn', 'btn-primary', 'claim', 'disabled')} disabled>
          <IndefiniteSpinner width={16} height={16} />
        </button>
      )
    } else if (claimState === 'error') {
      claimButton = (
        <Tooltip overlay={t('reward_claim.errors.failed_tx_ask_support')}>
          <button type="button" className={cx('btn', 'btn-primary', 'claim')}>CLAIM</button>
        </Tooltip>
      )
    } else if (!canClaim) {
      claimButton = (
        <Tooltip overlay={problemMessage}>
          <button type="button" className={cx('btn', 'btn-primary', 'claim', 'disabled')} disabled>
            {t('reward_claim.claim').toUpperCase()}
          </button>
        </Tooltip>
      )
    } else {
      claimButton = (
        <button type="button" onClick={this.handleClaim} className={cx('btn', 'btn-primary', 'claim')}>
          {t('reward_claim.claim').toUpperCase()}
        </button>
      )
    }

    return (
      <div className={cx('claimRewards')}>
        <button type="button" className={cx('closeButton')} onClick={closeModal} />
        <div className={cx('claimContainer')}>
          <h4 className={cx('heading')}>Claim {rewardToken.symbol}</h4>
          <p className={cx('annotation')}>
            <Trans key="reward_claim.info">
              In order to claim your&nbsp;
              <span className={cx('rewardInfo')}>
                {rewardValue} {rewardToken.symbol}
              </span>&nbsp;
              tokens, you first have to switch to the <span className={cx('network')}>{targetNetwork}</span> network in
              your MetaMask wallet. Also make sure you have enough ETH to submit the transaction with the claim request.
              More information in our&nbsp;
              <Link to="/game-guide" href="/game-guide" className={cx('faqLink')}>
                FAQ
              </Link>
              .
            </Trans>
          </p>
          <div className={cx('currentNetworkContainer')}>
            {t('reward_claim.current_network')}
            <span className={cx('network', { wrongNetwork: isWrongNetwork })}>{currentNetwork}</span>
          </div>
          {!isWrongNetwork && (
            <p className={cx('gasCosts')}>
              {t('reward_claim.gas_estimation')}
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
  claimRewardGasCost: PropTypes.oneOfType([PropTypes.string, PropTypes.number, decimalJsTest]),
  rewardValue: PropTypes.number.isRequired,
  hasClaimedReward: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
}

ClaimReward.defaultProps = {
  currentBalance: '0',
  currentNetworkId: 0,
  currentNetwork: '',
  gasPrice: Decimal(0),
  claimRewardGasCost: Decimal(0),
}

const enhancer = compose(
  withRouter,
  withNamespaces(),
)

export default enhancer(ClaimReward)
