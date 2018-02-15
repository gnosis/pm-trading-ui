import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { fieldPropTypes } from 'redux-form'
import classNames from 'classnames/bind'

import styles from './RadioButton.scss'

const cx = classNames.bind(styles)

class RadioButton extends PureComponent {
  handleOnChange = () => {
    const { input: { onChange, onBlur }, value } = this.props
    onBlur()
    return onChange(value)
  }
  render() {
    const {
      input,
      meta: { touched, error },
      value,
      label,
      className,
    } = this.props

    const inputId = `formRadioButton_${input.name}_${JSON.stringify(value)}`
    const isChecked = input && input.value.toString() === value.toString()
    return (
      <div className={cx('formRadioButton', className, {
        error: (touched && error) !== false,
      })}
      >
        <label htmlFor={inputId}>
          <input
            type="radio"
            id={inputId}
            onChange={this.handleOnChange}
            checked={isChecked}
            value={value}
          />
          {label}
        </label>
      </div>
    )
  }
}

RadioButton.propTypes = {
  input: PropTypes.shape(fieldPropTypes.input).isRequired,
  meta: PropTypes.shape(fieldPropTypes.meta).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.node.isRequired,
  className: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
}

RadioButton.defaultProps = {
  className: undefined,
}

export default RadioButton
