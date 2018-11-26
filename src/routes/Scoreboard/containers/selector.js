import { createSelector, createStructuredSelector } from 'reselect'
import { getCurrentAccount, getRegisteredMainnetAddress } from 'integrations/store/selectors'
import { rankSelector } from 'routes/Scoreboard/store/selectors'
import { hasClaimedReward } from 'containers/Modals/ModalClaimReward/selectors'
import { getCollateralToken } from 'store/selectors/blockchain'
import { firstTournamentUsersSelectorAsList, meSelector } from '../store/selectors'

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
  mainnetAddress: getRegisteredMainnetAddress,
  myAccount: getCurrentAccount,
  rank: rankSelector,
  hasClaimedReward,
  collateralToken: getCollateralToken,
})
