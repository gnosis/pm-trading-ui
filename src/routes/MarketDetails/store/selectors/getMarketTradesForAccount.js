import { createSelector } from 'reselect'
import moment from 'moment'
import tradeSelector from 'store/selectors/account/trades'
import { normalizeHex } from 'utils/helpers'

const getMarketTradesForAccount = (eventAddress, accountAddress = '') => createSelector(tradeSelector, trades => trades
  .filter(
    trade => normalizeHex(trade.eventAddress) === normalizeHex(eventAddress)
          && normalizeHex(trade.owner) === normalizeHex(accountAddress),
  )
  .sort((a, b) => (moment(a.date).isBefore(b.date) ? 1 : -1)))

export default getMarketTradesForAccount
