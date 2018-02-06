import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'

import { fieldPropTypes } from 'redux-form'
import { omit } from 'lodash'

import styles from './Checkbox.scss'

const cx = classNames.bind(styles)

const Checkbox = ({
  input,
  label,
  children,
  className,
  muted,
  meta: { touched, error },
}) => {
  const showErrorMessage = touched && error
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
        <span className={cx('formCheckboxText')}>{children}</span>
      </label>
    </div>
  )
}

Checkbox.propTypes = {
  input: PropTypes.shape(omit(fieldPropTypes.input, ['onBlur', 'onFocus', 'onDragStart', 'onDrop'])).isRequired,
  meta: PropTypes.shape(fieldPropTypes.meta).isRequired,
  label: PropTypes.string,
  children: PropTypes.node,
  muted: PropTypes.bool,
  className: PropTypes.string,
}

Checkbox.defaultProps = {
  label: '',
  children: undefined,
  className: '',
  muted: false,
  startAdornment: undefined,
  endAdornment: undefined,
}

export default Checkbox
