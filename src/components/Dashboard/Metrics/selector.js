import { createSelector, createStructuredSelector } from 'reselect';
import { getCurrentBalance } from 'selectors/blockchain'
import { meSelector } from 'routes/scoreboard/store/selectors';
import { roundProfits } from 'utils/helpers';

const tokenSelector = createSelector(
    getCurrentBalance,
    (balance) => balance ? balance.substring(0,5) : undefined,
)

const profitsSelector = createSelector(
    meSelector,
    (account) => account ? roundProfits(account.predictedProfits) : undefined,
)

const rankSelector = createSelector(
    meSelector,
    (account) => { 
        return account ? account.currentRank : undefined
    },
)

export default createStructuredSelector({
    tokens: tokenSelector,
    predictedProfits: profitsSelector,
    rank: rankSelector,
});
