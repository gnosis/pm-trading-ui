import { createSelector } from 'reselect'
import { getFormValues } from 'redux-form'

import { getCurrentAccount } from 'integrations/store/selectors'
import { isMarketFunded, isMarketClosed } from 'store/utils/marketStatus'

import { MARKETFILTER_FORM_NAME } from 'routes/MarketList/components/Filter/Form'

const formFilterSelector = getFormValues(MARKETFILTER_FORM_NAME)

// Fields in MarketFilter Form
const FIELD_FILTER_MARKETSTATUS = 'filterByStatus'
const FIELD_FILTER_QUERY = 'filterQuery'

const FILTER_FIELDS = [
  FIELD_FILTER_MARKETSTATUS, FIELD_FILTER_QUERY,
]

// Default Filter Values
const FILTER_DEFAULTS = {}

// Functions for RadioButton Filters for MarketStatus
const MARKET_STATUS_FILTERS = {
  isClosed: market => isMarketClosed(market.stage, market.resolution, market.resolved),
  isOpen: market => !isMarketClosed(market.stage, market.resolution, market.resolved),
}

// Functions for each filter field
const FILTER_FUNCTIONS = {
  [FIELD_FILTER_MARKETSTATUS]: params => market => MARKET_STATUS_FILTERS[params.filterValue](market),
  [FIELD_FILTER_QUERY]: params => market => (
    market.title.toLowerCase().indexOf(params.filterValue.toLowerCase()) > -1 ||
    market.description.toLowerCase().indexOf(params.filterValue.toLowerCase()) > -1
  ),
}

const marketFilterSelector = createSelector(
  getCurrentAccount,
  formFilterSelector,
  (currentAccount, formValues = FILTER_DEFAULTS) => (market) => {
    if (!market) {
      return false
    }

    const isFundedMarket = isMarketFunded(market.stage)

    if (!isFundedMarket) {
      return false
    }

    let filtersMatch = true

    // iterate through available filter fields
    FILTER_FIELDS.forEach((filterFieldName) => {
      if (formValues[filterFieldName]) {
        const filterParams = {
          currentAccount,
          filterValue: formValues[filterFieldName],
        }

        // find filter function and pass parameters
        const filterFunction = FILTER_FUNCTIONS[filterFieldName](filterParams)

        if (!filterFunction) {
          return true // continue
        }

        // call the filter function wit the market to determine if we need to discard
        const isFilterMatching = filterFunction(market)

        if (!isFilterMatching) {
          filtersMatch = false
          return false // break
        }
      }
      return true // continue
    })

    return filtersMatch
  },
)

export default marketFilterSelector
