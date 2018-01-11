import { openModal } from 'actions/modal'

import { fetchOlympiaUsers, addUsers } from '../store/actions'

const openSetMainnetAddressModal = () => openModal({ modalName: 'ModalSetMainnetAddress' })

export default {
  fetchOlympiaUsers, addUsers, openSetMainnetAddressModal,
}
