const getEventByAddress = require('./event').getEventByAddress

describe('eventSelector', () => {
  test('it should return an empty object for invalid address', () => {
    const state = {
      entities: {},
    }

    expect(getEventByAddress(state)('test123')).toMatchObject({})
  })

  test('it should return event structure for valid address', () => {
    const state = {
      entities: {
        categoricalEvent: {
          test123: {
            id: 'test123',
          },
        },
      },
    }

    const desired = {
      eventAddress: 'test123',
    }

    expect(getEventByAddress(state)('test123')).toMatchObject(desired)
  })
})
