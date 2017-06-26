const getMarketById = require('./market').getMarketById
const getMarkets = require('./market').getMarkets

describe('marketSelector', () => {
  describe('getMarketById', () => {
    test('it should return an empty object for invalid address', () => {
      const state = {
        entities: {
          foo: { id: 'not to be included' },
        },
      }

      expect(getMarketById(state)('test123')).toMatchObject({})
    })

    test('it should return a market even without any relations', () => {
      const state = {
        entities: {
          market: {
            test123: {
              id: 'test123',
            },
          },
        },
      }

      expect(getMarketById(state)('test123')).toHaveProperty('address')
      expect(getMarketById(state)('test123')).toHaveProperty('creationDate')
      expect(getMarketById(state)('test123')).toHaveProperty('creationBlock')
      expect(getMarketById(state)('test123')).not.toHaveProperty('eventAddress')
    })

    test('it should return a market with an event', () => {
      const state = {
        entities: {
          market: {
            test123: {
              id: 'test123',
              event: 'event1',
            },
          },
          categoricalEvent: {
            event1: {
              id: 'event1',
            },
          },
        },
      }

      expect(getMarketById(state)('test123')).toHaveProperty('address')
      expect(getMarketById(state)('test123')).toHaveProperty('eventAddress', 'event1')
      expect(getMarketById(state)('test123')).toHaveProperty('eventType', 'CATEGORICAL')
      expect(getMarketById(state)('test123')).not.toHaveProperty('oracleType')
    })

    test('it should return a market with an event and oracle', () => {
      const state = {
        entities: {
          market: {
            test123: {
              id: 'test123',
              event: 'event1',
            },
          },
          categoricalEvent: {
            event1: {
              id: 'event1',
              oracle: 'oracle1',
            },
          },
          centralizedOracle: {
            oracle1: {
              id: 'oracle1',
            },
          },
        },
      }

      expect(getMarketById(state)('test123')).toHaveProperty('address')
      expect(getMarketById(state)('test123')).toHaveProperty('eventAddress', 'event1')
      expect(getMarketById(state)('test123')).toHaveProperty('eventType', 'CATEGORICAL')
      expect(getMarketById(state)('test123')).toHaveProperty('oracleAddress', 'oracle1')
      expect(getMarketById(state)('test123')).toHaveProperty('oracleType', 'CENTRALIZED')
      expect(getMarketById(state)('test123')).not.toHaveProperty('title')
    })

    test('it should return a market with an event, oracle and eventdescription', () => {
      const state = {
        entities: {
          market: {
            test123: {
              id: 'test123',
              event: 'event1',
            },
          },
          categoricalEvent: {
            event1: {
              id: 'event1',
              oracle: 'oracle1',
            },
          },
          centralizedOracle: {
            oracle1: {
              id: 'oracle1',
              eventDescription: 'eventDescription1',
            },
          },
          categoricalEventDescription: {
            eventDescription1: {
              title: 'müll',
            },
          },
        },
      }

      expect(getMarketById(state)('test123')).toHaveProperty('address')
      expect(getMarketById(state)('test123')).toHaveProperty('eventAddress', 'event1')
      expect(getMarketById(state)('test123')).toHaveProperty('eventType', 'CATEGORICAL')
      expect(getMarketById(state)('test123')).toHaveProperty('oracleAddress', 'oracle1')
      expect(getMarketById(state)('test123')).toHaveProperty('oracleType', 'CENTRALIZED')
      expect(getMarketById(state)('test123')).toHaveProperty('title', 'müll')
    })
  })

  describe('getMarkets', () => {
    test('it should return an empty array for invalid address', () => {
      const state = {
        entities: {},
      }

      expect(getMarkets(state)).toEqual([])
    })
  })
})
