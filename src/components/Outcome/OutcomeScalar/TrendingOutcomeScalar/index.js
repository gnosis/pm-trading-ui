import React from 'react'
import PropTypes from 'prop-types'
import Decimal from 'decimal.js'
import DecimalValue from 'components/DecimalValue'

const TrendingOutcomeScalar = ({ predictedValue, unit, decimals }) => (
  <div className="row">
    <div className="col-md-6">
      <DecimalValue value={predictedValue} decimals={decimals} className="outcome__currentPrediction--value" />
      &nbsp;{unit}
    </div>
  </div>
)

TrendingOutcomeScalar.propTypes = {
  predictedValue: PropTypes.instanceOf(Decimal),
  unit: PropTypes.string,
  decimals: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

TrendingOutcomeScalar.defaultProps = {
  predictedValue: Decimal(0),
  unit: '',
  decimals: 0,
}

export default TrendingOutcomeScalar
