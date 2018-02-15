import Decimal from 'decimal.js'

const calculateProfit = (share) => {
  console.log(share)
  return new Decimal(share.balance).mul(share.marginalPrice)
}

export default calculateProfit
