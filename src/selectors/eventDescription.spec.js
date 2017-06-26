const getEventDescriptionByAddress = require('./eventDescription').getEventDescriptionByAddress

describe('eventDescriptionSelector', () => {
  test('it should return an empty object for invalid address', () => {
    const state = {
      entities: {},
    }

    expect(getEventDescriptionByAddress(state)('test123')).toMatchObject({})
  })

  test('it should return event structure for valid address', () => {
    const state = {
      entities: {
        categoricalEventDescription: {
          test123: {
            id: 'test123',
            title: 'Hello!',
            description: 'Lorem Ipsum!',
            ipfsHash: '123',
          },
        },
      },
    }

    const desired = {
      eventDescriptionAddress: 'test123',
      title: 'Hello!',
      description: 'Lorem Ipsum!',
      ipfsHash: '123',
    }

    expect(getEventDescriptionByAddress(state)('test123')).toMatchObject(desired)
  })
})
