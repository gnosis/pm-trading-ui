import { openModal } from 'actions/modal'

import { fetchTournamentUsers, addUsers } from '../store/actions'

const openSetMainnetAddressModal = () => openModal({ modalName: 'ModalRegisterWalletUport' })

export default {
  fetchTournamentUsers,
  addUsers,
  openSetMainnetAddressModal,
}
