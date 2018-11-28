import { openModal } from 'store/actions/modal'
import { updateCollateralToken } from 'store/actions/blockchain'
import { fetchTournamentUsers, addUsers, fetchTournamentUserData } from '../store/actions'

const openSetMainnetAddressModal = () => openModal({ modalName: 'ModalRegisterWalletUport' })
const openClaimRewardModal = () => openModal({ modalName: 'ModalClaimReward' })

export default dispatch => ({
  fetchTournamentUsers: () => dispatch(fetchTournamentUsers()),
  addUsers: () => dispatch(addUsers()),
  openSetMainnetAddressModal: () => dispatch(openSetMainnetAddressModal()),
  openClaimRewardModal: () => dispatch(openClaimRewardModal()),
  fetchTournamentUserData: account => dispatch(fetchTournamentUserData(account)),
  updateCollateralToken: () => dispatch(updateCollateralToken()),
})
