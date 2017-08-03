import React from 'react'

// Current mapping does not contain any logic
export const outcomeTokenToText = () => 'Outcome Token'
export const collateralTokenToText = () => 'ETH'

const CurrencyName = ({ collateralToken, outcomeToken }) => {
  if (collateralToken) {
    return <span>{collateralTokenToText(collateralToken)}</span>
  }

  if (outcomeToken) {
    return <span>{outcomeTokenToText(outcomeToken)}</span>
  }
}

export default CurrencyName
