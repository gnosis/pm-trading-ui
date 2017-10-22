import { createSelector, createStructuredSelector } from 'reselect';
import { firstOlympiaUsersSelectorAsList, meSelector } from '../store/selectors';

const accountSelector = createSelector(
    meSelector,
    (me) => me !== undefined ? true : false,
);

export default createStructuredSelector({
    data: firstOlympiaUsersSelectorAsList,
    myPosition: meSelector,
    containsAccount: accountSelector, 
});
