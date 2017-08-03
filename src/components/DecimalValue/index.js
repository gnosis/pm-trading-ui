import React from 'react'
import PropTypes from 'prop-types'

import Decimal from 'decimal.js'

export const decimalToText = (value, decimals = 4) => {
  if (value && value.toDP) {
    return value.toDP(decimals).toString()
  }

  let decimalValue
  try {
    decimalValue = Decimal(value)
  } catch (e) {
    console.warn('Invalid prop given to <DecimalValue />: Using 0 as fallback. Please fix this, it causes massive performance issues')
    decimalValue = Decimal(0)
  }

  return decimalValue.toDP(decimals).toString()
}

const DecimalValue = ({ value, decimals = 4 }) => {
  const text = decimalToText(value, decimals)
  return <span>{text}</span>
}

DecimalValue.propTypes = {
  value: PropTypes.string,
  decimals: PropTypes.number,
}

export default DecimalValue
