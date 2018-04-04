import { createSelector, createStructuredSelector } from 'reselect'
import { getCurrentAccount } from 'integrations/store/selectors'
import { firstTournamentUsersSelectorAsList, meSelector, tournamentMainnetRegistryAddress } from '../store/selectors'

const usersSelector = createSelector(firstTournamentUsersSelectorAsList, meSelector, (firstUsers, me) => {
  if (!me) {
    return firstUsers
  }

  if (!firstUsers) {
    return undefined
  }

  const foundUser = firstUsers ? firstUsers.find(user => user.account === me.account) : undefined
  const dataTable = foundUser ? firstUsers : firstUsers.push(me)

  return dataTable
})

export default createStructuredSelector({
  data: usersSelector,
  mainnetAddress: tournamentMainnetRegistryAddress,
  myAccount: getCurrentAccount,
})
