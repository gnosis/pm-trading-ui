import React from 'react'
import PropTypes from 'prop-types'
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
  predictedValue: PropTypes.string,
  unit: PropTypes.string,
  decimals: PropTypes.string,
}

TrendingOutcomeScalar.defaultProps = {
  predictedValue: '0',
  unit: '',
  decimals: '0',
}

export default TrendingOutcomeScalar
