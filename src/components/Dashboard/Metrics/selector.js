import { createSelector, createStructuredSelector } from 'reselect'
import { meSelector } from 'routes/Scoreboard/store/selectors'
import { badgeOf } from 'routes/Scoreboard/components/Table/ScoreTable/table'

export const rankSelector = createSelector(meSelector, account => (account ? account.currentRank : '--'))

const badgeSelector = createSelector(meSelector, account => badgeOf(account ? account.predictions : 0))

export default createStructuredSelector({
  rank: rankSelector,
  badge: badgeSelector,
})
