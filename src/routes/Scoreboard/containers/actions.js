import { openModal } from 'actions/modal'

import { fetchTournamentUsers, addUsers } from '../store/actions'

const openSetMainnetAddressModal = () => openModal({ modalName: 'ModalRegisterWalletUport' })
const openClaimRewardModal = () => openModal({ modalName: 'ModalClaimReward' })

export default {
  fetchTournamentUsers,
  addUsers,
  openSetMainnetAddressModal,
  openClaimRewardModal,
}
