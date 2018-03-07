import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { OUTCOME_TYPES } from 'utils/constants'
import cn from 'classnames/bind'
import Decimal from 'decimal.js'
import { marketShape } from 'utils/shapes'
import style from './WinningOutcome.mod.scss'

const cx = cn.bind(style)

const WinningOutcome = ({ market }) => {
  const {
    bounds,
    winningOutcome,
    type,
  } = market

  let outcomeText

  if (type === OUTCOME_TYPES.CATEGORICAL) {
    outcomeText = `${winningOutcome.name}`
  } else if (type === OUTCOME_TYPES.SCALAR) {
    const outcomeValue = Decimal(market.winningOutcome)
      .div(10 ** bounds.decimals)
      .toString()
    outcomeText = (
      <Fragment>
        {outcomeValue} <span className={cx('winningOutcomeUnit')}>{bounds.unit}</span>
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
  market: marketShape,
}

WinningOutcome.defaultProps = {
  market: {
    event: {
      type: '',
    },
    eventDescription: {
      outcomes: [],
      unit: '',
      decimals: '',
    },
    oracle: {
      outcome: '',
    },
  },
}

export default WinningOutcome
