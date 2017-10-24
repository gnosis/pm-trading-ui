import { createSelector } from 'reselect';
import { ContactRecord } from '../models';
import { getCurrentAccount } from 'selectors/blockchain';

const olympiaUsersSelectorAsList = (state) => {
    
    if (!state.olympia) {
        return undefined;
    }
    
    if (!state.olympia.ranking) {
        return undefined;
    }

    return state.olympia.ranking.toList()
}


export const firstOlympiaUsersSelectorAsList = createSelector(
    olympiaUsersSelectorAsList,
    (users) => users
        ? users
            .sort((userA, userB) => {
                if (userA.currentRank > userB.currentRank) {
                    return 1;
                }

                if (userA.currentRank < userB.currentRank) {
                    return -1;
                }

                return 0;
            })
            .take(10)
        : undefined,
);

export const meSelector = createSelector(
    olympiaUsersSelectorAsList,
    getCurrentAccount,
    (users, account) =>
        users ? users.find((user) => user.account === account) : undefined,
);
