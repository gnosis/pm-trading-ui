import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'

import { decimalToText } from 'components/DecimalValue'
import Decimal from 'decimal.js'

import css from './OutcomeSelection.scss'

const cx = classNames.bind(css)

const Outcome = ({
  onSelect, selected, index, label, probability, color, hidePercentage,
}) => {
  const inputId = `formOutcomeBar_${index}`

  return (
    <div className={cx('outcome', { selected })}>
      <span className={cx('outcomeLabel')}>
        {label}
      </span>
      <label htmlFor={inputId}>
        <input
          type="radio"
          id={inputId}
          onChange={onSelect}
          checked={selected}
          value={index}
          style={{ backgroundColor: color }}
        />
        <div className={cx('wrapper')}>
          <div
            className={cx('outcomeBar')}
            style={{
              width: `${probability.toFixed(2)}%`,
              backgroundColor: color,
            }}
          />
          <div className={cx('outcomeDescription')}>
            {!hidePercentage && (
              <span className={cx('outcomeProbability')}>
                {decimalToText(probability, 2)}
%
              </span>
            )}
          </div>
        </div>
      </label>
    </div>
  )
}

Outcome.propTypes = {
  onSelect: PropTypes.func.isRequired,
  probability: PropTypes.instanceOf(Decimal).isRequired,
  index: PropTypes.number.isRequired,
  selected: PropTypes.bool,
  color: PropTypes.string,
  hidePercentage: PropTypes.bool,
  label: PropTypes.string,
}

Outcome.defaultProps = {
  label: 'Outcome',
  selected: false,
  color: '#fff',
  hidePercentage: false,
}

export default Outcome
