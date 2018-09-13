import React from 'react'
import PropTypes from 'prop-types'

import Decimal from 'decimal.js'

export const decimalToText = (value, decimals = 4) => {
  if (value && value.toDP) {
    // toDP is a function of Decimal.js, it rounds the Decimal object to decimals places with rounding mode entered
    // rounding mode = 1 => round down
    return value.toDP(decimals, 1).toString()
  }

  let decimalValue
  try {
    decimalValue = Decimal(value)
  } catch (e) {
    console.warn(
      'Invalid prop given to <DecimalValue />: Using 0 as fallback. Please fix this, it causes massive performance issues',
    )
    decimalValue = Decimal(0)
  }

  return decimalValue.toDP(decimals, 1).toString()
}

const DecimalValue = ({ value, decimals = 4, className }) => {
  const text = decimalToText(value, decimals)
  return <span className={className}>{text}</span>
}

// I don't use PropTypes.instanceOf because Decimal can be cloned with different default properties
// and instanceOf doesn't deal with that situation. In fact, Decimal.clone is used in gnosis.js
export const decimalJsTest = (props, propName, componentName) => {
  const value = props[propName]

  if (!value) {
    return new Error(`Invalid prop ${propName}`)
  }

  const namesToCheck = []

  if (value.constructor) {
    namesToCheck.push(value.constructor.name)
    namesToCheck.push(value.constructor.prototype.name)
  }

  const testResults = namesToCheck.map(name => /(Decimal|(Big)?Number)/.test(name))

  return testResults.includes(true)
    ? undefined
    : new Error(`Non-numeric \`${propName}\` supplied to \`${componentName}\`. Validation failed.`)
}

DecimalValue.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, decimalJsTest, PropTypes.number]).isRequired,
  decimals: PropTypes.number,
  className: PropTypes.string,
}

DecimalValue.defaultProps = {
  decimals: 4,
  className: '',
}

export default DecimalValue
