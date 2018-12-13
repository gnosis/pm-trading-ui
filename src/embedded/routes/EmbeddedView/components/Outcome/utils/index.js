import Decimal from 'decimal.js'

export const calcLMSRMarginalPrice = ({ netOutcomeTokensSold, funding, outcomeTokenIndex }) => {
  const noTokensSold = netOutcomeTokensSold.every(quantity => quantity === 0)
  if (funding === 0 && noTokensSold) {
    return new Decimal(1).div(netOutcomeTokensSold.length)
  }

  const b = Decimal(funding).div(Decimal.ln(netOutcomeTokensSold.length))
  const expOffset = Decimal.max(...netOutcomeTokensSold).div(b)

  return Decimal(netOutcomeTokensSold[outcomeTokenIndex].valueOf())
    .div(b)
    .sub(expOffset)
    .exp()
    .div(
      netOutcomeTokensSold.reduce(
        (acc, tokensSold) => acc.add(
          Decimal(tokensSold.valueOf())
            .div(b)
            .sub(expOffset)
            .exp(),
        ),
        Decimal(0),
      ),
    )
}
