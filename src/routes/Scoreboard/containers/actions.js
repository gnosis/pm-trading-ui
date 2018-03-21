import { openModal } from 'actions/modal'

import { fetchTournamentUsers, addUsers } from '../store/actions'

const openSetMainnetAddressModal = () => openModal({ modalName: 'ModalSetMainnetAddress' })

export default {
  fetchTournamentUsers,
  addUsers,
  openSetMainnetAddressModal,
}
