import React from 'react'
import PropTypes from 'prop-types'
import { OUTCOME_TYPES } from 'utils/constants'
import ImmutablePropTypes from 'react-immutable-proptypes'
import cn from 'classnames/bind'
import Decimal from 'decimal.js'
import style from './WinningOutcome.scss'

const cx = cn.bind(style)

const WinningOutcome = ({
  type, unit, decimals, winningOutcome,
}) => {
  let outcomeText

  if (type === OUTCOME_TYPES.CATEGORICAL) {
    if (typeof winningOutcome === 'undefined') {
      outcomeText = (
        <>
          <span title={winningOutcome}>Invalid Outcome</span>
        </>
      )
    } else {
      outcomeText = winningOutcome.name
    }
  } else if (type === OUTCOME_TYPES.SCALAR) {
    const outcomeValue = Decimal(winningOutcome)
      .div(10 ** decimals)
      .toString()
    outcomeText = (
      <>
        {outcomeValue} <span className={cx('winningOutcomeUnit')}>{unit}</span>
      </>
    )
  }

  return (
    <div className={cx('winningOutcomeContainer')}>
      <div className={cx('winningOutcomeIcon')} />
      <span className={cx('winningOutcomeLabel')}>
        Winning
        <br />
        outcome
      </span>
      <div className={cx('winningOutcomeText')}>{outcomeText}</div>
    </div>
  )
}

WinningOutcome.propTypes = {
  type: PropTypes.oneOf(Object.keys(OUTCOME_TYPES)).isRequired,
  winningOutcome: PropTypes.oneOfType([PropTypes.number, ImmutablePropTypes.record]).isRequired,
  unit: PropTypes.string,
  decimals: PropTypes.number,
}

WinningOutcome.defaultProps = {
  unit: undefined,
  decimals: 0,
}

export default WinningOutcome
