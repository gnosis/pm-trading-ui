import { connect } from 'react-redux'

import { closeModal } from 'store/actions/modal'
import { updateMainnetAddress, requestMainnetAddress } from 'store/actions/blockchain'

import RegisterWalletUport from 'components/ModalContent/RegisterWalletUport'

export default connect(null, {
  updateMainnetAddress,
  requestMainnetAddress,
  closeModal,
})(RegisterWalletUport)
