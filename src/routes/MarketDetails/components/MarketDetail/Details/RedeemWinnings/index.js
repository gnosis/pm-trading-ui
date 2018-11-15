import React from 'react'
import { withNamespaces } from 'react-i18next'
import PropTypes from 'prop-types'
import Decimal from 'decimal.js'
import cn from 'classnames/bind'
import DecimalValue from 'components/DecimalValue'
import Icon from 'components/Icon'
import InteractionButton from 'containers/InteractionButton'
import CurrencyName from 'components/CurrencyName'
import { weiToEth } from 'utils/helpers'
import style from './RedeemWinnings.scss'

const cx = cn.bind(style)
const iconSize = 64

const RedeemWinnings = ({
  collateralToken, winningsAmount, handleRedeemWinnings, transactionGas, t,
}) => (
  <div className={cx('redeemWinning')}>
    <div className={cx('detailsContainer')}>
      <Icon type="achievementBadge" size={iconSize} />
      <div className={cx('details')}>
        <div className={cx('heading')}>
          <DecimalValue value={weiToEth(winningsAmount)} /> <CurrencyName tokenAddress={collateralToken} />
        </div>
        <div className={cx('label')}>{t('market.your_winnings')}</div>
      </div>
    </div>
    <div className={cx('action')}>
      <InteractionButton className={cx('redeemButton', 'btn btn-primary')} onClick={handleRedeemWinnings}>
        {t('market.redeem_winnings')}
      </InteractionButton>
      <span className={cx('gasCost')}>{t('market.gas_cost', { cost: transactionGas })}</span>
    </div>
  </div>
)

RedeemWinnings.propTypes = {
  collateralToken: PropTypes.string.isRequired,
  winningsAmount: PropTypes.instanceOf(Decimal).isRequired,
  handleRedeemWinnings: PropTypes.func.isRequired,
  transactionGas: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
}

export default withNamespaces()(RedeemWinnings)
