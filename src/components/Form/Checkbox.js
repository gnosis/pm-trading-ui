import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'

import { fieldPropTypes } from 'redux-form'
import { omit } from 'lodash'

import InputError from './InputError'
import styles from './Checkbox.scss'

const cx = classNames.bind(styles)

const Checkbox = ({
  input,
  label,
  children,
  className,
  light,
  meta: { touched, error },
}) => {
  const inputId = `formCheckbox_${input.name}`

  const checkboxClasses = cx('formCheckbox', className, {
    light,
    error: (error && touched),
  })

  return (
    <div className={checkboxClasses}>
      <label htmlFor={inputId}>{ label }</label>
      <label htmlFor={inputId} className={cx('formCheckboxLabel')}>
        <input
          id={inputId}
          type="checkbox"
          checked={input.value}
          {...input}
        />
        <span className={cx('formCheckboxText')}>{children}</span>
      </label>
      <InputError error={touched && error} />
    </div>
  )
}

Checkbox.propTypes = {
  input: PropTypes.shape(omit(fieldPropTypes.input, ['onBlur', 'onFocus', 'onDragStart', 'onDrop'])).isRequired,
  meta: PropTypes.shape(fieldPropTypes.meta).isRequired,
  label: PropTypes.string,
  children: PropTypes.node,
  light: PropTypes.bool,
  className: PropTypes.string,
}

Checkbox.defaultProps = {
  label: '',
  children: undefined,
  className: '',
  light: false,
}

export default Checkbox
