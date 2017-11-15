import allowedRangePrice from './marginPrice'

describe('Margin Price Calculation', () => {
  test('it should be in range when same outcome price', () => {
    const oldPrice = '0.3333333333333'
    const newPrice = '0.3333333333333'

    expect(allowedRangePrice(oldPrice, newPrice)).toEqual(true)
  })

  test('it should be in range when the new price is the minimum', () => {
    const oldPrice = '0.000000000000000002'
    const newPrice = '0.000000000000000001'

    expect(allowedRangePrice(oldPrice, newPrice)).toEqual(true)
  })

  test('it should be in range when the new price is the maximum', () => {
    const oldPrice = '0.949999999999999999'
    const newPrice = '0.999999999999999999'

    expect(allowedRangePrice(oldPrice, newPrice)).toEqual(true)
  })

  test('it should NOT be in range when the new price is the minimum and the old one is higher than 5% allowed', () => {
    const oldPrice = '0.000000000000000003'
    const newPrice = '0.000000000000000001'

    expect(allowedRangePrice(oldPrice, newPrice)).toEqual(false)
  })

  test('it should NOT be in range when an obvious difference of 5% is set', () => {
    const oldPrice = '0.4566'
    const newPrice = '0.6745'

    expect(allowedRangePrice(oldPrice, newPrice)).toEqual(false)
  })

  test('it should NOT be in range when the new price is the maximum and the old one is just exactly 5% of the max', () => {
    const oldPrice = '0.949999999999999998'
    const newPrice = '0.999999999999999999'

    expect(allowedRangePrice(oldPrice, newPrice)).toEqual(false)
  })
})
