/* globals fetch */

import { mapValues, startsWith, isArray } from 'lodash'

import { HEX_VALUE_REGEX } from 'utils/constants'

export const hexWithoutPrefix = (value) => {
  if (HEX_VALUE_REGEX.test(value)) {
    return startsWith(value, '0x') ? value.substring(2) : value
  }

  return value
}

export const hexWithPrefix = (value) => {
  if (HEX_VALUE_REGEX.test(value)) {
    return startsWith(value, '0x') ? value : `0x${value}`
  }
  return value
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
