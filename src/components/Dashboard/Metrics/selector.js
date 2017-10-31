import { createSelector, createStructuredSelector } from 'reselect'
import { getCurrentBalance } from 'selectors/blockchain'
import { meSelector } from 'routes/scoreboard/store/selectors'
import { weiToEth } from 'utils/helpers'
import { badgeOf } from 'routes/scoreboard/components/ScoreTable/table'

const tokenSelector = createSelector(
    getCurrentBalance,
    balance => balance ? balance : '0',
)

const profitsSelector = createSelector(
    meSelector,
    account => (account ? weiToEth(account.predictedProfit) : undefined),
)

const rankSelector = createSelector(
    meSelector,
    account => (account ? account.currentRank : undefined),
)

const badgeSelector = createSelector(
    meSelector,
    account => badgeOf(account ? account.predictions : undefined),
)


export default createStructuredSelector({
    tokens: tokenSelector,
    predictedProfit: profitsSelector,
    rank: rankSelector,
    badge: badgeSelector,
})
