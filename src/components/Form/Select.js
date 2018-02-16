import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames/bind'

import OriginalSelect from 'react-select'

import { fieldPropTypes } from 'redux-form'

import 'react-select/dist/react-select.css'

import InputError from './InputError'
import styles from './Select.scss'

const cx = classNames.bind(styles)

const Select = ({
  input,
  label,
  options,
  className,
  defaultValue,
  loading,
  meta: { error },
}) => {
  const inputId = `formSelect_${input.name}`

  const selectClasses = cx('formSelect', className, {
    error: !!error,
  })

  return (
    <div className={selectClasses}>
      <label htmlFor={inputId}>
        {label}
      </label>
      <OriginalSelect
        {...input}
        id={inputId}
        className={cx('formSelectInput')}
        value={input.value ? input.value : defaultValue}
        options={options}
        onBlur={undefined}
        isLoading={loading}
      />
      <InputError error={error} />
    </div>
  )
}

Select.propTypes = {
  input: PropTypes.shape(fieldPropTypes.input).isRequired,
  meta: PropTypes.shape(fieldPropTypes.meta).isRequired,
  label: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
  className: PropTypes.string,
  defaultValue: PropTypes.string,
  loading: PropTypes.bool,
}

Select.defaultProps = {
  label: '',
  defaultValue: undefined,
  className: '',
  options: [],
  loading: false,
}

export default Select
