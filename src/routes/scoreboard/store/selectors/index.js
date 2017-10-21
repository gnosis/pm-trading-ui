import { createSelector } from 'reselect';
import { ContactRecord } from '../models';
import { getCurrentAccount } from 'selectors/blockchain';


export const olympiaUsersSelectorAsList = (state) => state.olympia && state.olympia.users
    ? state.olympia.users.toList()
    : undefined;

export const meSelector = createSelector(
    olympiaUsersSelectorAsList,
    getCurrentAccount,
    (users, account) =>
        users ? users.find((user) => user.account === account) : undefined,
);
