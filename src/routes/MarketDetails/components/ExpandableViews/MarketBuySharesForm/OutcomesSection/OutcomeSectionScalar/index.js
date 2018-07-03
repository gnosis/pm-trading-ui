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
    selectedBuyInvest,
    selectedOutcome,
    market: {
      event: { lowerBound, upperBound },
      eventDescription: { decimals, unit },
      netOutcomeTokensSold,
      funding,
    },
    outcomeTokenCount,
  } = props
  const canRunSimulation = selectedBuyInvest && selectedOutcome

  const marketTokenCounts = netOutcomeTokensSold.map(value => Decimal(value))
  const marginalPricesCurrent = calcLMSRMarginalPrice({
    netOutcomeTokensSold: marketTokenCounts,
    outcomeTokenIndex: 1,
    funding,
  })
  let marginalPriceSelected = marginalPricesCurrent

  if (canRunSimulation) {
    marketTokenCounts[selectedOutcome] = marketTokenCounts[selectedOutcome].add(outcomeTokenCount)
    marginalPriceSelected = calcLMSRMarginalPrice({
      netOutcomeTokensSold: marketTokenCounts,
      outcomeTokenIndex: 1,
      funding,
    })
  }

  const scalarOutcomes = [
    {
      index: 0,
      label: 'Short',
      color: COLOR_SCHEME_SCALAR[0],
      probability: Decimal(1).sub(marginalPriceSelected).mul(100),
    },
    {
      index: 1,
      label: 'Long',
      color: COLOR_SCHEME_SCALAR[1],
      probability: marginalPriceSelected.mul(100),
    },
  ]

  return (
    <div className={cn('col-md-6')}>
      <div className={cn('row')}>
        <div className={cn('col-md-12')}>
          <h2>
            Your Trade
          </h2>
          <Field
            component={OutcomeSelection}
            name="selectedOutcome"
            outcomes={scalarOutcomes}
            hideBars
            hidePercentage
          />
        </div>
      </div>
      <div className={cn('row')}>
        <div className={cn('col-md-12')}>
          <ScalarSlider
            lowerBound={parseInt(lowerBound, 10)}
            upperBound={parseInt(upperBound, 10)}
            unit={unit}
            decimals={decimals}
            marginalPriceCurrent={marginalPricesCurrent.toString()}
            marginalPriceSelected={marginalPriceSelected.toString()}
          />
        </div>
      </div>
    </div>
  )
}

OutcomeSectionScalar.propTypes = {
  market: marketShape.isRequired,
  selectedOutcome: PropTypes.string,
  selectedBuyInvest: PropTypes.string,
  outcomeTokenCount: PropTypes.oneOfType([PropTypes.instanceOf(Decimal), PropTypes.number]).isRequired,
}

OutcomeSectionScalar.defaultProps = {
  selectedBuyInvest: '0',
  selectedOutcome: undefined,
}

export default OutcomeSectionScalar
