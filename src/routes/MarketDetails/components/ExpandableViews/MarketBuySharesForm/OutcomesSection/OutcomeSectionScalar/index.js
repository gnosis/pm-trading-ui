import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import Decimal from 'decimal.js'
import { calcLMSRMarginalPrice } from 'api'
import { Field } from 'redux-form'
import { OutcomeSelection } from 'components/Form'
import { COLOR_SCHEME_SCALAR } from 'utils/constants'
import { marketShape } from 'utils/shapes'
import ScalarSlider from './ScalarSlider'

const OutcomeSectionScalar = (props) => {
  const {
    selectedOutcome,
    market: {
      bounds: {
        lower, upper, decimals, unit,
      },
      outcomeTokensSold,
      funding,
    },
    outcomeTokenCount,
    valid: canRunSimulation,
  } = props

  const marketTokenCounts = outcomeTokensSold.toArray().map(value => Decimal(value))
  const marginalPricesCurrent = marketTokenCounts.map((value, outcomeTokenIndex) => calcLMSRMarginalPrice({
    netOutcomeTokensSold: marketTokenCounts,
    outcomeTokenIndex,
    funding,
  }))
  let marginalPriceSelected = marginalPricesCurrent

  if (canRunSimulation) {
    marketTokenCounts[selectedOutcome] = marketTokenCounts[selectedOutcome].add(outcomeTokenCount)
    marginalPriceSelected = marketTokenCounts.map((value, outcomeTokenIndex) => calcLMSRMarginalPrice({
      netOutcomeTokensSold: marketTokenCounts,
      outcomeTokenIndex,
      funding,
    }))
  }

  const scalarOutcomes = [
    {
      index: 0,
      label: 'Short',
      color: COLOR_SCHEME_SCALAR[0],
      probability: marginalPriceSelected[0].mul(100),
    },
    {
      index: 1,
      label: 'Long',
      color: COLOR_SCHEME_SCALAR[1],
      probability: marginalPriceSelected[1].mul(100),
    },
  ]

  return (
    <div className={cn('col-md-6')}>
      <div className={cn('row')}>
        <div className={cn('col-md-12')}>
          <h2>
            Your Trade
          </h2>
          <Field component={OutcomeSelection} name="selectedOutcome" outcomes={scalarOutcomes} hideBars hidePercentage />
        </div>
      </div>
      <div className={cn('row')}>
        <div className={cn('col-md-12')}>
          <ScalarSlider
            lowerBound={parseInt(lower, 10)}
            upperBound={parseInt(upper, 10)}
            unit={unit}
            decimals={decimals}
            marginalPriceCurrent={marginalPricesCurrent[1].toString()}
            marginalPriceSelected={marginalPriceSelected[1].toString()}
          />
        </div>
      </div>
    </div>
  )
}

OutcomeSectionScalar.propTypes = {
  market: marketShape.isRequired,
  selectedOutcome: PropTypes.string,
  valid: PropTypes.bool,
  outcomeTokenCount: PropTypes.oneOfType([PropTypes.instanceOf(Decimal), PropTypes.number]).isRequired,
}

OutcomeSectionScalar.defaultProps = {
  valid: false,
  selectedOutcome: undefined,
}

export default OutcomeSectionScalar
