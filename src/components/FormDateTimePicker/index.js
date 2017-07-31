import React from 'react'
import Datetime from 'react-datetime'
import PropTypes from 'prop-types'
import moment from 'moment'

import 'react-datetime/css/react-datetime.css'
import './formDateTimePicker.less'

const FormDateTimePicker = ({ label, input, validDateCheck }) => {
  let isValidDate = validDateCheck
  if (typeof validDateCheck !== 'function') {
    const yesterday = moment().subtract(1, 'day')
    isValidDate = current => current.isAfter(yesterday)
  }

  return (
    <div className="formDateTimePicker">
      <label>{label}</label>
      <Datetime className="formDateTimePicker__datetime" isValidDate={isValidDate} {...input} />
    </div>
  )
}

FormDateTimePicker.propTypes = {
  label: PropTypes.string,
  input: PropTypes.object,
  validDateCheck: PropTypes.func,
}

export default FormDateTimePicker
