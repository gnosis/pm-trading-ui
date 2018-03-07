import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { OUTCOME_TYPES } from 'utils/constants'
import cn from 'classnames/bind'
import Decimal from 'decimal.js'
import { eventDescriptionShape, marketShape } from 'utils/shapes'
import style from './WinningOutcome.mod.scss'

const cx = cn.bind(style)

const WinningOutcome = ({
  market: { eventDescription: { outcomes, unit, decimals }, oracle: { outcome: winningOutcome }, event: { type } },
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
  eventDescription: eventDescriptionShape,
  outcomes: PropTypes.array,
  type: PropTypes.string,
  funding: PropTypes.string,
  oracle: PropTypes.object,
  outcome: PropTypes.string,
  netOutcomeTokensSold: PropTypes.string,
  market: marketShape,
  unit: PropTypes.string,
  decimals: PropTypes.string,
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
