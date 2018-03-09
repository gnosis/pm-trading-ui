import moment from 'moment'
import { createSelector } from 'reselect'
import { getFormValues } from 'redux-form'
import { isMarketClosed } from 'store/utils/marketStatus'

import { MARKETFILTER_FORM_NAME } from 'routes/marketlist/components/Filter/Form.jsx'

const formFilterSelector = getFormValues(MARKETFILTER_FORM_NAME)

const defaultSorting = (marketA, marketB) => {
  const isAClosed = isMarketClosed(marketA.stage, marketA.resolution, marketA.resolved)
  const isBClosed = isMarketClosed(marketB.stage, marketB.resolution, marketB.resolved)

  if (isAClosed && !isBClosed) {
    return 1
  }

  if (!isAClosed && isBClosed) {
    return -1
  }

  if (marketA.resolution > marketB.resolution) {
    return -1
  }

  if (marketB.resolution > marketA.resolution) {
    return 1
  }

  return 0
}

const SORTFIELD_RESOLUTION_DATE = 'resolution'
const SORTFIELD_TRADING_VOLUME = 'volume'

const SORTER_VALUE_PARSERS = {
  [SORTFIELD_RESOLUTION_DATE]: val => moment(val).unix(),
  [SORTFIELD_TRADING_VOLUME]: val => parseInt(val, 10),
}

const DEFAULT_SORT_VALUES = {
  sortBy: {
    value: {},
  },
}

const marketSort = createSelector(
  formFilterSelector,
  ({ sortBy: { value: { key, dir } } } = DEFAULT_SORT_VALUES) => (marketA, marketB) => {
    if (key === undefined) {
      return defaultSorting(marketA, marketB)
    }

    const dirInt = dir === 'asc' ? 1 : -1

    const marketAValue = SORTER_VALUE_PARSERS[key](marketA[key])
    const marketBValue = SORTER_VALUE_PARSERS[key](marketB[key])

    if (marketAValue > marketBValue) {
      return dirInt
    }

    if (marketAValue < marketBValue) {
      return -dirInt
    }

    return defaultSorting(marketA, marketB)
  },
)

export default marketSort
