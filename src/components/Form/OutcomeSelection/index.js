import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { fieldPropTypes } from 'redux-form'

import classNames from 'classnames/bind'

import OutcomeBar from './OutcomeBar'

import styles from './style.scss'

const cx = classNames.bind(styles)

class OutcomeSelection extends PureComponent {
  render() {
    const { outcomes, label, input: { value, onChange } } = this.props

    return (
      <div className={cx('formOutcomeSelection')}>
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
  outcomes: PropTypes.arrayOf(PropTypes.shape({

  })),
  label: PropTypes.string,
}

OutcomeSelection.defaultProps = {
  outcomes: [],

}

export default OutcomeSelection
