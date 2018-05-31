import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames/bind'
import Decimal from 'decimal.js'
import DecimalValue from 'components/DecimalValue'
import OutcomeColorBox from 'components/Outcome/OutcomeColorBox'
import { marketShareShape } from 'utils/shapes'
import { LOWEST_DISPLAYED_VALUE } from 'utils/constants'
import style from './ShareRow.mod.scss'

const cx = cn.bind(style)

const ShareRow = ({
  outcomeColorStyle, ableToSell, share, outcomeName, onSellClick,
}) => {
  const shareBalance = Decimal(share.balance)
    .div(1e18)
    .gte(LOWEST_DISPLAYED_VALUE) ? (
      <DecimalValue value={Decimal(share.balance).div(1e18)} />
    ) : (
      `< ${LOWEST_DISPLAYED_VALUE}`
    )
  const onClickHandler = e => onSellClick(e, share.id)

  return (
    <tr>
      <td>
        <OutcomeColorBox outcomeIndex={share.outcomeToken.index} />
      </td>
      <td>{outcomeName}</td>
      <td>{shareBalance}</td>
      <td>
        {ableToSell && (
          <button className={cx('ShareSellButton')} onClick={onClickHandler}>
            Sell
          </button>
        )}
      </td>
    </tr>
  )
}

ShareRow.propTypes = {
  outcomeColorStyle: PropTypes.shape({
    backgroundColor: PropTypes.string.isRequired,
  }),
  ableToSell: PropTypes.bool,
  share: marketShareShape,
  outcomeName: PropTypes.string,
  onSellClick: PropTypes.func,
}

ShareRow.defaultProps = {
  outcomeColorStyle: {
    backgroundColor: '#fff',
  },
  outcomeName: '',
  ableToSell: false,
  share: {},
  onSellClick: () => {},
}

export default ShareRow
