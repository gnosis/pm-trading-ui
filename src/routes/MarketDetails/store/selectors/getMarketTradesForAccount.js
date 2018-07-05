import { createSelector } from 'reselect'
import moment from 'moment'
import { normalizeHex } from 'utils/helpers'

const getMarketTradesForAccount = (eventAddress, accountAddress) => createSelector(
  state => state.accountTrades,
  trades => trades
    .filter(
      trade => normalizeHex(trade.eventAddress) === normalizeHex(eventAddress)
            && normalizeHex(trade.owner) === normalizeHex(accountAddress),
    )
    .sort((a, b) => (moment(a.date).isBefore(b.date) ? 1 : -1)),
)

export default getMarketTradesForAccount
