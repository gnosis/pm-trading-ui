import React from 'react'
import Datetime from 'react-datetime'
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

export default FormDateTimePicker
