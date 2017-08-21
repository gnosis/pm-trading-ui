/* globals fetch */

import { mapValues, startsWith, isArray } from 'lodash'
import Decimal from 'decimal.js'
import { HEX_VALUE_REGEX } from 'utils/constants'

export const hexWithoutPrefix = (value) => {
  if (HEX_VALUE_REGEX.test(value)) {
    return startsWith(value, '0x') ? value.substring(2) : value
  }

  return value
}

/**
 * Adds the `0x` prefix to the incoming string value
 * @param {String} value 
 */
export const add0xPrefix = (value) => {
  return startsWith(value, '0x') ? value : `0x${value}`
}

export const hexWithPrefix = (value) => {
  return HEX_VALUE_REGEX.test(value) ? add0xPrefix(value) : value
}

export const toEntity = (data, entityType, idKey = 'address') => {
  const { [idKey]: id, ...entityPayload } = mapValues(data, hexWithoutPrefix)

  return {
    entities: {
      [entityType]: {
        [id]: {
          [idKey]: id,
          ...entityPayload,
        },
      },
    },
    result: [
      id,
    ],
  }
}

/**
 * Converts a value from WEI to ETH
 * @param {String|Number} value
 */
export const weiToEth = (value) => {
  let ethValue = '0'
  if (value && Decimal(value).gt(0)) {
    ethValue = Decimal(value).div(1e18).toString()
  }
  return ethValue
}

/** 
 * Adds _id incremental numeric property to each object in the array
 * @param {Array of objects} arrayData 
 */
export const addIdToObjectsInArray = (arrayData) => {
  arrayData.forEach((item, index) => {
    item['_id'] = index
  })
  return arrayData
}

export const restFetch = url =>
  fetch(url)
    .then(res => res.json())
    .catch(err => console.warn(`Gnosis DB: ${err}`))

export const bemifyClassName = (className, element, modifier) => {
  const classNameDefined = className || ''
  const classNames = isArray(classNameDefined) ? classNameDefined : classNameDefined.split(' ')

  if (classNames && classNames.length) {
    let classPath = ''

    if (element) {
      classPath += `__${element}`
    }
    if (element && modifier) {
      classPath += `--${modifier}`
    }

    return classNames.filter(s => s.length).map(cls => `${cls}${classPath}`).join(' ')
  }

  return ''
}

export const timeoutCondition = (timeout, rejectReason) => new Promise((_, reject) => {
  setTimeout(() => {
    reject(rejectReason)
  }, timeout)
})
