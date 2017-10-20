import { createSelector, createStructuredSelector } from 'reselect';
import { olympiaUsersSelectorAsList, meSelector } from '../store/selectors';

const accountSelector = createSelector(
    meSelector,
    (me) => me !== undefined ? true : false,
);

export default createStructuredSelector({
    data: usersSelectorAsList,
    myPosition: meSelector,
    containsAccount: accountSelector, 
});
