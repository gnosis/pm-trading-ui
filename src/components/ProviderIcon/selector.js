import { createSelector, createStructuredSelector } from 'reselect'
import { meSelector } from 'routes/scoreboard/store/selectors'
import { badgeOf } from 'routes/scoreboard/components/ScoreTable/table'

const badgeSelector = createSelector(
    meSelector,
    account => badgeOf(account ? account.predictions : undefined),
)

export default createStructuredSelector({
    badge: badgeSelector,
})
