import { createSelector } from 'reselect'
import { getCurrentAccount } from 'selectors/blockchain'
import { hexWithoutPrefix } from 'utils/helpers'

const olympiaUsersSelectorAsList = (state) => {
    if (!state.olympia) {
        return undefined
    }

    if (!state.olympia.ranking) {
        return undefined
    }

    return state.olympia.ranking.toList()
}


export const firstOlympiaUsersSelectorAsList = createSelector(
    olympiaUsersSelectorAsList,
    users => users
        ? users
            .filter(user => user.currentRank > 0)
            .sort((userA, userB) => {
                if (userA.currentRank > userB.currentRank) {
                    return 1
                }

                if (userA.currentRank < userB.currentRank) {
                    return -1
                }

                return 0
            })
            .take(10)
        : undefined,
)

export const nomalizedCurrentAccount = createSelector(
    getCurrentAccount,
    account => account ? hexWithoutPrefix(account) : account,
)

export const meSelector = createSelector(
    olympiaUsersSelectorAsList,
    nomalizedCurrentAccount,
    (users, account) => users ? users.find(user => user.account === account) : undefined,
)
