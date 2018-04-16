import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { OUTCOME_TYPES } from 'utils/constants'
import cn from 'classnames/bind'
import Decimal from 'decimal.js'
import style from './WinningOutcome.mod.scss'

const cx = cn.bind(style)

const WinningOutcome = ({
  type,
  unit,
  decimals,
  outcomes,
  winningOutcome,
}) => {
  let outcomeText

  if (type === OUTCOME_TYPES.CATEGORICAL) {
    outcomeText = `${outcomes[winningOutcome]}`
  } else if (type === OUTCOME_TYPES.SCALAR) {
    const outcomeValue = Decimal(winningOutcome)
      .div(10 ** decimals)
      .toString()
    outcomeText = (
      <Fragment>
        {outcomeValue} <span className={cx('winningOutcomeUnit')}>{unit}</span>
      </Fragment>
    )
  }

  return (
    <div className={cx('winningOutcomeContainer')}>
      <div className={cx('winningOutcomeIcon')} />
      <span className={cx('winningOutcomeLabel')}>
        Winning<br />outcome
      </span>
      <div className={cx('winningOutcomeText')}>{outcomeText}</div>
    </div>
  )
}

WinningOutcome.propTypes = {
  type: PropTypes.oneOf(Object.keys(OUTCOME_TYPES)).isRequired,
  winningOutcome: PropTypes.number.isRequired,
  unit: PropTypes.string,
  decimals: PropTypes.number,
  outcomes: PropTypes.array.isRequired,
}

WinningOutcome.defaultProps = {
  unit: undefined,
  decimals: 0,
}

export default WinningOutcome
