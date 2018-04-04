import { connect } from 'react-redux'

import { closeModal } from 'actions/modal'
import { updateMainnetAddress, requestMainnetAddress } from 'actions/blockchain'

import RegisterWalletUport from 'components/ModalContent/RegisterWalletUport'

export default connect(null, {
  updateMainnetAddress,
  requestMainnetAddress,
  closeModal,
})(RegisterWalletUport)
