import React from 'react'
import PropTypes from 'prop-types'
import Decimal from 'decimal.js'
import cn from 'classnames/bind'
import DecimalValue from 'components/DecimalValue'
import Icon from 'components/Icon'
import InteractionButton from 'containers/InteractionButton'
import { collateralTokenToText } from 'components/CurrencyName'
import { weiToEth } from 'utils/helpers'
import style from './RedeemWinnings.mod.scss'

const cx = cn.bind(style)
const iconSize = 64

const RedeemWinnings = ({
  collateralToken, winningsAmount, handleRedeemWinnings, transactionGas,
}) => (
  <div className={cx('redeemWinning')}>
    <div className={cx('detailsContainer')}>
      <Icon type="achievementBadge" size={iconSize} />
      <div className={cx('details')}>
        <div className={cx('heading')}>
          <DecimalValue value={weiToEth(winningsAmount)} /> {collateralTokenToText(collateralToken)}
        </div>
        <div className={cx('label')}>Your Winnings</div>
      </div>
    </div>
    <div className={cx('action')}>
      <InteractionButton className={cx('redeemButton', 'btn btn-primary')} onClick={handleRedeemWinnings}>
        Redeem Winnings
      </InteractionButton>
      <span className={cx('gasCost')}>Gas cost: {transactionGas} ETH</span>
    </div>
  </div>
)

RedeemWinnings.propTypes = {
  collateralToken: PropTypes.string.isRequired,
  winningsAmount: PropTypes.instanceOf(Decimal).isRequired,
  handleRedeemWinnings: PropTypes.func.isRequired,
  transactionGas: PropTypes.string.isRequired,
}

export default RedeemWinnings
