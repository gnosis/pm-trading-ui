import React from 'react'
import cn from 'classnames/bind'
import PropTypes from 'prop-types'
import { lifecycle } from 'recompose'
import { Link, withRouter } from 'react-router-dom'
import Decimal from 'decimal.js'
import DecimalValue from 'components/DecimalValue'
import InteractionButton from 'containers/InteractionButton'
import LinkIcon from 'assets/img/icons/icon_link.svg'
import WalletIcon from 'assets/img/icons/icon_wallet.svg'
import style from './ClaimReward.mod.scss'

const cx = cn.bind(style)

const ClaimReward = ({
  closeModal, currentAccount, currentBalance, gasPrice,
}) => {
  const handleRegistration = async () => {
    closeModal()
  }
  const disabled = false

  return (
    <div className={cx('claimRewards')}>
      <button className={cx('closeButton')} onClick={closeModal} />
      <div className={cx('claimContainer')}>
        <h4 className={cx('heading')}>Claim GNO</h4>
        <p className={cx('annotation')}>
          In order to claim your <span className={cx('rewardInfo')}>0.2 GNO</span> tokens, you first have to switch to
          the <span className={cx('network')}>MAINNET</span> network in your MetaMask wallet. Also make sure you have
          enough ETH to submit the transaction with the claim request. More information in{' '}
          <Link to="/game-guide" href="/game-guide">
            FAQ
          </Link>.
        </p>
        <div className={cx('currentNetworkContainer')}>
          Current network:
          <span className={cx('network')}>RINKEBY</span>
        </div>
        <p className={cx('gasCosts')}>
          Gas Costs: <span className={cx('gasEstimation')}>0.004 ETH</span>
        </p>
        <InteractionButton
          onClick={handleRegistration}
          className={cx('btn', 'btn-primary', 'claim')}
          disabled={disabled}
        >
          CLAIM
        </InteractionButton>
      </div>
    </div>
  )
}

ClaimReward.propTypes = {
  closeModal: PropTypes.func.isRequired,
  currentAccount: PropTypes.string.isRequired,
  currentBalance: PropTypes.string.isRequired,
  gasPrice: PropTypes.instanceOf(Decimal).isRequired,
  registrationGasCost: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
}

export default withRouter(lifecycle({
  componentDidMount() {
    this.props.requestGasPrice()
  },
})(ClaimReward))
