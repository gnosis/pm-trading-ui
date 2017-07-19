import { trimStart } from 'lodash'
import { HEX_VALUE_REGEX } from 'utils/constants'

export const normalizeHex = (value) => {
  if (HEX_VALUE_REGEX.test(value)) {
    return trimStart(value, '0x')
  }

  return value
}

export const hexWithPrefix = (value) => {
  if (HEX_VALUE_REGEX.test(value)) {
    return `0x${trimStart(value, '0x')}`
  }
  return value
}
