import { findDefaultProvider } from './blockchain'

describe('Blockchain selectors', () => {
  describe('findDefaultProvider', () => {
    test('Returns undefined with no providers registered', () => {
      const state = {
        blockchain: {
          providers: {},
        },
      }
      expect(findDefaultProvider(state)).toBeUndefined()
    })

    test('Returns default provider correctly', () => {
      const state = {
        blockchain: {
          providers: {},
        },
      }
    })
  })
})
