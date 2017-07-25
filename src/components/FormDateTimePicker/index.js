import React, { Component } from 'react'
import Datetime from 'react-datetime'
import moment from 'moment'
import autobind from 'autobind-decorator'
import { get } from 'lodash'

import FormInput from 'components/FormInput'

import 'react-datetime/css/react-datetime.css'
import './formDateTimePicker.less'

const FormDateTimePicker = ({ label, input }) => {
  return (
    <div className="formDateTimePicker">
      <label>{label}</label>
      <Datetime className="formDateTimePicker__datetime" {...input} />
    </div>
  )
}

export default FormDateTimePicker
