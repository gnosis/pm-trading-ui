import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'

import { fieldInputPropTypes } from 'redux-form'
import { omit } from 'lodash'

import styles from './Checkbox.scss'

const cx = classNames.bind(styles)

const Checkbox = ({
  input, label, text, className, muted,
}) => {
  const inputId = `formCheckbox_${input.name}`
  return (
    <div className={cx('formCheckbox', className, {
      muted,
    })}
    >
      <label htmlFor={inputId} style={styles.label}>{ label }</label>
      <label htmlFor={inputId} style={styles.inputLabel}>
        <input
          id={inputId}
          type="checkbox"
          checked={input.value}
          {...input}
        />
        <span className={cx('formCheckboxText')}>{ text }</span>
      </label>
    </div>
  )
}

Checkbox.propTypes = {
  input: PropTypes.shape(omit(fieldInputPropTypes, ['onBlur', 'onFocus', 'onDragStart', 'onDrop'])).isRequired,
  label: PropTypes.string,
  text: PropTypes.node,
  muted: PropTypes.bool,
  className: PropTypes.string,
}

Checkbox.defaultProps = {
  label: '',
  text: undefined,
  className: '',
  muted: false,
}

export default Checkbox
