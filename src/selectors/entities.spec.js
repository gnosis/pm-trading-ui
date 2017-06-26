const entitySelector = require('./entities').entitySelector

describe('entitySelector', () => {
  test('works without any entities available', () => {
    expect(entitySelector({ entities: {} }, 'test')).toMatchObject({})
  })

  test('selects available entities as an object', () => {
    const state = {
      entities: {
        market: {
          test123: {
            address: 'test',
          },
        },
      },
    }
    expect(entitySelector(state, 'market')).toBe(state.entities.market)
  })

  test('malformed entity name works as intended', () => {
    const state = {
      entities: {
        'sadl.ad33.-$_§$:_23-.': {
          test: 'true',
        },
      },
    }
    expect(entitySelector(state, 'sadl.ad33.-$_§$:_23-.')).toMatchObject({ test: 'true' })
  })
})
