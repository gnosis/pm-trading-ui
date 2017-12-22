import Decimal from 'decimal.js'

const allowedRangePrice = (oldP, newP) => {
  const oldPrice = new Decimal(oldP)
  const newPrice = new Decimal(newP)

  // We calculate the 5% of the latest price applying 18 decimals round up
  const allowance = new Decimal(newPrice).mul(5).div(100).toDP(18, Decimal.ROUND_UP)

  // Calculate the abs difference between prices
  const diff = new Decimal(newPrice).sub(oldPrice).absoluteValue()

  return diff.lte(allowance)  // return true if diff between prices is lower than 5 percent
}

export default allowedRangePrice
