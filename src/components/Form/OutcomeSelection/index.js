import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { fieldPropTypes } from 'redux-form'
import Decimal from 'decimal.js'

import classNames from 'classnames/bind'

import OutcomeBar from './OutcomeBar'

import css from '../OutcomeSelection.mod.scss'

const cx = classNames.bind(css)

class OutcomeSelection extends PureComponent {
  render() {
    const {
      outcomes, label, hideBars, input: { value, onChange },
    } = this.props

    return (
      <div className={cx('formOutcomeSelection', { hideBars })}>
        <label>{label}</label>
        {outcomes.map(outcome => (<OutcomeBar
          {...outcome}
          key={outcome.index}
          onSelect={onChange}
          selected={outcome.index.toString() === value}
        />))}
      </div>
    )
  }
}

OutcomeSelection.propTypes = {
  input: PropTypes.shape(fieldPropTypes.input).isRequired,
  hideBars: PropTypes.bool,
  outcomes: PropTypes.arrayOf(PropTypes.shape({
    probability: PropTypes.instanceOf(Decimal).isRequired,
    index: PropTypes.number.isRequired,
    color: PropTypes.string,
    label: PropTypes.string,
  })),
  label: PropTypes.string,
}

OutcomeSelection.defaultProps = {
  hideBars: false,
  outcomes: [],
  label: '',
}

export default OutcomeSelection
