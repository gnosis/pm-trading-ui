import entityReducer from './entities'
import { updateEntity, receiveEntities } from 'actions/entities'

describe('entityReducer', () => {
  describe('updateEntity', () => {
    const currentEntityState = {
      testEntity: {
        'test-2': {
          id: 'test-2',
          deeplyNestedData: {
            deeplyNestedKey: 'moreNestedData',
          },
        },
      },
    }
    const updateAction = updateEntity({ entityType: 'testEntity', data: { id: 'test-1', testObject: { deeplyNested: 'aNestedVaue' } } })

    const newEntityState = entityReducer(currentEntityState, updateAction)

    test('no mutating on existing entities', () => {
      expect(currentEntityState.testEntity['test-2'].deeplyNestedData).toMatchObject(newEntityState.testEntity['test-2'].deeplyNestedData)
      expect(currentEntityState.testEntity['test-2'].deeplyNestedData).not.toBe(newEntityState.testEntity['test-2'].deeplyNestedData)
    })

    test('no mutating on new entities', () => {
      expect(updateAction.payload.data.testObject).toMatchObject(newEntityState.testEntity['test-1'].testObject)
      expect(updateAction.payload.data.testObject).not.toBe(newEntityState.testEntity['test-1'].testObject)
    })

    test('added the entity correctly', () => {
      expect(newEntityState.testEntity).toMatchObject({
        'test-2': {
          id: 'test-2',
          deeplyNestedData: {
            deeplyNestedKey: 'moreNestedData',
          },
        },
        'test-1': {
          id: 'test-1',
          testObject: { deeplyNested: 'aNestedVaue' },
        },
      })
    })
  })

  describe.only('receiveEntities', () => {
    const currentEntityState = {
      testEntityA: {
        foo: {
          id: 'foo',
          deeplyNestedData: {
            deeplyNestedKey: 'moreNestedData',
          },
        },
      },
    }
    const receiveAction = receiveEntities({
      entities: {
        testEntityA: {
          bar: {
            id: 'bar',
            testObject: {
              dontShallowCopyMe: 'please',
            },
          },
        },
        testEntityB: {
          baz: {
            id: 'baz',
            testObject: {
              more: 'values',
              needed: 'here',
            },
          },
        },
      },
    })
    const newEntityState = entityReducer(currentEntityState, receiveAction)

    test('no mutation on previous entity types', () => {
      expect(newEntityState.testEntityA.foo.deeplyNestedData).toMatchObject(currentEntityState.testEntityA.foo.deeplyNestedData)
      expect(newEntityState.testEntityA.foo.deeplyNestedData).not.toBe(currentEntityState.testEntityA.foo.deeplyNestedData)
    })
    test('no mutation on new entity type', () => {
      expect(newEntityState.testEntityB.baz.testObject).toMatchObject(receiveAction.payload.entities.testEntityB.baz.testObject)
      expect(newEntityState.testEntityB.baz.testObject).not.toBe(receiveAction.payload.entities.testEntityB.baz.testObject)
    })

    test('added new entity correctly', () => {
      expect(newEntityState.testEntityB).toMatchObject({
        baz: {
          id: 'baz',
          testObject: {
            more: 'values',
            needed: 'here',
          },
        },
      })
    })
  })
})
