import React from 'react'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import cn from 'classnames/bind'
import Decimal from 'decimal.js'
import DecimalValue from 'components/DecimalValue'
import OutcomeColorBox from 'components/Outcome/OutcomeColorBox'
import { marketShareShape } from 'utils/shapes'
import { LOWEST_VALUE } from 'utils/constants'
import style from './ShareRow.scss'

const cx = cn.bind(style)

const ShareRow = ({
  ableToSell, share, outcomeName, onSellClick, t,
}) => {
  const shareBalance = Decimal(share.balance)
    .div(1e18)
    .gte(LOWEST_VALUE) ? (
      <DecimalValue value={Decimal(share.balance).div(1e18)} />
    ) : (
      `< ${LOWEST_VALUE}`
    )
  const onClickHandler = e => onSellClick(e, share.id)

  return (
    <tr>
      <td>
        <OutcomeColorBox outcomeIndex={share.outcomeToken.index} />
      </td>
      <td>
        {outcomeName}
      </td>
      <td>
        {shareBalance}
      </td>
      <td>
        {ableToSell && (
          <button type="button" className={cx('ShareSellButton')} onClick={onClickHandler}>
            {t('market.sell_tokens')}
          </button>
        )}
      </td>
    </tr>
  )
}

ShareRow.propTypes = {
  ableToSell: PropTypes.bool,
  share: marketShareShape,
  outcomeName: PropTypes.string,
  onSellClick: PropTypes.func,
  t: PropTypes.func.isRequired,
}

ShareRow.defaultProps = {
  outcomeName: '',
  ableToSell: false,
  share: {},
  onSellClick: () => {},
}

export default withNamespaces()(ShareRow)
